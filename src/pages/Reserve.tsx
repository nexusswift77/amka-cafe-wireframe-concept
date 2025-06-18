import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { Calendar as CalendarIcon, Shield, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { createReservation, getAvailableTimeSlots, type ReservationData } from '@/services/reservationService';

const Reserve: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [location, setLocation] = useState<string>("area1");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  
  // Pre-fill user data if available
  useEffect(() => {
    if (user?.user_metadata) {
      const { first_name, last_name } = user.user_metadata;
      if (first_name && last_name) {
        setName(`${first_name} ${last_name}`);
      }
      if (user.email) {
        setEmail(user.email);
      }
    }
  }, [user]);

  // Load available times when date, guests, or location changes
  useEffect(() => {
    if (date && guests && location) {
      loadAvailableTimes();
    }
  }, [date, guests, location]);

  const loadAvailableTimes = async () => {
    if (!date) return;
    
    setIsLoadingTimes(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const guestCount = parseInt(guests);
      const times = await getAvailableTimeSlots(dateString, guestCount, location);
      setAvailableTimes(times);
      
      // Clear selected time if it's no longer available
      if (time && !times.includes(time)) {
        setTime("");
      }
    } catch (error) {
      console.error('Error loading available times:', error);
      toast({
        title: "Error",
        description: "Failed to load available times. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTimes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make a reservation",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    // Validate form
    if (!date || !time || !guests || !location || !name || !phone || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const reservationData: ReservationData = {
        reservationDate: format(date, 'yyyy-MM-dd'),
        reservationTime: time,
        guests: parseInt(guests),
        seatingArea: location,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        specialRequests: notes || undefined,
      };
      
      const result = await createReservation(reservationData);
      
      if (result.success) {
        toast({
          title: "Reservation confirmed!",
          description: "Your table has been reserved. You'll receive a confirmation email shortly.",
        });
        
        // Reset form
        setDate(undefined);
        setTime("");
        setGuests("2");
        setLocation("area1");
        setName("");
        setPhone("");
        setEmail("");
        setNotes("");
        
        // Redirect to profile to view reservations
        navigate('/profile');
      } else {
        toast({
          title: "Reservation failed",
          description: result.error || "Unable to create reservation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationName = (locationValue: string) => {
    switch (locationValue) {
      case 'area1': return 'Area 1 (Main Dining)';
      case 'area2': return 'Area 2 (Cozy Corner)';
      default: return locationValue;
    }
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
                    <Label htmlFor="date">Date *</Label>
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
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Select value={time} onValueChange={setTime} disabled={isLoadingTimes}>
                      <SelectTrigger id="time">
                        <SelectValue placeholder={isLoadingTimes ? "Loading times..." : "Select time"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingTimes ? (
                          <SelectItem value="loading" disabled>
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading available times...
                            </div>
                          </SelectItem>
                        ) : availableTimes.length > 0 ? (
                          availableTimes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No available times for this selection
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {date && availableTimes.length === 0 && !isLoadingTimes && (
                      <p className="text-sm text-red-600">
                        No available times for this date and party size. Try selecting a different date or reducing party size.
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests *</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger id="guests">
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'guest' : 'guests'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Seating Area *</Label>
                    <RadioGroup value={location} onValueChange={setLocation} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="area1" id="area1" />
                        <Label htmlFor="area1">Area 1 (Main Dining)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="area2" id="area2" />
                        <Label htmlFor="area2">Area 2 (Cozy Corner)</Label>
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
                    <Label htmlFor="name">Full Name *</Label>
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
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
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

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <h3 className="font-semibold text-blue-900 mb-2">Data Privacy Notice</h3>
                    <p className="text-blue-800 leading-relaxed">
                      By making a reservation, you consent to Café Amka collecting and using your personal information 
                      (name, phone, email) for reservation management, communication about your booking, and to improve 
                      our services. We protect your data in accordance with our privacy policy and will not share it 
                      with third parties without your consent.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                  You'll receive a confirmation email once your reservation is confirmed.
                </p>
                <Button 
                  type="submit" 
                  className="gradient-button"
                  disabled={isLoading || !user || !date || !time || availableTimes.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Reservation...
                    </>
                  ) : !user ? (
                    "Sign In Required"
                  ) : !date || !time ? (
                    "Select Date & Time"
                  ) : availableTimes.length === 0 ? (
                    "No Available Times"
                  ) : (
                    "Reserve Table"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reserve;
