
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Product, PaymentMethod, OrderType } from '../../types';
import Button from '../shared/Button';
import Input from '../shared/Input';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';

type CheckoutStep = 'cart' | 'details' | 'payment' | 'success';

const CartView: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { cart, user, removeFromCart, updateQuantity, placeOrder, appliedDiscount, dashboardConfig } = useContext(AppContext);
    const [step, setStep] = useState<CheckoutStep>('cart');
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('transfer');
    
    const [orderType, setOrderType] = useState<OrderType>('pickup');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [useReward, setUseReward] = useState(false);

    const [finalWAMessage, setFinalWAMessage] = useState<string>('');

    useEffect(() => {
        if (user && isOpen) {
            setName(user.fullName || '');
            setPhone(user.phone || '');
        }
    }, [user, isOpen]);

    const handleOrderTypeChange = (type: OrderType) => {
        setOrderType(type);
        if (type === 'pickup') {
            setAddress('');
        }
    };

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
    const deliveryFee = orderType === 'delivery' ? 100 : 0;
    const total = subtotal - appliedDiscount + deliveryFee;

    const generateWAMessage = (items: any[], currentTotal: number, discount: number, redeemed: boolean) => {
        let message = `*NUEVO PEDIDO - THE POINT LOUNGE*\n\n`;
        message += `👤 *Cliente:* ${name || 'No especificado'}\n`;
        message += `📞 *Teléfono:* ${phone || 'No especificado'}\n`;
        message += `📍 *Tipo:* ${orderType === 'delivery' ? '🚀 Envío a Domicilio (Delivery)' : '🛍️ Recogida en el Local'}\n`;
        
        if (orderType === 'delivery' && address) {
            message += `🏠 *Dirección:* ${address}\n`;
        }

        message += `\n📦 *Detalle del Pedido:*\n`;
        items.forEach((item: any) => {
            message += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(0)})\n`;
        });

        if (redeemed) {
            message += `\n🎁 *RECOMPENSA:* ¡Producto Sorpresa Gratis! (Canjeado)\n`;
        }

        message += `\n--- Resumen ---\n`;
        message += `Subtotal: $${subtotal.toFixed(0)}\n`;
        if (discount > 0) {
            message += `🔖 Promo Descuento: -$${discount.toFixed(0)}\n`;
        }
        if (orderType === 'delivery') {
            message += `Envío: $100\n`;
        }

        message += `\n💳 *Pago:* ${
            selectedPayment === 'transfer' ? 'Transferencia' : 'Efectivo'
        }\n`;

        const finalNote = note.trim();
        if (finalNote || redeemed) {
            message += `\n📝 *Notas:* ${finalNote}${redeemed ? (finalNote ? ' | ' : '') + 'Incluir regalo por puntos' : ''}\n`;
        }

        message += `\n💰 *TOTAL FINAL: $${currentTotal.toFixed(0)}*\n\n`;
        message += `_Enviado desde la App Oficial_`;
        
        return message;
    };

    const handlePlaceOrder = () => {
        const msg = generateWAMessage([...cart], total, appliedDiscount, useReward);
        setFinalWAMessage(msg);

        placeOrder(selectedPayment, {
            type: orderType,
            name,
            phone,
            address: orderType === 'delivery' ? address : undefined,
            note: note.trim() || undefined
        }, useReward);
        
        setStep('success');
    };
    
    const handleClose = () => {
        setStep('cart');
        setFinalWAMessage('');
        setUseReward(false);
        setOrderType('pickup');
        onClose();
    };

    const handleBack = () => {
        if (step === 'details') setStep('cart');
        if (step === 'payment') setStep('details');
        if (step === 'success') handleClose();
    };
    
    const whatsappLink = useMemo(() => {
        const whatsappNumber = "18293837441";
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalWAMessage)}`;
    }, [finalWAMessage]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-base z-[100] flex flex-col animate-fadeIn overflow-hidden text-light-text">
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between border-b border-gray-800 shrink-0">
                <button onClick={step === 'cart' ? handleClose : handleBack} className="text-light-text p-2 bg-gray-800 rounded-full active:scale-90 transition-transform">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-black text-light-text uppercase tracking-widest">
                    {step === 'cart' ? 'Tu Carrito' : 
                     step === 'details' ? 'Entrega' :
                     step === 'payment' ? 'Pago' : 'Confirmación'}
                </h2>
                <div className="w-10"></div>
            </div>
            
            {/* Contenido */}
            <div className="flex-grow p-4 overflow-y-auto pb-32">
                {step === 'cart' && (
                    <div className="space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-dark-text text-lg italic">Tu carrito está vacío.</p>
                                <button onClick={handleClose} className="mt-6 bg-accent px-8 py-3 rounded-full font-bold text-white uppercase tracking-tighter">Ver Menú</button>
                            </div>
                        ) : (
                            <>
                                {user && user.rewardsAvailable > 0 && (
                                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${useReward ? 'bg-accent/20 border-accent shadow-[0_0_20px_rgba(229,57,53,0.2)]' : 'bg-primary border-gray-800'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-xl">🎁</div>
                                                <div>
                                                    <p className="text-xs font-black text-light-text uppercase tracking-tight italic">¡Tienes un premio!</p>
                                                    <p className="text-[9px] text-dark-text font-bold uppercase tracking-widest">Canjea por 1 producto gratis</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setUseReward(!useReward)}
                                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${useReward ? 'bg-accent text-white' : 'bg-gray-800 text-dark-text border border-gray-700'}`}
                                            >
                                                {useReward ? 'Activado' : 'Canjear'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {appliedDiscount > 0 && !useReward && (
                                    <div className="bg-accent/10 border border-accent/40 p-4 rounded-2xl flex items-center">
                                        <div className="mr-3 text-accent">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" /><path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" /></svg>
                                        </div>
                                        <p className="text-accent text-xs font-black uppercase tracking-widest">¡Promoción Aplicada!</p>
                                    </div>
                                )}

                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center bg-primary p-3 rounded-xl border border-gray-800 shadow-lg">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-700" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-light-text text-sm leading-tight uppercase tracking-tighter">{item.name}</p>
                                            <p className="text-accent text-sm font-black mt-1">${item.price.toFixed(0)}</p>
                                        </div>
                                        <div className="flex items-center bg-base rounded-lg border border-gray-700 p-1">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-light-text font-bold">-</button>
                                            <span className="mx-3 text-light-text font-black text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-light-text font-bold">+</button>
                                        </div>
                                    </div>
                                ))}

                                {useReward && (
                                    <div className="flex items-center bg-accent/5 p-3 rounded-xl border-2 border-dashed border-accent/40 animate-pulse">
                                        <div className="w-16 h-16 bg-accent/10 rounded-lg mr-4 flex items-center justify-center text-2xl">🎁</div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-accent text-sm leading-tight uppercase tracking-tighter">Producto Sorpresa</p>
                                            <p className="text-white text-xs font-black mt-1 uppercase italic tracking-widest">¡Regalo Gratis!</p>
                                        </div>
                                        <span className="text-accent font-black text-sm pr-4">$0</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {step === 'details' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-dark-text text-[10px] font-black uppercase mb-3 ml-1 tracking-widest text-center">Selecciona Método de Entrega</label>
                            <div className="flex bg-primary p-1.5 rounded-2xl border border-gray-800 shadow-inner">
                                <button 
                                    onClick={() => handleOrderTypeChange('delivery')} 
                                    className={`flex-1 py-4 flex flex-col items-center gap-1 rounded-xl transition-all ${orderType === 'delivery' ? 'bg-accent text-white shadow-xl scale-[1.02]' : 'text-dark-text'}`}
                                >
                                    <span className="text-xl">🚀</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Delivery</span>
                                    <span className="text-[8px] font-bold opacity-70">+$100</span>
                                </button>
                                <button 
                                    onClick={() => handleOrderTypeChange('pickup')} 
                                    className={`flex-1 py-4 flex flex-col items-center gap-1 rounded-xl transition-all ${orderType === 'pickup' ? 'bg-accent text-white shadow-xl scale-[1.02]' : 'text-dark-text'}`}
                                >
                                    <span className="text-xl">🛍️</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Recogida</span>
                                    <span className="text-[8px] font-bold opacity-70">Gratis</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input label="Tu Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Juan Pérez" />
                            <Input label="Teléfono (WhatsApp)" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="8290000000" />
                            
                            {orderType === 'delivery' && (
                                <div className="mb-4 animate-fadeIn">
                                    <label className="block text-dark-text text-[10px] font-black uppercase mb-1 ml-1 tracking-widest text-accent">Dirección Exacta (Calle/Nº)</label>
                                    <textarea 
                                        className="bg-primary border-2 border-accent/20 rounded-2xl w-full py-3 px-4 text-light-text h-28 resize-none focus:border-accent outline-none transition-all shadow-inner" 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)} 
                                        placeholder="Escribe tu calle, sector y número de casa o apartamento..." 
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-dark-text text-[10px] font-black uppercase mb-1 ml-1 tracking-widest">Notas (Opcional)</label>
                                <textarea className="bg-primary border-2 border-gray-700 rounded-2xl w-full py-3 px-4 text-light-text h-20 resize-none focus:border-accent outline-none" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Sin cebolla, extra picante..." />
                            </div>
                        </div>
                    </div>
                )}

                {step === 'payment' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-primary p-6 rounded-3xl border border-gray-800 shadow-2xl">
                            <p className="text-dark-text text-[10px] uppercase font-black tracking-widest mb-4 opacity-60 text-center">Resumen del Pedido</p>
                            
                            <div className="space-y-3 mb-6 border-b border-gray-800 pb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark-text font-bold uppercase tracking-tighter">Subtotal</span>
                                    <span className="text-light-text font-black">${subtotal.toFixed(0)}</span>
                                </div>
                                {appliedDiscount > 0 && !useReward && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-accent font-black uppercase tracking-tighter italic">🔖 Promo Descuento</span>
                                        <span className="text-accent font-black">-$${appliedDiscount.toFixed(0)}</span>
                                    </div>
                                )}
                                {useReward && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-accent font-black uppercase tracking-tighter italic">🎁 Regalo Canjeado</span>
                                        <span className="text-accent font-black">GRATIS</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark-text font-bold uppercase tracking-tighter">Entrega: {orderType === 'delivery' ? '🚀 Delivery' : '🛍️ Recogida'}</span>
                                    <span className="text-light-text font-black">{orderType === 'delivery' ? '+$100.00' : 'Gratis'}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-light-text font-black text-xs uppercase tracking-[0.2em]">Total a Pagar</span>
                                <span className="text-4xl font-black text-accent">${total.toFixed(0)}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-dark-text text-[10px] font-black uppercase mb-4 ml-1 tracking-widest text-center">Selecciona Método de Pago</label>
                            <div className="space-y-3">
                                {(['transfer', 'cash'] as const).map((m) => (
                                    <div key={m} className="space-y-3">
                                        <button 
                                            onClick={() => setSelectedPayment(m)}
                                            className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all ${selectedPayment === m ? 'bg-accent/10 border-accent shadow-lg scale-[1.01]' : 'bg-primary border-gray-800'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${selectedPayment === m ? 'border-accent bg-accent' : 'border-gray-600'}`}>
                                                {selectedPayment === m && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                            </div>
                                            <span className="text-light-text font-black uppercase text-xs tracking-wide">
                                                {m === 'transfer' ? 'Transferencia' : 'Efectivo'}
                                            </span>
                                        </button>
                                        
                                        {m === 'transfer' && selectedPayment === 'transfer' && (
                                            <div className="mx-2 p-4 bg-primary/50 border border-accent/20 rounded-2xl animate-fadeIn">
                                                <p className="text-[8px] font-black text-accent uppercase tracking-[0.2em] mb-2">Datos para Transferencia:</p>
                                                <p className="text-[11px] text-light-text font-bold leading-relaxed whitespace-pre-line bg-base/50 p-3 rounded-xl border border-gray-800">
                                                    {dashboardConfig.transferInfo}
                                                </p>
                                                <p className="text-[8px] text-dark-text mt-2 italic px-1 uppercase font-black opacity-60">Recuerda enviar el comprobante por WhatsApp al finalizar.</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6 animate-fadeIn px-2">
                        <div className="w-28 h-28 bg-[#25D366] rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(37,211,102,0.4)] animate-bounce">
                             <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </div>
                        <h3 className="text-3xl font-black text-light-text mb-4 uppercase italic tracking-tighter">LISTO PARA ENVIAR</h3>
                        <p className="text-dark-text text-lg mb-10 leading-snug font-bold px-4">Tu pedido se ha registrado. Presiona el botón para enviarnos el comprobante por WhatsApp.</p>
                        
                        <a 
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-6 px-6 rounded-3xl flex items-center justify-center transition-all transform active:scale-95 shadow-2xl mb-8 no-underline"
                        >
                            <span className="text-2xl uppercase tracking-tighter">ENVIAR PEDIDO</span>
                        </a>
                        <button onClick={handleClose} className="text-dark-text underline font-black uppercase text-sm tracking-widest">Volver al Menú</button>
                    </div>
                )}
            </div>

            {/* Footer */}
            {isOpen && step !== 'success' && cart.length > 0 && (
                <div className="p-6 bg-primary border-t border-gray-800 safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            <span className="text-dark-text font-black uppercase text-[10px] tracking-widest">Resumen de Pago</span>
                            {(appliedDiscount > 0 || useReward) && <span className="text-accent text-[9px] font-black uppercase tracking-tight italic">{useReward ? '🎁 Premio Activado' : '🔖 Descuento Aplicado'}</span>}
                        </div>
                        <span className="text-3xl font-black text-accent">${total.toFixed(0)}</span>
                    </div>
                    <Button onClick={() => {
                        if (step === 'cart') setStep('details');
                        else if (step === 'details') {
                            if (!name || !phone || (orderType === 'delivery' && !address)) {
                                alert(orderType === 'delivery' ? "Por favor escribe tu calle y número para el delivery." : "Por favor completa tu nombre y teléfono.");
                                return;
                            }
                            setStep('payment');
                        }
                        else if (step === 'payment') handlePlaceOrder();
                    }}>
                        <span className="uppercase tracking-[0.2em] font-black py-1 block">
                            {step === 'cart' ? 'Continuar Compra' : step === 'details' ? 'Elegir Pago' : 'Confirmar Pedido'}
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CartView;
