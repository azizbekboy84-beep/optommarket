import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface CartItemWithProduct {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  product?: {
    id: string;
    nameUz: string;
    nameRu: string;
    price: string;
    wholesalePrice: string;
    images: string[] | null;
    slug: string;
    unit: string;
    stockQuantity: number;
  };
}

interface CartContextType {
  cartItems: CartItemWithProduct[];
  isLoading: boolean;
  itemCount: number;
  totalAmount: number;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem('cart-session-id');
    if (!sessionId) {
      sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cart-session-id', sessionId);
    }
    return sessionId;
  };

  // Fetch cart items
  const { data: cartItems = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/cart'],
    queryFn: async (): Promise<CartItemWithProduct[]> => {
      const response = await fetch('/api/cart', {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      return response.json();
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId()
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Savatga qo'shildi!",
        description: "Mahsulot muvaffaqiyatli savatga qo'shildi.",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Xatolik",
        description: "Mahsulotni savatga qo'shishda xatolik yuz berdi.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId()
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Miqdorni yangilashda xatolik yuz berdi.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': getSessionId()
        }
      });
      if (!response.ok) throw new Error('Failed to remove from cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "O'chirildi",
        description: "Mahsulot savatdan o'chirildi.",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik yuz berdi.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Calculate derived values
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce((total, item) => {
    if (item.product) {
      return total + (parseFloat(item.product.wholesalePrice) * item.quantity);
    }
    return total;
  }, 0);

  // Context methods
  const addToCart = async (productId: string, quantity: number) => {
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const removeFromCart = async (itemId: string) => {
    await removeFromCartMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    // Remove all items one by one
    for (const item of cartItems) {
      await removeFromCartMutation.mutateAsync(item.id);
    }
  };

  const value: CartContextType = {
    cartItems,
    isLoading,
    itemCount,
    totalAmount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetchCart: refetch,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}