emailjs.init({
    publicKey: "phiYwCeBQvQANsWdj"
});

// ---------- Konfiguration ----------

// Im Bootcamp zeigt der Trainer die echte API-URL.
// Für lokales Testen ohne Backend bleibt API_BASE = ''
// (dann wird der Snapshot-Fallback genutzt).
const API_BASE = 'http://192.168.1.186:8080/api/v1';

let currentSerial = '7208r_0001';
// ---------- Hilfsfunktionen ----------

function snapshotKey(serial) {
  return `snapshot:${serial}`;
}

function SnackbarWarnung() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


async function loadData() {
    const valuesDiv = document.getElementById('values');
    valuesDiv.classList.add('invisible');
    const errorMessageDiv = document.getElementById('message');
    errorMessageDiv.classList.remove('invisible');

            try {
                const response = await fetch('data.json');
                const bundles = await response.json();

                const data = bundles[0]; 
                const bme680 = data.readings.bme680;
                document.getElementById('tem-c').textContent = bme680.temp_c + ' °C';
                document.getElementById('hum-pct').textContent = bme680.hum_pct + ' %';

                getStatus(bme680.temp_c, bme680.hum_pct);

                valuesDiv.classList.remove('invisible');
                errorMessageDiv.classList.add('invisible');

            } catch (error) {
                errorMessageDiv.innerHTML = '<p class="error">Fehler: Daten konnten nicht geladen werden.</p>';
                console.error(error);
            }
    }

    window.addEventListener('DOMContentLoaded', function() {
    loadData();
});




    const EDB_Temp_Gut_Min = 20;
    const EDB_Temp_Gut_Max = 22;
    const EDB_Temp_Kritisch_Min = 10;
    const EDB_Temp_Kritisch_Max = 20;
    const EDB_Hum_Gut_Min = 40;
    const EDB_Hum_Gut_Max = 60;
    const EDB_Hum_Kritisch_Min = 10;
    const EDB_Hum_Kritisch_Max = 30;

    function getStatus(temp_c, hum_pct) {
    const StatusGutDiv = document.getElementById('status-gut');
    StatusGutDiv.classList.add('invisible');
    const StatusKritischDiv = document.getElementById('status-kritisch');
    StatusKritischDiv.classList.add('invisible');
    const StatusSchlechtDiv = document.getElementById('status-schlecht');
    StatusSchlechtDiv.classList.add('invisible');

    const tempGut = temp_c >= EDB_Temp_Gut_Min && temp_c <= EDB_Temp_Gut_Max;
    const humGut = hum_pct >= EDB_Hum_Gut_Min && hum_pct <= EDB_Hum_Gut_Max;
    const tempKritisch = temp_c >= EDB_Temp_Kritisch_Min && temp_c <= EDB_Temp_Kritisch_Max;
    const humKritisch = hum_pct >= EDB_Hum_Kritisch_Min && hum_pct <= EDB_Hum_Kritisch_Max;


    if (tempGut && humGut) {
        return StatusGutDiv.classList.remove('invisible');
    }
    else if (tempKritisch && humKritisch) {
        return  StatusKritischDiv.classList.remove('invisible');
    }
    else {
        StatusSchlechtDiv.classList.remove('invisible');
        sendWarningEmail()
    }

}
//async function loadDashboard() {
    //try {
       // const response = await fetch('data.json');
       // const bundles = await response.json();

        //renderHistory(bundles);

   // } catch (error) {
        //const errorMessageDiv = document.getElementById('message');
        //errorMessageDiv.innerHTML = '<p class="error">Fehler: Daten konnten nicht geladen werden.</p>';
       // console.error(error);
    //}
//}


function renderHistory(bundles) {
    const container = document.getElementById('history-list'); 
    if (!container) return;
    container.innerHTML = '<div class="label">Verlauf:</div>';
    const limitedBundles = bundles.slice(0, 10);
    limitedBundles.forEach(bundle => {
        const item = document.createElement('div');
        item.classList.add('history-item');

        const formattedDate = new Date(bundle.recorded_at).toLocaleString('de-DE', {
        hour: '2-digit', minute: '2-digit'
        });

        const temp_c = bundle.readings?.bme680?.temp_c.toFixed(1) ?? '--';
        const hum_pct = bundle.readings?.bme680?.hum_pct.toFixed(1) ?? '--';

        item.innerHTML = `
        <div class="history-time">
             <small class="item-meta">${formattedDate} Uhr</small>
        </div>
        <div class="history-temp">
            <span>${temp_c}°C</span>
        </div>
        <div class="history-hum">
            <span>${hum_pct}%</span>
        </div>
        <div class="label">Status:</div>
        
        <div class="history-status-gut">
            <div class="status gut">gut</div>
        </div>
        <div class="history-status-kritisch">
            <div class="status kritisch">kritisch</div>
        </div>
        <div class="history-status-schlecht">
            <div class="status schlecht">schlecht</div>
        </div> 
        `;

        getHistoryStatus(temp_c, hum_pct, item);

        container.appendChild(item);
    });
}
    const HistoryEDB_Temp_Gut_Min = 20;
    const HistoryEDB_Temp_Gut_Max = 22;
    const HistoryEDB_Temp_Kritisch_Min = 22;
    const HistoryEDB_Temp_Kritisch_Max = 26;
    const HistoryEDB_Hum_Gut_Min = 40;
    const HistoryEDB_Hum_Gut_Max = 60;
    const HistoryEDB_Hum_Kritisch_Min = 60;
    const HistoryEDB_Hum_Kritisch_Max = 65;

