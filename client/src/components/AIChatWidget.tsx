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
  const [sessionId, setSessionId] = useState<string>('');
  const [chatStarted, setChatStarted] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when session starts
  const { data: chatHistory } = useQuery({
    queryKey: ['/api/chat/history', sessionId],
    enabled: isOpen && chatStarted && sessionId !== '',
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

  // Start chat session mutation
  const startChatMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string }) => {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to start chat');
      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setChatStarted(true);
      setUserName(data.name);
      setUserPhone(data.phone);
    },
    onError: (error) => {
      console.error('Chat start error:', error);
    }
  });

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; sessionId: string; userName: string; userPhone: string }) => {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || startChatMutation.isPending) return;
    
    startChatMutation.mutate({
      name: userName.trim(),
      phone: userPhone.trim(),
    });
  };

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
      userName,
      userPhone,
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
            className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 ml-[4px] mr-[4px] pt-[5px] pb-[5px] pl-[31px] pr-[31px]"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 md:bottom-6 w-96 sm:w-80 xs:w-72 h-[520px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-w-[calc(100vw-3rem)]">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-600 to-red-500 text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">
              {!chatStarted 
                ? (language === 'uz' ? 'Suhbatni boshlash' : 'Начать разговор')
                : (language === 'uz' ? 'AI Yordamchi' : 'AI Помощник')
              }
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setChatStarted(false);
                setUserName('');
                setUserPhone('');
                setMessages([]);
                setSessionId('');
              }}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Content - Form or Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            {!chatStarted ? (
              // Start Chat Form
              <div className="flex flex-col justify-center h-full px-6 py-4">
                <div className="text-center mb-6">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {language === 'uz' 
                      ? 'Salom! Sizga yordam berishga tayyorman' 
                      : 'Привет! Я готов помочь вам'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {language === 'uz' 
                      ? 'Suhbatni boshlash uchun ismingiz va telefon raqamingizni kiriting' 
                      : 'Введите ваше имя и номер телефона для начала разговора'}
                  </p>
                </div>
                
                <form onSubmit={handleStartChat} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder={language === 'uz' ? "Ismingiz" : "Ваше имя"}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder={language === 'uz' ? "Telefon raqam (+998901234567)" : "Номер телефона (+998901234567)"}
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600"
                    disabled={startChatMutation.isPending || !userName.trim() || !userPhone.trim()}
                  >
                    {startChatMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {language === 'uz' ? 'Boshlanmoqda...' : 'Начинается...'}
                      </>
                    ) : (
                      language === 'uz' ? 'Suhbatni boshlash' : 'Начать разговор'
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              // Messages Area
              <ScrollArea className="h-full px-4 py-3 max-h-[380px]">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="h-8 w-8 mb-2" />
                    <p className="text-sm">
                      {language === 'uz' 
                        ? `Salom ${userName}! Sizga qanday yordam bera olaman?` 
                        : `Привет ${userName}! Как я могу вам помочь?`}
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
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600'
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
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {language === 'uz' ? 'AI yozmoqda...' : 'AI печатает...'}
                    </div>
                  </div>
                </div>
              )}
              
                <div ref={messagesEndRef} />
              </ScrollArea>
            )}
          </CardContent>

          {/* Input - Only show when chat started */}
          {chatStarted && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mt-auto">
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
          )}
        </div>
      )}
    </>
  );
}