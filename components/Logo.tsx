import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* Red Arc */}
                <path
                    d="M 29,75 A 38 38 0 1 1 85,35"
                    stroke="#E53935"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* White Arc (swish) */}
                <path
                    d="M 85,35 C 95 25, 85 10, 70 18"
                    stroke="#FFFFFF"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Center circle */}
                <circle cx="50" cy="50" r="20" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                <circle cx="50" cy="50" r="15" fill="#E53935" />
            </svg>
            <span className="text-white tracking-[0.3em] text-xl font-light mt-4">THE POINT</span>
        </div>
    );
};

export default Logo;
