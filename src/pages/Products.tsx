import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { supabase } from '@/integrations/supabase/client';

const Products = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">The Collection</p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground">Luxury Pieces</h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any, index: number) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
