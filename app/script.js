async function loadData() {
    const valuesDiv = document.getElementById('values');
    valuesDiv.classList.add('invisible');
    const errorMessageDiv = document.getElementById('message');
    errorMessageDiv.classList.remove('invisible');

            try {
                const response = await fetch('data.json');
                const bundles = await response.json();

                const data = bundles[bundles.length - 1]; 
                const bme680 = data.readings.bme680;
                document.getElementById('tem-c').textContent = bme680.temp_c + ' °C';
                document.getElementById('hum-pct').textContent = bme680.hum_pct + ' %';

                valuesDiv.classList.remove('invisible');
                errorMessageDiv.classList.add('invisible');
            } catch (error) {
                card.innerHTML = '<p class="error">Fehler: Daten konnten nicht geladen werden.</p>';
                console.error(error);
            }
    }

    window.addEventListener('DOMContentLoaded', function() {
    loadData();
});

    const StatusGutDiv = document.getElementById('status-gut');
    StatusGutDiv.classList.add('invisible');
    const StatusKritischDiv = document.getElementById('status-kritisch');
    StatusKritischDiv.classList.add('invisible');
    const StatusSchlechtDiv = document.getElementById('status-schlecht');
    StatusSchlechtDiv.classList.add('invisible');
    const errorMessageDiv = document.getElementById('message');
    errorMessageDiv.classList.remove('invisible');
    const EDB_Temp_Gut_Min = 20;
    const EDB_Temp_Gut_Max = 24;
    const EDB_Temp_Kritisch_Min = 10;
    const EDB_Temp_Kritisch_Max = 19;
    const EDB_Temp_Schlecht_Min = 25;
    const EDB_Temp_Schlecht_Max = 40;
    const EDB_Hum_Gut_Min = 30;
    const EDB_Hum_Gut_Max = 40;
    const EDB_Hum_Kritisch_Min = 10;
    const EDB_Hum_Kritisch_Max = 29;
    const EDB_Hum_Schlecht_Min = 41;
    const EDB_Hum_Schlecht_Max = 80;

        function getStatus(temp_c, hum_pct) {
            const tempGut = temp_c >= EDB_Temp_Gut_Min && tempC <= EDB_Temp_Gut_Max;
            const humGut = hum_pct >= EDB_Hum_Gut_Min && hum_pct <= EDB_Hum_Gut_Max;
            const tempKritisch = temp_c >= EDB_Temp_Kritisch_Min && temp_c <= EDB_Temp_Kritisch_Max;
            const humKritisch = hum_pct >= EDB_Hum_Kritisch_Min && hum_pct <= EDB_Hum_Kritisch_Max;
            const tempSchlecht = temp_c >= EDB_Temp_Schlecht_Min && temp_c <= EDB_Temp_Schlecht_Max;
            const humSchlecht = hum_pct >= EDB_Hum_Schlecht_Min && hum_pct <= EDB_Hum_Schlecht_Max;

            if (tempGut && humGut) return StatusGutDiv.classList.remove('invisible') ;
            else if (tempKritisch && humKritisch) return StatusKritischDiv.classList.remove('invisible');
            else if (tempSchlecht && humSchlecht) return StatusSchlechtDiv.classList.remove('invisible');
            else return 'nicht erkannt';
        }
        window.addEventListener('DOMContentLoaded', function() {
        getStatus();
})