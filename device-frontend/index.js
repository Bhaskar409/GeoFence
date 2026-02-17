console.log("SCRIPT LOADED");

let intervalId = null;
function startTracking() {
    const deviceId = document.getElementById("deviceId").value;

    if (!deviceId) {
        alert("Enter Device ID");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser");
        return;
    }

    console.log("Requesting location...");

    navigator.geolocation.getCurrentPosition(
        function (position) {
            console.log("Location received");

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const altitude = position.coords.altitude;

            console.log("Lat:", latitude);
            console.log("Lng:", longitude);
            console.log("Alt:", altitude);

            fetch("http://localhost:8080/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    deviceId: deviceId,
                    latitude: latitude,
                    longitude: longitude
                })
            })
            .then(res => res.json())
            .then(data => console.log("Server:", data))
            .catch(err => console.error("Fetch error:", err));
        },
        function (error) {
            console.error("Geolocation error:", error);

            if (error.code === 1) {
                alert("Permission denied. Allow location access.");
            } else if (error.code === 2) {
                alert("Position unavailable.");
            } else if (error.code === 3) {
                alert("Location request timed out.");
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}
