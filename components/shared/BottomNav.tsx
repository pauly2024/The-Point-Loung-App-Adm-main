
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Page } from '../../types';
import HomeIcon from '../icons/HomeIcon';
import MenuIcon from '../icons/MenuIcon';
import HeartIcon from '../icons/HeartIcon';
import UserIcon from '../icons/UserIcon';

interface BottomNavProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative ${isActive ? 'text-accent scale-110' : 'text-dark-text hover:text-light-text'}`}>
        {icon}
        <span className={`text-[9px] mt-1 font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
        {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_#E53935]"></div>}
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
    const { user } = useContext(AppContext);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-md h-20 border-t border-gray-800 flex justify-around items-center z-50 px-2 safe-bottom">
            <NavItem label="Inicio" icon={<HomeIcon className="w-5 h-5" />} isActive={activePage === 'Dashboard'} onClick={() => setActivePage('Dashboard')} />
            <NavItem label="Menú" icon={<MenuIcon className="w-5 h-5" />} isActive={activePage === 'Menu'} onClick={() => setActivePage('Menu')} />
            <NavItem label="Puntos" icon={<HeartIcon className="w-5 h-5" />} isActive={activePage === 'Loyalty'} onClick={() => setActivePage('Loyalty')} />
            
            {user?.isAdmin && (
                <NavItem 
                    label="Admin" 
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    } 
                    isActive={activePage === 'Admin'} 
                    onClick={() => setActivePage('Admin')} 
                />
            )}

            <NavItem label="Perfil" icon={<UserIcon className="w-5 h-5" />} isActive={activePage === 'Profile'} onClick={() => setActivePage('Profile')} />
        </nav>
    );
};

export default BottomNav;
