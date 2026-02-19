# PWA (Progressive Web App) Support

This project now includes full Progressive Web App support, making it installable and functional offline.

## ✅ What's Included

### 1. **Web Manifest** (`public/manifest.json`)
- Defines app metadata: name, description, icons, theme colors
- Enables app installation on home screen/app drawer
- Configures app display mode as standalone (full screen)
- Includes app shortcuts for quick actions
- Set app categories and screenshots for app stores

### 2. **Service Worker** (`public/sw.js`)
- Enables offline functionality
- Intelligent caching strategies:
  - **Network First**: Try network, fallback to cache (HTML, API calls)
  - **Stale While Revalidate**: Return cached, update in background (CSS, JS)
  - **Cache Images**: Cache images intelligently
- Auto-updates service worker on app reload
- Handles network failures gracefully

### 3. **PWA Utilities** (`src/utils/pwaUtils.js`)
- `canInstall()` - Check if install prompt is available
- `promptInstall()` - Show install dialog to user
- `isInstalled()` - Check current installation status
- `checkForUpdates()` - Check for service worker updates
- `sendNotification()` - Send push notifications
- `requestNotificationPermission()` - Ask for notification access

### 4. **Install App Component** (`src/components/common/InstallPWA.jsx`)
- Displays "Install App" button when available
- Shows "App Installed" badge when app is installed
- Manages installation flow

### 5. **PWA Styling** (`src/assets/styles/pwa.css`)
- Beautiful install button with hover effects
- Installed badge styling
- Offline indicator animations
- Responsive design

## 🚀 How to Use

### Enable in Your App

1. **Import the component** in your Navbar or Header:
```jsx
import InstallPWA from './components/common/InstallPWA';

function Navbar() {
  return (
    <nav>
      {/* ... other navbar content ... */}
      <InstallPWA />
    </nav>
  );
}
```

2. **Import PWA styles** in your main CSS file:
```css
@import './assets/styles/pwa.css';
```

### Installation Process

1. **Web Browser** (Desktop/Mobile):
   - Click "Install App" button in navbar
   - Confirm installation
   - App appears on home screen / app launcher

2. **Mobile Browsers**:
   - Browser shows native "Add to Home Screen" prompt
   - Install like a native app
   - Access offline

3. **Desktop Browsers**:
   - Install like a desktop application
   - Runs in standalone window
   - Accessible from taskbar/dock

## 📋 Features

### Offline Support
- App works fully offline after first visit
- Caches all static assets (HTML, CSS, JS)
- Caches API responses automatically
- Shows offline indicator when network unavailable

### Smart Caching
- Static assets cached on install
- Images cached on first view
- CSS/JS cached and updated in background
- API calls cached for offline access

### Installation Features
- Install button when app can be installed
- Installed indicator badge
- Custom app icon (launcher icon)
- Splash screen on iOS
- Custom app shortcuts

### Notifications (Optional)
```javascript
// Use pwaUtils to send notifications
import pwaUtils from './utils/pwaUtils';

// Request permission
await pwaUtils.requestNotificationPermission();

// Send notification
pwaUtils.sendNotification('Transaction Added', {
  body: 'Your $50 expense was recorded',
  icon: '/icon-192.png',
  badge: '/icon-96.png',
});
```

## 🎨 Customization

### Change App Name/Description
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "description": "Your app description"
}
```

### Change Theme Colors
Edit `public/manifest.json` and `index.html`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

### Add Your Icons
Replace the icon references in `public/manifest.json`:
1. Create PNG icons (192x192, 512x512)
2. Place in `public/` folder
3. Update manifest.json with icon paths

**To generate icons from SVG**:
```bash
# Using ImageMagick
convert -background none public/icon.svg -resize 192x192 public/icon-192.png
convert -background none public/icon.svg -resize 512x512 public/icon-512.png
```

## 🔧 Configuration

### Service Worker Caching Strategy
Edit `public/sw.js` to customize:
- Cache names (for versioning)
- Which assets to cache
- Cache invalidation strategy

Example - Add new assets to cache on install:
```javascript
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/other-page.html', // Add your pages
];
```

### Update Handling
The service worker automatically:
1. Detects when new version is available
2. Caches in background
3. Prompts user when different

## 📱 Testing

### Test Offline Mode
1. Install and open app
2. Open DevTools: F12
3. Go to Network tab → check "Offline"
4. App should work perfectly

### Test Installation
1. Open in browser
2. Should see "Install App" button
3. Click to install locally
4. Access from home screen/app drawer

### View Service Worker
1. Open DevTools: F12
2. Application → Service Workers
3. See active workers and cache storage

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web App Manifest | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Offline Support | ✅ | ✅ | ✅ | ✅ |
| Installation | ✅ | ✅ | ⚠️ Limited | ✅ |
| Notifications | ✅ | ✅ | ⚠️ Limited | ✅ |

## 📦 Files Added/Modified

- ✅ `public/manifest.json` - App metadata
- ✅ `public/sw.js` - Service worker
- ✅ `public/icon.svg` - App icon (SVG)
- ✅ `src/utils/pwaUtils.js` - PWA utilities
- ✅ `src/components/common/InstallPWA.jsx` - Install button
- ✅ `src/assets/styles/pwa.css` - PWA styling
- ✅ `index.html` - Updated with manifest & SW registration

## 🚀 Next Steps

1. **Add the InstallPWA component** to your Navbar
2. **Test offline functionality** using DevTools
3. **Generate custom icons** for your app
4. **Add push notifications** if needed
5. **Test installation** on mobile and desktop

## 📚 Resources

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
