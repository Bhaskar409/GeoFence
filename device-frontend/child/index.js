// function startTracking() {

//     const deviceId = Number(document.getElementById("deviceId").value);

//     if (!deviceId) {
//         alert("Enter valid Device ID");
//         return;
//     }

//     if (!navigator.geolocation) {
//         alert("Geolocation not supported");
//         return;
//     }

//     navigator.geolocation.getCurrentPosition(function (position) {

//         const data = {
//             deviceId: deviceId,
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//         };

//         console.log("Sending:", JSON.stringify(data));

//         fetch("http://localhost:8080/update", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data)
//         })
//         .then(async (res) => {

//             const contentType = res.headers.get("content-type");

//             // 🔥 If response is not OK (404, 500 etc.)
//             if (!res.ok) {

//                 let errorMessage = "Request failed";

//                 // Try parsing JSON error
//                 if (contentType && contentType.includes("application/json")) {
//                     const errorData = await res.json();
//                     errorMessage = errorData.message || errorData.error || errorMessage;
//                 } else {
//                     errorMessage = await res.text();
//                 }

//                 throw new Error(errorMessage);
//             }

//             // Normal success response
//             return res.json();
//         })
//         .then(response => {
//             alert("Device is " + response.status);
//         })
//         .catch(err => {
//             alert(err.message);   // 👈 Shows exact backend message
//             console.error("Error:", err);
//         });

//     }, function (error) {
//         console.error("Location error:", error);
//         alert("Unable to retrieve location");
//     });
// }



//continous integration 

let trackingInterval = null;

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

    document.getElementById("status").innerText = "Tracking started...";

    // prevent multiple intervals
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }

    trackingInterval = setInterval(() => {

        navigator.geolocation.getCurrentPosition(function (position) {

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

                document.getElementById("status").innerText =
                    "Device is " + response.status;

                console.log("Server:", response.status);

            })
            .catch(err => {

                console.error("Error:", err);
                document.getElementById("status").innerText = err.message;

            });

        }, function (error) {

            console.error("Location error:", error);
            document.getElementById("status").innerText = "Unable to retrieve location";

        });

    }, 5000); // every 5 seconds
}

function stopTracking() {

    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
        document.getElementById("status").innerText = "Tracking stopped";
    }

}