import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus } from 'lucide-react';
import type { MenuItemWithCategory } from '@/hooks/useMenuData';

interface MenuCardProps {
  item: MenuItemWithCategory;
  tags?: string[];
}

const MenuCard: React.FC<MenuCardProps> = ({ item, tags = [] }) => {
  const { addItem, getItemQuantity, updateQuantity, items } = useCart();
  
  // Format price to display as Ksh
  const formatPrice = (price: number) => `Ksh ${price.toFixed(0)}`;

  // Use image_url from database or fallback to placeholder
  const imageUrl = item.image_url || '/placeholder.svg';
  
  // Get current quantity in cart for this specific item
  const currentQuantity = getItemQuantity(item.id);
  
  // Find the cart item to get its ID for quantity updates
  const cartItem = items.find(cartItem => cartItem.menuItem.id === item.id);

  const handleAddToCart = () => {
    addItem(item, 1);
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      addItem(item, 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    } else if (cartItem) {
      updateQuantity(cartItem.id, 0); // This will remove the item
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col">
      <div className="h-48 overflow-hidden relative flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            // Fallback to placeholder if image fails to load
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
          <span className="font-bold text-coffee-medium">{formatPrice(item.price)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3 flex-grow">{item.description}</p>
        
        {/* Show category as a tag */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.category && (
            <span className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full">
              {item.category.name}
            </span>
          )}
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Cart controls - always at bottom */}
        <div className="mt-auto">
          {currentQuantity > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecreaseQuantity}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold min-w-[2rem] text-center">{currentQuantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIncreaseQuantity}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                Total: {formatPrice(item.price * currentQuantity)}
              </span>
            </div>
          ) : (
            <Button className="gradient-button w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
