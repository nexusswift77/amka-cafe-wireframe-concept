
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PromoBanner from '@/components/ui/PromoBanner';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import QuickActions from '@/components/home/QuickActions';

const featuredItems = [
  {
    id: 1,
    name: "Signature Latte",
    description: "Our house blend espresso with velvety steamed milk and a hint of vanilla",
    price: "Ksh 350",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Avocado Toast",
    description: "Artisanal sourdough topped with fresh avocado, cherry tomatoes, and feta",
    price: "Ksh 450",
    image: "https://images.unsplash.com/photo-1603046891744-7c041f69e472?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Blueberry Muffin",
    description: "Freshly baked muffin loaded with organic blueberries",
    price: "Ksh 250",
    image: "https://images.unsplash.com/photo-1607958996333-41785c147cb4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Cold Brew",
    description: "Smooth cold brew steeped for 24 hours with notes of chocolate",
    price: "Ksh 380",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
  }
];

const Index: React.FC = () => {
  return (
    <PageLayout>
      <section className="pt-6 pb-10 px-4 md:px-6">
        <div className="cafe-container">
          <PromoBanner
            title="Earn Points With Every Sip!"
            description="Join our loyalty program today and start earning rewards with each purchase. Redeem for free drinks, pastries, and exclusive member benefits."
            ctaText="Join Now"
            ctaLink="/profile"
          />
        </div>
      </section>

      <section className="py-10 px-4 md:px-6 bg-cream">
        <div className="cafe-container">
          <h2 className="section-title">Featured For You</h2>
          <p className="text-coffee-dark/80 mb-6">Discover our AI-recommended selections just for you</p>
          <FeaturedCarousel items={featuredItems} />
        </div>
      </section>

      <section className="py-10 px-4 md:px-6">
        <div className="cafe-container">
          <h2 className="section-title">Quick Actions</h2>
          <QuickActions />
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
