import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import DeliveryCustomizationPopup, { DeliveryDetails } from '@/components/order/DeliveryCustomizationPopup';
import { MapPin, Edit3 } from 'lucide-react';

const Order: React.FC = () => {
  const [orderItems, setOrderItems] = useState([
    {
      id: 1,
      name: 'Cappuccino',
      price: 320,
      quantity: 1,
      options: {
        size: 'Regular',
        milk: 'Whole',
        sugar: '1 spoon',
      },
      notes: ''
    },
    {
      id: 2,
      name: 'Blueberry Muffin',
      price: 250,
      quantity: 1,
      options: {},
      notes: ''
    }
  ]);
  
  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isDeliveryPopupOpen, setIsDeliveryPopupOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null);
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setOrderItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const updateNotes = (id: number, notes: string) => {
    setOrderItems(items => 
      items.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };
  
  const removeItem = (id: number) => {
    setOrderItems(items => items.filter(item => item.id !== id));
  };
  
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = 50;
  const deliveryFee = orderType === 'delivery' ? 150 : 0;
  const total = subtotal + serviceFee + deliveryFee;
  
  const pointsEarned = Math.floor(total / 100) * 10;

  const handleDeliveryDetailsUpdate = (details: DeliveryDetails) => {
    setDeliveryDetails(details);
  };

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
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4 text-coffee-dark">Your Items</h2>
                
                {orderItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                    <Button className="mt-4" asChild>
                      <a href="/menu">Browse Menu</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orderItems.map(item => (
                      <div key={item.id} className="border-b pb-6">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="font-bold text-coffee-medium">Ksh {item.price}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-3">
                          {Object.entries(item.options).map(([key, value]) => (
                            <span key={key} className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="ml-auto text-red-500 hover:text-red-600 hover:border-red-300"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="mt-3">
                          <Label htmlFor={`notes-${item.id}`}>Special instructions</Label>
                          <Textarea 
                            id={`notes-${item.id}`} 
                            placeholder="Add notes (e.g., allergies, preferences)"
                            value={item.notes}
                            onChange={(e) => updateNotes(item.id, e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-coffee-dark">Delivery Options</h2>
                
                <RadioGroup 
                  value={orderType} 
                  onValueChange={setOrderType} 
                  className="mb-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Pickup</Label>
                  </div>
                </RadioGroup>
                
                {orderType === 'delivery' && (
                  <div className="space-y-4">
                    {deliveryDetails ? (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-coffee-medium" />
                            <span className="font-medium">Delivery Address</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDeliveryPopupOpen(true)}
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>{deliveryDetails.address}</p>
                          {deliveryDetails.apartment && <p>{deliveryDetails.apartment}</p>}
                          {deliveryDetails.businessName && <p>{deliveryDetails.businessName}</p>}
                          <p className="text-gray-600">Phone: {deliveryDetails.phone}</p>
                          {deliveryDetails.deliveryTime === 'scheduled' && deliveryDetails.scheduledTime && (
                            <p className="text-coffee-medium">
                              Scheduled for: {new Date(deliveryDetails.scheduledTime).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setIsDeliveryPopupOpen(true)}
                        className="w-full gradient-button"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Add Delivery Details
                      </Button>
                    )}
                  </div>
                )}
                
                {orderType === 'pickup' && (
                  <div>
                    <p className="text-gray-600 mb-2">Pickup from:</p>
                    <p className="font-medium">Café Amka - Main Branch</p>
                    <p className="text-sm text-gray-600">123 Coffee Street, Nairobi</p>
                    <p className="text-sm text-gray-600 mt-4">Estimated pickup time: 15-20 minutes</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                <h2 className="text-xl font-bold mb-4 text-coffee-dark">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Ksh {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>Ksh {serviceFee}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery fee</span>
                      <span>Ksh {deliveryFee}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Ksh {total}</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    You'll earn {pointsEarned} points with this purchase!
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Payment Method</h3>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod} 
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
                
                <div className="mb-6">
                  <div className="flex items-top space-x-2">
                    <Checkbox id="terms" />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the terms and conditions
                      </label>
                      <p className="text-sm text-gray-500">
                        By placing this order, you agree to our terms of service.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="gradient-button w-full"
                  disabled={orderType === 'delivery' && !deliveryDetails}
                >
                  Complete Order
                </Button>
              </div>
            </div>
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
