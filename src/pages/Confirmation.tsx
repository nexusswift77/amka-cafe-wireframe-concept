import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

const Confirmation: React.FC = () => (
  <PageLayout>
    <div className="bg-cream py-8 px-4 md:px-6">
      <div className="cafe-container">
        <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-6">Order in Progress</h1>
      </div>
    </div>
    <div className="py-10 px-4 md:px-6">
      <div className="cafe-container max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-xl text-coffee-dark font-semibold mb-4">Order received. Please wait while we prepare it.</p>
        <p className="text-coffee-medium">You’ll be notified when it’s ready.</p>
      </div>
    </div>
  </PageLayout>
);

export default Confirmation; 