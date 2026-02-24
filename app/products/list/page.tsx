"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { Package, Trash2 } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';
import { Toaster, toast } from 'sonner';
import { getProducts, createProduct, deleteProduct } from '@/services/productService';

export default function ProductListPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const handleAddProduct = async (data: any) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'images' && data[key]) {
                    data[key].forEach((file: File) => formData.append('images', file));
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });

            await createProduct(formData);
            toast.success('Product created successfully');
            setIsFormOpen(false);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create product');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = products.filter(p => p.status === 'Active').length;

    return (
        <div className="w-full max-w-[1600px] mx-auto p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            {!isFormOpen ? (
                <>
                    <PageHeader
                        title="Product List"
                        description="Manage diverse range of products"
                        totalCount={products.length}
                        addButtonLabel="Add Product"
                        onAdd={() => setIsFormOpen(true)}
                        showBack={true}
                    />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                        <StatsCard
                            title="Total Products"
                            value={products.length.toString()}
                            icon={<Package size={24} />}
                            color="#3b82f6"
                        />
                        <StatsCard
                            title="Active Items"
                            value={activeCount.toString()}
                            icon={<Package size={24} />}
                            color="#10b981"
                        />
                        <StatsCard
                            title="Low Stock"
                            value="0"
                            icon={<Package size={24} />}
                            color="#f59e0b"
                        />
                        <StatsCard
                            title="Out of Stock"
                            value="0"
                            icon={<Package size={24} />}
                            color="#ef4444"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Product Inventory</h2>
                            <div className="flex flex-row items-center gap-4 w-full justify-end">
                                <div className="w-full max-w-[768px] flex-1 transition-all">
                                    <SearchInput
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                        placeholder="Search products..."
                                    />
                                </div>
                                <DateFilter onFilterChange={handleDateFilterChange} />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-12 text-center text-gray-500 font-medium">Loading products...</div>
                            ) : filteredProducts.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-sm font-semibold text-gray-600">
                                            <th className="px-6 py-4">Image</th>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredProducts.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden border border-gray-200">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.sku || 'No SKU'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">{product.category?.name || '-'}</td>
                                                <td className="px-6 py-4 text-gray-900 font-bold">₹{product.mrp || 0}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                                    <div className="p-4 rounded-full bg-orange-50 mb-4 text-orange-600">
                                        <Package size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                                    <p className="text-gray-500 max-w-md">
                                        Start by adding a new product to your inventory using the button above.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <ProductForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleAddProduct}
                />
            )}
        </div>
    );
}
