// Corner direction elements
const topLeft = document.getElementById('topLeft');
const topRight = document.getElementById('topRight');
const bottomRight = document.getElementById('bottomRight');
const bottomLeft = document.getElementById('bottomLeft');

// Camera setup
const video = document.getElementById('camera');

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
            }
        });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
    }
}

// Function to get direction from heading
function getDirection(heading) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
}

// Function to update corner directions
function updateCornerDirections(heading) {
    // Calculate the directions for each corner (45 degrees offset)
    const topLeftHeading = (heading - 45 + 360) % 360;
    const topRightHeading = (heading + 45) % 360;
    const bottomRightHeading = (heading + 135) % 360;
    const bottomLeftHeading = (heading + 225) % 360;

    // Update the corner indicators
    topLeft.textContent = getDirection(topLeftHeading);
    topRight.textContent = getDirection(topRightHeading);
    bottomRight.textContent = getDirection(bottomRightHeading);
    bottomLeft.textContent = getDirection(bottomLeftHeading);
}

// Check if device has compass support
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
        // Get the compass heading
        let heading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
        
        // Update corner directions
        updateCornerDirections(heading);
    });
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

// Initialize camera
setupCamera();

// Add click handler for iOS permission
document.addEventListener('click', requestPermission, { once: true }); 