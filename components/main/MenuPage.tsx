
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Product, Category } from '../../types';
import { mockCategories } from '../../data/mockData';
import CartIcon from '../icons/CartIcon';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart } = useContext(AppContext);
    return (
        <div className="bg-primary rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800 flex flex-col mb-8 transform active:scale-[0.98] transition-all duration-300 group">
            {/* Contenedor Cuadrado Perfecto 1:1 con visualización completa absoluta */}
            <div className="relative w-full aspect-square bg-[#0D0D0D] flex items-center justify-center overflow-hidden">
                <img 
                    className="max-w-full max-h-full w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" 
                    src={product.imageUrl} 
                    alt={product.name} 
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6">
                    <span className="bg-accent/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/10">
                        {product.isCombo ? 'Combo Especial' : 'Individual'}
                    </span>
                </div>
            </div>
            
            <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-black text-light-text uppercase italic tracking-tighter leading-none pr-4">{product.name}</h2>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-accent leading-none">${product.price.toFixed(0)}</span>
                        <span className="text-[8px] font-black text-dark-text uppercase tracking-widest mt-1">RD$</span>
                    </div>
                </div>
                <p className="text-dark-text text-xs italic font-medium leading-relaxed mb-8 line-clamp-2 opacity-80">{product.description}</p>
                
                <button 
                    onClick={() => addToCart(product)} 
                    className="w-full bg-accent hover:bg-red-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.25em] transition-all shadow-[0_15px_30px_rgba(229,57,53,0.35)] active:scale-95 flex items-center justify-center gap-3 group/btn"
                >
                    <span className="group-hover/btn:translate-x-1 transition-transform">Añadir al Pedido</span>
                    <span className="text-xl leading-none">+</span>
                </button>
            </div>
        </div>
    );
};

const MenuPage: React.FC = () => {
    const { cart, products, setIsCartOpen } = useContext(AppContext);
    
    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    const groupedProducts = useMemo(() => {
        return mockCategories.map(cat => ({
            category: cat,
            items: products.filter(p => p.categoryId === cat.id)
        })).filter(group => group.items.length > 0);
    }, [products]);

    return (
        <div className="relative pb-40 animate-fadeIn">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-light-text italic tracking-tighter uppercase leading-none">Nuestro <span className="text-accent">Menú</span></h1>
                <p className="text-accent text-[10px] uppercase tracking-[0.5em] font-black mt-4 opacity-80">The Point Lounge Experience</p>
            </header>

            <div className="space-y-16">
                {groupedProducts.map(({ category, items }) => (
                    <section key={category.id} className="animate-fadeIn">
                        <div className="flex items-center gap-5 mb-8">
                            <h2 className="text-xs font-black text-accent uppercase tracking-[0.4em] italic whitespace-nowrap">{category.name}</h2>
                            <div className="h-[1px] w-full bg-gradient-to-r from-accent/40 via-accent/10 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {items.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Barra flotante de carrito rápido */}
            {cartCount > 0 && (
                <div className="fixed bottom-24 left-4 right-4 z-40 animate-slideUp">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-light-text text-base p-6 rounded-[2rem] shadow-2xl flex items-center justify-between group active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <CartIcon className="w-8 h-8" />
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-light-text animate-bounce">
                                    {cartCount}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Tu Pedido Actual</p>
                                <p className="text-xl font-black uppercase italic tracking-tighter">Ver Carrito</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total RD$</p>
                            <p className="text-2xl font-black text-accent tracking-tighter">${cartTotal.toFixed(0)}</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuPage;
