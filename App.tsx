
import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import type { Page } from './types';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/main/Dashboard';
import MenuPage from './components/main/MenuPage';
import LoyaltyPage from './components/main/LoyaltyPage';
import ProfilePage from './components/main/ProfilePage';
import AdminPanel from './components/admin/AdminPanel';
import BottomNav from './components/shared/BottomNav';
import Header from './components/shared/Header';
import CartView from './components/main/CartView';

const AppContent: React.FC = () => {
    const { isAuthenticated, isCartOpen, setIsCartOpen, user, isLoading } = useContext(AppContext);
    const [activePage, setActivePage] = useState<Page>('Dashboard');

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-dark-text text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Conectando con The Point...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AuthPage />;
    }

    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <Dashboard setActivePage={setActivePage} />;
            case 'Menu':
                return <MenuPage />;
            case 'Loyalty':
                return <LoyaltyPage />;
            case 'Profile':
                return <ProfilePage />;
            case 'Admin':
                return user?.isAdmin ? <AdminPanel /> : <Dashboard setActivePage={setActivePage} />;
            default:
                return <Dashboard setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="bg-base min-h-screen font-sans flex flex-col text-light-text selection:bg-accent selection:text-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6 mb-24 max-w-2xl">
                {renderPage()}
            </main>
            <BottomNav activePage={activePage} setActivePage={setActivePage} />
            <CartView isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
