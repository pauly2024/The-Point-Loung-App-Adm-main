
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div className="mb-4">
            <label className="block text-dark-text text-sm font-bold mb-2" htmlFor={props.id}>
                {label}
            </label>
            <input
                className="bg-primary appearance-none border-2 border-gray-700 rounded w-full py-3 px-4 text-light-text leading-tight focus:outline-none focus:bg-base focus:border-accent"
                {...props}
            />
        </div>
    );
};

export default Input;
