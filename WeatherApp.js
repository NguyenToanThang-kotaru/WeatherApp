const container = document.getElementById("container");
const search = document.getElementById("search");
function getData(callback, country) {
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${country}&appid=d23a8a0b0a51ed7d6bf6f9a72aa14503`
    fetch(api)
        .then(response => {
            // Check if the response is ok
            if (!response.ok) {
                noFound();
                throw new Error("Không tìm thấy thành phố");
            }
            return response.json()
        })
        .then(callback)
    
}

search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        let selectedcountry = search.value;
        for (let i = 0; i < selectedcountry.length; i++) {
            if (selectedcountry[i] === " ") {
                selectedcountry = selectedcountry.replace(' ', '');
            }
        }
        getData(renderData, selectedcountry)
        search.value = "";
        search.placeholder = "Enter country name"; // Reset placeholder
        search.blur();
    }

})
// function renderTime() {
//     let apiTime = `http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh`
//     fetch(api)
// }

function uniqeCountry(codeCountry, callback) {
    let api = `https://restcountries.com/v3.1/name/${codeCountry}`
    let key = ""
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            key = data[0].cca2;
            callback(key);
        })
}

function renderData(data) {
    console.log(data.name, data.sys.country)
    console.log(data)
    // renderTime(data.timezone)
    container.innerHTML = `
        <div id="header">
            <div id="countryName">${data.name}</div>
            <div id="date">5/1/2024 5:10</div>
        </div>
        <div id="celcius">${Ktocelcius(data.main.temp)}</div>

    `
}


function getTime(data) {
    realTime = data / 3600;
    currentDate = new Date();
    if (realTime >= 7) {
        currentDate += realTime - 7;
    }
    else {
        currentDate -= 7 - realTime;
    }
    console.log(realTime)
    console.log(currentDate)
}


function Ktocelcius(data) {
    return `${(data - 273.15).toFixed(1)}°C`
}



function noFound() {
    search.placeholder = "Not found your country, please try again"; // Use placeholder attribute
    search.focus();
}