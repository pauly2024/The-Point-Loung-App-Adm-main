
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const LoyaltyPage: React.FC = () => {
    const { user, setIsCartOpen } = useContext(AppContext);

    if (!user) return null;
    
    // Regla de Negocio:
    // 100 pesos = 10 puntos (es decir, 1 punto cada 10 pesos)
    // Recompensa = 250 puntos (es decir, 2500 pesos gastados)
    const pointsThreshold = 250;
    const currentCycleSpent = user.totalSpent % 2500;
    const currentPoints = Math.floor(currentCycleSpent / 10);
    const progressPercentage = (currentPoints / pointsThreshold) * 100;
    const pointsToReward = pointsThreshold - currentPoints;

    return (
        <div className="animate-fadeIn pb-10">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-light-text italic tracking-tighter uppercase leading-none">Club <span className="text-accent">The Point</span></h1>
                <p className="text-dark-text text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Beneficios exclusivos y Recompensas</p>
            </header>

            {/* Visualizador de Puntos Central */}
            <div className="bg-primary p-8 rounded-[2.5rem] shadow-2xl mb-12 border border-gray-800 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-gray-900 border-4 border-accent/20 mb-6 shadow-[0_0_40px_rgba(229,57,53,0.1)]">
                        <div className="text-center">
                            <span className="text-5xl font-black text-light-text block leading-none">{currentPoints}</span>
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest italic mt-1">Puntos</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-light-text uppercase tracking-tight mb-2 italic">¡Sigue Acumulando!</h3>
                    <p className="text-dark-text text-xs font-bold mb-8 px-4">Te faltan <span className="text-accent">{pointsToReward} puntos</span> para desbloquear tu próximo artículo especial de regalo.</p>

                    <div className="w-full bg-gray-900 rounded-full h-4 mb-3 border border-gray-800 p-1">
                        <div 
                            className="bg-accent h-full rounded-full shadow-[0_0_15px_rgba(229,57,53,0.5)] transition-all duration-1000 relative" 
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-dark-text">
                        <span>Progreso Actual</span>
                        <span className="text-accent">Meta: {pointsThreshold} Pts</span>
                    </div>
                </div>

                {user.rewardsAvailable > 0 &&
                    <div className="mt-10 p-6 bg-accent/10 border border-accent/30 rounded-3xl animate-fadeIn shadow-lg cursor-pointer active:scale-95 transition-transform" onClick={() => setIsCartOpen(true)}>
                        <p className="text-accent font-black text-xl uppercase italic tracking-tighter leading-tight">¡PREMIO LISTO!</p>
                        <p className="text-light-text text-[10px] font-black uppercase tracking-widest mt-2">Tienes <span className="text-accent underline text-sm">{user.rewardsAvailable}</span> {user.rewardsAvailable === 1 ? 'recompensa' : 'recompensas'} para usar ahora mismo en tu carrito.</p>
                        <p className="text-white text-[8px] font-bold uppercase mt-3 bg-accent px-4 py-1.5 rounded-full inline-block">Canjear en Carrito</p>
                    </div>
                }
            </div>

            {/* Explicación del Programa */}
            <section className="mb-6">
                <h2 className="text-xl font-black text-light-text uppercase italic tracking-tighter mb-6">Reglas del Club</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-primary p-6 rounded-3xl border border-gray-800 flex items-start gap-5 group hover:border-accent/40 transition-colors">
                        <div className="w-10 h-10 shrink-0 bg-accent/10 rounded-xl flex items-center justify-center text-accent font-black text-xl italic shadow-inner">1</div>
                        <div>
                            <p className="text-light-text font-black uppercase text-sm mb-1 tracking-tight">Gasta y Gana</p>
                            <p className="text-dark-text text-xs leading-relaxed">Por cada <span className="text-light-text font-bold">$100</span> pesos consumidos, sumas <span className="text-accent font-bold">10 puntos</span> directamente a tu perfil.</p>
                        </div>
                    </div>
                    <div className="bg-primary p-6 rounded-3xl border border-gray-800 flex items-start gap-5 group hover:border-accent/40 transition-colors">
                        <div className="w-10 h-10 shrink-0 bg-accent/10 rounded-xl flex items-center justify-center text-accent font-black text-xl italic shadow-inner">2</div>
                        <div>
                            <p className="text-light-text font-black uppercase text-sm mb-1 tracking-tight">Reclama tu Regalo</p>
                            <p className="text-dark-text text-xs leading-relaxed">Al completar <span className="text-light-text font-bold">{pointsThreshold} puntos</span> ($2,500 en compras acumuladas), obtienes un <span className="text-accent font-bold">producto sorpresa</span> gratis.</p>
                        </div>
                    </div>
                    <div className="bg-primary p-6 rounded-3xl border border-gray-800 flex items-start gap-5 group hover:border-accent/40 transition-colors">
                        <div className="w-10 h-10 shrink-0 bg-accent/10 rounded-xl flex items-center justify-center text-accent font-black text-xl italic shadow-inner">3</div>
                        <div>
                            <p className="text-light-text font-black uppercase text-sm mb-1 tracking-tight">Sin Límites</p>
                            <p className="text-dark-text text-xs leading-relaxed">No hay límite de cuántas veces puedes ganar. ¡Cuanto más disfrutas, más ganas!</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoyaltyPage;
