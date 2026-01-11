
import type { User, Product, Category, Promotion, Order } from '../types';

export const mockUser: User = {
    id: 'user-123',
    fullName: 'Alex Doe',
    phone: '123-456-7890',
    totalSpent: 3250,
    rewardsAvailable: 0,
    isAdmin: false
};

export const mockCategories: Category[] = [
    { id: 'cat-2', name: 'Rikiskebab' },
    { id: 'cat-6', name: 'Empanadas' },
    { id: 'cat-1', name: 'Combos' },
    { id: 'cat-3', name: 'Postres en Vasitos' },
    { id: 'cat-4', name: 'Café Comestible' },
    { id: 'cat-5', name: 'Panini Gelati' },
    { id: 'cat-7', name: 'Jugos' },
];

export const mockProducts: Product[] = [
    // Cat-2: Rikiskebab
    { id: 'prod-5', name: 'Rikiskebab', description: 'Nuestro kebab especial de la casa, una explosión de sabor.', price: 100, imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=800', categoryId: 'cat-2', isCombo: false, isEligibleForReward: true },

    // Cat-6: Empanadas
    { id: 'prod-13', name: 'Empanada de Jamón y Queso', description: 'Rellena del clásico jamón y queso derretido.', price: 60, imageUrl: 'https://images.unsplash.com/photo-1628548484584-93018eec0d3d?q=80&w=800', categoryId: 'cat-6', isCombo: false, isEligibleForReward: true },
    { id: 'prod-14', name: 'Empanada de Pollo', description: 'Jugoso relleno de pollo guisado tradicional.', price: 60, imageUrl: 'https://images.unsplash.com/photo-1628548484584-93018eec0d3d?q=80&w=800', categoryId: 'cat-6', isCombo: false, isEligibleForReward: true },
    { id: 'prod-15', name: 'Empanada de Pollo con Queso', description: 'La combinación perfecta de pollo y queso cremoso.', price: 60, imageUrl: 'https://images.unsplash.com/photo-1628548484584-93018eec0d3d?q=80&w=800', categoryId: 'cat-6', isCombo: false, isEligibleForReward: true },
    { id: 'prod-16', name: 'Empanada de Vegetales con Queso', description: 'Una mezcla de vegetales frescos con queso.', price: 60, imageUrl: 'https://images.unsplash.com/photo-1628548484584-93018eec0d3d?q=80&w=800', categoryId: 'cat-6', isCombo: false, isEligibleForReward: true },
    { id: 'prod-17', name: 'Empanada de Camarones', description: 'Exquisito relleno de camarones salteados.', price: 90, imageUrl: 'https://images.unsplash.com/photo-1628548484584-93018eec0d3d?q=80&w=800', categoryId: 'cat-6', isCombo: false, isEligibleForReward: true },

    // Cat-1: Combos
    { id: 'prod-1', name: 'Combo Familiar', description: '4 Empanadas, 4 Jugos, 4 Postres, 2 Rikiskebabs, y 2 Cafés Comestibles.', price: 790, imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=800', categoryId: 'cat-1', isCombo: true, isEligibleForReward: false },
    { id: 'prod-2', name: 'Combo Dúo', description: '2 Empanadas, 2 Jugos, 2 Postres, y 2 Cafés Comestibles.', price: 375, imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=800', categoryId: 'cat-1', isCombo: true, isEligibleForReward: false },
    { id: 'prod-3', name: 'Combo Saludable', description: '1 Rikiskebab, 1 Jugo, 1 Postre, y 1 Café Comestible.', price: 180, imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=800', categoryId: 'cat-1', isCombo: true, isEligibleForReward: false },
    { id: 'prod-4', name: 'Combo Merienda', description: '3 Empanadas, 1 Jugo, 1 Postre, y 1 Café Comestible.', price: 295, imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=800', categoryId: 'cat-1', isCombo: true, isEligibleForReward: false },
    
    // Cat-3: Postres en Vasitos
    { id: 'prod-6', name: 'Tres Leches', description: 'Clásico postre de tres leches, suave y dulce.', price: 75, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800', categoryId: 'cat-3', isCombo: false, isEligibleForReward: true },
    { id: 'prod-7', name: 'Cheesecake Oreo', description: 'Cremoso cheesecake con trozos de galleta Oreo.', price: 75, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800', categoryId: 'cat-3', isCombo: false, isEligibleForReward: true },
    { id: 'prod-8', name: 'Cheesecake Dulce de Leche', description: 'Delicioso cheesecake con un toque de dulce de leche.', price: 75, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800', categoryId: 'cat-3', isCombo: false, isEligibleForReward: true },
    { id: 'prod-9', name: 'Cheesecake de Mango', description: 'Cheesecake refrescante con sabor a mango tropical.', price: 75, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800', categoryId: 'cat-3', isCombo: false, isEligibleForReward: true },
    { id: 'prod-10', name: 'Cheesecake de Fresa', description: 'El tradicional cheesecake con una capa de fresa.', price: 75, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800', categoryId: 'cat-3', isCombo: false, isEligibleForReward: true },
    
    // Cat-4: Café Comestible
    { id: 'prod-11', name: 'Café Comestible', description: 'Disfruta tu café y luego cómete la taza. ¡Cero desperdicio!', price: 35, imageUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800', categoryId: 'cat-4', isCombo: false, isEligibleForReward: true },
    
    // Cat-5: Panini Gelati
    { id: 'prod-12', name: 'Panini Gelati', description: 'Un panini caliente sellado con tu helado favorito dentro.', price: 75, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800', categoryId: 'cat-5', isCombo: false, isEligibleForReward: true },
    
    // Cat-7: Jugos
    { id: 'prod-18', name: 'Jugo de Sandía', description: 'Refrescante y natural jugo de sandía.', price: 50, imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800', categoryId: 'cat-7', isCombo: false, isEligibleForReward: true },
    { id: 'prod-19', name: 'MorirSoñando', description: 'Bebida tradicional de naranja y leche.', price: 50, imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800', categoryId: 'cat-7', isCombo: false, isEligibleForReward: true },
    { id: 'prod-20', name: 'Jugo de Mango', description: 'Dulce y tropical jugo de mango.', price: 50, imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800', categoryId: 'cat-7', isCombo: false, isEligibleForReward: true },
    { id: 'prod-21', name: 'Fruit Punch', description: 'Una mezcla de frutas tropicales.', price: 50, imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800', categoryId: 'cat-7', isCombo: false, isEligibleForReward: true },
    { id: 'prod-22', name: 'Jugo de Pera y Piña', description: 'Combinación perfecta de pera y piña.', price: 50, imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800', categoryId: 'cat-7', isCombo: false, isEligibleForReward: true },
];

export const mockPromotions: Promotion[] = [
    { id: 'promo-1', title: 'Happy Hour 2x1', description: 'Disfruta de 2x1 en todas las bebidas frías de 4 PM a 6 PM.', imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800' },
    { id: 'promo-2', title: 'Miércoles de Postres', description: 'Todos los miércoles, obtén un 20% de descuento en nuestros deliciosos postres.', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800' },
];

export const mockOrderHistory: Order[] = [
    { 
        id: 'order-1', 
        date: '2024-05-20', 
        items: [{...mockProducts[0], quantity: 1}, {...mockProducts[17], quantity: 1}], 
        total: 150, 
        paymentMethod: 'cash',
        deliveryDetails: { type: 'delivery', name: 'Alex Doe', phone: '123-456-7890', address: 'Calle Principal #123' }
    },
    { 
        id: 'order-2', 
        date: '2024-05-15', 
        items: [{...mockProducts[1], quantity: 2}], 
        total: 120, 
        paymentMethod: 'transfer',
        deliveryDetails: { type: 'pickup', name: 'Alex Doe', phone: '123-456-7890' }
    },
];
