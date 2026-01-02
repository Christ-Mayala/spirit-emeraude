import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [canInstall, setCanInstall] = useState(false);

    // Vérifier le mode standalone
    const checkStandalone = useCallback(() => {
        const standalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;
        setIsStandalone(standalone);
        return standalone;
    }, []);

    // Vérifier iOS
    const checkIOS = useCallback(() => {
        const ua = window.navigator.userAgent;
        const isIPad = /iPad/.test(ua);
        const isIPhone = /iPhone/.test(ua);
        const isIPod = /iPod/.test(ua);
        const isSafari = /Safari/.test(ua);
        const isChrome = /CriOS/.test(ua);
        const isFirefox = /FxiOS/.test(ua);

        const ios = (isIPad || isIPhone || isIPod) && isSafari && !isChrome && !isFirefox;
        setIsIOS(ios);
        return ios;
    }, []);

    // Installation
    const install = useCallback(async () => {
        if (!deferredPrompt) return false;

        try {
            await deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;

            if (choice.outcome === 'accepted') {
                console.log('PWA installed successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Installation error:', error);
            return false;
        } finally {
            setDeferredPrompt(null);
            setCanInstall(false);
        }
    }, [deferredPrompt]);

    useEffect(() => {
        if (checkStandalone()) return;

        const ios = checkIOS();

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);
            setCanInstall(!ios);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setCanInstall(false);
            setIsStandalone(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [checkStandalone, checkIOS]);

    return {
        canInstall,
        isIOS,
        isStandalone,
        install,
        deferredPrompt
    };
}