import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useMenuItems } from '@/hooks/useMenuData';

interface CarouselItem {
  id: string; // Changed from number to string to support UUID
  name: string;
  description: string;
  price: string;
  image: string;
}

interface FeaturedCarouselProps {
  items: CarouselItem[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem, getItemQuantity, updateQuantity, items: cartItems } = useCart();
  const { data: menuItems = [] } = useMenuItems();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  // Calculate visible items based on screen size
  const visibleItems = items.slice(currentIndex, currentIndex + 3);
  
  // If we don't have enough items, wrap around to the beginning
  if (visibleItems.length < 3) {
    visibleItems.push(...items.slice(0, 3 - visibleItems.length));
  }

  const handleAddToCart = (carouselItem: CarouselItem) => {
    // Find the corresponding menu item from the database
    const menuItem = menuItems.find(item => item.id === carouselItem.id);
    if (menuItem) {
      addItem(menuItem, 1);
    }
  };

  const handleIncreaseQuantity = (carouselItem: CarouselItem) => {
    const menuItem = menuItems.find(item => item.id === carouselItem.id);
    if (!menuItem) return;
    
    const cartItem = cartItems.find(cartItem => cartItem.menuItem.id === carouselItem.id);
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      addItem(menuItem, 1);
    }
  };

  const handleDecreaseQuantity = (carouselItem: CarouselItem) => {
    const cartItem = cartItems.find(cartItem => cartItem.menuItem.id === carouselItem.id);
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    } else if (cartItem) {
      updateQuantity(cartItem.id, 0); // This will remove the item
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <Button
          onClick={prevSlide}
          variant="outline"
          size="icon"
          className="absolute left-0 z-10 rounded-full bg-white/80 text-coffee-dark border-coffee-light hover:bg-cream"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <div className="flex overflow-hidden w-full py-8 px-4">
          <div className="flex w-full transition-transform duration-300">
            {visibleItems.map((item) => {
              const currentQuantity = getItemQuantity(item.id);
              
              return (
                <div key={item.id} className="w-full sm:w-1/2 md:w-1/3 px-2 flex-shrink-0">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      {currentQuantity > 0 && (
                        <Badge className="absolute top-2 right-2 bg-coffee-medium text-white">
                          {currentQuantity} in cart
                        </Badge>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-coffee-dark">{item.name}</h3>
                        <span className="font-bold text-coffee-medium">{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 flex-grow">{item.description}</p>
                      
                      {/* Cart controls - always at bottom */}
                      <div className="mt-auto">
                        {currentQuantity > 0 ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDecreaseQuantity(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-semibold min-w-[2rem] text-center">{currentQuantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIncreaseQuantity(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            className="gradient-button w-full"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          onClick={nextSlide}
          variant="outline"
          size="icon"
          className="absolute right-0 z-10 rounded-full bg-white/80 text-coffee-dark border-coffee-light hover:bg-cream"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-coffee-medium' : 'bg-coffee-light/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
