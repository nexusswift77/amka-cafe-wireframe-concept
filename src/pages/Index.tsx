import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PromoBanner from '@/components/ui/PromoBanner';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import QuickActions from '@/components/home/QuickActions';
import { useFeaturedMenuItems } from '@/hooks/useMenuData';
import { Loader2 } from 'lucide-react';

const Index: React.FC = () => {
  // Fetch featured items from database
  const { data: featuredItems = [], isLoading } = useFeaturedMenuItems(4);

  // Transform database items to match FeaturedCarousel expected format
  const transformedFeaturedItems = featuredItems.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: `Ksh ${item.price.toFixed(0)}`,
    image: item.image_url || '/placeholder.svg'
  }));

  return (
    <PageLayout>
      <section className="pt-6 pb-10 px-4 md:px-6">
        <div className="cafe-container">
          <PromoBanner
            title="Earn Points With Every Sip!"
            description="Join our loyalty program today and start earning rewards with each purchase. Redeem for free drinks, pastries, and exclusive member benefits."
            ctaText="Join Now"
            ctaLink="/auth"
          />
        </div>
      </section>
      
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container">
          <section className="mb-12">
            <h2 className="section-title">Featured Items</h2>
            <p className="text-coffee-dark/80 mb-8">Discover our most popular dishes and drinks</p>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading featured items...</span>
                </div>
              </div>
            ) : (
              <FeaturedCarousel items={transformedFeaturedItems} />
            )}
          </section>
          
          <QuickActions />
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
