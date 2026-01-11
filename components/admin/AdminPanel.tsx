import React, { useContext, useState, useRef, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Product, Order, User, Promotion, DashboardConfig } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { mockCategories } from '../../data/mockData';

const AdminPanel: React.FC = () => {
    const { 
        products, allOrders, allUsers, promotions, dashboardConfig,
        addProduct, updateProduct, deleteProduct,
        updateDashboardConfig, addPromotion, updatePromotion, deletePromotion,
        deleteOrder, deleteUser
    } = useContext(AppContext);

    const [activeTab, setActiveTab] = useState<'inicio' | 'products' | 'orders' | 'users'>('inicio');
    const [editingItem, setEditingItem] = useState<Product | Promotion | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stats = useMemo(() => {
        const totalSales = allOrders.reduce((sum, o) => sum + o.total, 0);
        const avgTicket = allOrders.length > 0 ? totalSales / allOrders.length : 0;
        return {
            totalSales,
            orderCount: allOrders.length,
            avgTicket,
            userCount: allUsers.length
        };
    }, [allOrders, allUsers]);

    const [productForm, setProductForm] = useState<Partial<Product>>({
        name: '', description: '', price: 0, imageUrl: '', categoryId: mockCategories[0]?.id || '', isCombo: false, isEligibleForReward: true
    });
    
    const [promoForm, setPromoForm] = useState<Partial<Promotion>>({
        title: '', description: '', imageUrl: '', discountPercentage: 0, minAmount: 0
    });

    const [configForm, setConfigForm] = useState<DashboardConfig>(dashboardConfig);

    const resetForm = () => {
        setProductForm({ name: '', description: '', price: 0, imageUrl: '', categoryId: mockCategories[0]?.id || '', isCombo: false, isEligibleForReward: true });
        setPromoForm({ title: '', description: '', imageUrl: '', discountPercentage: 0, minAmount: 0 });
        setEditingItem(null);
        setIsAdding(false);
        setSaveError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const compressImage = (base64Str: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const TARGET_SIZE = 1024;
                canvas.width = TARGET_SIZE;
                canvas.height = TARGET_SIZE;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(base64Str);

                ctx.fillStyle = '#0D0D0D';
                ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);

                let renderWidth, renderHeight;
                const imgRatio = img.width / img.height;

                if (imgRatio > 1) {
                    renderWidth = TARGET_SIZE;
                    renderHeight = TARGET_SIZE / imgRatio;
                } else {
                    renderHeight = TARGET_SIZE;
                    renderWidth = TARGET_SIZE * imgRatio;
                }

                const x = (TARGET_SIZE - renderWidth) / 2;
                const y = (TARGET_SIZE - renderHeight) / 2;

                ctx.drawImage(img, x, y, renderWidth, renderHeight);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsCompressing(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const compressed = await compressImage(reader.result as string);
                if (activeTab === 'products') setProductForm(prev => ({ ...prev, imageUrl: compressed }));
                if (activeTab === 'inicio') setPromoForm(prev => ({ ...prev, imageUrl: compressed }));
                setIsCompressing(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveConfig = () => {
        updateDashboardConfig(configForm);
        alert("Configuración guardada correctamente.");
    };

    const handleSavePromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!promoForm.title || !promoForm.imageUrl) return setSaveError("Título e Imagen son obligatorios.");
        
        const data = { 
            ...promoForm, 
            id: editingItem ? (editingItem as Promotion).id : `promo-${Date.now()}`,
            discountPercentage: Number(promoForm.discountPercentage || 0),
            minAmount: Number(promoForm.minAmount || 0)
        } as Promotion;
        
        if (editingItem) updatePromotion(data);
        else addPromotion(data);
        resetForm();
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productForm.name || !productForm.imageUrl) return setSaveError("Nombre e Imagen son obligatorios.");
        
        const data = { ...productForm, id: editingItem ? (editingItem as Product).id : `prod-${Date.now()}` } as Product;
        if (editingItem) updateProduct(data);
        else addProduct(data);
        resetForm();
    };

    const handleDeleteOrder = (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
            deleteOrder(id);
        }
    };

    const handleDeleteUser = (id: string) => {
        if (window.confirm("¿Eliminar perfil de cliente permanentemente?")) {
            deleteUser(id);
        }
    };

    return (
        <div className="animate-fadeIn pb-10">
            <header className="mb-8">
                <h1 className="text-3xl font-black italic tracking-tighter text-light-text uppercase leading-none">Control <span className="text-accent">Admin</span></h1>
                <p className="text-dark-text text-[10px] font-black tracking-[0.3em] uppercase mt-2">The Point Management Hub</p>
            </header>

            <div className="flex bg-primary p-1 rounded-2xl border border-gray-800 mb-8 overflow-x-auto no-scrollbar">
                {(['inicio', 'products', 'orders', 'users'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); resetForm(); }}
                        className={`flex-1 min-w-[100px] px-4 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === tab ? 'bg-accent text-white shadow-lg' : 'text-dark-text'}`}
                    >
                        {tab === 'inicio' ? 'Dashboard' : tab === 'products' ? 'Menú' : tab === 'orders' ? 'Ventas' : 'Clientes'}
                    </button>
                ))}
            </div>

            {activeTab === 'inicio' && (
                <div className="space-y-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary p-5 rounded-3xl border border-gray-800 shadow-xl">
                            <p className="text-[9px] font-black text-dark-text uppercase tracking-widest mb-1">Ventas Totales</p>
                            <p className="text-2xl font-black text-accent tracking-tighter leading-none">${stats.totalSales.toLocaleString('es-DO')}</p>
                        </div>
                        <div className="bg-primary p-5 rounded-3xl border border-gray-800 shadow-xl">
                            <p className="text-[9px] font-black text-dark-text uppercase tracking-widest mb-1">Pedidos Totales</p>
                            <p className="text-2xl font-black text-light-text tracking-tighter leading-none">{stats.orderCount}</p>
                        </div>
                        <div className="bg-primary p-5 rounded-3xl border border-gray-800 shadow-xl">
                            <p className="text-[9px] font-black text-dark-text uppercase tracking-widest mb-1">Clientes</p>
                            <p className="text-2xl font-black text-light-text tracking-tighter leading-none">{stats.userCount}</p>
                        </div>
                        <div className="bg-primary p-5 rounded-3xl border border-gray-800 shadow-xl">
                            <p className="text-[9px] font-black text-dark-text uppercase tracking-widest mb-1">Avg. Ticket</p>
                            <p className="text-2xl font-black text-accent tracking-tighter leading-none">${stats.avgTicket.toFixed(0)}</p>
                        </div>
                    </div>

                    <section className="bg-primary p-6 rounded-3xl border border-gray-800 shadow-xl">
                        <h2 className="text-xs font-black text-accent uppercase tracking-widest mb-6 border-b border-gray-800 pb-2 italic">Configuración General</h2>
                        <div className="space-y-4">
                            <Input label="Título Dashboard" value={configForm.welcomeTitle} onChange={e => setConfigForm({...configForm, welcomeTitle: e.target.value})} />
                            <Input label="Eslogan" value={configForm.welcomeSubtitle} onChange={e => setConfigForm({...configForm, welcomeSubtitle: e.target.value})} />
                            
                            <div className="mb-4">
                                <label className="block text-dark-text text-sm font-bold mb-2 uppercase tracking-widest text-[10px]">Información para Transferencias</label>
                                <textarea 
                                    className="bg-primary border-2 border-gray-700 rounded-xl w-full py-3 px-4 text-light-text text-xs h-28 resize-none focus:border-accent outline-none transition-all"
                                    value={configForm.transferInfo} 
                                    onChange={e => setConfigForm({...configForm, transferInfo: e.target.value})}
                                    placeholder="Ej: Banco Popular, Cuenta: 123456..."
                                />
                            </div>

                            <Button onClick={handleSaveConfig}>Actualizar Configuración</Button>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-xl font-black text-light-text uppercase italic tracking-tighter">Ofertas Activas</h2>
                            {!isAdding && <button onClick={() => setIsAdding(true)} className="text-[10px] font-black uppercase text-accent border border-accent/30 px-4 py-2 rounded-xl bg-accent/5 hover:bg-accent/10 transition-all">+ Nueva Promo</button>}
                        </div>

                        {isAdding ? (
                            <form onSubmit={handleSavePromo} className="bg-primary p-6 rounded-3xl border border-gray-800 animate-fadeIn shadow-2xl">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-6">Nueva Promoción</h3>
                                {saveError && <p className="text-accent text-[10px] mb-4 uppercase font-bold text-center bg-accent/10 py-2 rounded-lg">{saveError}</p>}
                                <div className="space-y-4">
                                    <div 
                                        onClick={() => !isCompressing && fileInputRef.current?.click()}
                                        className={`w-full aspect-square bg-base rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-colors group ${isCompressing ? 'border-accent animate-pulse' : 'border-gray-800 hover:border-accent'}`}
                                    >
                                        {isCompressing ? (
                                            <div className="text-center">
                                                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                                <p className="text-accent text-[10px] font-black uppercase">Comprimiendo...</p>
                                            </div>
                                        ) : promoForm.imageUrl ? (
                                            <img src={promoForm.imageUrl} className="w-full h-full object-contain group-hover:scale-105 transition-transform" alt="Promo" />
                                        ) : (
                                            <p className="text-dark-text text-[10px] font-black uppercase">Subir Banner 1024x1024</p>
                                        )}
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </div>
                                    <Input label="Nombre de la Promo" value={promoForm.title} onChange={e => setPromoForm({...promoForm, title: e.target.value})} />
                                    <Input label="Descripción" value={promoForm.description} onChange={e => setPromoForm({...promoForm, description: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="% Descuento" type="number" value={promoForm.discountPercentage} onChange={e => setPromoForm({...promoForm, discountPercentage: Number(e.target.value)})} />
                                        <Input label="Min. Compra $" type="number" value={promoForm.minAmount} onChange={e => setPromoForm({...promoForm, minAmount: Number(e.target.value)})} />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" disabled={isCompressing}>Publicar</Button>
                                        <button type="button" onClick={resetForm} className="px-6 bg-gray-800 rounded-xl text-[10px] font-black uppercase text-light-text">Cancelar</button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                {promotions.map(promo => (
                                    <div key={promo.id} className="bg-primary p-4 rounded-2xl border border-gray-800 flex items-center gap-4 group hover:border-accent/30 transition-all">
                                        <img src={promo.imageUrl} className="w-16 h-16 object-contain rounded-xl border border-gray-700 bg-gray-900" alt="" />
                                        <div className="flex-grow">
                                            <p className="text-xs font-black text-light-text uppercase tracking-tight">{promo.title}</p>
                                            <p className="text-[10px] text-dark-text line-clamp-1 italic">{promo.description}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingItem(promo); setPromoForm(promo); setIsAdding(true); }} className="p-2.5 text-dark-text hover:text-accent bg-gray-900 rounded-xl"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                            <button onClick={() => deletePromotion(promo.id)} className="p-2.5 text-dark-text hover:text-red-500 bg-gray-900 rounded-xl"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xl font-black text-light-text uppercase italic tracking-tighter">Inventario Menú</h2>
                        {!isAdding && <button onClick={() => setIsAdding(true)} className="bg-accent text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">+ Añadir Plato</button>}
                    </div>

                    {isAdding ? (
                        <form onSubmit={handleSaveProduct} className="bg-primary p-6 rounded-3xl border border-gray-800 animate-fadeIn shadow-2xl">
                            {saveError && <p className="text-accent text-[10px] mb-4 uppercase font-bold text-center bg-accent/10 py-2 rounded-lg">{saveError}</p>}
                            <div className="space-y-4">
                                <div onClick={() => !isCompressing && fileInputRef.current?.click()} className={`w-full aspect-square bg-base rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer group transition-colors ${isCompressing ? 'border-accent animate-pulse' : 'border-gray-800 hover:border-accent'}`}>
                                    {isCompressing ? (
                                        <div className="text-center">
                                            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                            <p className="text-accent text-[10px] font-black uppercase">Comprimiendo...</p>
                                        </div>
                                    ) : productForm.imageUrl ? (
                                        <img src={productForm.imageUrl} className="w-full h-full object-contain group-hover:scale-105 transition-transform" alt="Product" />
                                    ) : (
                                        <p className="text-dark-text text-[10px] font-black uppercase">Foto Producto 1024x1024</p>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                </div>
                                <Input label="Nombre del Plato" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Precio RD$" type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                                    <div className="mb-4">
                                        <label className="block text-dark-text text-[10px] font-black uppercase mb-2">Categoría</label>
                                        <select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} className="w-full bg-base border-2 border-gray-800 rounded-xl py-3 px-4 text-light-text text-sm outline-none focus:border-accent">
                                            {mockCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <Input label="Descripción" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={isCompressing}>Confirmar</Button>
                                    <button type="button" onClick={resetForm} className="px-6 bg-gray-800 rounded-xl text-[10px] font-black uppercase text-light-text">Cancelar</button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-primary p-4 rounded-2xl border border-gray-800 flex items-center shadow-md group hover:border-accent/30 transition-all">
                                    <img src={p.imageUrl} className="w-16 h-16 object-contain rounded-xl border border-gray-700 bg-gray-900" alt="" />
                                    <div className="ml-4 flex-grow">
                                        <p className="text-xs font-black text-light-text uppercase tracking-tight">{p.name}</p>
                                        <p className="text-accent font-black text-xs mt-1.5">${p.price.toFixed(0)}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setEditingItem(p); setProductForm(p); setIsAdding(true); }} className="p-2.5 text-dark-text hover:text-accent bg-gray-900 rounded-xl"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                        <button onClick={() => deleteProduct(p.id)} className="p-2.5 text-dark-text hover:text-red-500 bg-gray-900 rounded-xl"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-end px-1">
                        <h2 className="text-xl font-black text-light-text uppercase italic tracking-tighter leading-none">Ventas Reales</h2>
                        <span className="text-dark-text text-[9px] font-black uppercase tracking-widest">{allOrders.length} Totales</span>
                    </div>
                    {allOrders.map(order => (
                        <div key={order.id} className="bg-primary p-6 rounded-3xl border border-gray-800 shadow-xl border-l-4 border-l-accent relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] text-dark-text font-black uppercase tracking-widest">#{order.id.slice(-6).toUpperCase()}</p>
                                    <p className="text-light-text font-black text-sm uppercase tracking-tight">{order.customerName}</p>
                                    <p className="text-dark-text text-[9px] uppercase font-bold mt-1 opacity-70">{new Date(order.date).toLocaleString('es-DO')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-accent leading-none">${order.total.toFixed(0)}</p>
                                    <button onClick={() => handleDeleteOrder(order.id)} className="mt-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-end px-1">
                        <h2 className="text-xl font-black text-light-text uppercase italic tracking-tighter leading-none">Clientes</h2>
                        <span className="text-dark-text text-[9px] font-black uppercase tracking-widest">{allUsers.length}</span>
                    </div>
                    {allUsers.map(u => (
                        <div key={u.id} className="bg-primary p-6 rounded-3xl border border-gray-800 shadow-xl flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-accent font-black border border-gray-800">
                                        {u.fullName?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-light-text uppercase tracking-tight">{u.fullName}</p>
                                        <p className="text-[10px] text-accent font-black tracking-widest">{u.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <p className="text-xl font-black text-light-text leading-none">${u.totalSpent.toLocaleString('es-DO')}</p>
                                    {!u.isAdmin && (
                                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;