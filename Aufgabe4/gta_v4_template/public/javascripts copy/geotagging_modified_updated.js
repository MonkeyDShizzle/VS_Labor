
var globalArray = [];
var maxElemsPerPage = 5;
var curPage = 1;
let maxPs;

var nextBtn = document.getElementById("pagination-right");
var preBtn = document.getElementById("pagination-left");

async function initialize() {
    globalArray = await fetch("api/geotags", {
        method: "GET"
    })
    .then(response => response.json());

    maxPs = Math.ceil(globalArray.length / maxElemsPerPage);
    
    updateLocation();
    console.log(`Initialization finished: ${JSON.stringify(globalArray)}`);
}

function mapUpdate(latitude, longitude) {
    let nearGeoTaglist = JSON.parse(document.getElementById("map").getAttribute("data-tags"));
    let mapManager = new MapManager("CquR8AxqHTiVhknCWjjY54wUEul9hv8J");
    let mapUrl = mapManager.getMapUrl(latitude, longitude, nearGeoTaglist, 16);
    document.getElementById("map").setAttribute("src", mapUrl);
}

function updateLocation() {
    if (document.getElementById("taglatinput").getAttribute("value") === "" ||
        document.getElementById("taglonginput").getAttribute("value") === "") {
        LocationHelper.findLocation(async function (location) {
            document.getElementById("disclatinput").setAttribute("value", location.latitude);
            document.getElementById("disclonginput").setAttribute("value", location.longitude);
            document.getElementById("taglatinput").setAttribute("value", location.latitude);
            document.getElementById("taglonginput").setAttribute("value", location.longitude);
            mapUpdate(location.latitude, location.longitude);
        });
        updatePagination();
    }
}



function updatePagination(searchresult) {
    document.getElementById("discoveryResults").innerHTML = "";
    if (searchresult !== undefined) {
        globalArray = searchresult;
        maxPs = Math.ceil(globalArray.length / maxElemsPerPage);
        curPage=1;
    }
    for (i = (curPage - 1) * maxElemsPerPage;  i < (curPage * maxElemsPerPage) && i < globalArray.length; i++) {
        var gtag = globalArray[i];
        var newElem = document.createElement("li");
        newElem.innerHTML += '<li class="listitem">' + gtag.name + " ( " + gtag.latitude + "," + gtag.longitude + ") " + gtag.hashtag + '</li>';
        document.getElementById('discoveryResults').appendChild(newElem);
    }
    document.getElementById("pagination-text").value = curPage + " / " + maxPs + "(" + globalArray.length + ")";


    if (curPage == 1) preBtn.disabled = true;
    else preBtn.disabled = false;

    if (curPage == maxPs) nextBtn.disabled = true;
    else nextBtn.disabled = false;

}

function apiMapUpdate(){
    let mapManager = new MapManager("CquR8AxqHTiVhknCWjjY54wUEul9hv8J");
    let lat = document.getElementById("taglatinput").getAttribute("value");
    let lon = document.getElementById("taglonginput").getAttribute("value"); 
    let mapUrl = mapManager.getMapUrl(lat, lon, globalArray, 15);
    document.getElementById("map").setAttribute("src", mapUrl);

    // window.location.reload();
}
async function postAdd(geotag) {
    let response = await fetch("api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });
    return response.json();
}

nextBtn.addEventListener("click", function (e) {
    if (curPage < maxPs) {
        curPage++;
        updatePagination();
    }
});


preBtn.addEventListener("click", function (e) {
    if (curPage > 1) {
        curPage--;
        updatePagination();
    }
});


document.getElementById("tagbutton").addEventListener("click", (e) => {
    e.preventDefault();

    let geotag = {
        name: document.getElementById("tagnameinput").value,
        latitude: document.getElementById("taglatinput").value,
        longitude: document.getElementById("taglonginput").value,
        hashtag: document.getElementById("taghashtaginput").value
    };

    postAdd(geotag)
        .then(apiMapUpdate)
        .then(updatePagination);

    document.getElementById("tagnameinput").value = "";
    document.getElementById("taghashtaginput").value = "";
    document.getElementById("discoveryinput").value = "";
    window.location.reload();
}, true);

document.getElementById("discoverybutton").addEventListener("click", async (e) => {
    e.preventDefault();

    let formInput = document.getElementById("discoveryinput").value;
    console.log(`Input of discovery-form: ${formInput}`);

    let result;

    if(typeof formInput === "number") {
        result = await fetch(`api/geotags?latitude=${formInput}`)
            .then(response => response.json());
    } else if(typeof formInput === "string" && formInput !== "") {
        result = await fetch(`api/geotags?searchterm=${formInput}`)
            .then(response => response.json());
        console.log(`Result of Query-Param-Seach: ${JSON.stringify(result)}`)
    } else {
        result = globalArray;
    }

    updatePagination(result);
    apiMapUpdate();
});


document.addEventListener("DOMContentLoaded", initialize, true);


// Event-Listener für das Tagging-Formular
document.querySelector('.main__tagging').addEventListener('submit', function(event) {
    if (event.target && event.target.nodeName === 'FORM') {
        event.preventDefault();
        submitTaggingForm();
    }
});

// Event-Listener für das Discovery-Formular
document.querySelector('.main__discovery').addEventListener('submit', function(event) {
    if (event.target && event.target.nodeName === 'FORM') {
        event.preventDefault();
        submitDiscoveryForm();
    }
});

// Funktion, um das Tagging-Formular zu verarbeiten und per AJAX zu senden
async function submitTaggingForm() {
    // Sammeln und Validieren der Formulardaten
    // TODO: Fügen Sie die entsprechende Validierungslogik hinzu
    const form = document.querySelector('.main__tagging form');
    const formData = new FormData(form);

    // Konvertiere FormData zu JSON
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    // AJAX POST-Anfrage
    try {
        const response = await fetch('/api/tagging', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            // TODO: Aktualisieren Sie die Benutzeroberfläche nach Bedarf
        } else {
            // Fehlerbehandlung
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

// Funktion, um das Discovery-Formular zu verarbeiten und per AJAX zu senden
async function submitDiscoveryForm() {
    // Sammeln und Validieren der Formulardaten
    // TODO: Fügen Sie die entsprechende Validierungslogik hinzu
    const form = document.querySelector('.main__discovery form');
    const formData = new FormData(form);
    const queryParams = new URLSearchParams(formData);

    // AJAX GET-Anfrage
    try {
        const response = await fetch('/api/discovery?' + queryParams.toString(), {
            method: 'GET'
        });

        if (response.ok) {
            const result = await response.json();
            // TODO: Aktualisieren Sie die Benutzeroberfläche nach Bedarf
        } else {
            // Fehlerbehandlung
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}
