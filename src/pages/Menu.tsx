import React, { useState, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MenuCard from '@/components/ui/MenuCard';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMenuItems, useCategories } from '@/hooks/useMenuData';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch data from database
  const { data: menuItems = [], isLoading: menuLoading, error: menuError } = useMenuItems();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Build categories list with "All Items" option
  const categoryOptions = useMemo(() => [
    { id: 'all', name: 'All Items' },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ], [categories]);
  
  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, selectedCategory]);
  
  // Get suggested items (just the first 3 items for now)
  const suggestedItems = useMemo(() => menuItems.slice(0, 3), [menuItems]);

  // Loading state
  if (menuLoading || categoriesLoading) {
    return (
      <PageLayout>
        <div className="bg-cream py-8 px-4 md:px-6">
          <div className="cafe-container">
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-6">Our Menu</h1>
          </div>
        </div>
        
        <div className="py-10 px-4 md:px-6">
          <div className="cafe-container flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading menu...</span>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (menuError || categoriesError) {
    return (
      <PageLayout>
        <div className="bg-cream py-8 px-4 md:px-6">
          <div className="cafe-container">
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-6">Our Menu</h1>
          </div>
        </div>
        
        <div className="py-10 px-4 md:px-6">
          <div className="cafe-container">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load menu items. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-6">Our Menu</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search menu items..."
                className="pl-10 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-coffee-medium text-white'
                      : 'bg-white text-coffee-dark hover:bg-coffee-light/20'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container">
          {/* Suggested items section */}
          {suggestedItems.length > 0 && selectedCategory === 'all' && !searchTerm && (
            <div className="mb-12">
              <h2 className="section-title">Featured Items</h2>
              <p className="text-coffee-dark/80 mb-6">Try our popular dishes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestedItems.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main menu section */}
          <h2 className="section-title">
            {selectedCategory === 'all' 
              ? 'All Items' 
              : categoryOptions.find(c => c.id === selectedCategory)?.name || 'Menu Items'
            }
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-coffee-dark/80">
                {searchTerm 
                  ? 'No items found matching your search.' 
                  : 'No items available in this category.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Menu;
