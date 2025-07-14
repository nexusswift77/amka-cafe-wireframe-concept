import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showCostShare, setShowCostShare] = useState(false);
  const [friendPhones, setFriendPhones] = useState<string[]>(['']);

  useEffect(() => {
    // Prefill from localStorage
    setName(localStorage.getItem('fastcheckout_name') || '');
    setPhone(localStorage.getItem('fastcheckout_phone') || '');
  }, []);

  useEffect(() => {
    if (!item) {
      navigate('/menu');
    }
  }, [item, navigate]);

  const handlePay = () => {
    // Save to localStorage
    localStorage.setItem('fastcheckout_name', name);
    localStorage.setItem('fastcheckout_phone', phone);
    // Simulate payment success (replace with Stripe integration)
    setTimeout(() => {
      navigate('/confirmation');
    }, 1000);
  };

  const handleFriendPhoneChange = (idx: number, value: string) => {
    setFriendPhones(phones => phones.map((p, i) => (i === idx ? value : p)));
  };

  const handleAddFriend = () => {
    setFriendPhones(phones => [...phones, '']);
  };

  const handleRemoveFriend = (idx: number) => {
    setFriendPhones(phones => phones.filter((_, i) => i !== idx));
  };

  // Calculate split: user + friends
  const totalPeople = 1 + friendPhones.filter(p => p.trim()).length;
  const splitAmount = item ? Math.ceil(item.price / totalPeople) : 0;

  if (!item) return null;

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-6">Checkout</h1>
        </div>
      </div>
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <img src={item.image_url || '/placeholder.svg'} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div>
              <h2 className="font-bold text-xl text-coffee-dark">{item.name}</h2>
              <p className="text-coffee-medium font-semibold">Ksh {item.price}</p>
            </div>
          </div>
          <form onSubmit={e => { e.preventDefault(); handlePay(); }}>
            <div className="mb-4">
              <label className="block text-coffee-dark font-semibold mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-coffee-dark font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full border rounded px-3 py-2"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="Enter your phone number"
              />
            </div>
            <Button type="submit" className="w-full gradient-button mb-2">Pay Now (Demo)</Button>
          </form>
          <Button variant="outline" className="w-full" onClick={() => setShowCostShare(s => !s)}>
            {showCostShare ? 'Cancel Cost Share' : 'Cost Share with Friends'}
          </Button>
          {showCostShare && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold text-coffee-dark mb-2">Cost Share</h3>
              <p className="text-sm text-gray-600 mb-4">Add friends' phone numbers to split the bill equally.</p>
              {friendPhones.map((phone, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="tel"
                    className="flex-1 border rounded px-3 py-2"
                    value={phone}
                    onChange={e => handleFriendPhoneChange(idx, e.target.value)}
                    placeholder="Friend's phone number"
                  />
                  <Button type="button" variant="ghost" onClick={() => handleRemoveFriend(idx)} disabled={friendPhones.length === 1}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddFriend} className="mb-4">Add Another Friend</Button>
              <div className="bg-cream rounded p-3 text-coffee-dark font-semibold text-center">
                Each pays: Ksh {splitAmount}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Checkout; 