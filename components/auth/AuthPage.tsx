
import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Logo from '../Logo';
import Input from '../shared/Input';
import Button from '../shared/Button';

const LoginPage: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const { login } = useContext(AppContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const success = await login(username, password);
            if (!success) {
                setError('Credenciales incorrectas o usuario no encontrado.');
            }
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto animate-fadeIn">
            <h2 className="text-3xl font-black text-center mb-8 uppercase italic tracking-tighter">¡Bienvenido!</h2>
            <form onSubmit={handleSubmit} className="bg-primary shadow-2xl rounded-3xl px-8 pt-8 pb-10 mb-4 border border-gray-800">
                {error && <p className="text-accent text-[10px] font-black uppercase mb-4 text-center bg-accent/10 py-2 rounded-xl">{error}</p>}
                <Input 
                    label="Nombre de Usuario o Admin" 
                    id="login-username" 
                    type="text" 
                    placeholder="Paul Valerio Naar" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input 
                    label="Contraseña" 
                    id="login-password" 
                    type="password" 
                    placeholder="****" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="flex items-center justify-between mb-8">
                    <label className="flex items-center text-dark-text text-xs uppercase font-bold tracking-widest cursor-pointer">
                        <input className="mr-2 accent-accent" type="checkbox" />
                        <span>Recordarme</span>
                    </label>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
                </Button>
            </form>
            <p className="text-center text-dark-text text-xs uppercase font-black tracking-widest">
                ¿No tienes cuenta?{' '}
                <button onClick={onSwitch} className="text-accent hover:underline ml-1">
                    Regístrate aquí
                </button>
            </p>
        </div>
    );
};

const RegisterPage: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const { register } = useContext(AppContext);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const success = await register({ fullName: name, phone }, pass);
            if (!success) {
                setError('Hubo un error al registrarte. Intenta con otro nombre.');
            }
        } catch (err) {
            setError('Error de conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto animate-fadeIn">
            <h2 className="text-3xl font-black text-center mb-8 uppercase italic tracking-tighter">Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className="bg-primary shadow-2xl rounded-3xl px-8 pt-8 pb-10 mb-4 border border-gray-800">
                {error && <p className="text-accent text-[10px] font-black uppercase mb-4 text-center bg-accent/10 py-2 rounded-xl">{error}</p>}
                <Input label="Nombre Completo" id="reg-name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Número de Teléfono" id="reg-phone" type="tel" placeholder="829-000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Input label="Contraseña" id="reg-password" type="password" placeholder="Mínimo 4 caracteres" value={pass} onChange={(e) => setPass(e.target.value)} required />
                <div className="mb-8 mt-4">
                    <label className="flex items-center text-dark-text text-xs uppercase font-bold tracking-widest cursor-pointer">
                        <input className="mr-2 accent-accent" type="checkbox" required />
                        <span className="leading-tight">Acepto los Términos y Condiciones de The Point</span>
                    </label>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'CREANDO CUENTA...' : 'CREAR MI CUENTA'}
                </Button>
            </form>
            <p className="text-center text-dark-text text-xs uppercase font-black tracking-widest">
                ¿Ya tienes cuenta?{' '}
                <button onClick={onSwitch} className="text-accent hover:underline ml-1">
                    Inicia Sesión aquí
                </button>
            </p>
        </div>
    );
};

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-base flex flex-col justify-center items-center p-6">
            <Logo className="mb-12 scale-110" />
            {isLogin ? <LoginPage onSwitch={() => setIsLogin(false)} /> : <RegisterPage onSwitch={() => setIsLogin(true)} />}
        </div>
    );
};

export default AuthPage;
