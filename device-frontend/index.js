console.log("SCRIPT LOADED");

let intervalId = null;
function startTracking() {
    const deviceId = document.getElementById("deviceId").value;

    if (!deviceId) {
        alert("Enter Device ID");
        return;
    }

    console.log("Button clicked");

    const data = {
        deviceId: deviceId,
        latitude: 28.6139,
        longitude: 77.2090
    };

    console.log("Sending data:", data);

    fetch("http://localhost:8080/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        console.log("Response status:", res.status);
        return res.json();
    })
    .then(response => {
        console.log("Server response:", response);
    })
    .catch(err => {
        console.error("Fetch error:", err);
    });
}
