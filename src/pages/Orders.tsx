import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <h1 className="font-display text-4xl text-foreground mb-12">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-display text-2xl text-foreground mb-4">No Orders Yet</h2>
              <p className="text-muted-foreground mb-8">
                Start your luxury journey with your first purchase.
              </p>
              <Link to="/products">
                <Button variant="luxury-outline" size="lg">
                  Explore Collection
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border/30 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        Order ID
                      </p>
                      <p className="font-mono text-sm text-foreground">
                        {order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span
                        className={`inline-block px-4 py-1.5 text-xs uppercase tracking-widest border rounded-full ${
                          statusColors[order.status] || statusColors.pending
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-6">
                    <div className="space-y-3 mb-6">
                      {(order.items as any[]).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-border/30">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Placed on
                        </p>
                        <p className="text-sm text-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Total
                        </p>
                        <p className="font-display text-xl text-primary">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    {order.shipping_address && (
                      <div className="mt-6 pt-4 border-t border-border/30">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                          Shipping Address
                        </p>
                        <p className="text-sm text-foreground">
                          {order.shipping_address.full_name}
                          <br />
                          {order.shipping_address.address_line1}
                          <br />
                          {order.shipping_address.city}, {order.shipping_address.state}{' '}
                          {order.shipping_address.postal_code}
                          <br />
                          {order.shipping_address.country}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
