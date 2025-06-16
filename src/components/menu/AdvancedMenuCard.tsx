
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Star, Clock, Flame } from 'lucide-react';

interface MenuItemOption {
  id: string;
  name: string;
  price: number;
  type: 'single' | 'multiple';
  required?: boolean;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
  calories?: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isPopular?: boolean;
  customizationOptions?: MenuItemOption[];
}

interface AdvancedMenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, customizations: any, quantity: number, specialInstructions: string) => void;
}

const AdvancedMenuCard: React.FC<AdvancedMenuCardProps> = ({ item, onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const calculateTotalPrice = () => {
    let total = item.price * quantity;
    
    Object.entries(selectedOptions).forEach(([optionId, choices]) => {
      const option = item.customizationOptions?.find(opt => opt.id === optionId);
      if (option) {
        choices.forEach(choiceId => {
          const choice = option.options.find(opt => opt.id === choiceId);
          if (choice) {
            total += choice.price * quantity;
          }
        });
      }
    });
    
    return total;
  };

  const handleOptionChange = (optionId: string, choiceId: string, isChecked: boolean) => {
    setSelectedOptions(prev => {
      const option = item.customizationOptions?.find(opt => opt.id === optionId);
      if (!option) return prev;

      const currentChoices = prev[optionId] || [];
      
      if (option.type === 'single') {
        return { ...prev, [optionId]: isChecked ? [choiceId] : [] };
      } else {
        return {
          ...prev,
          [optionId]: isChecked
            ? [...currentChoices, choiceId]
            : currentChoices.filter(id => id !== choiceId)
        };
      }
    });
  };

  const handleAddToCart = () => {
    onAddToCart(item, selectedOptions, quantity, specialInstructions);
    setIsOpen(false);
    setQuantity(1);
    setSelectedOptions({});
    setSpecialInstructions('');
  };

  const isValidSelection = () => {
    if (!item.customizationOptions) return true;
    
    return item.customizationOptions.every(option => {
      if (option.required) {
        const selected = selectedOptions[option.id] || [];
        return selected.length > 0;
      }
      return true;
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative" onClick={() => setIsOpen(true)}>
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          {item.isPopular && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
          {item.isSpicy && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              <Flame className="h-3 w-3" />
            </Badge>
          )}
        </div>
        
        <div className="p-4" onClick={() => setIsOpen(true)}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-coffee-dark">{item.name}</h3>
            <span className="font-bold text-coffee-medium">Ksh {item.price}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{item.rating}</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{item.prepTime}</span>
              </div>
            </div>
            
            <div className="flex gap-1">
              {item.isVegetarian && (
                <Badge variant="outline" className="text-green-600 border-green-600">V</Badge>
              )}
              {item.isVegan && (
                <Badge variant="outline" className="text-green-700 border-green-700">VG</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <Button 
            className="w-full gradient-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            Customize & Add
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{item.rating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{item.prepTime}</span>
                </div>
                {item.calories && (
                  <span>{item.calories} cal</span>
                )}
              </div>
            </div>

            {item.customizationOptions && item.customizationOptions.length > 0 && (
              <div className="space-y-6">
                {item.customizationOptions.map((option) => (
                  <div key={option.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-coffee-dark">
                        {option.name}
                        {option.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {option.type === 'single' ? 'Choose 1' : 'Choose multiple'}
                      </span>
                    </div>
                    
                    {option.type === 'single' ? (
                      <RadioGroup
                        value={selectedOptions[option.id]?.[0] || ''}
                        onValueChange={(value) => handleOptionChange(option.id, value, true)}
                      >
                        {option.options.map((choice) => (
                          <div key={choice.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={choice.id} id={choice.id} />
                              <Label htmlFor={choice.id}>{choice.name}</Label>
                            </div>
                            {choice.price > 0 && (
                              <span className="text-sm text-gray-600">+Ksh {choice.price}</span>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-2">
                        {option.options.map((choice) => (
                          <div key={choice.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={choice.id}
                                checked={selectedOptions[option.id]?.includes(choice.id) || false}
                                onCheckedChange={(checked) => 
                                  handleOptionChange(option.id, choice.id, checked as boolean)
                                }
                              />
                              <Label htmlFor={choice.id}>{choice.name}</Label>
                            </div>
                            {choice.price > 0 && (
                              <span className="text-sm text-gray-600">+Ksh {choice.price}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any special requests? (e.g., no onions, extra sauce, etc.)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg min-w-[2rem] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">Total</div>
                <div className="font-bold text-lg text-coffee-dark">
                  Ksh {calculateTotalPrice()}
                </div>
              </div>
            </div>

            <Button
              className="w-full gradient-button"
              onClick={handleAddToCart}
              disabled={!isValidSelection()}
            >
              Add {quantity} to Cart - Ksh {calculateTotalPrice()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdvancedMenuCard;
