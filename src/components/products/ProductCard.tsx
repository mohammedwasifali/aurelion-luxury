import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="relative overflow-hidden bg-card border border-border/30 hover:border-primary/30 transition-all duration-500">
          {/* Image Container */}
          <div className="aspect-[3/4] overflow-hidden luxury-image-hover">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <Button
              variant="luxury-outline"
              size="lg"
              onClick={handleAddToCart}
              className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Quick Add - Mobile */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
            <Button
              variant="luxury"
              size="sm"
              onClick={handleAddToCart}
              className="w-full"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 text-center">
          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground font-body uppercase tracking-wider">
            {product.category}
          </p>
          <p className="mt-2 text-primary font-display text-lg tracking-wider">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
