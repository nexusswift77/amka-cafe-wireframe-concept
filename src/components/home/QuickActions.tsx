
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, Wallet } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Link to="/order" className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all border border-gray-100 group">
        <div className="inline-flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-cream text-coffee-dark group-hover:bg-coffee-light group-hover:text-white transition-colors">
          <ShoppingCart size={24} />
        </div>
        <h3 className="text-xl font-bold text-coffee-dark mb-2">Order Now</h3>
        <p className="text-sm text-gray-600">Quick and easy online ordering</p>
      </Link>
      
      <Link to="/reserve" className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all border border-gray-100 group">
        <div className="inline-flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-cream text-coffee-dark group-hover:bg-coffee-light group-hover:text-white transition-colors">
          <Calendar size={24} />
        </div>
        <h3 className="text-xl font-bold text-coffee-dark mb-2">Reserve Table</h3>
        <p className="text-sm text-gray-600">Book your spot in advance</p>
      </Link>
      
      <Link to="/wallet" className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all border border-gray-100 group">
        <div className="inline-flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-cream text-coffee-dark group-hover:bg-coffee-light group-hover:text-white transition-colors">
          <Wallet size={24} />
        </div>
        <h3 className="text-xl font-bold text-coffee-dark mb-2">Check Wallet</h3>
        <p className="text-sm text-gray-600">View balance and rewards</p>
      </Link>
    </div>
  );
};

export default QuickActions;
