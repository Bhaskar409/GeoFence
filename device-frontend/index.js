function startTracking() {
    const deviceId = Number(document.getElementById("deviceId").value);

    if (!deviceId) {
        alert("Enter valid Device ID");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {

        const data = {
            deviceId: deviceId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        console.log("Sending:", JSON.stringify(data));

        fetch("http://localhost:8080/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            alert("Device is " + response.status);
        })
        .catch(err => console.error(err));

    }, function(error) {
        console.error("Location error:", error);
    });
}
