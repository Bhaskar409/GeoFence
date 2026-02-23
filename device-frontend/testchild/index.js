function setBackgroundStatus(state) {
    const body = document.body;
    body.classList.remove('status-inside', 'status-outside');
    if (state) body.classList.add('status-' + state);
}

function setStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    statusEl.className = 'status ' + type;
    statusText.textContent = message;
    statusEl.classList.remove('hidden');
}

function showCoords(lat, lng) {
    const display = document.getElementById('coordsDisplay');
    document.getElementById('latVal').textContent = lat.toFixed(6);
    document.getElementById('lngVal').textContent = lng.toFixed(6);
    display.classList.remove('hidden');
}

function startTracking() {
    const deviceId = Number(document.getElementById("deviceId").value);

    if (!deviceId) {
        setStatus("Enter a valid Device ID.", "error");
        return;
    }

    if (!navigator.geolocation) {
        setStatus("Geolocation is not supported by your browser.", "error");
        return;
    }

    const btn = document.querySelector('.btn');
    btn.classList.add('loading');
    setStatus("Acquiring location…", "info");

    navigator.geolocation.getCurrentPosition(function (position) {

        const { latitude, longitude } = position.coords;
        showCoords(latitude, longitude);

        const data = { deviceId, latitude, longitude };
        console.log("Sending:", JSON.stringify(data));

        fetch("http://localhost:8080/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(async (res) => {
            const contentType = res.headers.get("content-type");

            if (!res.ok) {
                let errorMessage = "Request failed";
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } else {
                    errorMessage = await res.text();
                }
                throw new Error(errorMessage);
            }

            return res.json();
        })
        .then(response => {
            setStatus("Device is " + response.status, "success");
            const isOutside = response.status?.toLowerCase().includes("outside");
            setBackgroundStatus(isOutside ? "outside" : "inside");
        })
        .catch(err => {
            setStatus(err.message, "error");
            console.error("Error:", err);
        })
        .finally(() => {
            btn.classList.remove('loading');
        });

    }, function (error) {
        console.error("Location error:", error);
        setStatus("Unable to retrieve location.", "error");
        btn.classList.remove('loading');
    });
}
