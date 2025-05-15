
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Reserve: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [location, setLocation] = useState<string>("any");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
    "18:00", "18:30", "19:00", "19:30"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle reservation submission
    console.log({
      date,
      time,
      guests,
      location,
      name,
      phone,
      email,
      notes
    });
  };

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-2">Reserve a Table</h1>
          <p className="text-coffee-dark/80">Book your spot at Café Amka</p>
        </div>
      </div>
      
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-coffee-dark">Reservation Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => {
                            // Disable dates in the past
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger id="guests">
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'guest' : 'guests'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Table Location</Label>
                    <RadioGroup value={location} onValueChange={setLocation} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="any" />
                        <Label htmlFor="any">Any Location</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="window" id="window" />
                        <Label htmlFor="window">Window</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outdoor" id="outdoor" />
                        <Label htmlFor="outdoor">Outdoor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quiet" id="quiet" />
                        <Label htmlFor="quiet">Quiet Zone</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-coffee-dark">Contact Information</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests</Label>
                    <Input 
                      id="notes" 
                      placeholder="Any special requests or notes for your reservation"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                  You'll receive a confirmation email once your reservation is confirmed.
                </p>
                <Button type="submit" className="gradient-button">Reserve Table</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reserve;
