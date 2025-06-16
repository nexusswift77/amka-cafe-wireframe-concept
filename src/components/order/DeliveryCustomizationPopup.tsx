
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Phone } from 'lucide-react';

interface DeliveryCustomizationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deliveryDetails: DeliveryDetails) => void;
  currentDetails?: DeliveryDetails;
}

export interface DeliveryDetails {
  address: string;
  apartment?: string;
  businessName?: string;
  deliveryInstructions: string;
  phone: string;
  deliveryTime: 'asap' | 'scheduled';
  scheduledTime?: string;
  contactPreference: 'call' | 'text' | 'both';
  leaveAtDoor: boolean;
}

const DeliveryCustomizationPopup: React.FC<DeliveryCustomizationPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  currentDetails
}) => {
  const [details, setDetails] = useState<DeliveryDetails>(
    currentDetails || {
      address: '',
      apartment: '',
      businessName: '',
      deliveryInstructions: '',
      phone: '',
      deliveryTime: 'asap',
      scheduledTime: '',
      contactPreference: 'call',
      leaveAtDoor: false
    }
  );

  const handleSave = () => {
    onSave(details);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-coffee-dark">Delivery Address</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="Enter your delivery address"
                value={details.address}
                onChange={(e) => setDetails({ ...details, address: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apartment">Apt/Suite/Floor (Optional)</Label>
                <Input
                  id="apartment"
                  placeholder="e.g. Apt 2B, Floor 3"
                  value={details.apartment}
                  onChange={(e) => setDetails({ ...details, apartment: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business">Business Name (Optional)</Label>
                <Input
                  id="business"
                  placeholder="If delivering to a business"
                  value={details.businessName}
                  onChange={(e) => setDetails({ ...details, businessName: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold text-coffee-dark flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>How should the driver contact you?</Label>
              <RadioGroup
                value={details.contactPreference}
                onValueChange={(value: 'call' | 'text' | 'both') => 
                  setDetails({ ...details, contactPreference: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="call" id="call" />
                  <Label htmlFor="call">Call me</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Text me</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Either is fine</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold text-coffee-dark flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Delivery Time
            </h3>
            
            <RadioGroup
              value={details.deliveryTime}
              onValueChange={(value: 'asap' | 'scheduled') => 
                setDetails({ ...details, deliveryTime: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asap" id="asap" />
                <Label htmlFor="asap">ASAP (25-35 minutes)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled">Schedule for later</Label>
              </div>
            </RadioGroup>
            
            {details.deliveryTime === 'scheduled' && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="scheduledTime">Select Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={details.scheduledTime}
                  onChange={(e) => setDetails({ ...details, scheduledTime: e.target.value })}
                  min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold text-coffee-dark">Delivery Instructions</h3>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="e.g. Ring doorbell, leave at front desk, etc."
                value={details.deliveryInstructions}
                onChange={(e) => setDetails({ ...details, deliveryInstructions: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="leaveAtDoor"
                checked={details.leaveAtDoor}
                onChange={(e) => setDetails({ ...details, leaveAtDoor: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="leaveAtDoor">Leave at my door</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!details.address || !details.phone}
            className="gradient-button"
          >
            Save Delivery Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryCustomizationPopup;
