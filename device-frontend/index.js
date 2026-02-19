console.log("SCRIPT LOADED");


function startTracking() {
    const deviceId = Number(document.getElementById("deviceId").value);

    if (!deviceId) {
        alert("Enter valid Device ID");
        return;
    }

    const data = {
        deviceId: deviceId,
        latitude: 28.6139,
        longitude: 77.2090
    };

    console.log("Sending:", JSON.stringify(data));

    fetch("http://localhost:8080/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        console.log("Status:", res.status);
        return res.json();
    })
    .then(response => {
        console.log("Response:", response.status);
        alert("Device is " + response.status);
    })
    .catch(err => console.error(err));
}
