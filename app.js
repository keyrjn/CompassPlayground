let compassNeedle = document.querySelector('.compass-needle');
let headingDisplay = document.querySelector('.heading');
let installPrompt = document.getElementById('installPrompt');
let installButton = document.getElementById('installButton');
let deferredPrompt;

// Handle PWA installation
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.classList.add('visible');
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
        installPrompt.classList.remove('visible');
    }
});

// Check if device has compass support
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
        // Get the compass heading
        let heading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
        
        // Update the compass needle rotation
        compassNeedle.style.transform = `translate(-50%, -50%) rotate(${-heading}deg)`;
        
        // Update the heading display
        headingDisplay.textContent = `${Math.round(heading)}°`;
    });
} else {
    headingDisplay.textContent = 'Compass not supported';
}

// Request permission for device orientation on iOS
function requestPermission() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            })
            .catch(console.error);
    }
}

// Add click handler for iOS permission
document.addEventListener('click', requestPermission, { once: true }); 