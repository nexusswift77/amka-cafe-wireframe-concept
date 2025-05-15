
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselItem {
  id: number;
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
            {visibleItems.map((item) => (
              <div key={item.id} className="w-full sm:w-1/2 md:w-1/3 px-2 flex-shrink-0">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full">
                  <div className="h-48 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-coffee-dark">{item.name}</h3>
                      <span className="font-bold text-coffee-medium">{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <Button className="gradient-button w-full">Add to Cart</Button>
                  </div>
                </div>
              </div>
            ))}
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
