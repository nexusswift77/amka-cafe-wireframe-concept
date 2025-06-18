import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { MenuItemWithCategory } from '@/hooks/useMenuData';

export interface CartItem {
  id: string;
  menuItem: MenuItemWithCategory;
  quantity: number;
  specialInstructions?: string;
  customizations?: Record<string, any>;
  unitPrice: number;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItemWithCategory; quantity: number; specialInstructions?: string; customizations?: Record<string, any> } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType extends CartState {
  addItem: (menuItem: MenuItemWithCategory, quantity?: number, specialInstructions?: string, customizations?: Record<string, any>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cafe-amka-cart';

// Calculate total price including customizations
const calculateItemPrice = (menuItem: MenuItemWithCategory, quantity: number, customizations?: Record<string, any>): number => {
  let basePrice = menuItem.price * quantity;
  
  // Add customization costs if any
  if (customizations) {
    Object.values(customizations).forEach((customization: any) => {
      if (Array.isArray(customization)) {
        customization.forEach((option: any) => {
          if (option.price) {
            basePrice += option.price * quantity;
          }
        });
      } else if (customization.price) {
        basePrice += customization.price * quantity;
      }
    });
  }
  
  return basePrice;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity, specialInstructions, customizations } = action.payload;
      const unitPrice = calculateItemPrice(menuItem, 1, customizations);
      const totalPrice = calculateItemPrice(menuItem, quantity, customizations);
      
      // Create unique ID based on menu item and customizations
      const customizationKey = customizations ? JSON.stringify(customizations) : '';
      const itemId = `${menuItem.id}_${customizationKey}_${specialInstructions || ''}`;
      
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                totalPrice: calculateItemPrice(menuItem, item.quantity + quantity, customizations)
              }
            : item
        );
      } else {
        // New item
        const newItem: CartItem = {
          id: itemId,
          menuItem,
          quantity,
          specialInstructions,
          customizations,
          unitPrice,
          totalPrice,
        };
        newItems = [...state.items, newItem];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }
      
      const newItems = state.items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              quantity,
              totalPrice: calculateItemPrice(item.menuItem, quantity, item.customizations)
            }
          : item
      );
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state]);

  const addItem = (
    menuItem: MenuItemWithCategory, 
    quantity: number = 1, 
    specialInstructions?: string, 
    customizations?: Record<string, any>
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { menuItem, quantity, specialInstructions, customizations }
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${menuItem.name} added to your cart`,
    });
  };

  const removeItem = (id: string) => {
    const item = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    
    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.menuItem.name} removed from your cart`,
      });
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getItemQuantity = (menuItemId: string): number => {
    return state.items
      .filter(item => item.menuItem.id === menuItemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 