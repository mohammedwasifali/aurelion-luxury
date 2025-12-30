import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Package, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  stock: string;
}

const initialProductForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  category: 'Apparel',
  stock: '10',
};

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(initialProductForm);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      return data || [];
    },
    enabled: isAdmin,
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      return data || [];
    },
    enabled: isAdmin,
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      const { error } = await supabase.from('products').insert(product);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product added successfully' });
      closeModal();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...product }: Product) => {
      const { error } = await supabase.from('products').update(product).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product updated successfully' });
      closeModal();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order status updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm(initialProductForm);
    setShowProductModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category,
      stock: product.stock.toString(),
    });
    setShowProductModal(true);
  };

  const closeModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm(initialProductForm);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      image_url: productForm.image_url,
      category: productForm.category,
      stock: parseInt(productForm.stock),
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...productData });
    } else {
      addProductMutation.mutate(productData);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto">
          <h1 className="font-display text-4xl text-foreground mb-8">Admin Dashboard</h1>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-8 bg-card border border-border/30">
              <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl text-foreground">Products</h2>
                <Button variant="luxury" onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {productsLoading ? (
                <div className="text-center py-12">Loading...</div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product: Product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 p-4 bg-card border border-border/30"
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-20 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-primary">{formatPrice(product.price)}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">Stock: {product.stock}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditModal(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          className="hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <h2 className="font-display text-2xl text-foreground mb-6">Orders</h2>

              {ordersLoading ? (
                <div className="text-center py-12">Loading...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No orders yet</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 bg-card border border-border/30"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                          <Select
                            value={order.status}
                            onValueChange={(status) =>
                              updateOrderStatusMutation.mutate({ id: order.id, status })
                            }
                          >
                            <SelectTrigger className="w-40 bg-card">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status} className="capitalize">
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="border-t border-border/30 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Items</p>
                            {(order.items as any[]).map((item: any, i: number) => (
                              <p key={i} className="text-sm text-foreground">
                                {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                              </p>
                            ))}
                            <p className="mt-2 font-display text-primary">
                              Total: {formatPrice(order.total)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                              Shipping
                            </p>
                            {order.shipping_address && (
                              <div className="text-sm text-foreground">
                                <p>{order.shipping_address.full_name}</p>
                                <p>{order.shipping_address.phone}</p>
                                <p>{order.shipping_address.address_line1}</p>
                                <p>
                                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                  {order.shipping_address.postal_code}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg mx-4 p-6 bg-card border border-border/30 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-foreground">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div>
                <Label className="text-sm uppercase tracking-widest">Product Name</Label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="mt-2 bg-background"
                  placeholder="Gold Embroidered Blazer"
                />
              </div>

              <div>
                <Label className="text-sm uppercase tracking-widest">Description</Label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="mt-2 bg-background min-h-24"
                  placeholder="Opulent blazer featuring intricate gold thread embroidery..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm uppercase tracking-widest">Price (₹)</Label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="mt-2 bg-background"
                    placeholder="125000"
                  />
                </div>
                <div>
                  <Label className="text-sm uppercase tracking-widest">Stock</Label>
                  <Input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                    className="mt-2 bg-background"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm uppercase tracking-widest">Category</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger className="mt-2 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Apparel', 'Shirts', 'Blazers', 'Trousers', 'Outerwear', 'Footwear', 'Accessories'].map(
                      (cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm uppercase tracking-widest">Image URL</Label>
                <Input
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  required
                  className="mt-2 bg-background"
                  placeholder="https://images.unsplash.com/..."
                />
                {productForm.image_url && (
                  <img
                    src={productForm.image_url}
                    alt="Preview"
                    className="mt-2 w-full h-40 object-cover border border-border/30"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="luxury"
                  className="flex-1"
                  disabled={addProductMutation.isPending || updateProductMutation.isPending}
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Admin;
