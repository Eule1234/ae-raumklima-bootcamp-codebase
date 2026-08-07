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