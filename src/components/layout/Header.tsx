
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Wallet, Home, Coffee, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/cart">
            <ShoppingCart className="h-6 w-6 text-coffee-dark" />
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
          <Link to="/cart">
            <ShoppingCart className="h-6 w-6 text-coffee-dark hover:text-coffee-medium transition-colors" />
          </Link>
          <Link to="/profile">
            <User className="h-6 w-6 text-coffee-dark hover:text-coffee-medium transition-colors" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="cafe-container py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="flex items-center p-2 hover:bg-cream rounded-md"
              onClick={toggleMenu}
            >
              <Home className="h-5 w-5 mr-3 text-coffee-dark" />
              <span>Home</span>
            </Link>
            <Link 
              to="/menu" 
              className="flex items-center p-2 hover:bg-cream rounded-md"
              onClick={toggleMenu}
            >
              <Coffee className="h-5 w-5 mr-3 text-coffee-dark" />
              <span>Menu</span>
            </Link>
            <Link 
              to="/order" 
              className="flex items-center p-2 hover:bg-cream rounded-md"
              onClick={toggleMenu}
            >
              <ShoppingCart className="h-5 w-5 mr-3 text-coffee-dark" />
              <span>Order</span>
            </Link>
            <Link 
              to="/reserve" 
              className="flex items-center p-2 hover:bg-cream rounded-md"
              onClick={toggleMenu}
            >
              <Calendar className="h-5 w-5 mr-3 text-coffee-dark" />
              <span>Reserve</span>
            </Link>
            <Link 
              to="/wallet" 
              className="flex items-center p-2 hover:bg-cream rounded-md"
              onClick={toggleMenu}
            >
              <Wallet className="h-5 w-5 mr-3 text-coffee-dark" />
              <span>Wallet</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center p-2 hover:bg-cream rounded-md"
              onClick={toggleMenu}
            >
              <User className="h-5 w-5 mr-3 text-coffee-dark" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
