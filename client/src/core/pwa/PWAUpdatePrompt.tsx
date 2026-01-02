import React, { useState } from 'react';
import { useRegisterSW } from "virtual:pwa-register/react";
import './PWAInstallPrompt.css'; // Utilise les mêmes styles

export const PWAUpdatePrompt: React.FC = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('Service Worker enregistré:', r);
        },
        onRegisterError(error) {
            console.error('Erreur d\'enregistrement du Service Worker:', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!needRefresh && !offlineReady) return null;

    return (
        <div className="pwa-install-prompt">
            <div className="pwa-install-content">
                <div className="pwa-install-header">
                    <h3>🔄 Mise à jour disponible</h3>
                    <button className="pwa-close-btn" onClick={close} aria-label="Fermer">
                        ×
                    </button>
                </div>

                <div className="pwa-install-body">
                    {offlineReady ? (
                        <p>
                            <strong>✅ Prêt hors ligne !</strong>
                            <br />
                            <small>L'application peut maintenant fonctionner sans connexion internet.</small>
                        </p>
                    ) : (
                        <>
                            <p>
                                <strong>✨ Nouvelle version disponible !</strong>
                            </p>
                            <ul>
                                <li>✅ Corrections de bugs</li>
                                <li>✅ Nouvelles fonctionnalités</li>
                                <li>✅ Améliorations des performances</li>
                            </ul>
                            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
                                <small>Cliquez sur "Recharger" pour installer la mise à jour.</small>
                            </p>
                        </>
                    )}
                </div>

                <div className="pwa-install-footer">
                    {needRefresh && (
                        <>
                            <button className="pwa-btn-secondary" onClick={close}>
                                Plus tard
                            </button>
                            <button
                                className="pwa-btn-primary"
                                onClick={() => updateServiceWorker(true)}
                            >
                                Recharger
                            </button>
                        </>
                    )}

                    {offlineReady && (
                        <button className="pwa-btn-primary" onClick={close}>
                            Super !
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};