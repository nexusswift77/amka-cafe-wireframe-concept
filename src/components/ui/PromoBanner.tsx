
import React from 'react';
import { Button } from '@/components/ui/button';

interface PromoBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ 
  title, 
  description, 
  ctaText, 
  ctaLink,
  backgroundImage
}) => {
  return (
    <div 
      className="relative rounded-xl overflow-hidden"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className={`${backgroundImage ? 'bg-coffee-dark/60' : 'bg-gradient-to-r from-coffee-dark to-coffee-medium'} p-8 md:p-12`}>
        <div className="max-w-2xl text-cream">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-sm md:text-base mb-6">{description}</p>
          <Button asChild className="gradient-button">
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
