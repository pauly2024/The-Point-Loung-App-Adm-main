import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CartIcon from '../icons/CartIcon';

const Header: React.FC = () => {
    const { cart, setIsCartOpen } = useContext(AppContext);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-primary sticky top-0 z-40 h-20 flex items-center justify-between px-4 border-b border-gray-800 backdrop-blur-md bg-primary/90">
            <div className="flex items-center">
               <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="logo-glow">
                    <path d="M 29,75 A 38 38 0 1 1 85,35" stroke="#E53935" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <path d="M 85,35 C 95 25, 85 10, 70 18" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="#FFFFFF" strokeWidth="8" />
                    <circle cx="50" cy="50" r="15" fill="#E53935" />
                </svg>
                <h1 className="text-xl font-black ml-2 tracking-widest text-light-text italic uppercase">THE POINT</h1>
            </div>
            <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative text-light-text p-2 hover:bg-gray-800 rounded-full transition-colors active:scale-90"
            >
                <CartIcon className="w-7 h-7" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-primary animate-bounce">
                        {cartItemCount}
                    </span>
                )}
            </button>
        </header>
    );
};

export default Header;