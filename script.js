// ==========================================
// 1. HTML ELEMENTS
// ==========================================

const searchForm =
    document.querySelector("#searchForm");

const cityInput =
    document.querySelector("#cityInput");

const searchBtn =
    document.querySelector("#searchBtn");

const loading =
    document.querySelector("#loading");

const errorMessage =
    document.querySelector("#errorMessage");

const weatherCard =
    document.querySelector("#weatherCard");

const welcome =
    document.querySelector("#welcome");

const cityName =
    document.querySelector("#cityName");

const countryName =
    document.querySelector("#countryName");

const weatherEmoji =
    document.querySelector("#weatherEmoji");

const temperature =
    document.querySelector("#temperature");

const condition =
    document.querySelector("#condition");

const humidity =
    document.querySelector("#humidity");

const wind =
    document.querySelector("#wind");

const sunrise =
    document.querySelector("#sunrise");

const sunset =
    document.querySelector("#sunset");

const todayRainChance =
    document.querySelector("#todayRainChance");

const todayRainAmount =
    document.querySelector("#todayRainAmount");

const forecastList =
    document.querySelector("#forecastList");

const updatedTime =
    document.querySelector("#updatedTime");

const themeBtn =
    document.querySelector("#themeBtn");


// ==========================================
// 2. API URLS
// ==========================================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// ==========================================
// 3. WEATHER CONDITION
// ==========================================

function getWeatherCondition(code) {

    const conditions = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Fog",

        48: "Rime fog",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Dense drizzle",

        56: "Light freezing drizzle",

        57: "Dense freezing drizzle",

        61: "Slight rain",

        63: "Moderate rain",

        65: "Heavy rain",

        66: "Light freezing rain",

        67: "Heavy freezing rain",

        71: "Slight snow",

        73: "Moderate snow",

        75: "Heavy snow",

        77: "Snow grains",

        80: "Slight rain showers",

        81: "Moderate rain showers",

        82: "Heavy rain showers",

        85: "Slight snow showers",

        86: "Heavy snow showers",

        95: "Thunderstorm",

        96: "Thunderstorm with hail",

        99: "Thunderstorm with heavy hail"

    };


    return (
        conditions[code] ||
        "Unknown weather"
    );

}


// ==========================================
// 4. WEATHER EMOJI
// ==========================================

function getWeatherEmoji(code) {

    if (code === 0) {
        return "☀️";
    }


    if (
        code === 1 ||
        code === 2
    ) {
        return "🌤️";
    }


    if (code === 3) {
        return "☁️";
    }


    if (
        code === 45 ||
        code === 48
    ) {
        return "🌫️";
    }


    if (
        code >= 51 &&
        code <= 67
    ) {
        return "🌧️";
    }


    if (
        code >= 71 &&
        code <= 77
    ) {
        return "❄️";
    }


    if (
        code >= 80 &&
        code <= 82
    ) {
        return "🌦️";
    }


    if (
        code >= 85 &&
        code <= 86
    ) {
        return "🌨️";
    }


    if (code >= 95) {
        return "⛈️";
    }


    return "🌤️";

}


// ==========================================
// 5. FORMAT DATE
// ==========================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


// ==========================================
// 6. GET DAY NAME
// ==========================================

function getDayName(
    dateString,
    index
) {

    if (index === 0) {
        return "Today";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short"
        }
    );

}


// ==========================================
// 7. FORMAT TIME
// ==========================================

function formatTime(timeString) {

    if (!timeString) {
        return "--:--";
    }


    const date =
        new Date(timeString);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// 8. SHOW LOADING
// ==========================================

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

    weatherCard.classList.add(
        "hidden"
    );

    welcome.classList.add(
        "hidden"
    );


    searchBtn.disabled = true;

}


// ==========================================
// 9. HIDE LOADING
// ==========================================

function hideLoading() {

    loading.classList.add(
        "hidden"
    );

    searchBtn.disabled = false;

}


// ==========================================
// 10. SHOW ERROR
// ==========================================

function showError(message) {

    errorMessage.textContent =
        `❌ ${message}`;


    errorMessage.classList.remove(
        "hidden"
    );

    weatherCard.classList.add(
        "hidden"
    );

    welcome.classList.add(
        "hidden"
    );

}


// ==========================================
// 11. SEARCH CITY
// ==========================================

async function searchCity(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=en` +
        `&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "City search failed."
        );

    }


    const data =
        await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            "City nahi mili. Dusri city try karo."
        );

    }


    return data.results[0];

}


// ==========================================
// 12. GET WEATHER DATA
// ==========================================

async function getWeather(
    latitude,
    longitude,
    timezone
) {

    const params = new URLSearchParams({

        latitude:
            latitude,

        longitude:
            longitude,

        current:
            "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",

        daily:
            [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_probability_max",
                "precipitation_sum",
                "sunrise",
                "sunset"
            ].join(","),

        forecast_days:
            "7",

        timezone:
            timezone

    });


    const response =
        await fetch(
            `${WEATHER_API}?${params}`
        );


    if (!response.ok) {

        throw new Error(
            "Weather data load nahi ho paaya."
        );

    }


    return await response.json();

}


