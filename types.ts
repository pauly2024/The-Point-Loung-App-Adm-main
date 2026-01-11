
export interface User {
    id: string;
    fullName: string;
    phone: string;
    totalSpent: number;
    rewardsAvailable: number;
    isAdmin?: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    isCombo: boolean;
    isEligibleForReward: boolean;
}

export interface Category {
    id: string;
    name: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export type PaymentMethod = 'cash' | 'transfer';

export type OrderType = 'pickup' | 'delivery';

export interface DeliveryDetails {
    type: OrderType;
    name: string;
    phone: string;
    address?: string;
    note?: string;
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    discount?: number;
    paymentMethod: PaymentMethod;
    deliveryDetails: DeliveryDetails;
    customerName?: string;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    discountPercentage?: number;
    minAmount?: number;
}

export interface DashboardConfig {
    welcomeTitle: string;
    welcomeSubtitle: string;
    transferInfo: string;
}

export type Page = 'Dashboard' | 'Menu' | 'Loyalty' | 'Profile' | 'Admin';
