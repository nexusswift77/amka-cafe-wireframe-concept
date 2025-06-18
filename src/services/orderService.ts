import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { CartItem } from '@/contexts/CartContext';
import type { OrderStatus } from '@/integrations/supabase/types';

export interface OrderDetails {
  orderType: 'delivery' | 'pickup' | 'dine-in';
  paymentMethod: 'wallet' | 'mpesa' | 'card' | 'paylater';
  deliveryAddress?: string;
  deliveryInstructions?: string;
  contactPhone?: string;
  scheduledTime?: string;
}

export interface OrderSummary {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  pointsEarned: number;
}

// Simulate payment processing
const processPayment = async (
  paymentMethod: string, 
  amount: number, 
  userId: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For simulation, all payments succeed
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  switch (paymentMethod) {
    case 'wallet':
      // In a real app, you'd check wallet balance and deduct
      return { success: true, transactionId };
    
    case 'mpesa':
      // In a real app, you'd integrate with M-Pesa API
      return { success: true, transactionId };
    
    case 'card':
      // In a real app, you'd integrate with card payment gateway
      return { success: true, transactionId };
    
    case 'paylater':
      // In a real app, you'd create a credit record
      return { success: true, transactionId };
    
    default:
      return { success: false, error: 'Invalid payment method' };
  }
};

// Calculate order totals
export const calculateOrderSummary = (
  cartItems: CartItem[], 
  orderType: string
): OrderSummary => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceFee = 50;
  const deliveryFee = orderType === 'delivery' ? 150 : 0;
  const total = subtotal + serviceFee + deliveryFee;
  // Use 0.01 multiplier for points calculation (1 point per 100 KSh spent)
  const pointsEarned = Math.floor(total * 0.01);
  
  return {
    subtotal,
    serviceFee,
    deliveryFee,
    total,
    pointsEarned
  };
};

// Main order placement function
export const placeOrder = async (
  cartItems: CartItem[],
  orderDetails: OrderDetails,
  orderSummary: OrderSummary
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    // Get current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { success: false, error: 'Authentication error. Please sign in again.' };
    }
    
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to place an order' };
    }

    const userId = session.user.id;
    console.log('Placing order for user:', userId);

    // Process payment first
    const paymentResult = await processPayment(
      orderDetails.paymentMethod, 
      orderSummary.total, 
      userId
    );

    if (!paymentResult.success) {
      return { 
        success: false, 
        error: paymentResult.error || 'Payment processing failed' 
      };
    }

    // Create the order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: Number(orderSummary.total),
        status: 'pending' as OrderStatus
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      console.error('Order creation details:', {
        userId,
        total_amount: orderSummary.total,
        status: 'confirmed'
      });
      return { 
        success: false, 
        error: `Failed to create order: ${orderError.message || orderError.code || 'Unknown error'}` 
      };
    }

    // Create order items
    const orderItems = cartItems.map(item => {
      // Validate required fields
      if (!item.menuItem.id) {
        throw new Error(`Invalid menu item: missing ID for ${item.menuItem.name}`);
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Invalid quantity for ${item.menuItem.name}: ${item.quantity}`);
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new Error(`Invalid unit price for ${item.menuItem.name}: ${item.unitPrice}`);
      }
      
      return {
        order_id: order.id,
        menu_item_id: item.menuItem.id,
        quantity: item.quantity,
        unit_price: Number(item.unitPrice)
        // subtotal is auto-calculated as quantity * unit_price
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      console.error('Order items data:', orderItems);
      // In a real app, you'd want to rollback the order and refund payment
      return { 
        success: false, 
        error: `Failed to save order items: ${itemsError.message || itemsError.code || 'Unknown error'}` 
      };
    }

    // Award loyalty points first
    if (orderSummary.pointsEarned > 0) {
      console.log(`Awarding ${orderSummary.pointsEarned} loyalty points for order ${order.id}`);
      
      const { data: loyaltyTransaction, error: pointsError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'loyalty-reward',
          amount: orderSummary.pointsEarned,
          details: { 
            order_id: order.id,
            points_earned: orderSummary.pointsEarned,
            order_total: orderSummary.total,
            description: `Loyalty points earned from order #${order.id.slice(-8)}`
          }
        })
        .select()
        .single();

      if (pointsError) {
        console.error('Points award error:', pointsError);
        console.error('Points transaction data:', {
          user_id: userId,
          type: 'loyalty-reward',
          amount: orderSummary.pointsEarned,
          details: { 
            order_id: order.id,
            points_earned: orderSummary.pointsEarned,
            order_total: orderSummary.total,
            description: `Loyalty points earned from order #${order.id.slice(-8)}`
          }
        });
        // Don't fail the order for points error, just log it
      } else {
        console.log('Loyalty points transaction created:', loyaltyTransaction);
      }
    }

    // Record payment transaction for all payment methods
    const paymentTransactionAmount = orderDetails.paymentMethod === 'wallet' 
      ? -orderSummary.total * 100  // Wallet payments deduct from balance (stored in cents)
      : 0; // Other payment methods don't affect wallet balance

    console.log(`Recording payment transaction: ${orderDetails.paymentMethod}, amount: ${paymentTransactionAmount}`);

    const { data: paymentTransaction, error: paymentTransactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'purchase',
        amount: paymentTransactionAmount,
        details: { 
          order_id: order.id,
          payment_method: orderDetails.paymentMethod,
          transaction_id: paymentResult.transactionId,
          order_total: orderSummary.total,
          description: `Payment for order #${order.id.slice(-8)} via ${orderDetails.paymentMethod}`
        }
      })
      .select()
      .single();

    if (paymentTransactionError) {
      console.error('Payment transaction recording error:', paymentTransactionError);
      // Don't fail the order for transaction recording error, just log it
    } else {
      console.log('Payment transaction created:', paymentTransaction);
    }

    // Update order status to confirmed after successful payment and order creation
    const { error: statusUpdateError } = await supabase
      .from('orders')
      .update({ status: 'confirmed' as OrderStatus })
      .eq('id', order.id);

    if (statusUpdateError) {
      console.error('Status update error:', statusUpdateError);
      // Don't fail the order for status update error, just log it
    }

    return { success: true, orderId: order.id };

  } catch (error) {
    console.error('Order placement error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred while placing your order' 
    };
  }
};

