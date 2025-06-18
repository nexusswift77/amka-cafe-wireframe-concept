import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUserOrders } from '@/services/orderService';
import { Clock, Package, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface OrderHistoryProps {
  className?: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ className }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Order Received';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Preparing';
      case 'shipped':
        return 'On the Way';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleReorderItem = (menuItem: any) => {
    addItem(menuItem, 1);
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-coffee-medium" />
            <span className="ml-2">Loading order history...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No orders yet</p>
            <p className="text-sm text-gray-400">Your order history will appear here once you place your first order.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-coffee-dark">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(order.placed_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <p className="font-bold text-coffee-medium mt-1">
                      Ksh {parseFloat(order.total_amount).toFixed(0)}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Order Items:</h4>
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-grow">
                        <span className="font-medium">{item.menu_item?.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        {item.menu_item?.category && (
                          <span className="text-xs px-2 py-1 bg-cream text-coffee-dark rounded-full ml-2">
                            {item.menu_item.category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Ksh {parseFloat(item.subtotal || item.unit_price * item.quantity).toFixed(0)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReorderItem(item.menu_item)}
                          className="text-xs"
                        >
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory; 