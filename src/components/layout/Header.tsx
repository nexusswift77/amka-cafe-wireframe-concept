import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Wallet, Home, Coffee, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="cafe-container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <Coffee className="h-8 w-8 text-coffee-dark" />
          <span className="ml-2 text-xl font-montserrat font-bold text-coffee-dark">Café Amka</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link text-coffee-dark hover:text-coffee-medium transition-colors">Home</Link>
          <Link to="/menu" className="nav-link text-coffee-dark hover:text-coffee-medium transition-colors">Menu</Link>
          <Link to="/order" className="nav-link text-coffee-dark hover:text-coffee-medium transition-colors">Order</Link>
          <Link to="/reserve" className="nav-link text-coffee-dark hover:text-coffee-medium transition-colors">Reserve</Link>
          <Link to="/wallet" className="nav-link text-coffee-dark hover:text-coffee-medium transition-colors">Wallet</Link>
          <Link to="/profile" className="nav-link text-coffee-dark hover:text-coffee-medium transition-colors">Profile</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-coffee-dark" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-coffee-medium text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </Badge>
            )}
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-coffee-dark" />
            ) : (
              <Menu className="h-6 w-6 text-coffee-dark" />
            )}
          </Button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-coffee-dark hover:text-coffee-medium transition-colors" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-coffee-medium text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </Badge>
            )}
          </Link>
          <Link to="/profile">
            <User className="h-6 w-6 text-coffee-dark hover:text-coffee-medium transition-colors" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col space-y-4 p-4">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-coffee-dark hover:text-coffee-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/menu" 
              className="flex items-center space-x-3 text-coffee-dark hover:text-coffee-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Coffee className="h-5 w-5" />
              <span>Menu</span>
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center space-x-3 text-coffee-dark hover:text-coffee-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {totalItems > 0 && (
                <Badge className="bg-coffee-medium text-white text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
            <Link 
              to="/order" 
              className="flex items-center space-x-3 text-coffee-dark hover:text-coffee-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Coffee className="h-5 w-5" />
              <span>Order</span>
            </Link>
            <Link 
              to="/reserve" 
              className="flex items-center space-x-3 text-coffee-dark hover:text-coffee-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              <span>Reserve</span>
            </Link>
            <Link 
              to="/wallet" 
              className="flex items-center space-x-3 text-coffee-dark hover:text-coffee-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center space-x-3 text-coffee-dark hover:text-coffee-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
