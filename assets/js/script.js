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
            }
        });       
    }
}