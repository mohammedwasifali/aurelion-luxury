import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Layout from '@/components/layout/Layout';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  if (items.length === 0) {
    return (
      <Layout>
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-display text-3xl text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Discover our luxury collection</p>
            <Link to="/products"><Button variant="luxury-outline" size="lg">Shop Now</Button></Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl text-foreground mb-12 text-center">Shopping Cart</h1>

          <div className="space-y-6 mb-12">
            {items.map((item, index) => (
              <motion.div key={item.product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex gap-6 p-6 bg-card border border-border/30">
                <img src={item.product.image_url} alt={item.product.name} className="w-24 h-32 object-cover" />
                <div className="flex-1">
                  <h3 className="font-display text-lg text-foreground">{item.product.name}</h3>
                  <p className="text-primary mt-1">{formatPrice(item.product.price)}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 text-muted-foreground hover:text-foreground"><Minus className="h-4 w-4" /></button>
                    <span className="text-foreground w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-foreground font-display">{formatPrice(item.product.price * item.quantity)}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="mt-4 text-muted-foreground hover:text-destructive"><Trash2 className="h-5 w-5" /></button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-border/30 pt-8">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl text-foreground">Total</span>
              <span className="font-display text-2xl text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <Link to="/checkout"><Button variant="luxury" size="xl" className="w-full">Proceed to Checkout</Button></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
