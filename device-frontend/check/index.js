let currentStep = 1;
let parentEmailStored = "";
let deviceIdStored = "";
let map = null;
let marker = null;
let circle = null;

/* -------------------- STEP CONTROL -------------------- */

function updateStepUI() {
    document.querySelectorAll('.step-dot').forEach((el, i) => {
        el.classList.remove('active', 'done');
        if (i + 1 === currentStep) el.classList.add('active');
        if (i + 1 < currentStep) el.classList.add('done');
    });
    document.querySelectorAll('.step-connector').forEach((el, i) => {
        if (i + 1 < currentStep) el.classList.add('filled');
        else el.classList.remove('filled');
    });
}

function nextStep() {
    document.getElementById("step" + currentStep).classList.remove("active");
    currentStep++;
    document.getElementById("step" + currentStep).classList.add("active");
    updateStepUI();
    if (currentStep === 3) setTimeout(() => initMap(), 250);
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
    .then(() => { parentEmailStored = data.email; nextStep(); })
    .catch(() => alert("Parent registration failed"));
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
    .then(response => { deviceIdStored = response.id; nextStep(); })
    .catch(() => alert("Device registration failed"));
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
    .then(() => alert("Setup Complete!"))
    .catch(() => alert("Geofence setup failed"));
}

/* -------------------- MAP INITIALIZATION -------------------- */

function initMap() {
    if (map) { map.invalidateSize(); return; }

    // Default location (Delhi)
    map = L.map('map').setView([28.6139, 77.2090], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lng;
        document.getElementById("latDisplay").textContent = lat.toFixed(5);
        document.getElementById("lngDisplay").textContent = lng.toFixed(5);

        if (marker) map.removeLayer(marker);
        if (circle) map.removeLayer(circle);

        marker = L.marker([lat, lng]).addTo(map);
        drawCircle(lat, lng);
    });

    document.getElementById("radius").addEventListener("input", function() {
        if (marker) {
            const ll = marker.getLatLng();
            drawCircle(ll.lat, ll.lng);
        }
    });
}

/* -------------------- DRAW / UPDATE CIRCLE -------------------- */

function drawCircle(lat, lng) {
    const radius = parseInt(document.getElementById("radius").value);

    if (circle) map.removeLayer(circle);

    circle = L.circle([lat, lng], {
        radius: radius,
        color: '#6c63ff',
        fillColor: '#6c63ff',
        fillOpacity: 0.15,
        weight: 2
    }).addTo(map);
}
