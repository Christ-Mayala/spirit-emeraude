import React, { useEffect, useState } from 'react';
import { Sparkles, Smartphone, Check, Share2, X, ChevronRight } from 'lucide-react';
import { usePWAInstall } from '@/core/hooks/use-pwa-install';
import './PWAInstallPrompt.css';

export const PWAInstallPrompt: React.FC = () => {
    const { canInstall, showIOSPrompt, install, dismiss, isPromptDismissedRecently } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((canInstall || showIOSPrompt) && !isPromptDismissedRecently()) {
                setIsVisible(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [canInstall, showIOSPrompt, isPromptDismissedRecently]);

    const handleInstall = async () => {
        const installed = await install();
        if (installed) setIsVisible(false);
    };

    const handleDismiss = () => { dismiss(); setIsVisible(false); };

    const handleIOSInstructions = () => {
        alert(
            "Sur iPhone/iPad :\n\n" +
            "1. Appuyez sur l'icône de partage\n" +
            "2. Faites défiler vers le bas\n" +
            "3. Appuyez sur 'Sur l'écran d'accueil'\n" +
            "4. Appuyez sur 'Ajouter'\n\n" +
            "L'application apparaîtra sur votre écran d'accueil !"
        );
        handleDismiss();
    };

    if (!isVisible) return null;

    return (
        <div className="pwa-install-prompt">
            <div className="pwa-install-content">
                <div className="pwa-install-header">
                    <h3>
                        <Sparkles className="inline-block mr-2 h-5 w-5 text-[#F4E6A1]" />
                        Installer Spirit KES
                    </h3>
                    <button className="pwa-close-btn" onClick={handleDismiss} aria-label="Fermer">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="pwa-install-body">
                    <p><strong>Profitez d'une expérience optimale !</strong></p>
                    <ul>
                        {[
                            { text: "Accès direct depuis l'écran d'accueil", icon: <Smartphone className="h-4 w-4 text-[#D4AF37]" /> }, 
                            { text: "Chargement instantané", icon: <Sparkles className="h-4 w-4 text-[#D4AF37]" /> },
                            { text: "Expérience native", icon: <Check className="h-4 w-4 text-[#D4AF37]" /> },
                        ].map((item, index) => (
                            <li key={index}>
                                {item.icon}
                                <span className="ml-2">{item.text}</span>
                            </li>
                        ))}
                    </ul>

                    {showIOSPrompt && (
                        <div className="ios-instructions">
                            <p>
                                <small>
                                    <Share2 className="inline-block h-4 w-4 text-[#0A3D2F] mr-1" />
                                    Sur iOS, utilisez l'option <strong>"Sur l'écran d'accueil"</strong> dans le menu de partage.
                                </small>
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
                            Voir instructions <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                    ) : (
                        <button className="pwa-btn-primary" onClick={handleInstall}>
                            Installer l'application <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
