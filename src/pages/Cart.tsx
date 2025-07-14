import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { items: cartItems, updateQuantity, removeItem, totalAmount, clearCart } = useCart();

  const [showCostShare, setShowCostShare] = useState(false);
  const [friendPhones, setFriendPhones] = useState<string[]>(['']);

  const formatPrice = (price: number) => `Ksh ${price.toFixed(0)}`;

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    } else {
      removeItem(itemId);
    }
  };

  const handleFriendPhoneChange = (idx: number, value: string) => {
    setFriendPhones(phones => phones.map((p, i) => (i === idx ? value : p)));
  };

  const handleAddFriend = () => {
    setFriendPhones(phones => [...phones, '']);
  };

  const handleRemoveFriend = (idx: number) => {
    setFriendPhones(phones => phones.filter((_, i) => i !== idx));
  };

  // Calculate split: user + friends
  const totalPeople = 1 + friendPhones.filter(p => p.trim()).length;
  const splitAmount = totalPeople > 0 ? Math.ceil((totalAmount + 50) / totalPeople) : 0;

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-2">Your Cart</h1>
          <p className="text-coffee-dark/80">Review and modify your order</p>
        </div>
      </div>
      
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Button asChild className="gradient-button">
                <Link to="/menu">Browse Menu</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-coffee-dark">
                      Cart Items ({cartItems.length})
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-600"
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 pb-6 border-b last:border-b-0">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.menuItem.image_url || '/placeholder.svg'} 
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        
                        {/* Item Details */}
                        <div className="flex-grow">
                          <h3 className="font-bold text-coffee-dark">{item.menuItem.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.menuItem.description}</p>
                          
                          {/* Category */}
                          {item.menuItem.category && (
                            <span className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full">
                              {item.menuItem.category.name}
                            </span>
                          )}
                          
                          {/* Special Instructions */}
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-500 mt-2">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Price and Remove */}
                        <div className="text-right">
                          <p className="font-bold text-coffee-medium">
                            {formatPrice(item.totalPrice)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 mt-1"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Cart Summary */}
              <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                <h3 className="text-xl font-bold text-coffee-dark mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service Fee</span>
                    <span>Ksh 50</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount + 50)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button asChild className="w-full gradient-button">
                    <Link to="/order">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/menu">Continue Shopping</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowCostShare(s => !s)}>
                    {showCostShare ? 'Cancel Cost Share' : 'Cost Share with Friends'}
                  </Button>
                  {showCostShare && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-bold text-coffee-dark mb-2">Cost Share</h3>
                      <p className="text-sm text-gray-600 mb-4">Add friends' phone numbers to split the bill equally.</p>
                      {friendPhones.map((phone, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input
                            type="tel"
                            className="flex-1 border rounded px-3 py-2"
                            value={phone}
                            onChange={e => handleFriendPhoneChange(idx, e.target.value)}
                            placeholder="Friend's phone number"
                          />
                          <Button type="button" variant="ghost" onClick={() => handleRemoveFriend(idx)} disabled={friendPhones.length === 1}>
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={handleAddFriend} className="mb-4">Add Another Friend</Button>
                      <div className="bg-cream rounded p-3 text-coffee-dark font-semibold text-center">
                        Each pays: {formatPrice(splitAmount)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Earn {Math.floor((totalAmount + 50) / 100) * 10} loyalty points with this order!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Cart; 