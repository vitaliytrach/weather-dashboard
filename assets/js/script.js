const API_KEY = "c449dd1cd17ade45897b4ce0f64b2a04";

$("#city-name").on("input", handleInputChanged);
$("#search-form").on("submit", handleSearch);

var historyList = [];

onLoad();

function onLoad() {
    $("#search-btn").prop("disabled", true);
    $("#search-btn").css("background-color", "grey");

    // Updating the search history
    if(localStorage.length > 0) {
        historyList = JSON.parse(localStorage.getItem("history"));
        for(let i = 0; i < historyList.length; i++) {
            var historyItem = document.createElement("li");
            historyItem.textContent = historyList[i];
            document.getElementById("history-list").appendChild(historyItem);        
        }
    }

    document.getElementById("history-list").addEventListener("click", handleHistoryClick);
}

function handleHistoryClick(e) {
    var cityName = e.target.innerHTML;
    runApiCall(cityName);
}

function handleInputChanged(e) {
    if($("#city-name").val() === "") {
        $("#search-btn").prop("disabled", true);
        $("#search-btn").css("background-color", "grey");
    } else {
        $("#search-btn").prop("disabled", false);
        $("#search-btn").css("background-color", "var(--medium)"); 
    }
}

function handleSearch(e) {
    e.preventDefault();
    var cityName = $("#city-name").val();
    cityName = uppercaseEachWord(cityName);

    if(cityName.length > 0) {
        runApiCall(cityName);

        // Putting the search input in the history list
        var historyItem = document.createElement("li");
        historyItem.textContent = cityName;
        document.getElementById("history-list").appendChild(historyItem);
        historyList.push(cityName);
        localStorage.setItem("history", JSON.stringify(historyList));
    }
}

function runApiCall(cityName) {
    var apiCall = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + API_KEY;

    fetch(apiCall)
    .then(response => {
        return response.json();
    })
    .then(data => {
        reset();

        // Error with api response
        if(data.cod == 404) {
            $("#city-date").text("City not found, try again!");

            var historyListEl = document.getElementById("history-list");
            historyList.pop();
            localStorage.setItem("history", JSON.stringify(historyList));
            historyListEl.removeChild(historyListEl.lastChild);
        } 
        // Valid api response
        else {

            var lat = data.coord.lat;
            var lon = data.coord.lon;

            var call = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + API_KEY;

            // Fetch for the weather data of last 5 days
            fetch(call)
            .then(callResponse => {
                return callResponse.json();
            })
            .then(weekData => {

                // Updated Current Weather
                var time = moment().format("MM/DD/YY");
                $("#city-date").html(cityName + " " + time + " " + getWeatherEmoji(weekData.current.weather[0].main));
                $("#top-temp").html("Temp: " + weekData.current.temp);
                $("#top-wind").html("Wind: " + weekData.current.wind_speed);
                $("#top-humidity").html("Humidity: " + weekData.current.humidity);
                $("#top-uv").html("UV Index: " + weekData.current.uvi);

                // Creating next 5 day forcast
                var dayDate = weekData.daily;
                for(let i = 0; i < 5; i++) {
                    var dDate = moment(dayDate[i].dt, "X").format("MM/DD/YY");
                    var dTemp = dayDate[i].temp.day;
                    var dWind = dayDate[i].wind_speed;
                    var dHumidity = dayDate[i].humidity;

                    var card = document.createElement("div");
                    card.classList.add("card");

                    var dateEl = document.createElement("h2");
                    dateEl.textContent = dDate;
                    card.appendChild(dateEl);

                    var emojiEl = document.createElement("h2");
                    emojiEl.textContent = getWeatherEmoji(dayDate[i].weather[0].main);
                    card.appendChild(emojiEl);

                    var tempEl = document.createElement("h4");
                    tempEl.textContent = "Temp: " + dTemp;
                    card.appendChild(tempEl);

                    var windEl = document.createElement("h4");
                    windEl.textContent = "Wind: " + dWind;
                    card.appendChild(windEl);

                    var humidityEl = document.createElement("h4");
                    humidityEl.textContent = "Humidity: " + dHumidity;
                    humidityEl.style.marginBottom = "10px";
                    card.appendChild(humidityEl);

                    document.getElementById("cards-container").appendChild(card);
                }
            });
        }
    }); 
}

function reset() {
    $("#city-date").html("");
    $("#top-temp").html("Temp:");
    $("#top-wind").html("Wind:");
    $("#top-humidity").html("Humidity:");
    $("#top-uv").html("UV Index:");

    var cList = document.getElementById("cards-container");
    while(cList.firstChild) {
        cList.removeChild(cList.firstChild);
    }
}

function convertKelvinToF(input) {
    return Math.round((input - 273.15) * 9/5 + 32);
} 

function uppercaseEachWord(input) {
    const words = input.split(" ");
    var result = "";

    for(let i = 0; i < words.length; i++) {
        result += words[i][0].toUpperCase() + words[i].substring(1) + " ";
    }
    
    return result.substring(0, result.length - 1);
}

function getWeatherEmoji(weather) {
    if(weather === "Clouds") {
        return "☁️";
    } else if (weather === "Rain") {
        return "🌧";
    } else if (weather === "Sun") {
        return "☀️";
    } else if (weather === "Snow") {
        return "❄️";
    } else {
        return "❓";
    }
}