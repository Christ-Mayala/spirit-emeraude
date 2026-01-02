import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

export interface PWAInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [location] = useLocation();

    useEffect(() => {
        // Vérifier si l'app est déjà installée
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsStandalone(true);
        }

        // Détecter iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as PWAInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Vérifier si l'app a été installée
        window.addEventListener('appinstalled', () => {
            localStorage.setItem('pwa-installed', 'true');
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Ne pas afficher le prompt sur certaines pages (comme admin)
    const shouldShowPrompt = !location.includes('/dashboard') && !location.includes('/login');

    const canInstall = !isStandalone && deferredPrompt !== null && !isIOS && shouldShowPrompt;
    const showIOSPrompt = !isStandalone && isIOS && shouldShowPrompt;

    const install = useCallback(async () => {
        if (!deferredPrompt) return false;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                localStorage.setItem('pwa-installed', 'true');
                return true;
            }
        } catch (error) {
            console.error('Erreur lors de l\'installation:', error);
        }

        return false;
    }, [deferredPrompt]);

    const dismiss = useCallback(() => {
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }, []);

    const isPromptDismissedRecently = () => {
        const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissedTime) return false;

        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        return Date.now() - parseInt(dismissedTime) < sevenDays;
    };

    return {
        canInstall,
        showIOSPrompt,
        isStandalone,
        install,
        dismiss,
        isPromptDismissedRecently,
        shouldShowPrompt
    };
}