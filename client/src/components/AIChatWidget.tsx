import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from './language-provider';

interface ChatMessage {
  id: string;
  message: string;
  response: string | null;
  createdAt: string;
  isUser?: boolean;
}

interface ChatResponse {
  id: string;
  message: string;
  response: string;
  createdAt: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['/api/chat/history', sessionId],
    enabled: isOpen,
  });

  useEffect(() => {
    if (chatHistory && Array.isArray(chatHistory)) {
      const formattedMessages: ChatMessage[] = [];
      chatHistory.forEach((msg: any) => {
        if (msg.message) {
          formattedMessages.push({
            id: `${msg.id}_user`,
            message: msg.message,
            response: null,
            createdAt: msg.createdAt,
            isUser: true,
          });
        }
        if (msg.response) {
          formattedMessages.push({
            id: `${msg.id}_ai`,
            message: msg.response,
            response: null,
            createdAt: msg.createdAt,
            isUser: false,
          });
        }
      });
      setMessages(formattedMessages);
    }
  }, [chatHistory]);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; sessionId: string }) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (data) => {
      // Add AI response to messages
      setMessages(prev => [
        ...prev,
        {
          id: `${data.id}_ai`,
          message: data.response,
          response: null,
          createdAt: data.createdAt,
          isUser: false,
        }
      ]);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          message: language === 'uz' 
            ? 'Kechirasiz, xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.' 
            : 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.',
          response: null,
          createdAt: new Date().toISOString(),
          isUser: false,
        }
      ]);
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to UI immediately
    const userMsgObj: ChatMessage = {
      id: `user_${Date.now()}`,
      message: userMessage,
      response: null,
      createdAt: new Date().toISOString(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMsgObj]);

    // Send to API
    chatMutation.mutate({
      message: userMessage,
      sessionId,
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-24 right-6 z-50 md:bottom-6">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 md:bottom-6 w-96 sm:w-80 xs:w-72 h-[520px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col max-w-[calc(100vw-3rem)]">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-600 to-red-500 text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">
              {language === 'uz' ? 'AI Yordamchi' : 'AI Помощник'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-4 py-3 max-h-[380px]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Bot className="h-8 w-8 mb-2" />
                  <p className="text-sm">
                    {language === 'uz' 
                      ? 'Salom! Sizga qanday yordam bera olaman?' 
                      : 'Привет! Как я могу вам помочь?'}
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 mb-6 ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex-shrink-0">
                      <Bot className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm leading-[1.5] ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-600 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words font-medium">
                      {message.message}
                    </div>
                  </div>
                  
                  {message.isUser && (
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex items-start gap-2 mb-4">
                  <Bot className="h-6 w-6 text-blue-600" />
                  <div className="bg-gray-100 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {language === 'uz' ? 'AI yozmoqda...' : 'AI печатает...'}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  language === 'uz' 
                    ? 'Savolingizni yozing...' 
                    : 'Напишите ваш вопрос...'
                }
                disabled={chatMutation.isPending}
                className="flex-1 text-sm"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputMessage.trim() || chatMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600 px-3"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}