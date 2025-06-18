'use client';

import { useState, useRef, useEffect } from 'react';
import { FaExternalLinkAlt, FaRocket, FaCode, FaGlobe } from 'react-icons/fa';
import { VERCEL_DEPLOY_URL, VERCEL_PREVIEW_URL } from '@/constants/site';
import { useTranslations } from 'next-intl';
import { useCanvasConfetti } from '@/hooks/useCanvasConfetti';

const VercelIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 19.777h20L12 2z" />
    </svg>
);

export const VercelDeployButton = () => {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { containerRef, triggerConfetti } = useCanvasConfetti({
        effect: 'realistic',
        enabled: true,
        intensity: 'high',
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="group flex items-center gap-3 rounded-xl border border-gray-900 bg-gray-900 px-5 py-3 text-base font-medium text-white shadow-sm transition-all duration-300 hover:border-black hover:bg-black hover:shadow-md dark:border-white dark:bg-white dark:text-gray-900 dark:hover:border-gray-200 dark:hover:bg-gray-100"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
                    <VercelIcon size={30} className="text-white dark:text-gray-900" />
                </div>

                <span className="font-medium text-white dark:text-gray-900">
                    {t('common.vercel.button.title')}
                </span>

                <svg
                    className={`h-4 w-4 text-white/70 transition-transform duration-300 group-hover:text-white dark:text-gray-600 dark:group-hover:text-gray-700 ${
                        isOpen ? 'rotate-180 transform' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 w-86 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800">
                    <div className="p-2">
                        <button
                            ref={containerRef as any}
                            onMouseEnter={() => triggerConfetti()}
                            onClick={() => handleMenuClick(VERCEL_DEPLOY_URL)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-900/5 dark:text-gray-200 dark:hover:bg-white/5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 dark:bg-white">
                                <VercelIcon size={16} className="text-white dark:text-gray-900" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {t('common.vercel.dropdown.deploy.title')}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('common.vercel.dropdown.deploy.description')}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-md border border-gray-900 bg-gray-900 px-2 py-1 text-xs font-medium text-white dark:border-white dark:bg-white dark:text-gray-900">
                                    <FaRocket className="mr-1 h-3 w-3" />
                                    {t('common.vercel.dropdown.deploy.badge')}
                                </div>
                                <FaExternalLinkAlt
                                    className="text-gray-400 dark:text-gray-500"
                                    size={12}
                                />
                            </div>
                        </button>
                        <button
                            onClick={() => handleMenuClick(VERCEL_PREVIEW_URL)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-blue-900/20"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                                <FaGlobe className="text-blue-500 dark:text-blue-400" size={16} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {t('common.vercel.dropdown.preview.title')}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('common.vercel.dropdown.preview.description')}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                                    <FaGlobe className="mr-1 h-3 w-3" />
                                    {t('common.vercel.dropdown.preview.badge')}
                                </div>
                                <FaExternalLinkAlt
                                    className="text-gray-400 dark:text-gray-500"
                                    size={12}
                                />
                            </div>
                        </button>
                        <button
                            onClick={() => handleMenuClick('https://vercel.com/docs')}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-700 transition-all duration-200 hover:bg-purple-50 dark:text-gray-200 dark:hover:bg-purple-900/20"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                                <FaCode
                                    className="text-purple-500 dark:text-purple-400"
                                    size={16}
                                />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {t('common.vercel.dropdown.docs.title')}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('common.vercel.dropdown.docs.description')}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:border-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                                    <FaCode className="mr-1 h-3 w-3" />
                                    {t('common.vercel.dropdown.docs.badge')}
                                </div>
                                <FaExternalLinkAlt
                                    className="text-gray-400 dark:text-gray-500"
                                    size={12}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VercelDeployButton;
