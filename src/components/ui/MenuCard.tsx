
import React from 'react';
import { Button } from '@/components/ui/button';

interface MenuCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  tags?: string[];
}

const MenuCard: React.FC<MenuCardProps> = ({ image, name, description, price, tags = [] }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-coffee-dark">{name}</h3>
          <span className="font-bold text-coffee-medium">{price}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <Button className="gradient-button w-full">Add to Cart</Button>
      </div>
    </div>
  );
};

export default MenuCard;
