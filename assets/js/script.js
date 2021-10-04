const API_KEY = "c449dd1cd17ade45897b4ce0f64b2a04";

$("#city-name").on("input", handleInputChanged);
$("#search-form").on("submit", handleSearch);


onLoad();

function onLoad() {
    $("#search-btn").prop("disabled", true);
    $("#search-btn").css("background-color", "grey");
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

    if(cityName.length > 0) {
        var apiCall = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + API_KEY;

        fetch(apiCall)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.cod == 404) {
                console.log(data);
            } else {
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                var call = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + API_KEY;

                // Fetch for the weather data of last 5 days
                fetch(call)
                .then(callResponse => {
                    return callResponse.json();
                })
                .then(weekData => {
                    console.log(weekData);

                    // Updated Current Weather
                    $("#top-temp").html("Temp: " + weekData.current.temp);
                    $("#top-wind").html("Wind: " + weekData.current.wind_speed);
                    $("#top-humidity").html("Humidity: " + weekData.current.humidity);
                    $("#top-uv").html("UV Index: " + weekData.current.uvi);
                });
            }
        });       
    }
}

function convertKelvinToF(input) {
    return Math.round((input - 273.15) * 9/5 + 32);
} 