// ==========================================
// 13. DISPLAY CURRENT WEATHER
// ==========================================

function displayCurrentWeather(
    location,
    weatherData
) {

    const current =
        weatherData.current;

    const daily =
        weatherData.daily;


    // CITY

    cityName.textContent =
        location.name;


    // COUNTRY

    countryName.textContent =
        `${location.country}` +
        (
            location.admin1
                ? ` • ${location.admin1}`
                : ""
        );


    // TEMPERATURE

    temperature.textContent =
        `${Math.round(
            current.temperature_2m
        )}°C`;


    // CONDITION

    condition.textContent =
        getWeatherCondition(
            current.weather_code
        );


    // EMOJI

    weatherEmoji.textContent =
        getWeatherEmoji(
            current.weather_code
        );


    // HUMIDITY

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    // WIND

    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    // SUNRISE

    sunrise.textContent =
        formatTime(
            daily.sunrise[0]
        );


    // SUNSET

    sunset.textContent =
        formatTime(
            daily.sunset[0]
        );


    // TODAY RAIN PROBABILITY

    todayRainChance.textContent =
        `${daily.precipitation_probability_max[0] ?? 0}%`;


    // TODAY RAIN AMOUNT

    todayRainAmount.textContent =
        `${Number(
            daily.precipitation_sum[0] ?? 0
        ).toFixed(1)} mm`;

}


// ==========================================
// 14. DISPLAY 7 DAY FORECAST
// ==========================================

function displayForecast(
    daily
) {

    forecastList.innerHTML =
        "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const day =
            getDayName(
                daily.time[i],
                i
            );


        const date =
            formatDate(
                daily.time[i]
            );


        const emoji =
            getWeatherEmoji(
                daily.weather_code[i]
            );


        const maxTemp =
            Math.round(
                daily.temperature_2m_max[i]
            );


        const minTemp =
            Math.round(
                daily.temperature_2m_min[i]
            );


        const rainChance =
            daily
                .precipitation_probability_max[i]
                ?? 0;


        const rainAmount =
            Number(
                daily.precipitation_sum[i]
                ?? 0
            ).toFixed(1);


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "forecast-item";


        item.innerHTML = `

            <div class="forecast-day">

                <strong>
                    ${day}
                </strong>

                <span class="forecast-date">
                    ${date}
                </span>

            </div>


            <div class="forecast-weather">

                <span>
                    ${emoji}
                </span>

            </div>


            <div class="forecast-temp">

                <strong>
                    ${maxTemp}° / ${minTemp}°
                </strong>

                <span>
                    ${getWeatherCondition(
                        daily.weather_code[i]
                    )}
                </span>

            </div>


            <div class="forecast-rain">

                <strong>
                    💧 ${rainChance}%
                </strong>

                <span>
                    🌧️ ${rainAmount} mm
                </span>

            </div>

        `;


        forecastList.appendChild(
            item
        );

    }

}


// ==========================================
// 15. DISPLAY WEATHER
// ==========================================

function displayWeather(
    location,
    weatherData
) {

    displayCurrentWeather(
        location,
        weatherData
    );


    displayForecast(
        weatherData.daily
    );


    updatedTime.textContent =
        new Date().toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    weatherCard.classList.remove(
        "hidden"
    );


    welcome.classList.add(
        "hidden"
    );

}


// ==========================================
// 16. LOAD WEATHER
// ==========================================

async function loadWeather(city) {

    showLoading();


    try {

        // CITY → COORDINATES

        const location =
            await searchCity(city);


        // COORDINATES → WEATHER

        const weatherData =
            await getWeather(
                location.latitude,
                location.longitude,
                location.timezone
            );


        // WEATHER → UI

        displayWeather(
            location,
            weatherData
        );


        // SAVE LAST CITY

        localStorage.setItem(
            "lastWeatherCity",
            city
        );

    }

    catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        showError(
            error.message ||
            "Something went wrong."
        );

    }

    finally {

        hideLoading();

    }

}


// ==========================================
// 17. SEARCH FORM
// ==========================================

searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        if (city === "") {

            showError(
                "City name enter karo."
            );

            return;

        }


        loadWeather(city);

    }
);


// ==========================================
// 18. DARK MODE
// ==========================================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "weatherTheme",
            isDark
                ? "dark"
                : "light"
        );

    }
);


// ==========================================
// 19. LOAD SAVED THEME
// ==========================================

const savedTheme =
    localStorage.getItem(
        "weatherTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent =
        "☀️";

}


// ==========================================
// 20. LOAD LAST CITY
// ==========================================

const lastCity =
    localStorage.getItem(
        "lastWeatherCity"
    );


if (lastCity) {

    cityInput.value =
        lastCity;


    loadWeather(
        lastCity
    );

}

