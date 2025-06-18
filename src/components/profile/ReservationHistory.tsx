import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, Users, MapPin, MessageSquare, Loader2 } from 'lucide-react';
import { format, parseISO, isPast, isFuture } from 'date-fns';
import { getUserReservations, cancelReservation, type Reservation } from '@/services/reservationService';

const ReservationHistory: React.FC = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const data = await getUserReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load reservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (reservationId: string) => {
    setCancellingId(reservationId);
    try {
      const result = await cancelReservation(reservationId);
      if (result.success) {
        toast({
          title: "Reservation cancelled",
          description: "Your reservation has been successfully cancelled",
        });
        // Refresh the list
        await loadReservations();
      } else {
        toast({
          title: "Cancellation failed",
          description: result.error || "Failed to cancel reservation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLocationName = (seatingArea: string) => {
    switch (seatingArea) {
      case 'area1': return 'Area 1 (Main Dining)';
      case 'area2': return 'Area 2 (Cozy Corner)';
      default: return seatingArea;
    }
  };

  const canCancelReservation = (reservation: Reservation) => {
    const reservationDateTime = parseISO(`${reservation.reservation_date}T${reservation.reservation_time}`);
    return isFuture(reservationDateTime) && 
           reservation.status !== 'cancelled' && 
           reservation.status !== 'completed';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading reservations...</span>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reservations Yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't made any table reservations yet.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/reserve'}>
            Make a Reservation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Reservations</h3>
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/reserve'}>
          New Reservation
        </Button>
      </div>
      
      {reservations.map((reservation) => {
        const reservationDate = parseISO(reservation.reservation_date);
        const isPastReservation = isPast(parseISO(`${reservation.reservation_date}T${reservation.reservation_time}`));
        
        return (
          <Card key={reservation.id} className={isPastReservation ? 'opacity-75' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {format(reservationDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Reservation #{reservation.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                {getStatusBadge(reservation.status || 'pending')}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{reservation.reservation_time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{getLocationName(reservation.seating_area)}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Contact:</strong> {reservation.customer_name}
                </div>
              </div>
              
              {reservation.special_requests && (
                <div className="flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Special Requests:</p>
                    <p className="text-gray-600">{reservation.special_requests}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Reserved on {format(parseISO(reservation.created_at), 'MMM d, yyyy')}
                </p>
                
                {canCancelReservation(reservation) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(reservation.id)}
                    disabled={cancellingId === reservation.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {cancellingId === reservation.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Reservation'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ReservationHistory;
