import React, { useEffect, useState } from 'react';
import { Sparkles, Smartphone, Check, Share2, X, ChevronRight, Download } from 'lucide-react';
import { usePWAInstall } from '@/core/hooks/use-pwa-install';
import './PWAInstallPrompt.css';

export const PWAInstallPrompt: React.FC = () => {
    const {
        canInstall,
        showIOSPrompt,
        install,
        dismiss,
        isPromptDismissedRecently,
        isStandalone
    } = usePWAInstall();

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Ne pas afficher si déjà installé ou si masqué récemment
        if (isStandalone || isPromptDismissedRecently()) {
            return;
        }

        const timer = setTimeout(() => {
            if (canInstall || showIOSPrompt) {
                setIsVisible(true);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [canInstall, showIOSPrompt, isStandalone, isPromptDismissedRecently]);

    const handleInstall = async () => {
        const installed = await install();
        if (installed) {
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        dismiss();
        setIsVisible(false);
    };

    const handleIOSInstructions = () => {
        alert(
            "Installation sur iPhone/iPad :\n\n" +
            "1. Appuyez sur l'icône de partage (📤)\n" +
            "2. Faites défiler vers le bas\n" +
            "3. Appuyez sur 'Sur l'écran d'accueil'\n" +
            "4. Appuyez sur 'Ajouter'\n\n" +
            "L'application apparaîtra sur votre écran d'accueil !"
        );
        handleDismiss();
    };

    // Ne pas afficher si déjà installé ou si masqué
    if (!isVisible || isStandalone) return null;

    return (
        <div className="pwa-install-prompt">
            <div className="pwa-install-content">
                <div className="pwa-install-header">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src="/logo.png"
                                alt="Spirit KES Logo"
                                className="w-10 h-10 object-cover rounded-full scale-125 shadow-md"
                            />
                            <div className="absolute -inset-3 bg-primary/5 rounded-full blur"></div>
                        </div>
                        <div>
                            <h3 className="flex items-center gap-2">
                                Installer Spirit KES
                            </h3>
                        </div>
                    </div>
                    <button className="pwa-close-btn" onClick={handleDismiss} aria-label="Fermer">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="pwa-install-body">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <strong>Profitez d'une expérience premium !</strong>
                    </p>

                    <div className="space-y-3">
                        {[
                            {
                                text: "Accès instantané depuis l'écran d'accueil",
                                icon: <Smartphone className="h-4 w-4 text-[#D4AF37]" />
                            },
                            {
                                text: "Fonctionne hors ligne",
                                icon: <Check className="h-4 w-4 text-[#D4AF37]" />
                            },
                            {
                                text: "Chargement ultra-rapide",
                                icon: <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                            },
                            {
                                text: "Interface plein écran",
                                icon: <Download className="h-4 w-4 text-[#D4AF37]" />
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4AF37]/10 to-[#0A3D2F]/10 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {showIOSPrompt && (
                        <div className="ios-instructions mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Share2 className="h-4 w-4 text-[#0A3D2F] dark:text-[#D4AF37]" />
                                <p className="text-sm font-medium text-[#0A3D2F] dark:text-white">
                                    Instructions pour iOS
                                </p>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Sur iPhone/iPad, utilisez l'option <strong>"Sur l'écran d'accueil"</strong> dans le menu de partage (📤)
                            </p>
                        </div>
                    )}
                </div>

                <div className="pwa-install-footer">
                    <button className="pwa-btn-secondary" onClick={handleDismiss}>
                        Plus tard
                    </button>

                    {showIOSPrompt ? (
                        <button className="pwa-btn-primary" onClick={handleIOSInstructions}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Voir instructions
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                    ) : (
                        <button className="pwa-btn-primary" onClick={handleInstall}>
                            <Download className="mr-2 h-4 w-4" />
                            Installer l'application
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};