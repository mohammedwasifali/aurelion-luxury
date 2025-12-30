import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      return data;
    },
  });

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({ title: 'Added to Cart', description: `${product.name} has been added.` });
    }
  };

  if (isLoading) return <Layout><div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></Layout>;
  if (!product) return <Layout><div className="min-h-screen flex items-center justify-center"><p>Product not found</p></div></Layout>;

  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto">
          <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Collection
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="aspect-[3/4] overflow-hidden">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
              <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">{product.category}</p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">{product.name}</h1>
              <p className="font-display text-3xl text-primary mb-8">{formatPrice(product.price)}</p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">{product.description}</p>
              <p className="text-sm text-muted-foreground mb-8">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
              <Button variant="luxury" size="xl" onClick={handleAddToCart} disabled={product.stock === 0} className="w-full md:w-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />Add to Cart
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
