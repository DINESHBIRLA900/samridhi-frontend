import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Instagram, Facebook, Youtube, Twitter, Link as LinkIcon, Save, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';
import CategoryForm from './CategoryForm';
import TechnicalForm from './TechnicalForm';
import HSNForm from './HSNForm';
import UnitForm from './UnitForm';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ProductFormProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

interface Variant {
    id: string;
    unit_value: string;
    unit_master: string;
    packing: string;
    gst_bill: {
        mrp: string;
        price_excl_gst: string;
        min_price_excl_gst: string;
        gst_percent: string;
        gst_amount: number;
        total_amount: number;
    };
    non_gst_bill: {
        price_excl_gst: string;
        min_price_excl_gst: string;
        total_amount: number;
    };
}

export default function ProductForm({ onClose, onSubmit }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        technical_name: '',
        category: '',
        hsn_code: '',
        description: '',
        variants: [
            {
                id: '1',
                unit_value: '1',
                unit_master: '',
                packing: '',
                gst_bill: {
                    mrp: '',
                    price_excl_gst: '',
                    min_price_excl_gst: '',
                    gst_percent: '',
                    gst_amount: 0,
                    total_amount: 0
                },
                non_gst_bill: {
                    price_excl_gst: '',
                    min_price_excl_gst: '',
                    total_amount: 0
                }
            }
        ] as Variant[],
        social_links: [] as { platform: string; url: string; }[],
        banner_images: [] as File[],
        product_images: [] as File[]
    });


    const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);
    const [productPreviews, setProductPreviews] = useState<string[]>([]);

    // Modal State
    const [activeModal, setActiveModal] = useState<'category' | 'technical' | 'hsn' | 'unit' | null>(null);

    // Data State
    const [technicalNamesList, setTechnicalNamesList] = useState<any[]>([]);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [hsnCodesList, setHsnCodesList] = useState<any[]>([]);
    const [unitsList, setUnitsList] = useState<any[]>([]);
    const [packingsList, setPackingsList] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, techs, hsn, units, packs] = await Promise.all([
                    import('../../services/productService').then(m => m.getCategories()),
                    import('../../services/productService').then(m => m.getTechnicals()),
                    import('../../services/productService').then(m => m.getHsnCodes()),
                    import('../../services/productService').then(m => m.getUnits()),
                    import('../../services/productService').then(m => m.getPackings())
                ]);
                setCategoriesList(cats);
                setTechnicalNamesList(techs);
                setHsnCodesList(hsn);
                setUnitsList(units);
                setPackingsList(packs);
            } catch (error) {
                console.error("Error fetching master data:", error);
                toast.error("Failed to load some master data");
            }
        };
        fetchData();
    }, []);

    // Sync GST % to all variants when HSN changes
    useEffect(() => {
        if (formData.hsn_code && hsnCodesList.length > 0) {
            const selectedHsn = hsnCodesList.find(h => h._id === formData.hsn_code || h.hsn_code === formData.hsn_code);
            if (selectedHsn) {
                setFormData(prev => ({
                    ...prev,
                    variants: prev.variants.map(v => {
                        const updated = {
                            ...v,
                            gst_bill: {
                                ...v.gst_bill,
                                gst_percent: selectedHsn.gst_rate.toString()
                            }
                        };
                        // Trigger recalculation
                        const price = parseFloat(v.gst_bill.price_excl_gst) || 0;
                        const gst = selectedHsn.gst_rate || 0;
                        const gstAmount = price * (gst / 100);
                        updated.gst_bill.gst_amount = parseFloat(gstAmount.toFixed(2));
                        updated.gst_bill.total_amount = parseFloat((price + gstAmount).toFixed(2));
                        return updated;
                    })
                }));
            }
        }
    }, [formData.hsn_code, hsnCodesList]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addSocialLink = () => {
        if (formData.social_links.length < 4) {
            setFormData(prev => ({
                ...prev,
                social_links: [...prev.social_links, { platform: 'Facebook', url: '' }]
            }));
        }
    };

    const removeSocialLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            social_links: prev.social_links.filter((_, i) => i !== index)
        }));
    };

    const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
        setFormData(prev => {
            const newLinks = [...prev.social_links];
            newLinks[index] = { ...newLinks[index], [field]: value };
            return { ...prev, social_links: newLinks };
        });
    };

    const handleVariantChange = (id: string, path: string, value: string) => {
        setFormData(prev => {
            const newVariants = prev.variants.map(variant => {
                if (variant.id === id) {
                    const keys = path.split('.');
                    const updatedVariant = JSON.parse(JSON.stringify(variant)); // Deep copy helper

                    let curr = updatedVariant;
                    for (let i = 0; i < keys.length - 1; i++) {
                        curr = curr[keys[i]];
                    }
                    curr[keys[keys.length - 1]] = value;

                    // Auto Calculations for GST Bill
                    if (path.startsWith('gst_bill.')) {
                        const price = parseFloat(updatedVariant.gst_bill.price_excl_gst) || 0;
                        const gst = parseFloat(updatedVariant.gst_bill.gst_percent) || 0;
                        const gstAmount = price * (gst / 100);
                        const total = price + gstAmount;

                        updatedVariant.gst_bill.gst_amount = parseFloat(gstAmount.toFixed(2));
                        updatedVariant.gst_bill.total_amount = parseFloat(total.toFixed(2));
                    }

                    // Auto Calculations for Non-GST Bill
                    if (path.startsWith('non_gst_bill.price_excl_gst')) {
                        updatedVariant.non_gst_bill.total_amount = parseFloat(value) || 0;
                    }

                    return updatedVariant;
                }
                return variant;
            });
            return { ...prev, variants: newVariants };
        });
    };


    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    id: Date.now().toString(),
                    unit_value: '1',
                    unit_master: '',
                    packing: '',
                    gst_bill: {
                        mrp: '',
                        price_excl_gst: '',
                        min_price_excl_gst: '',
                        gst_percent: '',
                        gst_amount: 0,
                        total_amount: 0
                    },
                    non_gst_bill: {
                        price_excl_gst: '',
                        min_price_excl_gst: '',
                        total_amount: 0
                    }
                }
            ]
        }));
    };


    const removeVariant = (id: string) => {
        if (formData.variants.length === 1) {
            toast.error("At least one variant is required.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'product') => {
        if (type === 'banner') {
            const files = e.target.files;
            if (files && files.length > 0) {
                const newFiles = Array.from(files);
                const newPreviews = newFiles.map(file => URL.createObjectURL(file));

                setBannerPreviews(prev => [...prev, ...newPreviews]);
                setFormData(prev => ({
                    ...prev,
                    banner_images: [...prev.banner_images, ...newFiles]
                }));
            }
        } else {
            const files = e.target.files;
            if (files && files.length > 0) {
                const newFiles = Array.from(files);
                const newPreviews = newFiles.map(file => URL.createObjectURL(file));

                setProductPreviews(prev => [...prev, ...newPreviews]);
                setFormData(prev => ({
                    ...prev,
                    product_images: [...prev.product_images, ...newFiles]
                }));
            }
        }
    };

    const removeBannerImage = (index: number) => {
        setBannerPreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            banner_images: prev.banner_images.filter((_, i) => i !== index)
        }));
    };

    const removeProductImage = (index: number) => {
        setProductPreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            product_images: prev.product_images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        toast.success('Product saved successfully');
        onSubmit(formData);
    };

    const handleSaveCategory = (data: any) => {
        setCategoriesList(prev => [...prev, data]);
        setFormData(prev => ({ ...prev, category: data._id }));
        setActiveModal(null);
    };

    const handleSaveTechnical = (data: any) => {
        setTechnicalNamesList(prev => [...prev, data]);
        setFormData(prev => ({ ...prev, technical_name: data._id }));
        setActiveModal(null);
    };

    const handleSaveHSN = (data: any) => {
        setHsnCodesList(prev => [...prev, data]);
        setFormData(prev => ({ ...prev, hsn_code: data._id }));
        setActiveModal(null);
    };

    // Note: Unit is just a string in the current variant structure, but if we had a global unit list we would update it here.
    // For now, let's assume we maintain a list of units for the 'Unit / Packing' field suggestions if needed,
    // but the current UI is a text input. The user might want a dropdown there?
    // The request said "Add Unit", implying we might need to select it.
    // The current variant field is `unit_packing` which is a text input.
    // I will keep it as text for now but if they use the modal, I'll assume they want to use the unit name.

    // START EDIT: Actually, looking at the request "Add Unit", let's assume `unit_packing` might benefit from a unit dropdown or at least appended text.
    // Since `unit_packing` is often "1 KG", "500 ML" etc, maybe it's better to just generic "Unit" management for now.
    // I'll leave the variant helper for now as it takes no args for specific row.
    // Wait, the "Add Unit" button is requested. I should probably add it near the variant or just globally?
    // The request says "Add Unit" in the list.
    // I'll add the button near the variant row if possible, or just have it available.

    // Let's implement a generic handleSaveUnit that doesn't necessarily auto-fill a specific variant row 
    // unless we track which row triggered it. For simplicity, just adding to a hypothetical list or doing nothing to the form
    // other than closing the modal (since we don't have a global unit dropdown in the form yet, only text inputs).
    // User might just be populating the master list.
    const handleSaveUnit = (data: any) => {
        console.log("Unit added:", data);
        // If we had a units dropdown, we would add to it.
        setActiveModal(null);
    };


    return (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 text-gray-400 hover:text-orange-600 rounded-full hover:bg-orange-50 transition-all group"
                        title="Back to List"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                        <p className="text-gray-500 text-sm mt-1">Fill in the details to register a new product</p>
                    </div>
                </div>
            </div>

            {/* Form Layout */}
            <div className="p-8">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto">

                    {/* Images Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Banner Images</label>

                            {/* Banner Image Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {bannerPreviews.map((preview, index) => (
                                    <div key={index} className="relative w-full h-32 rounded-xl border border-gray-200 overflow-hidden group">
                                        <img src={preview} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeBannerImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Remove Image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                                    <div className="text-center p-4">
                                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                            <Plus size={16} />
                                        </div>
                                        <span className="block text-xs font-medium text-gray-700">Add Image</span>
                                    </div>
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'banner')} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Product Images</label>

                            {/* Product Image Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {productPreviews.map((preview, index) => (
                                    <div key={index} className="relative w-full h-32 rounded-xl border border-gray-200 overflow-hidden group">
                                        <img src={preview} alt={`Product ${index + 1}`} className="w-full h-full object-contain p-2" />
                                        <button
                                            type="button"
                                            onClick={() => removeProductImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Remove Image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Button for Product */}
                                <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                                    <div className="text-center">
                                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                            <Package size={20} />
                                        </div>
                                        <span className="block text-sm font-medium text-gray-700">Add Image</span>
                                    </div>
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'product')} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                            <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModal('category')}
                                        className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-medium border border-orange-200"
                                    >
                                        <Plus size={14} />
                                        Add Category
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => {
                                            const newCat = e.target.value;
                                            setFormData(prev => ({ ...prev, category: newCat, technical_name: '' }));
                                        }}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categoriesList.map(opt => <option key={opt._id} value={opt._id}>{opt.name}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-sm font-medium text-gray-700">Technical Name</label>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModal('technical')}
                                        className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-medium border border-orange-200"
                                    >
                                        <Plus size={14} />
                                        Add Technical
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        name="technical_name"
                                        value={formData.technical_name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="">Select Technical Name</option>
                                        {technicalNamesList
                                            .filter(tech => !formData.category || tech.category === formData.category || tech.category?._id === formData.category)
                                            .map(opt => <option key={opt._id} value={opt._id}>{opt.name}</option>)
                                        }
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-sm font-medium text-gray-700">HSN Code <span className="text-red-500">*</span></label>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModal('hsn')}
                                        className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-medium border border-orange-200"
                                    >
                                        <Plus size={14} />
                                        Add HSN
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        name="hsn_code"
                                        value={formData.hsn_code}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="">Select HSN Code</option>
                                        {hsnCodesList.map(opt => <option key={opt._id} value={opt._id}>{opt.hsn_code} - {opt.gst_rate}%</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                <div className="quill-description-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                                        placeholder="Enter detailed product description"
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['clean']
                                            ],
                                        }}
                                        className="bg-white rounded-xl border border-gray-200 text-gray-900 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all shadow-sm overflow-hidden"
                                    />
                                </div>
                                <style jsx global>{`
                                    .quill-description-wrapper .ql-toolbar.ql-snow {
                                        border-top-left-radius: 0.75rem;
                                        border-top-right-radius: 0.75rem;
                                        border-color: #e5e7eb;
                                        background-color: #f9fafb;
                                    }
                                    .quill-description-wrapper .ql-container.ql-snow {
                                        border-bottom-left-radius: 0.75rem;
                                        border-bottom-right-radius: 0.75rem;
                                        border-color: #e5e7eb;
                                        min-height: 150px;
                                        font-family: inherit;
                                        font-size: 0.875rem;
                                    }
                                    .quill-description-wrapper .ql-editor {
                                        min-height: 150px;
                                    }
                                    .quill-description-wrapper .ql-editor.ql-blank::before {
                                        color: #9ca3af;
                                        font-style: normal;
                                    }
                                `}</style>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & SKU Variants */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                                <h3 className="text-lg font-bold text-gray-900">Product Variants</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('unit')}
                                    className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm border border-orange-200"
                                >
                                    <Plus size={16} />
                                    Add Unit
                                </button>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm border border-orange-200"
                                >
                                    <Plus size={16} />
                                    Add Variant
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {formData.variants.map((variant, index) => (
                                <div key={variant.id} className="bg-white p-8 rounded-3xl border border-gray-100 relative group transition-all hover:shadow-xl hover:border-orange-100">
                                    <div className="absolute -left-3 top-8 bg-orange-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                                        {index + 1}
                                    </div>

                                    <div className="flex flex-col gap-8">
                                        {/* Unit & Packing Configuration */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Value *</label>
                                                <input
                                                    type="number"
                                                    value={variant.unit_value}
                                                    onChange={(e) => handleVariantChange(variant.id, 'unit_value', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                    placeholder="e.g., 1, 5, 500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Master *</label>
                                                <select
                                                    value={variant.unit_master}
                                                    onChange={(e) => handleVariantChange(variant.id, 'unit_master', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                >
                                                    <option value="">Select Unit</option>
                                                    {unitsList.map(u => <option key={u._id} value={u._id}>{u.name} ({u.short_name})</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Packing *</label>
                                                <select
                                                    value={variant.packing}
                                                    onChange={(e) => handleVariantChange(variant.id, 'packing', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                >
                                                    <option value="">Select Packing</option>
                                                    {packingsList.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Section 1: GST Bill */}
                                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                    <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Section 1 :- GST Bill</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">MRP (Incl. GST) *</label>
                                                        <input
                                                            type="number"
                                                            value={variant.gst_bill.mrp}
                                                            onChange={(e) => handleVariantChange(variant.id, 'gst_bill.mrp', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Price (Excl. GST) *</label>
                                                        <input
                                                            type="number"
                                                            value={variant.gst_bill.price_excl_gst}
                                                            onChange={(e) => handleVariantChange(variant.id, 'gst_bill.price_excl_gst', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold mb-1 uppercase text-orange-600">Min Price (Set Manual)</label>
                                                        <input
                                                            type="number"
                                                            value={variant.gst_bill.min_price_excl_gst}
                                                            onChange={(e) => handleVariantChange(variant.id, 'gst_bill.min_price_excl_gst', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border border-orange-200 text-sm bg-orange-50/30"
                                                            placeholder="Floor Price"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">GST % (Auto)</label>
                                                        <input
                                                            type="text"
                                                            value={`${variant.gst_bill.gst_percent}%`}
                                                            readOnly
                                                            className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-500 font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">GST Amount</label>
                                                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">₹ {variant.gst_bill.gst_amount.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Total Amount</label>
                                                        <div className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold border border-orange-200">₹ {variant.gst_bill.total_amount.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2: Non GST Bill */}
                                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                    <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Section 2 :- Non GST Bill</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Price (Excl. GST) *</label>
                                                            <input
                                                                type="number"
                                                                value={variant.non_gst_bill.price_excl_gst}
                                                                onChange={(e) => handleVariantChange(variant.id, 'non_gst_bill.price_excl_gst', e.target.value)}
                                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold mb-1 uppercase text-blue-600">Min Price (Set Manual)</label>
                                                            <input
                                                                type="number"
                                                                value={variant.non_gst_bill.min_price_excl_gst}
                                                                onChange={(e) => handleVariantChange(variant.id, 'non_gst_bill.min_price_excl_gst', e.target.value)}
                                                                className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-blue-50/30"
                                                                placeholder="Floor Price"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Total Amount</label>
                                                        <div className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold border border-gray-300">₹ {variant.non_gst_bill.total_amount.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <p className="text-[10px] text-gray-400 italic">* Min Price sections specify the lowest price allowed for sales.</p>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(variant.id)}
                                                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all text-xs font-bold border border-red-100 hover:border-red-500 shadow-sm"
                                                disabled={formData.variants.length === 1}
                                            >
                                                <Trash2 size={14} />
                                                Remove Variant
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                                <h3 className="text-lg font-bold text-gray-900">Social Media Links</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addSocialLink}
                                disabled={formData.social_links.length >= 4}
                                className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={16} />
                                Add Link
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.social_links.map((link, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="w-1/3">
                                        <select
                                            value={link.platform}
                                            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                            className="w-full px-3 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none"
                                        >
                                            <option value="Facebook">Facebook</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="YouTube">YouTube</option>
                                            <option value="Twitter">Twitter</option>
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="w-2/3 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {link.platform === 'Facebook' && <Facebook size={18} className="text-blue-600" />}
                                            {link.platform === 'Instagram' && <Instagram size={18} className="text-pink-600" />}
                                            {link.platform === 'YouTube' && <Youtube size={18} className="text-red-600" />}
                                            {link.platform === 'Twitter' && <Twitter size={18} className="text-sky-500" />}
                                            {link.platform === 'LinkedIn' && <LinkIcon size={18} className="text-blue-700" />}
                                            {link.platform === 'Other' && <LinkIcon size={18} className="text-gray-500" />}
                                        </div>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                                            placeholder={`${link.platform} URL`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSocialLink(index)}
                                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.social_links.length === 0 && (
                                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                                    No social media links added. Click "Add Link" to add one.
                                </div>
                            )}
                        </div>
                    </div>

                </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    form="product-form"
                    className="px-8 py-3 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all font-bold flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                    <Save size={20} />
                    Save Product
                </button>
            </div>

            {/* Modals */}
            {activeModal === 'category' && (
                <CategoryForm onClose={() => setActiveModal(null)} onSubmit={handleSaveCategory} />
            )}
            {activeModal === 'technical' && (
                <TechnicalForm
                    onClose={() => setActiveModal(null)}
                    onSubmit={handleSaveTechnical}
                    initialData={{ category: formData.category }}
                />
            )}
            {activeModal === 'hsn' && (
                <HSNForm onClose={() => setActiveModal(null)} onSubmit={handleSaveHSN} />
            )}
            {activeModal === 'unit' && (
                <UnitForm onClose={() => setActiveModal(null)} onSubmit={handleSaveUnit} />
            )}
        </div>
    );
}
