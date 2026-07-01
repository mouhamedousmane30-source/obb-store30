import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import StatusBadge from '@/components/admin/StatusBadge';
import { ApiError } from '@/lib/api/client';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductStatus,
  importAdminProducts,
} from '@/lib/api/admin';
import { Plus, Grid3x3, List, Download, Upload, RefreshCw, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

interface AdminProduct {
  _id: string;
  nom: string;
  slug: string;
  prix: number;
  ancienPrix?: number;
  stock: number;
  vendu?: number;
  category: string;
  isActive?: boolean;
  isNewArrival?: boolean;
  imagePrincipale: string;
  gallery?: string[];
  createdAt?: string;
  description?: string;
}

interface ProductForm {
  nom: string;
  slug: string;
  category: string;
  prix: string;
  ancienPrix: string;
  stock: string;
  description: string;
  imageFiles: File[];
  isActive: boolean;
  isNewArrival: boolean;
}

const emptyForm: ProductForm = {
  nom: '',
  slug: '',
  category: 'maillots',
  prix: '0',
  ancienPrix: '0',
  stock: '0',
  description: '',
  imageFiles: [],
  isActive: true,
  isNewArrival: true,
};

function resolveProductStatus(product: AdminProduct) {
  if (!product.isActive) return 'inactive' as const;
  if (product.stock <= 3) return 'low_stock' as const;
  return 'active' as const;
}

function slugifyName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ProductsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productAction, setProductAction] = useState<'create' | 'edit' | 'view' | 'duplicate'>('create');
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyForm);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', categoryFilter],
    queryFn: () => {
      const params: Record<string, string | number> = { limit: 50 };
      if (categoryFilter) params.category = categoryFilter;
      return fetchAdminProducts(params);
    },
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: (payload: FormData | Record<string, unknown>) => createAdminProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Produit créé avec succès');
      setDialogOpen(false);
      setSelectedProductIds([]);
      setProductForm(emptyForm);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erreur lors de la création du produit');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData | Record<string, unknown> }) => updateAdminProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Produit mis à jour');
      setDialogOpen(false);
      setSelectedProductIds([]);
      setProductForm(emptyForm);
    },
    onError: () => toast.error('Erreur lors de la mise à jour du produit'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Produit supprimé');
      setSelectedProductIds((prev) => prev.filter((selectedId) => selectedId !== id));
    },
    onError: () => toast.error('Erreur lors de la suppression du produit'),
  });

  const importMutation = useMutation({
    mutationFn: (products: Record<string, unknown>[]) => importAdminProducts(products),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Produits importés avec succès');
    },
    onError: () => toast.error('Erreur lors de l’import des produits'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteAdminProduct(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Produits supprimés');
      setSelectedProductIds([]);
    },
    onError: () => toast.error('Erreur lors de la suppression des produits'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleProductStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Statut du produit mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour du statut du produit'),
  });

  const productsData = (data?.products ?? []) as AdminProduct[];
  const filteredProducts = searchQuery
    ? productsData.filter((p) =>
        p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productsData;

  const openDialogFor = (action: 'create' | 'edit' | 'view' | 'duplicate', product?: AdminProduct) => {
    setProductAction(action);
    setSelectedProduct(action === 'create' ? null : product ?? null);
    const baseProduct = product || null;
    setProductForm({
      nom: action === 'duplicate' && baseProduct ? `${baseProduct.nom} (copie)` : baseProduct?.nom ?? '',
      slug: action === 'duplicate' ? '' : baseProduct?.slug ?? '',
      category: baseProduct?.category ?? 'maillots',
      prix: baseProduct?.prix?.toString() ?? '0',
      ancienPrix: baseProduct?.ancienPrix?.toString() ?? '0',
      stock: baseProduct?.stock?.toString() ?? '0',
      description: baseProduct?.description ?? '',
      imageFiles: [],
      isActive: baseProduct?.isActive ?? true,
      isNewArrival: baseProduct?.isNewArrival ?? true,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setProductForm(emptyForm);
    setSelectedProduct(null);
    setProductAction('create');
  };

  const handleFormChange = (field: keyof ProductForm, value: string | boolean | File[] | null) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productForm.nom.trim()) {
      toast.error('Le nom du produit est requis');
      return;
    }

    if (productAction === 'create' && productForm.imageFiles.length === 0) {
      toast.error('L’upload d’image est requis pour le produit');
      return;
    }

    const payload = new FormData();
    payload.append('nom', productForm.nom);
    payload.append('slug', productForm.slug || slugifyName(productForm.nom));
    payload.append('category', productForm.category);
    payload.append('prix', String(Number(productForm.prix)));
    payload.append('ancienPrix', String(Number(productForm.ancienPrix)));
    payload.append('stock', String(Number(productForm.stock)));
    payload.append('description', productForm.description);
    payload.append('isActive', String(productForm.isActive));
    payload.append('isNewArrival', String(productForm.isNewArrival));

    productForm.imageFiles.forEach((file) => payload.append('images', file));

    if (productAction === 'edit' && selectedProduct) {
      updateMutation.mutate({ id: selectedProduct._id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const handleDelete = (product: AdminProduct) => {
    const confirmed = window.confirm(`Supprimer le produit « ${product.nom} » ?`);
    if (confirmed) {
      deleteMutation.mutate(product._id);
    }
  };

  const handleExport = () => {
    const exportData = filteredProducts.map((product) => ({
      nom: product.nom,
      slug: product.slug,
      category: product.category,
      prix: product.prix,
      ancienPrix: product.ancienPrix,
      stock: product.stock,
      description: product.description,
      imagePrincipale: product.imagePrincipale,
      isActive: product.isActive,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'produits-export.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        toast.error('Fichier d’import invalide, attend un tableau JSON');
        return;
      }
      importMutation.mutate(parsed.map((item) => ({
        nom: item.nom,
        slug: item.slug,
        category: item.category,
        prix: item.prix,
        ancienPrix: item.ancienPrix,
        stock: item.stock,
        description: item.description,
        imagePrincipale: item.imagePrincipale,
        isActive: item.isActive,
      })));
    } catch (error) {
      toast.error('Impossible de lire le fichier d’import');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
  };

  const handleBulkSelect = (productId: string, checked: boolean) => {
    setSelectedProductIds((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedProductIds(checked ? filteredProducts.map((product) => product._id) : []);
  };

  const handleBulkDelete = () => {
    if (!selectedProductIds.length) return;
    if (window.confirm(`Supprimer ${selectedProductIds.length} produit(s) sélectionné(s) ?`)) {
      bulkDeleteMutation.mutate(selectedProductIds);
    }
  };

  const dialogTitle =
    productAction === 'view'
      ? 'Détails du produit'
      : productAction === 'edit'
      ? 'Modifier le produit'
      : productAction === 'duplicate'
      ? 'Dupliquer le produit'
      : 'Ajouter un produit';

  return (
    <AdminLayout title="Produits">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 flex-1">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg" onClick={() => openDialogFor('create')}>
            <Plus size={18} />
            Ajouter un produit
          </Button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors"
          >
            <Download size={16} />
            Exporter
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors"
          >
            <Upload size={16} />
            Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => handleImport(event.target.files)}
          />
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:border-foreground/15 transition-colors"
          >
            <RefreshCw size={16} />
            Réinitialiser
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleBulkDelete}
            disabled={!selectedProductIds.length}
            className="flex items-center gap-2 px-4 py-2.5"
          >
            Supprimer ({selectedProductIds.length})
          </Button>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-foreground/8 rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground/15 transition-colors"
          >
            <option value="">Toutes les catégories</option>
            <option value="maillots">Maillots</option>
            <option value="tshirts">T-shirts</option>
            <option value="parfums">Parfums</option>
            <option value="chaussures">Chaussures</option>
          </select>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })}>
            <RefreshCw size={18} />
            Actualiser
          </Button>
          <div className="h-6 w-px bg-foreground/10" />
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'bg-muted/50 text-foreground/60 hover:text-foreground'}`}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-accent text-accent-foreground' : 'bg-muted/50 text-foreground/60 hover:text-foreground'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-foreground/60">Chargement des produits…</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const selected = selectedProductIds.includes(product._id);
            return (
              <div key={product._id} className={`bg-card rounded-lg border overflow-hidden hover:border-foreground/15 transition-all group ${selected ? 'border-accent shadow-sm' : 'border-foreground/8'}`}>
                <div className="p-3 border-b border-foreground/8 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => handleBulkSelect(product._id, e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    Sélectionner
                  </label>
                </div>
                <div className="relative h-48 bg-muted/50 overflow-hidden">
                  <img
                    src={product.imagePrincipale}
                    alt={product.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{product.nom}</h3>
                      <p className="text-xs text-foreground/60">{product.category}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-foreground">{product.prix?.toLocaleString()} FCFA</p>
                      {product.ancienPrix && product.ancienPrix > product.prix && (
                        <p className="text-xs text-foreground/40 line-through">{product.ancienPrix?.toLocaleString()} FCFA</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-foreground/60">Stock: {product.stock}</p>
                      <StatusBadge status={resolveProductStatus(product)}>
                        {resolveProductStatus(product) === 'active' ? 'Actif' : resolveProductStatus(product) === 'low_stock' ? 'Stock faible' : 'Inactif'}
                      </StatusBadge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openDialogFor('view', product)}
                        className="px-3 py-2 bg-muted/50 rounded-md text-sm text-foreground/80 hover:bg-muted/70 transition-colors"
                      >
                        Détails
                      </button>
                      <button
                        type="button"
                        onClick={() => openDialogFor('edit', product)}
                        className="px-3 py-2 bg-muted/50 rounded-md text-sm text-foreground/80 hover:bg-muted/70 transition-colors"
                      >
                        Modifier
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openDialogFor('duplicate', product)}
                        className="px-3 py-2 bg-muted/50 rounded-md text-sm text-foreground/80 hover:bg-muted/70 transition-colors"
                      >
                        Dupliquer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm hover:bg-destructive/90 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMutation.mutate(product._id)}
                      className="px-3 py-2 bg-accent hover:bg-accent/90 rounded-md text-sm text-accent-foreground transition-colors"
                    >
                      {product.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-foreground/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/8 bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Produit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Vendu</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const selected = selectedProductIds.includes(product._id);
                  return (
                    <tr key={product._id} className={`border-b border-foreground/5 hover:bg-muted/20 transition-colors ${selected ? 'bg-accent/10' : ''}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => handleBulkSelect(product._id, e.target.checked)}
                          className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                            <img src={product.imagePrincipale} alt={product.nom} className="w-full h-full object-cover" />
                          </div>
                          <div>
                          <p className="text-sm font-medium text-foreground">{product.nom}</p>
                          <p className="text-xs text-foreground/40">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground/80">{product.category}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-foreground">{product.prix?.toLocaleString()} FCFA</td>
                    <td className="px-4 py-4 text-sm text-foreground/80">{product.stock}</td>
                    <td className="px-4 py-4 text-sm text-foreground/80">{product.vendu || 0}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={resolveProductStatus(product)}>
                        {resolveProductStatus(product) === 'active' ? 'Actif' : resolveProductStatus(product) === 'low_stock' ? 'Stock faible' : 'Inactif'}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openDialogFor('view', product)}
                          className="px-2 py-1 bg-muted/50 rounded-md text-foreground/80 hover:bg-muted/70 transition-colors"
                        >
                          Détails
                        </button>
                        <button
                          type="button"
                          onClick={() => openDialogFor('edit', product)}
                          className="px-2 py-1 bg-muted/50 rounded-md text-foreground/80 hover:bg-muted/70 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => openDialogFor('duplicate', product)}
                          className="px-2 py-1 bg-muted/50 rounded-md text-foreground/80 hover:bg-muted/70 transition-colors"
                        >
                          Dupliquer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="px-2 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                        >
                          Supprimer
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleMutation.mutate(product._id)}
                          className="px-2 py-1 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
                        >
                          {product.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {productAction === 'view'
                ? 'Consulter les détails du produit.'
                : productAction === 'edit'
                ? 'Modifiez les informations du produit.'
                : productAction === 'duplicate'
                ? 'Dupliquez le produit et enregistrez une nouvelle fiche.'
                : 'Créez un nouveau produit.'}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <div className="h-[320px] rounded-3xl overflow-hidden bg-muted/80 shadow-inner">
                  <img
                    src={selectedProduct.gallery && selectedProduct.gallery.length > 0 ? selectedProduct.gallery[activeImageIndex] : selectedProduct.imagePrincipale}
                    alt={selectedProduct.nom}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.gallery && selectedProduct.gallery.length > 1 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.gallery.map((src, index) => (
                      <button
                        key={src + index}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`overflow-hidden rounded-2xl border transition ${activeImageIndex === index ? 'border-accent ring-2 ring-accent/30' : 'border-transparent'}`}
                      >
                        <img src={src} alt={`Image ${index + 1}`} className="w-full h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">Images</span>
                  <a
                    href={`/boutique/${selectedProduct.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-accent px-3 py-2 text-xs font-semibold text-accent transition hover:bg-accent/10"
                  >
                    Voir sur le site
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80">Nom</label>
                <Input
                  value={productForm.nom}
                  onChange={(e) => handleFormChange('nom', e.target.value)}
                  disabled={productAction === 'view'}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80">Catégorie</label>
                <select
                  value={productForm.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  disabled={productAction === 'view'}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="maillots">Maillots</option>
                  <option value="tshirts">T-shirts</option>
                  <option value="parfums">Parfums</option>
                  <option value="chaussures">Chaussures</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80">Prix</label>
                <Input
                  value={productForm.prix}
                  onChange={(e) => handleFormChange('prix', e.target.value)}
                  disabled={productAction === 'view'}
                  type="number"
                  min={0}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80">Ancien prix</label>
                <Input
                  value={productForm.ancienPrix}
                  onChange={(e) => handleFormChange('ancienPrix', e.target.value)}
                  disabled={productAction === 'view'}
                  type="number"
                  min={0}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80">Stock</label>
                <Input
                  value={productForm.stock}
                  onChange={(e) => handleFormChange('stock', e.target.value)}
                  disabled={productAction === 'view'}
                  type="number"
                  min={0}
                />
              </div>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80">Images du produit</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={productAction === 'view'}
                  onChange={(e) => handleFormChange('imageFiles', Array.from(e.target.files ?? []))}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {productForm.imageFiles.length > 0 ? (
                  <p className="text-xs text-foreground/60">Fichiers sélectionnés : {productForm.imageFiles.map((file) => file.name).join(', ')}</p>
                ) : null}
                {selectedProduct?.gallery?.length ? (
                  <div className="mt-3">
                    <p className="text-xs text-foreground/60">Galerie existante :</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedProduct.gallery.map((src, index) => (
                        <img key={src + index} src={src} alt={`Galerie ${index + 1}`} className="h-16 w-16 rounded-lg object-cover border border-foreground/10" />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground/80">Description</label>
              <Textarea
                value={productForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                disabled={productAction === 'view'}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground/80">Actif</label>
                <input
                  type="checkbox"
                  checked={productForm.isActive}
                  onChange={(e) => handleFormChange('isActive', e.target.checked)}
                  disabled={productAction === 'view'}
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground/80">Nouveauté</label>
                <input
                  type="checkbox"
                  checked={productForm.isNewArrival}
                  onChange={(e) => handleFormChange('isNewArrival', e.target.checked)}
                  disabled={productAction === 'view'}
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Fermer
              </Button>
              {productAction !== 'view' ? (
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-lg">
                  Enregistrer
                </Button>
              ) : null}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/products')({
  head: () => ({ meta: [{ title: 'Produits — OBB Store Admin' }] }),
  component: ProductsPage,
});
