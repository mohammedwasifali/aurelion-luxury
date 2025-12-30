import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);

  // Handle redirects in useEffect
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (items.length === 0 && !authLoading) {
      navigate('/cart');
    }
  }, [items.length, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      items: orderItems,
      total: totalPrice,
      shipping_address: form,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } else {
      clearCart();
      toast({
        title: 'Order Placed Successfully',
        description: 'Thank you for your purchase!',
      });
      navigate('/');
    }
    setLoading(false);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  // Don't render form if no user or no items
  if (!user || items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-display text-4xl text-foreground mb-12 text-center">
            Checkout
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm uppercase tracking-widest">Full Name</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                  className="mt-2 bg-card border-border"
                  placeholder="John Doe"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm uppercase tracking-widest">Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="mt-2 bg-card border-border"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm uppercase tracking-widest">Address</Label>
                <Input
                  value={form.address_line1}
                  onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                  required
                  className="mt-2 bg-card border-border"
                  placeholder="123 Luxury Lane"
                />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                  className="mt-2 bg-card border-border"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  required
                  className="mt-2 bg-card border-border"
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">Postal Code</Label>
                <Input
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  required
                  className="mt-2 bg-card border-border"
                  placeholder="400001"
                />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  required
                  className="mt-2 bg-card border-border"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border/30 pt-8 mt-8">
              <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mb-4 pt-4 border-t border-border/30">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary">Complimentary</span>
              </div>
              <div className="flex justify-between mb-8 text-xl pt-4 border-t border-border/30">
                <span>Total</span>
                <span className="text-primary font-display">{formatPrice(totalPrice)}</span>
              </div>
              <Button
                type="submit"
                variant="luxury"
                size="xl"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
