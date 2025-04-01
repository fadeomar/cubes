class Weather {
  constructor() {
    this.location = "";
    this.daily = [];
  }

  setDate() {
    const dateElement = document.getElementById("date");
    dateElement.textContent = new Date().toDateString();
  }

  getLocation() {
    // Simulated IP-based location (replace with real API if needed)
    const res = { city: "Buenos Aires", countryCode: "AR" };
    const locationInput = document.getElementById("location");
    locationInput.value = `${res.city}, ${res.countryCode}`;
    this.location = `${res.city}, ${res.countryCode}`;
    this.fetchWeatherData();
  }

  setLocation() {
    const form = document.getElementById("f_locator");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.location = document.getElementById("location").value.trim();
      this.fetchWeatherData();
    });
  }

  async fetchWeatherData() {
    const loading = document.querySelector(".loading");
    loading.classList.remove("hidden");

    try {
      const [current, forecast] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.location}&units=metric&appid=bc1301b0b23fe6ef52032a7e5bb70820`
        ).then((res) => res.json()),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${this.location}&units=metric&appid=bc1301b0b23fe6ef52032a7e5bb70820`
        ).then((res) => res.json()),
      ]);

      this.displayCurrentWeather(current);
      this.displayForecast(forecast);
    } catch (error) {
      console.error("Weather fetch failed:", error);
    } finally {
      loading.classList.add("hidden");
    }
  }

  displayCurrentWeather(data) {
    if (!data.main) return;

    document.getElementById("temperature").textContent = `${Math.round(
      data.main.temp
    )}°`;
    document.getElementById("description").textContent =
      data.weather[0].description;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;

    const icon = this.getWeatherIcon(
      data.weather[0].id,
      data.sys.sunrise,
      data.sys.sunset
    );
    this.displayWeatherIcon("#wicon-main", icon);
  }

  displayForecast(data) {
    // Aggregate 3-hour forecast into daily data
    const dailyData = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          weatherId: item.weather[0].id,
          day: date.getDay(),
        };
      } else {
        dailyData[dayKey].minTemp = Math.min(
          dailyData[dayKey].minTemp,
          item.main.temp_min
        );
        dailyData[dayKey].maxTemp = Math.max(
          dailyData[dayKey].maxTemp,
          item.main.temp_max
        );
      }
    });

    // Take the next 4 days
    this.daily = Object.values(dailyData)
      .slice(0, 4)
      .map((day) => ({
        maxTemp: Math.round(day.maxTemp),
        minTemp: Math.round(day.minTemp),
        day: day.day,
        icon: this.getWeatherIcon(day.weatherId),
      }));

    // Display the forecast
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayElements = document.querySelectorAll(".days-box .states_block");
    dayElements.forEach((el, i) => {
      if (this.daily[i]) {
        el.querySelector(".day").textContent = days[this.daily[i].day];
        el.querySelector(
          ".d-min-temp"
        ).textContent = `${this.daily[i].minTemp}°`;
        el.querySelector(
          ".d-max-temp"
        ).textContent = `${this.daily[i].maxTemp}°`;
        el.querySelector(".wi").className = "wi"; // Reset classes
        el.querySelector(".wi").classList.add(this.daily[i].icon.name);
      }
    });
  }

  getWeatherIcon(wId, sunrise, sunset) {
    if (!wId) return { name: "na", animation: "wi-scale" };

    const icon = { name: "na", animation: "wi-scale" };

    const between = (min, max, group, animation) => {
      if (wId >= min && wId < max) {
        icon.name = group || "na";
        icon.animation = animation || "wi-scale";
      }
    };

    between(200, 300, "thunderstorm", "wi-fade");
    between(300, 400, "showers", "wi-moveY");
    between(500, 600, "rain", "wi-moveY");
    between(600, 700, "snow", "wi-moveY");
    between(700, 800, "na", "wi-fade");
    between(801, 900, "cloudy", "wi-moveX");
    between(900, 1000, "na");

    const cond = {
      200: "storm-showers",
      201: "storm-showers",
      202: "thunderstorm",
      500: "rain-mix",
      501: "rain-mix",
      502: "rain",
      511: "sleet",
      520: "rain-mix",
      521: "rain-mix",
      600: "snow",
      611: "sleet",
      701: "fog",
      741: "fog",
      905: "windy",
      906: "hail",
    };
    const neutralCond = {
      711: "smoke",
      731: "sandstorm",
      761: "dust",
      762: "volcano",
      781: "tornado",
      900: "tornado",
      902: "hurricane",
      903: "snowflake-cold",
      904: "hot",
      958: "gale-warning",
      959: "gale-warning",
      960: "storm-warning",
      961: "storm-warning",
      962: "hurricane",
    };
    const dayCond = { 721: "haze", 800: "sunny" };
    const nightCond = { 800: "clear", 701: "fog", 741: "fog" };

    icon.name = cond[wId] || neutralCond[wId] || dayCond[wId] || icon.name;

    let time = "day";
    if (sunrise && sunset) {
      const now = Date.now() / 1000;
      const srDate = new Date(sunrise * 1000);
      if (srDate.getDate() === new Date().getDate()) {
        if (now <= sunrise || now >= sunset) {
          time = nightCond[wId] ? "night" : "night-alt";
          icon.name = nightCond[wId] || icon.name;
        }
      } else {
        time = nightCond[wId] ? "night" : "night-alt";
        icon.name = nightCond[wId] || icon.name;
      }
    }

    if (icon.name !== "na" && !neutralCond[wId]) {
      icon.name = `wi-${time}-${icon.name}`;
    } else {
      icon.name = `wi-${icon.name}`;
    }

    icon.animation =
      icon.name === "wi-day-sunny" ? "wi-rotate" : icon.animation;
    return icon;
  }

  displayWeatherIcon(selector, icon) {
    if (!selector || typeof icon !== "object" || icon.name === "na") return;

    const element = document.querySelector(selector);
    element.classList.add(icon.name);
  }

  setUnit() {
    let unit = "C";
    const unitSwitch = document.getElementById("unit-switch");
    unitSwitch.addEventListener("change", (e) => {
      unit = e.target.checked ? "C" : "F";
      const tempElements = document.querySelectorAll(
        "#temperature, .d-min-temp, .d-max-temp"
      );
      tempElements.forEach((el) => {
        const temp = parseFloat(el.textContent);
        el.textContent =
          unit === "C"
            ? `${Math.round(((temp - 32) * 5) / 9)}°`
            : `${Math.round((temp * 9) / 5 + 32)}°`;
      });
    });
  }
}

// Initialize and run
const weather = new Weather();

document.addEventListener("DOMContentLoaded", () => {
  weather.setDate();
  weather.getLocation();
  weather.setLocation();
  weather.setUnit();
});
