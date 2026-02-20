let currentStep = 1;
let parentEmailStored = "";
let deviceIdStored = "";

let map = null;
let marker = null;
let circle = null;

/* -------------------- STEP CONTROL -------------------- */

function updateProgress() {
    const progress = document.getElementById("progress");
    progress.style.width = (currentStep * 33) + "%";
}

function nextStep() {
    document.getElementById("step" + currentStep).classList.remove("active");
    currentStep++;
    document.getElementById("step" + currentStep).classList.add("active");
    updateProgress();

    // Initialize map only when entering Step 3
    if (currentStep === 3) {
        setTimeout(() => {
            initMap();
        }, 200);
    }
}

/* -------------------- STEP 1 - REGISTER PARENT -------------------- */

function registerParent() {
    const data = {
        name: document.getElementById("parentName").value,
        email: document.getElementById("parentEmail").value
    };

    fetch("http://localhost:8080/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        parentEmailStored = data.email;
        nextStep();
    })
    .catch(err => {
        console.error(err);
        alert("Parent registration failed");
    });
}

/* -------------------- STEP 2 - REGISTER DEVICE -------------------- */

function registerDevice() {

    const data = {
        parentEmail: parentEmailStored,
        deviceName: document.getElementById("deviceName").value
    };

    fetch("http://localhost:8080/device/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        console.log("Device Response:", response);

        deviceIdStored = response.id;   // This should now work
        nextStep();
    })
    .catch(err => {
        console.error(err);
        alert("Device registration failed");
    });
}

/* -------------------- STEP 3 - SET GEOFENCE -------------------- */

function setGeofence() {

    const lat = document.getElementById("latitude").value;
    const lng = document.getElementById("longitude").value;

    if (!lat || !lng) {
        alert("Please select a location on the map.");
        return;
    }

    const data = {
        parentEmail: parentEmailStored,
        deviceId: deviceIdStored,
        name: document.getElementById("geoName").value,
        centerLat: parseFloat(lat),
        centerLng: parseFloat(lng),
        radius: parseInt(document.getElementById("radius").value)
    };

    fetch("http://localhost:8080/geofence/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        alert("Setup Complete!");
    })
    .catch(err => {
        console.error(err);
        alert("Geofence setup failed");
    });
}

/* -------------------- MAP INITIALIZATION -------------------- */

function initMap() {

    // If map already exists, just resize it properly
    if (map) {
        map.invalidateSize();
        return;
    }

    // Default location (Delhi)
    map = L.map('map').setView([28.6139, 77.2090], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Handle map click
    map.on('click', function (e) {

        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lng;

        // Remove old marker/circle
        if (marker) map.removeLayer(marker);
        if (circle) map.removeLayer(circle);

        marker = L.marker([lat, lng]).addTo(map);

        drawCircle(lat, lng);
    });

    // Update circle if radius changes
    document.getElementById("radius").addEventListener("input", function () {
        if (marker) {
            const latlng = marker.getLatLng();
            drawCircle(latlng.lat, latlng.lng);
        }
    });
}

/* -------------------- DRAW / UPDATE CIRCLE -------------------- */

function drawCircle(lat, lng) {

    const radius = parseInt(document.getElementById("radius").value);

    if (circle) map.removeLayer(circle);

    circle = L.circle([lat, lng], {
        radius: radius,
        color: 'blue',
        fillOpacity: 0.2
    }).addTo(map);
}