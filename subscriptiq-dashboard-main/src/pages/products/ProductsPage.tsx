import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Package,
  Edit,
  Eye,
  Filter,
  Loader2,
  TrendingUp,
  ShoppingCart,
  Star
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn, formatCurrency } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
  variants: number;
  description: string;
  imageUrl?: string;
  stock?: number;
}

// Local formatPrice removed in favor of utils/formatCurrency

const ProductsPage = () => {
  const { addItem, setIsOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Featured products for Hero Section (Top 3 most expensive or specifically selected)
  const featuredProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 5);

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl blur-3xl -z-10" />
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id}>
                <div className="relative h-[400px] rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-8 z-20 text-white w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="inline-block px-3 py-1 bg-blue-500 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                          Featured
                        </span>
                        <h2 className="text-4xl font-bold mb-2">{product.name}</h2>
                        <p className="text-white/80 max-w-lg line-clamp-2 mb-4">{product.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-bold text-yellow-400">{formatCurrency(product.price)}</span>
                          <span className="text-white/60 text-sm line-through">{formatCurrency(product.price * 1.2)}</span>
                        </div>
                      </div>
                      <Button className="bg-white text-black hover:bg-white/90 font-bold px-8 h-12 rounded-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-0" />
          <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-0" />
        </Carousel>
      </div>

      <PageHeader
        title="Product Catalog"
        description="Manage and showcase your premium inventory"
        action={
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 border-0 rounded-full px-6">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., SaaS, Add-on, Service" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Product description" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button className="bg-gradient-primary border-0" onClick={() => setShowCreateModal(false)}>Create Product</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Floating Cart Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="w-6 h-6" />
      </motion.button>

<<<<<<< HEAD
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-4 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 ring-offset-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-10 border-border/50 hover:border-primary/50 bg-background/50 hover:bg-background transition-all shadow-sm rounded-xl">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            Filters
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none h-10 border-border/50 hover:border-primary/50 bg-background/50 hover:bg-background transition-all shadow-sm rounded-xl">
            <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground" />
            Sort
          </Button>
        </div>
      </div>
=======
      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 sticky top-4 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 border-transparent focus:bg-white transition-all rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-dashed">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="rounded-xl border-dashed">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sort: Best Selling
          </Button>
        </div>
      </motion.div>
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layoutId={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" className="rounded-full bg-white/90 text-black hover:bg-white shadow-lg" onClick={() => setSelectedProduct(product)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <StatusBadge variant={product.status === 'ACTIVE' ? 'success' : 'default'} className="backdrop-blur-md bg-white/90 shadow-sm">
                      {product.status}
                    </StatusBadge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold text-gray-600">4.8</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
                    </div>
                    <Button
                      className="rounded-xl bg-gray-900 text-white hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200"
                      onClick={() => addItem({
                        name: product.name,
                        price: product.price,
                        image: product.imageUrl,
                        productId: product.id
                      })}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/20">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 h-full max-h-[80vh]">
              <div className="relative bg-gray-100 h-64 md:h-auto">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">{selectedProduct.category}</span>
                    <h2 className="text-3xl font-bold mt-2">{selectedProduct.name}</h2>
                  </div>
                  <StatusBadge variant="success">{selectedProduct.status}</StatusBadge>
                </div>

                <div className="flex items-end gap-4 mb-8">
                  <span className="text-4xl font-bold text-gray-900">{formatCurrency(selectedProduct.price)}</span>
                  <span className="text-lg text-gray-400 line-through mb-1">{formatCurrency(selectedProduct.price * 1.2)}</span>
                  <span className="text-sm font-semibold text-green-600 mb-1 bg-green-50 px-2 py-1 rounded-md">Save 20%</span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {selectedProduct.description}
                  <br /><br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Stock</p>
                    <p className="font-semibold">{selectedProduct.stock || 'In Stock'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Variant</p>
                    <p className="font-semibold">Standard Edition</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (selectedProduct) {
                        addItem({
                          name: selectedProduct.name,
                          price: selectedProduct.price,
                          image: selectedProduct.imageUrl,
                          productId: selectedProduct.id
                        });
                        setSelectedProduct(null);
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="h-12 w-12 p-0 rounded-xl">
                    <Star className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout >
  );
};

export default ProductsPage;
