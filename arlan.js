const lat = 47.52;
const lon = 20.00;

const apiKey = '30acf5f35276c3c031a529a1f7d3cf20';
const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&lang=ru&units=metric`;

function getWeather() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка при запросе данных: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayCurrentWeather(data);
            displayWeeklyWeather(data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            setInterval(getWeather, 600000);
        });
}

function displayCurrentWeather(data) {
    const currentWeather = data.current;

    document.getElementById('temp').textContent = `${Math.round(currentWeather.temp)}°C`;
    document.getElementById('humi').textContent = `${currentWeather.humidity} %`;
    document.getElementById('wind').textContent = `${Math.round(currentWeather.wind_speed)} м/с`;
    document.getElementById('uvi').textContent = Math.round(currentWeather.uvi);
}

function displayWeeklyWeather(data) {
    const weeklyWeather = data.daily;
    const weeklyWeatherTable = document.getElementById('weeklyWeatherTable').getElementsByTagName('tbody')[0];

    
    weeklyWeatherTable.innerHTML = '';

    weeklyWeather.forEach((day, index) => {
        if (index > 0 && index <= 7) { 
            const date = new Date(day.dt * 1000);
            const dayOfWeek = date.toLocaleDateString('ru-RU', { weekday: 'long' });

            const tempDay = `${Math.round(day.temp.day)}°C`;
            const humidity = `${day.humidity} %`;
            const windSpeed = `${Math.round(day.wind_speed)} м/с`;

            
            const row = `
                <tr>
                    <td>${dayOfWeek}</td>
                    <td>${tempDay}</td>
                    <td>${humidity}</td>
                    <td>${windSpeed}</td>
                </tr>
            `;

        
            weeklyWeatherTable.innerHTML += row;
        }
    });
}

getWeather();




async function fetchTime() {
    try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Europe/Budapest');
        const data = await response.json();
        const datetime = new Date(data.datetime);
        return datetime;
    } catch (error) {
        console.error("Ошибка при получении времени:", error);
        return null;
    }
}

function updateClock() {
    fetchTime().then(time => {
        if (time) {
            const clockElement = document.getElementById('clock');
            clockElement.innerText = time.toLocaleTimeString();
        }
    });
}


setInterval(updateClock, 1000);

updateClock();