function getHistoryStatus(temp_c, hum_pct, item) {
    const HistoryStatusGutDiv = item.querySelector('.history-status-gut');
    const HistoryStatusKritischDiv = item.querySelector('.history-status-kritisch');
    const HistoryStatusSchlechtDiv = item.querySelector('.history-status-schlecht');


    HistoryStatusGutDiv.classList.add('invisible');
    HistoryStatusKritischDiv.classList.add('invisible');
    HistoryStatusSchlechtDiv.classList.add('invisible');

    const tempGut = temp_c >= HistoryEDB_Temp_Gut_Min && temp_c <= HistoryEDB_Temp_Gut_Max;
    const humGut = hum_pct >= HistoryEDB_Hum_Gut_Min && hum_pct <= HistoryEDB_Hum_Gut_Max;
    const tempKritisch = temp_c >= HistoryEDB_Temp_Kritisch_Min && temp_c <= HistoryEDB_Temp_Kritisch_Max;
    const humKritisch = hum_pct >= HistoryEDB_Hum_Kritisch_Min && hum_pct <= HistoryEDB_Hum_Kritisch_Max;

    if (tempGut && humGut) {
        return HistoryStatusGutDiv.classList.remove('invisible');
    }
    else if (tempKritisch && humKritisch) {
        return HistoryStatusKritischDiv.classList.remove('invisible');
    }
    else {
        return HistoryStatusSchlechtDiv.classList.remove('invisible');
    }
}
async function getBundles(serial, limit = 10) {
  // 1. Versuch: Live-API (nur wenn API_BASE gesetzt)
  if (API_BASE) {
    try {
      const response = await fetch(
        `${API_BASE}/sensors/${serial}/readings?page=1&page_size=${limit}`,
      );
      if (!response.ok) throw new Error(`API-Fehler: ${response.status}`);
      const data = await response.json();
      const items = data.items || [];

      // Erfolg: Snapshot in localStorage aktualisieren
      try {
        localStorage.setItem(snapshotKey(serial), JSON.stringify(items));
      } catch (e) {
        console.warn("Snapshot konnte nicht gespeichert werden:", e);
      }
      return items;
    } catch (error) {
      console.warn("API nicht erreichbar, nutze Snapshot:", error);
    }
  }

  // 2. Versuch: Snapshot aus localStorage
  const cached = localStorage.getItem(snapshotKey(serial));
  if (cached) {
    try {
      JSON.parse(cached);
      SnackbarWarnung()
    } catch (e) {
      console.warn("Snapshot kaputt:", e);
    }
  }

  // 3. Versuch: Initial-Seed (data.json)
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Seed nicht ladbar");
    return await response.json();
  } catch (error) {
    console.error("Auch Seed nicht ladbar:", error);
    return [];
  }
}

async function getLatestBundle(serial) {
  const bundles = await getBundles(serial, 10);
  if (bundles.length === 0) throw new Error("Keine Daten verfügbar");
  return bundles[0];
}

//Sensor-Auswahl
function onSensorChange() {
  console.log("onSensorChange wurde aufgerufen");
  currentSerial = document.getElementById("sensor-select").value;
  console.log("Ausgelesener Wert:", currentSerial);
  document.getElementById("serial-number").textContent= currentSerial;
  loadDashboard1();
}


function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

function sendWarningEmail() {
    const serialNumber = document.getElementById("serial-number").textContent;
    const temperature = document.getElementById("tem-c").textContent;
    const humidity = document.getElementById("hum-pct").textContent;

    emailjs.send("service_0eankhh", "template_3fqmuzb", {
        Sensor: serialNumber,
        Temperatur: temperature,
        Luftfeuchtigkeit: humidity,
    })
    .then(() => {
        console.log("Warn-E-Mail wurde gesendet!");
    })
    .catch((error) => {
        console.error("Fehler beim Senden der E-Mail:", error);
    });
}
async function loadDashboard1() {
  try {
    const latest = await getLatestBundle(currentSerial);
    const bme = latest.readings.bme680;

    document.getElementById("serial-number").textContent = currentSerial;
    document.getElementById("tem-c").textContent = bme.temp_c.toFixed(1) + " °C";
    document.getElementById("hum-pct").textContent = bme.hum_pct.toFixed(1) + " %";

    const bundles = await getBundles(currentSerial, 10);
    renderHistory(bundles);

    getStatus();
  } catch (error) {
    console.error(error);
  }
}
setInterval(() => {
  loadDashboard1();
}, 3600000); // 30000 ms = 30 Sekunden
// Beim Laden der Seite starten
loadDashboard1()
