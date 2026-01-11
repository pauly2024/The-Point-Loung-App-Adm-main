
import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { User, CartItem, Product, Order, PaymentMethod, DeliveryDetails, Promotion, DashboardConfig } from '../types';
import { mockUser, mockProducts as initialProducts, mockPromotions as initialPromos } from '../data/mockData';
import { supabase } from '../supabase';

interface AppContextType {
    isAuthenticated: boolean;
    user: User | null;
    cart: CartItem[];
    products: Product[];
    promotions: Promotion[];
    dashboardConfig: DashboardConfig;
    orderHistory: Order[];
    allOrders: Order[];
    allUsers: User[];
    isCartOpen: boolean;
    appliedDiscount: number;
    isLoading: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    login: (username: string, pass: string) => Promise<boolean>;
    register: (userData: Omit<User, 'id' | 'totalSpent' | 'rewardsAvailable'>, pass: string) => Promise<boolean>;
    logout: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    placeOrder: (paymentMethod: PaymentMethod, deliveryDetails: DeliveryDetails, usedReward?: boolean) => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    reorder: (order: Order) => void;
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    updateDashboardConfig: (config: DashboardConfig) => Promise<void>;
    addPromotion: (promo: Promotion) => Promise<void>;
    updatePromotion: (promo: Promotion) => Promise<void>;
    deletePromotion: (id: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
        welcomeTitle: 'Bienvenido',
        welcomeSubtitle: 'Experiencia Lounge',
        transferInfo: 'Configura tus datos en el Panel Admin'
    });
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                { data: prodData },
                { data: promoData },
                { data: orderData },
                { data: userData },
                { data: configData }
            ] = await Promise.all([
                supabase.from('products').select('*'),
                supabase.from('promotions').select('*'),
                supabase.from('orders').select('*').order('created_at', { ascending: false }),
                supabase.from('users').select('*'),
                supabase.from('dashboard_config').select('config').eq('id', 'main').maybeSingle()
            ]);

            // Si hay datos en Supabase, los usamos. Si no, usamos los de prueba
            setProducts(prodData && prodData.length > 0 ? prodData : initialProducts);
            setPromotions(promoData && promoData.length > 0 ? promoData : initialPromos);
            if (orderData) setAllOrders(orderData);
            if (userData) setAllUsers(userData);
            if (configData?.config) setDashboardConfig(configData.config);
            
        } catch (error) {
            console.error("Error cargando datos de Supabase:", error);
            // Fallback preventivo
            setProducts(initialProducts);
            setPromotions(initialPromos);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const appliedDiscount = useMemo(() => {
        if (cart.length === 0) return 0;
        let maxDiscount = 0;
        promotions.forEach(promo => {
            if (promo.discountPercentage && promo.discountPercentage > 0) {
                const min = promo.minAmount || 0;
                if (subtotal >= min) {
                    const discountValue = subtotal * (promo.discountPercentage / 100);
                    if (discountValue > maxDiscount) maxDiscount = discountValue;
                }
            }
        });
        return maxDiscount;
    }, [subtotal, promotions, cart.length]);

    const login = useCallback(async (username: string, pass: string) => {
        const uLower = username.toLowerCase();
        
        if (uLower === 'paul valerio naar' && pass === '2828') {
            const adminUser: User = { id: 'admin-1', fullName: 'Paul Valerio Naar', phone: '829-383-7441', totalSpent: 0, rewardsAvailable: 0, isAdmin: true };
            setUser(adminUser);
            setIsAuthenticated(true);
            return true;
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .ilike('fullName', uLower)
            .eq('password', pass)
            .maybeSingle();

        if (data && !error) {
            setUser(data);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, []);

    const register = useCallback(async (userData: Omit<User, 'id' | 'totalSpent' | 'rewardsAvailable'>, pass: string) => {
        const newUser: User = { 
            ...userData, 
            id: `user-${Date.now()}`, 
            totalSpent: 0, 
            rewardsAvailable: 0, 
            isAdmin: false 
        };

        const { error } = await supabase.from('users').insert([{ ...newUser, password: pass }]);
        
        if (!error) {
            setAllUsers(prev => [...prev, newUser]);
            setUser(newUser);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
        setCart([]);
    }, []);

    const addToCart = useCallback((product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { ...product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) { removeFromCart(productId); return; }
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    }, [removeFromCart]);

    const placeOrder = useCallback(async (paymentMethod: PaymentMethod, deliveryDetails: DeliveryDetails, usedReward: boolean = false) => {
        if (!user) return;
        const currentSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = deliveryDetails.type === 'delivery' ? 100 : 0;
        const finalTotal = currentSubtotal - appliedDiscount + deliveryFee;
        
        const newOrder: Order = {
            id: `order-${Date.now()}`,
            date: new Date().toISOString(),
            items: [...cart],
            total: finalTotal,
            discount: appliedDiscount,
            paymentMethod,
            deliveryDetails,
            customerName: user.fullName
        };

        if (usedReward) {
            newOrder.deliveryDetails.note = (newOrder.deliveryDetails.note ? newOrder.deliveryDetails.note + " | " : "") + "[CANJE DE PREMIO: PRODUCTO SORPRESA]";
        }

        await supabase.from('orders').insert([newOrder]);
        setAllOrders(prev => [newOrder, ...prev]);

        const newTotalSpent = user.totalSpent + finalTotal;
        const pointsThreshold = 2500;
        const previousRewardsEarned = Math.floor(user.totalSpent / pointsThreshold);
        const currentRewardsEarnedTotal = Math.floor(newTotalSpent / pointsThreshold);
        const newRewardsGained = currentRewardsEarnedTotal - previousRewardsEarned;

        let rewardsCount = user.rewardsAvailable + newRewardsGained;
        if (usedReward) rewardsCount = Math.max(0, rewardsCount - 1);

        const updatedUserData = { totalSpent: newTotalSpent, rewardsAvailable: rewardsCount };
        
        await supabase.from('users').update(updatedUserData).eq('id', user.id);
        
        const updatedMe = { ...user, ...updatedUserData };
        setUser(updatedMe);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedMe : u));
        setCart([]);
    }, [cart, user, appliedDiscount]);

    const deleteOrder = useCallback(async (orderId: string) => {
        await supabase.from('orders').delete().eq('id', orderId);
        setAllOrders(prev => prev.filter(o => o.id !== orderId));
    }, []);

    const deleteUser = useCallback(async (userId: string) => {
        await supabase.from('users').delete().eq('id', userId);
        setAllUsers(prev => prev.filter(u => u.id !== userId));
    }, []);

    const reorder = useCallback((order: Order) => {
        setCart(order.items.map(item => ({ ...item })));
        setIsCartOpen(true);
    }, []);

    const addProduct = useCallback(async (product: Product) => {
        await supabase.from('products').insert([product]);
        setProducts(prev => [...prev, product]);
    }, []);

    const updateProduct = useCallback(async (product: Product) => {
        await supabase.from('products').update(product).eq('id', product.id);
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    }, []);

    const deleteProduct = useCallback(async (productId: string) => {
        await supabase.from('products').delete().eq('id', productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
    }, []);

    const updateDashboardConfig = useCallback(async (config: DashboardConfig) => {
        await supabase.from('dashboard_config').upsert({ id: 'main', config });
        setDashboardConfig(config);
    }, []);

    const addPromotion = useCallback(async (promo: Promotion) => {
        await supabase.from('promotions').insert([promo]);
        setPromotions(prev => [...prev, promo]);
    }, []);

    const updatePromotion = useCallback(async (promo: Promotion) => {
        await supabase.from('promotions').update(promo).eq('id', promo.id);
        setPromotions(prev => prev.map(p => p.id === promo.id ? promo : p));
    }, []);

    const deletePromotion = useCallback(async (id: string) => {
        await supabase.from('promotions').delete().eq('id', id);
        setPromotions(prev => prev.filter(p => p.id !== id));
    }, []);

    return (
        <AppContext.Provider value={{ 
            isAuthenticated, user, cart, products, promotions, dashboardConfig, orderHistory: allOrders.filter(o => o.customerName === user?.fullName), allOrders, allUsers,
            isCartOpen, setIsCartOpen, appliedDiscount, isLoading,
            login, register, logout, addToCart, removeFromCart, 
            updateQuantity, clearCart: () => setCart([]), placeOrder, deleteOrder, deleteUser, reorder,
            addProduct, updateProduct, deleteProduct,
            updateDashboardConfig, addPromotion, updatePromotion, deletePromotion
        }}>
            {children}
        </AppContext.Provider>
    );
};
