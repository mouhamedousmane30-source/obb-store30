import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Grid3x3, List, Edit, Trash2, Copy, Archive } from 'lucide-react';
import { useState } from 'react';

const productsData = [
  {
    id: '1',
    name: 'Black Oversized Hoodie',
    sku: 'OBB-HOOD-001',
    price: '$89.99',
    stock: 245,
    sales: 1240,
    category: 'Hoodies',
    image: 'https://via.placeholder.com/150?text=Hoodie',
  },
  {
    id: '2',
    name: 'Silver Bomber Jacket',
    sku: 'OBB-BOMB-001',
    price: '$149.99',
    stock: 87,
    sales: 890,
    category: 'Jackets',
    image: 'https://via.placeholder.com/150?text=Jacket',
  },
  {
    id: '3',
    name: 'Premium White Tee',
    sku: 'OBB-TEE-001',
    price: '$39.99',
    stock: 512,
    sales: 756,
    category: 'T-Shirts',
    image: 'https://via.placeholder.com/150?text=Tee',
  },
  {
    id: '4',
    name: 'Street Wear Pants',
    sku: 'OBB-PANT-001',
    price: '$79.99',
    stock: 156,
    sales: 623,
    category: 'Pants',
    image: 'https://via.placeholder.com/150?text=Pants',
  },
];

function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <AdminLayout title="Products Management">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20"
          />
          <select className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground focus:outline-none focus:border-foreground/20">
            <option>All Categories</option>
            <option>Hoodies</option>
            <option>Jackets</option>
            <option>T-Shirts</option>
            <option>Pants</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-gray-800 text-foreground' : 'bg-foreground/5 text-foreground/60 hover:text-foreground'}`}
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-sm transition-colors ${viewMode === 'table' ? 'bg-gray-800 text-foreground' : 'bg-foreground/5 text-foreground/60 hover:text-foreground'}`}
          >
            <List size={20} />
          </button>
          <Button className="bg-white text-black hover:bg-gray-200 gap-2">
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-sm border border-foreground/10 overflow-hidden hover:border-gray-700 transition-all group"
            >
              <div className="relative h-48 bg-foreground/5 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-foreground/50 mb-1">{product.sku}</p>
                <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                <div className="mb-3">
                  <p className="text-lg font-bold text-foreground">{product.price}</p>
                  <p className="text-xs text-foreground/60">Stock: {product.stock}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-sm text-sm text-foreground transition-colors flex items-center justify-center gap-2">
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-sm text-foreground/60 transition-colors">
                    <Copy size={14} />
                  </button>
                  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-sm text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-sm border border-foreground/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/10 bg-foreground/3">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Sales</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-foreground/10 hover:bg-foreground/2 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground/60">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{product.price}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{product.stock}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{product.sales}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                          <Edit size={16} className="text-foreground/60" />
                        </button>
                        <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                          <Copy size={16} className="text-foreground/60" />
                        </button>
                        <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                          <Archive size={16} className="text-foreground/60" />
                        </button>
                        <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/products')({
  head: () => ({ meta: [{ title: 'Products — OBB Store Admin' }] }),
  component: ProductsPage,
});
