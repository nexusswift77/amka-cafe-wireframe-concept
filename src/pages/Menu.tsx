
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MenuCard from '@/components/ui/MenuCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const menuItems = [
  {
    id: 1,
    name: "Signature Latte",
    description: "Our house blend espresso with velvety steamed milk and a hint of vanilla",
    price: "Ksh 350",
    category: "coffee",
    tags: ["bestseller", "hot"],
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Avocado Toast",
    description: "Artisanal sourdough topped with fresh avocado, cherry tomatoes, and feta",
    price: "Ksh 450",
    category: "food",
    tags: ["vegan", "breakfast"],
    image: "https://images.unsplash.com/photo-1603046891744-7c041f69e472?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Blueberry Muffin",
    description: "Freshly baked muffin loaded with organic blueberries",
    price: "Ksh 250",
    category: "pastry",
    tags: ["sweet"],
    image: "https://images.unsplash.com/photo-1607958996333-41785c147cb4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Cold Brew",
    description: "Smooth cold brew steeped for 24 hours with notes of chocolate",
    price: "Ksh 380",
    category: "coffee",
    tags: ["cold"],
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Chicken Sandwich",
    description: "Grilled chicken with lettuce, tomato, and herb aioli on ciabatta",
    price: "Ksh 550",
    category: "food",
    tags: ["lunch", "protein"],
    image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and milk foam",
    price: "Ksh 320",
    category: "coffee",
    tags: ["hot", "classic"],
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Chocolate Croissant",
    description: "Buttery layered pastry filled with dark chocolate",
    price: "Ksh 280",
    category: "pastry",
    tags: ["sweet", "breakfast"],
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Fruit Smoothie",
    description: "Blend of seasonal fruits with yogurt and honey",
    price: "Ksh 420",
    category: "drinks",
    tags: ["cold", "healthy"],
    image: "https://images.unsplash.com/photo-1589734575451-8dca0a4507ed?q=80&w=1200&auto=format&fit=crop"
  }
];

const categories = [
  { id: "all", name: "All Items" },
  { id: "coffee", name: "Coffee" },
  { id: "food", name: "Food" },
  { id: "pastry", name: "Pastries" },
  { id: "drinks", name: "Drinks" }
];

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // AI suggested items (just using a static subset for the wireframe)
  const suggestedItems = menuItems.slice(0, 3);

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-6">Our Menu</h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm ${
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
          {suggestedItems.length > 0 && (
            <div className="mb-12">
              <h2 className="section-title">Suggested For You</h2>
              <p className="text-coffee-dark/80 mb-6">Based on your previous orders and preferences</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestedItems.map(item => (
                  <MenuCard
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                    tags={item.tags}
                  />
                ))}
              </div>
            </div>
          )}

          <h2 className="section-title">{selectedCategory === 'all' ? 'All Items' : `${categories.find(c => c.id === selectedCategory)?.name}`}</h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-coffee-dark/80">No items found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <MenuCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  tags={item.tags}
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
