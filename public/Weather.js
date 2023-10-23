document.addEventListener('DOMContentLoaded', function () {
    const weatherContainer = document.getElementById('weather'); 

    function formatDate(dateString) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    fetch('http://api.weatherapi.com/v1/forecast.json?key=230d01a8ef5f49449ee51349230810&q=42071&days=5&aqi=no&alerts=no')
        .then(response => response.json())
        .then(data => {
            const location = data.location.name;
            const forecastDays = data.forecast.forecastday;

            let weatherInfo = `<h2>Weather Forecast for ${location}</h2>
                               <div class="weather-scroll">`;

            forecastDays.forEach(day => {
                const formattedDate = formatDate(day.date);
                const minTempF = day.day.mintemp_f;
                const maxTempF = day.day.maxtemp_f;
                const condition = day.day.condition.text;

                weatherInfo += `
                    <div class="weather-card"> 
                        <p><strong>Date: </strong>${formattedDate}</p>
                        <p><strong>Min Temperature: </strong>${minTempF}°F</p>
                        <p><strong>Max Temperature: </strong>${maxTempF}°F</p>
                        <p><strong>Condition: </strong>${condition}</p>
                    </div>
                `;
            });

            weatherInfo += "</div>"; 

            weatherContainer.innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherContainer.innerHTML = '<p>Failed to fetch weather data</p>';
        });
});
