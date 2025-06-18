import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import DeliveryCustomizationPopup, { DeliveryDetails } from '@/components/order/DeliveryCustomizationPopup';
import { MapPin, Edit3, Plus, Minus, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { placeOrder, calculateOrderSummary, type OrderDetails } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';

const Order: React.FC = () => {
  const { items: cartItems, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'dine-in'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mpesa' | 'card' | 'paylater'>('mpesa');
  const [isDeliveryPopupOpen, setIsDeliveryPopupOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [confirmedOrderData, setConfirmedOrderData] = useState<{
    items: typeof cartItems;
    orderDetails: OrderDetails;
    orderSummary: typeof orderSummary;
  } | null>(null);
  
  // Check if user is logged in
  React.useEffect(() => {
    if (!user && cartItems.length > 0) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, cartItems.length, navigate, toast]);
  
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };
  
  const updateItemNotes = (itemId: string, notes: string) => {
    // For now, we'll store notes in localStorage since our cart context doesn't handle notes updates
    // In a real app, you'd want to extend the cart context to handle this
    const notesKey = `item_notes_${itemId}`;
    localStorage.setItem(notesKey, notes);
  };
  
  const getItemNotes = (itemId: string): string => {
    const notesKey = `item_notes_${itemId}`;
    return localStorage.getItem(notesKey) || '';
  };
  
  const removeCartItem = (itemId: string) => {
    removeItem(itemId);
  };
  
  const orderSummary = calculateOrderSummary(cartItems, orderType);

  const handleDeliveryDetailsUpdate = (details: DeliveryDetails) => {
    setDeliveryDetails(details);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place an order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your cart before placing an order",
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'delivery' && !deliveryDetails) {
      toast({
        title: "Delivery details required",
        description: "Please add your delivery address and contact information",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderDetails: OrderDetails = {
        orderType,
        paymentMethod,
        deliveryAddress: deliveryDetails?.address,
        deliveryInstructions: deliveryDetails?.deliveryInstructions,
        contactPhone: deliveryDetails?.phone,
        scheduledTime: deliveryDetails?.scheduledTime,
      };

      const result = await placeOrder(cartItems, orderDetails, orderSummary);

      if (result.success && result.orderId) {
        // Store order data for confirmation screen
        setConfirmedOrderData({
          items: [...cartItems], // Create a copy of current cart items
          orderDetails,
          orderSummary
        });
        
        setOrderId(result.orderId);
        setOrderSuccess(true);
        clearCart();
        
        // Clear any stored notes
        cartItems.forEach(item => {
          const notesKey = `item_notes_${item.id}`;
          localStorage.removeItem(notesKey);
        });

        toast({
          title: "Order placed successfully!",
          description: `Your order #${result.orderId.slice(-8)} has been confirmed`,
        });
      } else {
        toast({
          title: "Order failed",
          description: result.error || "Failed to place order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Order failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Show success screen if order was placed
  if (orderSuccess && orderId && confirmedOrderData) {
    const { items: confirmedItems, orderDetails: confirmedOrderDetails, orderSummary: confirmedOrderSummary } = confirmedOrderData;
    
    return (
      <PageLayout>
        <div className="py-16 px-4 md:px-6">
          <div className="cafe-container max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-coffee-dark mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We've received your payment and are preparing your items.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-coffee-dark mb-4">Your Order</h2>
                <div className="space-y-4">
                  {confirmedItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-coffee-dark">{item.menuItem.name}</h3>
                        {item.menuItem.category && (
                          <span className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full inline-block mt-1">
                            {item.menuItem.category.name}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-sm text-gray-600">•</span>
                          <span className="text-sm text-gray-600">Ksh {item.unitPrice.toFixed(0)} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-coffee-medium">Ksh {item.totalPrice.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-coffee-dark mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono">#{orderId.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Type:</span>
                    <span className="capitalize">{confirmedOrderDetails.orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{confirmedOrderDetails.paymentMethod}</span>
                  </div>
                  
                  {confirmedOrderDetails.deliveryAddress && (
                    <div className="flex justify-between">
                      <span>Delivery Address:</span>
                      <span className="text-right text-sm max-w-48">{confirmedOrderDetails.deliveryAddress}</span>
                    </div>
                  )}
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Ksh {confirmedOrderSummary.subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>Ksh {confirmedOrderSummary.serviceFee.toFixed(0)}</span>
                  </div>
                  {confirmedOrderSummary.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>Ksh {confirmedOrderSummary.deliveryFee.toFixed(0)}</span>
                    </div>
                  )}
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>Ksh {confirmedOrderSummary.total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Points Earned:</span>
                    <span>{confirmedOrderSummary.pointsEarned} points</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 mb-6">
                {confirmedOrderDetails.orderType === 'delivery' 
                  ? 'Your order will be delivered in 30-45 minutes' 
                  : confirmedOrderDetails.orderType === 'pickup'
                  ? 'Your order will be ready for pickup in 15-20 minutes'
                  : 'Please proceed to your reserved table'
                }
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/profile">View Order History</Link>
                </Button>
                <Button asChild className="gradient-button">
                  <Link to="/menu">Order Again</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-2">Complete Your Order</h1>
          <p className="text-coffee-dark/80">Customize your items and choose payment method</p>
        </div>
      </div>
      
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-coffee-dark">Your Items</h2>
                  {cartItems.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-600"
                    >
                      Clear Cart
                    </Button>
                  )}
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <Button asChild>
                      <Link to="/menu">Browse Menu</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="border-b pb-6">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-bold">{item.menuItem.name}</h3>
                          <p className="font-bold text-coffee-medium">Ksh {item.unitPrice.toFixed(0)}</p>
                        </div>
                        
                        {/* Show category */}
                        {item.menuItem.category && (
                        <div className="flex flex-wrap gap-3 mb-3">
                            <span className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full">
                              {item.menuItem.category.name}
                            </span>
                        </div>
                        )}
                        
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mb-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="ml-auto text-red-500 hover:text-red-600 hover:border-red-300"
                            onClick={() => removeCartItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="mt-3">
                          <Label htmlFor={`notes-${item.id}`}>Special instructions</Label>
                          <Textarea 
                            id={`notes-${item.id}`} 
                            placeholder="Add notes (e.g., allergies, preferences)"
                            value={getItemNotes(item.id)}
                            onChange={(e) => updateItemNotes(item.id, e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        {/* Show item total */}
                        <div className="mt-3 text-right">
                          <span className="font-semibold text-coffee-medium">
                            Item Total: Ksh {item.totalPrice.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Order Type */}
              {cartItems.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="font-bold mb-3">Order Type</h3>
                <RadioGroup 
                  value={orderType} 
                    onValueChange={(value: 'delivery' | 'pickup' | 'dine-in') => setOrderType(value)} 
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery</Label>
                      <span className="ml-auto text-sm text-gray-500">Ksh 150</span>
                  </div>
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Pickup</Label>
                      <span className="ml-auto text-sm text-gray-500">Free</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value="dine-in" id="dine-in" />
                      <Label htmlFor="dine-in">Dine In</Label>
                      <span className="ml-auto text-sm text-gray-500">Free</span>
                  </div>
                </RadioGroup>
                
                {orderType === 'delivery' && (
                    <div className="mt-4 p-4 bg-cream rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Delivery Address</h4>
                    {deliveryDetails ? (
                            <p className="text-sm text-gray-600">
                              {deliveryDetails.address}
                              {deliveryDetails.apartment && `, ${deliveryDetails.apartment}`}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">Please set your delivery address</p>
                          )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDeliveryPopupOpen(true)}
                          >
                          <Edit3 className="h-4 w-4 mr-2" />
                          {deliveryDetails ? 'Edit' : 'Add'}
                          </Button>
                      </div>
                    </div>
                    )}
                  </div>
                )}
            </div>
            
            {/* Order Summary */}
            {cartItems.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                <h3 className="font-bold mb-4">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Ksh {orderSummary.subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>Ksh {orderSummary.serviceFee}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>Ksh {orderSummary.deliveryFee}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>Ksh {orderSummary.total.toFixed(0)}</span>
                  </div>
                  <div className="text-sm text-green-600">
                    You'll earn {orderSummary.pointsEarned} loyalty points!
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Payment Method</h3>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value: 'wallet' | 'mpesa' | 'card' | 'paylater') => setPaymentMethod(value)} 
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet">Café Amka Wallet</Label>
                      <span className="ml-auto text-sm text-gray-500">Ksh 1,200 available</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa">M-Pesa</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value="paylater" id="paylater" />
                      <Label htmlFor="paylater">Pay Later</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  className="w-full gradient-button mb-4"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || (orderType === 'delivery' && !deliveryDetails) || !user || cartItems.length === 0}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : !user ? (
                    'Sign In Required'
                  ) : cartItems.length === 0 ? (
                    'Cart is Empty'
                  ) : orderType === 'delivery' && !deliveryDetails ? (
                    'Add Delivery Details'
                  ) : (
                    `Place Order - Ksh ${orderSummary.total.toFixed(0)}`
                  )}
                </Button>
                
                {/* Show specific reason why button is disabled */}
                {(!user || cartItems.length === 0 || (orderType === 'delivery' && !deliveryDetails)) && !isPlacingOrder && (
                  <div className="text-center text-sm text-gray-500 mb-4">
                    {!user && (
                      <p>Please <span className="text-coffee-medium font-medium">sign in</span> to place an order</p>
                    )}
                    {user && cartItems.length === 0 && (
                      <p>Add items to your cart to continue</p>
                    )}
                    {user && cartItems.length > 0 && orderType === 'delivery' && !deliveryDetails && (
                      <p>Please <span className="text-coffee-medium font-medium">add your delivery address</span> to continue</p>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeliveryCustomizationPopup
        isOpen={isDeliveryPopupOpen}
        onClose={() => setIsDeliveryPopupOpen(false)}
        onSave={handleDeliveryDetailsUpdate}
        currentDetails={deliveryDetails || undefined}
      />
    </PageLayout>
  );
};

export default Order;
