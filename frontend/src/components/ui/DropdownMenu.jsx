import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export const DropdownMenu = ({ children, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    {React.Children.map(children, child =>
                        React.cloneElement(child, {
                            onClick: () => {
                                if (child.props.onClick) {
                                    child.props.onClick();
                                }
                                setIsOpen(false);
                            }
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export const DropdownMenuItem = ({ children, onClick, icon: Icon, variant = 'default' }) => {
    const variantClasses = {
        default: 'hover:bg-slate-50 text-slate-700',
        danger: 'hover:bg-red-50 text-red-600'
    };

    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${variantClasses[variant]}`}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {children}
        </button>
    );
};

export const DropdownMenuTrigger = ({ children, className = '' }) => {
    return (
        <button className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${className}`}>
            {children || <MoreVertical className="h-4 w-4 text-slate-600" />}
        </button>
    );
};
