// PWA utility functions for install prompts and updates

let deferredPrompt = null;
let isAppInstalled = false;

// Track if app is installed
if (window.matchMedia('(display-mode: standalone)').matches) {
  isAppInstalled = true;
}

// Listen for app install
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA install prompt available');
});

// Listen for successful installation
window.addEventListener('appinstalled', () => {
  isAppInstalled = true;
  deferredPrompt = null;
  console.log('PWA installed successfully');
});

// Export PWA utilities
export const pwaUtils = {
  /**
   * Check if the app can be installed
   */
  canInstall() {
    return deferredPrompt !== null;
  },

  /**
   * Prompt user to install the app
   */
  async promptInstall() {
    if (!deferredPrompt) {
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  },

  /**
   * Check if app is currently installed
   */
  isInstalled() {
    return isAppInstalled;
  },

  /**
   * Check for service worker updates
   */
  async checkForUpdates() {
    if (!navigator.serviceWorker?.controller) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return false;
      }

      const updated = await registration.update();
      return updated !== registration;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  },

  /**
   * Skip waiting for service worker update (enable new version)
   */
  async skipWaiting() {
    const registrations = await navigator.serviceWorker.getRegistrations();
    registrations.forEach((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  },

  /**
   * Get service worker registration
   */
  async getRegistration() {
    if (!navigator.serviceWorker) {
      return null;
    }
    return navigator.serviceWorker.getRegistration();
  },

  /**
   * Check if browser supports PWA features
   */
  isSupported() {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  },

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return null;
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      return Notification.requestPermission();
    }

    return 'denied';
  },

  /**
   * Send a notification
   */
  sendNotification(title, options = {}) {
    if (!isAppInstalled || Notification.permission !== 'granted') {
      return;
    }

    const registration = navigator.serviceWorker?.controller;
    if (registration) {
      navigator.serviceWorker.ready.then((sw) => {
        sw.showNotification(title, options);
      });
    }
  },
};

export default pwaUtils;
