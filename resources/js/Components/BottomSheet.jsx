import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function BottomSheet({ isOpen, onClose, title, children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            <Transition
                show={isOpen}
                enter="transition-opacity ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" 
                    onClick={onClose}
                />
            </Transition>

            {/* Bottom Sheet */}
            <Transition
                show={isOpen}
                enter="transition-transform ease-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition-transform ease-in duration-200"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
                className="fixed bottom-0 inset-x-0 z-50 w-full md:max-w-md mx-auto"
            >
                <div className="bg-gray-800 rounded-t-2xl shadow-2xl pb-safe">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-100">{title}</h3>
                        <button 
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="p-4 max-h-[80vh] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
}
