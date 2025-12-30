import { useState } from 'react';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address_line1: '', city: '', state: '', postal_code: '', country: 'India' });

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = items.map(item => ({ product_id: item.product.id, name: item.product.name, price: item.product.price, quantity: item.quantity }));

    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      items: orderItems,
      total: totalPrice,
      shipping_address: form,
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to place order', variant: 'destructive' });
    } else {
      clearCart();
      toast({ title: 'Order Placed', description: 'Thank you for your purchase!' });
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-display text-4xl text-foreground mb-12 text-center">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-sm uppercase tracking-widest">Full Name</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="mt-2 bg-card" />
              </div>
              <div className="col-span-2">
                <Label className="text-sm uppercase tracking-widest">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="mt-2 bg-card" />
              </div>
              <div className="col-span-2">
                <Label className="text-sm uppercase tracking-widest">Address</Label>
                <Input value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} required className="mt-2 bg-card" />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="mt-2 bg-card" />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">State</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className="mt-2 bg-card" />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">Postal Code</Label>
                <Input value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} required className="mt-2 bg-card" />
              </div>
              <div>
                <Label className="text-sm uppercase tracking-widest">Country</Label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required className="mt-2 bg-card" />
              </div>
            </div>

            <div className="border-t border-border/30 pt-8 mt-8">
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between mb-8 text-xl">
                <span>Total</span>
                <span className="text-primary font-display">{formatPrice(totalPrice)}</span>
              </div>
              <Button type="submit" variant="luxury" size="xl" className="w-full" disabled={loading}>
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
