
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Page } from '../../types';
import MenuIcon from '../icons/MenuIcon';
import HeartIcon from '../icons/HeartIcon';

const MonthlyRaffleBanner: React.FC = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Obtener el último día del mes actual
    let raffleDate = new Date(currentYear, currentMonth + 1, 0);
    
    // Si ya es el último día del mes o ya pasó, mostrar el del mes siguiente
    if (now.getDate() >= raffleDate.getDate()) {
        raffleDate = new Date(currentYear, currentMonth + 2, 0);
    }

    const formattedDate = raffleDate.toLocaleDateString('es-DO', { day: 'numeric', month: 'long' });
    const dayOfMonth = raffleDate.getDate();
    const monthName = formattedDate.split(' ').pop(); // Toma la última palabra que es el nombre del mes

    return (
        <div className="relative mb-10 group cursor-pointer active:scale-[0.98] transition-all duration-300">
            {/* Brillo Exterior Animado */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent via-red-500 to-accent rounded-[2rem] blur opacity-25 group-hover:opacity-50 animate-pulse transition duration-1000"></div>
            
            <div className="relative bg-primary border-2 border-accent/30 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>

                <div className="p-6 flex flex-col items-center text-center">
                    <div className="bg-accent text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] mb-4 shadow-lg animate-bounce">
                        ¡SORTEO CONFIRMADO!
                    </div>
                    
                    <h2 className="text-4xl font-black text-light-text italic tracking-tighter uppercase leading-none mb-1">
                        GRAN RIFA <span className="text-accent">MENSUAL</span>
                    </h2>
                    
                    <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-black text-light-text tracking-tighter">RD$</span>
                        <span className="text-6xl font-black text-accent tracking-tighter drop-shadow-[0_0_15px_rgba(229,57,53,0.6)]">10,000</span>
                    </div>

                    <p className="text-dark-text text-[11px] font-bold uppercase tracking-widest max-w-[200px] leading-tight">
                        Participa automáticamente con cada compra realizada.
                    </p>

                    <div className="mt-6 w-full py-3 bg-white/5 rounded-2xl border border-white/10 flex justify-center items-center gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-accent font-black text-lg leading-none">{dayOfMonth}</span>
                            <span className="text-[8px] font-black text-dark-text uppercase">{monthName}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-gray-700"></div>
                        <p className="text-light-text text-[10px] font-black uppercase tracking-tighter">
                            Próximo Ganador <br/> <span className="text-accent">Fin de Mes</span>
                        </p>
                    </div>
                </div>

                {/* Franja Lateral Decorativa */}
                <div className="absolute top-0 left-0 h-full w-1 bg-accent"></div>
            </div>
        </div>
    );
};

const LoyaltyCard: React.FC = () => {
    const { user } = useContext(AppContext);
    if (!user) return null;

    const pointsThreshold = 250;
    const currentTotalSpent = user.totalSpent % 2500;
    const currentPoints = Math.floor(currentTotalSpent / 10);
    const progressPercentage = (currentPoints / pointsThreshold) * 100;
    const pointsToReward = pointsThreshold - currentPoints;

    return (
        <div className="bg-primary p-6 rounded-3xl shadow-2xl mb-8 border border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-accent/20 transition-all"></div>
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xs font-black text-accent uppercase tracking-widest mb-1 italic">Club The Point</h3>
                    <p className="text-2xl font-black text-light-text tracking-tighter uppercase leading-none">Mis Puntos</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-light-text leading-none">{currentPoints}</span>
                    <span className="text-[10px] block font-bold text-dark-text uppercase tracking-widest mt-1">Acumulados</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="w-full bg-gray-900 rounded-full h-3 border border-gray-800 p-0.5">
                    <div 
                        className="bg-accent h-full rounded-full shadow-[0_0_15px_rgba(229,57,53,0.5)] transition-all duration-1000 relative" 
                        style={{ width: `${progressPercentage}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                    <span className="text-dark-text">Meta: {pointsThreshold} Puntos</span>
                    <span className="text-accent italic">Faltan {pointsToReward} pts</span>
                </div>
            </div>

            {user.rewardsAvailable > 0 && 
                <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-accent rounded-full animate-ping mr-2"></div>
                        <span className="text-[10px] font-black text-light-text uppercase tracking-widest">Tienes un regalo listo</span>
                    </div>
                    <span className="bg-accent text-white px-2 py-1 rounded text-[10px] font-black uppercase shadow-lg">Canjear</span>
                </div>
            }
        </div>
    );
}

const QuickAccess: React.FC<{ setActivePage: (page: Page) => void }> = ({ setActivePage }) => {
    return (
        <div className="grid grid-cols-2 gap-4 mb-10">
            <button onClick={() => setActivePage('Menu')} className="bg-primary p-6 rounded-3xl shadow-lg text-center hover:bg-gray-800 transition-all border border-gray-800 group active:scale-95">
                <MenuIcon className="w-10 h-10 mx-auto mb-3 text-accent group-hover:scale-110 transition-transform" />
                <span className="font-black text-light-text text-[10px] uppercase tracking-widest">Ver Menú</span>
            </button>
            <button onClick={() => setActivePage('Loyalty')} className="bg-primary p-6 rounded-3xl shadow-lg text-center hover:bg-gray-800 transition-all border border-gray-800 group active:scale-95">
                <HeartIcon className="w-10 h-10 mx-auto mb-3 text-accent group-hover:scale-110 transition-transform" />
                <span className="font-black text-light-text text-[10px] uppercase tracking-widest">Puntos y Pedidos</span>
            </button>
        </div>
    );
};

const Promotions: React.FC = () => {
    const { promotions } = useContext(AppContext);
    
    if (promotions.length === 0) return null;

    return (
        <div className="pb-10">
            <h2 className="text-xl font-black mb-6 text-light-text uppercase italic tracking-tighter">Ofertas Especiales</h2>
            <div className="space-y-6">
                {promotions.map(promo => (
                    <div key={promo.id} className="bg-primary rounded-3xl shadow-xl overflow-hidden border border-gray-800 group hover:border-accent/50 transition-colors">
                        <div className="relative h-48 overflow-hidden">
                            <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <h3 className="font-black text-2xl text-light-text uppercase italic tracking-tighter leading-none">{promo.title}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-dark-text text-xs font-medium leading-relaxed">{promo.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Dashboard: React.FC<{ setActivePage: (page: Page) => void }> = ({ setActivePage }) => {
    const { user, dashboardConfig } = useContext(AppContext);
    if (!user) return null;

    const firstName = user.fullName.split(' ')[0];

    return (
        <div className="animate-fadeIn">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-light-text italic tracking-tighter leading-none uppercase">
                    {dashboardConfig.welcomeTitle}, <span className="text-accent">{firstName}</span>
                </h1>
                <p className="text-accent text-[10px] uppercase tracking-[0.3em] font-black mt-2">{dashboardConfig.welcomeSubtitle}</p>
            </header>
            
            <LoyaltyCard />
            <MonthlyRaffleBanner />
            <QuickAccess setActivePage={setActivePage} />
            <Promotions />
        </div>
    );
};

export default Dashboard;
