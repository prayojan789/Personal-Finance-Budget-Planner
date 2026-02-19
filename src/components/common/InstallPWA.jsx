import { useState, useCallback, useEffect } from 'react';
import Button from '../Button';

const InstallPWA = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setCanInstall(true);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setIsInstalled(true);
      setShowPrompt(false);
    };

    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    const event = window.__beforeInstallPromptEvent;
    if (!event) return;

    event.prompt();
    const { outcome } = await event.userChoice;
    
    if (outcome === 'accepted') {
      setCanInstall(false);
      setShowPrompt(false);
    }
  }, []);

  if (isInstalled) {
    return (
      <div className="pwa-installed-badge" title="App installed locally">
        ✓ App Installed
      </div>
    );
  }

  if (!canInstall) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <button
        onClick={handleInstall}
        className="pwa-install-button"
        title="Install this app on your device"
      >
        ⬇️ Install App
      </button>
    </div>
  );
};

export default InstallPWA;
