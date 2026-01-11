
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Input from '../shared/Input';
import Button from '../shared/Button';

const ProfilePage: React.FC = () => {
    const { user, logout, orderHistory, reorder } = useContext(AppContext);

    if (!user) return null;

    const handleReorder = (order: any) => {
        reorder(order);
        alert("¡Productos añadidos al carrito!");
    };

    return (
        <div className="animate-fadeIn pb-10">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-light-text italic tracking-tighter uppercase leading-none">Mi <span className="text-accent">Perfil</span></h1>
                <p className="text-dark-text text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Gestiona tu cuenta y pedidos</p>
            </header>

            {/* Información Personal */}
            <section className="mb-12">
                <h2 className="text-xs font-black text-accent uppercase tracking-widest mb-4 italic ml-1">Datos Personales</h2>
                <div className="bg-primary p-6 rounded-3xl shadow-xl border border-gray-800">
                    <form className="space-y-4">
                        <Input label="Nombre de Usuario" id="profile-name" type="text" defaultValue={user.fullName} readOnly />
                        <Input label="Número de Teléfono" id="profile-phone" type="tel" defaultValue={user.phone} readOnly />
                        <p className="text-[10px] text-dark-text italic text-center mt-2 opacity-50">Para cambios de datos, contacta a soporte.</p>
                    </form>
                </div>
            </section>

            {/* Historial de Pedidos */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="text-xl font-black text-light-text uppercase italic tracking-tighter">Historial de Compras</h2>
                    <span className="bg-gray-800 text-dark-text text-[9px] font-black px-3 py-1 rounded-full uppercase">{orderHistory.length} Pedidos</span>
                </div>
                
                <div className="space-y-4">
                    {orderHistory.length > 0 ? (
                        orderHistory.map(order => (
                            <div key={order.id} className="bg-primary p-5 rounded-3xl shadow-xl border border-gray-800 group hover:border-accent/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="block font-black text-light-text text-sm uppercase tracking-tight">Orden #{order.id.slice(-5).toUpperCase()}</span>
                                        <span className="text-[10px] text-dark-text font-bold uppercase">{new Date(order.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-accent text-xl font-black leading-none">${order.total.toFixed(0)}</p>
                                        <p className="text-[8px] text-dark-text uppercase font-black mt-1 tracking-widest">GANASTE +{Math.floor(order.total / 10)} PTS</p>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-dark-text font-bold uppercase truncate max-w-[140px]">
                                            {order.items.map(i => i.name).join(', ')}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleReorder(order)}
                                        className="bg-gray-800 hover:bg-accent hover:text-white text-dark-text text-[9px] font-black py-2.5 px-6 rounded-xl transition-all uppercase tracking-widest border border-gray-700 active:scale-95 shadow-md"
                                    >
                                        Repetir Pedido
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-primary/30 rounded-[2.5rem] border border-dashed border-gray-800">
                            <svg className="w-12 h-12 text-gray-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-dark-text text-[10px] font-black uppercase tracking-widest">No has realizado pedidos aún.</p>
                            <p className="text-accent text-[9px] font-bold uppercase mt-2 italic">¡Empieza a acumular hoy!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Logout */}
            <div className="mt-8">
                <button 
                    onClick={logout}
                    className="w-full bg-gray-900 border-2 border-gray-800 hover:border-accent hover:text-accent text-dark-text font-black py-4 rounded-3xl transition-all uppercase tracking-widest text-xs shadow-lg active:scale-95"
                >
                    Cerrar Sesión Segura
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