// Get order details by ID
export const getOrderById = async (orderId: string) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_item:menu_items (
            *,
            category:categories (*)
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Order fetch error:', orderError);
      return null;
    }

    return order;
  } catch (error) {
    console.error('Get order error:', error);
    return null;
  }
};

// Get user's order history
export const getUserOrders = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return [];
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_item:menu_items (
            *,
            category:categories (*)
          )
        )
      `)
      .eq('user_id', session.user.id)
      .order('placed_at', { ascending: false });

    if (error) {
      console.error('Orders fetch error:', error);
      return [];
    }

    return orders || [];
  } catch (error) {
    console.error('Get user orders error:', error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Update order status error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, order: data };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Failed to update order status' };
  }
};

// Get order status progression
export const getOrderStatusProgression = (): OrderStatus[] => {
  return ['pending', 'confirmed', 'processing', 'shipped', 'completed'];
};

// Check if status transition is valid
export const isValidStatusTransition = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  const progression = getOrderStatusProgression();
  const currentIndex = progression.indexOf(currentStatus);
  const newIndex = progression.indexOf(newStatus);
  
  // Allow moving forward in progression or to cancelled
  return newStatus === 'cancelled' || (newIndex > currentIndex && newIndex <= currentIndex + 1);
};

// Get next possible statuses
export const getNextPossibleStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  const progression = getOrderStatusProgression();
  const currentIndex = progression.indexOf(currentStatus);
  const nextStatuses: OrderStatus[] = [];
  
  // Add next status in progression if exists
  if (currentIndex >= 0 && currentIndex < progression.length - 1) {
    nextStatuses.push(progression[currentIndex + 1]);
  }
  
  // Always allow cancellation (except if already completed or cancelled)
  if (currentStatus !== 'completed' && currentStatus !== 'cancelled') {
    nextStatuses.push('cancelled');
  }
  
  return nextStatuses;
};

// Demo function to simulate order status progression (for testing)
export const simulateOrderProgression = async (orderId: string) => {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const nextStatuses = getNextPossibleStatuses(order.status);
    if (nextStatuses.length === 0) {
      return { success: false, error: 'No valid status transitions available' };
    }

    // Pick the first non-cancelled status (to simulate normal progression)
    const nextStatus = nextStatuses.find(status => status !== 'cancelled') || nextStatuses[0];
    
    const result = await updateOrderStatus(orderId, nextStatus);
    return result;
  } catch (error) {
    console.error('Simulate order progression error:', error);
    return { success: false, error: 'Failed to simulate order progression' };
  }
};

// Get user's transaction history for loyalty program
export const getUserTransactions = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return [];
    }

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get transactions error:', error);
      return [];
    }

    return transactions || [];
  } catch (error) {
    console.error('Get user transactions error:', error);
    return [];
  }
};

// Get user's loyalty points summary
export const getUserLoyaltyData = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return {
        totalPoints: 0,
        totalSpent: 0,
        totalOrders: 0,
        recentActivity: []
      };
    }

    const userId = session.user.id;

    // Get wallet data for current points
    const { data: wallet } = await supabase
      .from('wallets')
      .select('points, balance')
      .eq('user_id', userId)
      .single();

    // Get total orders and spending
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, placed_at')
      .eq('user_id', userId);

    // Get recent loyalty transactions
    const { data: loyaltyTransactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .in('type', ['loyalty-reward', 'purchase'])
      .order('created_at', { ascending: false })
      .limit(10);

    const totalOrders = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const totalPoints = wallet?.points || 0;

    // Format recent activity
    const recentActivity = (loyaltyTransactions || []).map(transaction => {
      const details = transaction.details as any;
      return {
        id: transaction.id,
        action: transaction.type === 'loyalty-reward' 
          ? 'Points earned from order' 
          : `Payment via ${details?.payment_method || 'unknown'}`,
        date: transaction.created_at,
        details: details?.description || 
          (transaction.type === 'loyalty-reward' 
            ? `${transaction.amount} points awarded` 
            : `Order payment processed`),
        points: transaction.type === 'loyalty-reward' ? transaction.amount : 0,
        amount: transaction.type === 'purchase' ? Math.abs(transaction.amount) : 0
      };
    });

    return {
      totalPoints,
      totalSpent,
      totalOrders,
      recentActivity
    };
  } catch (error) {
    console.error('Get user loyalty data error:', error);
    return {
      totalPoints: 0,
      totalSpent: 0,
      totalOrders: 0,
      recentActivity: []
    };
  }
}; 