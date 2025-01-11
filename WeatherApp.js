const container = document.getElementById("container");
const search = document.getElementById("search");
let flag = "";
let selectedcountry=""
function getData(callback, lat,lon,flag) {
    console.log(flag)
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d23a8a0b0a51ed7d6bf6f9a72aa14503`
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
        selectedcountry = search.value;
        for (let i = 0; i < selectedcountry.length; i++) {
            if (selectedcountry[i] === " ") {
                selectedcountry = selectedcountry.replace(' ', '');
            }
        }
        // getData(renderData, selectedcountry)
        uniqeCountry(selectedcountry,getData);
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
    console.log(api)
    let lat = ""
    let lon = ""

    fetch(api)
        .then(response => {
            if(!response.ok){
                noFound();
            }
            return response.json();
        })
        .then(data => {
            lat = data[0].latlng[0]
            lon = data[0].latlng[1]
            flag = data[0].flags.svg
            console.log(codeCountry,lat,lon,flag)
            callback(renderData,lat,lon,flag);
        })
}


function renderData(data) {
    console.log(data,flag)
    const name = capitalizeFirstLetter(selectedcountry);
    const timezone = getTime(data.timezone)
    const temp = Ktocelcius(data.main.temp)
    const icon = data.weather[0].icon
    const description = data.weather[0].description
    const temp_min = Ktocelcius(data.main.temp_min)
    const temp_max = Ktocelcius(data.main.temp_max)
    const humidity = data.main.humidity
    const wind_speed = mpsToKmph(data.wind.speed)
    const wind_deg = degreeToSymbol(data.wind.deg)

    // renderTime(data.timezone)
    container.innerHTML = `
        <div id="header">
            <div id="countryName">${name}</div>
            <div id="date">${timezone}</div>
        </div>
        <div id="celcius">${temp}</div>
        <div id="status">
            <div id="i-Weather"><img src="https://openweathermap.org/img/wn/${icon}@2x.png" style="width: 100%" alt=""></div>
            <div id="d-Weather">Status: ${description}</div>
        </div>    
        <div id="box-1">
            <div id="min-temp" class="child-box1"><img src="./Assest/temp.svg" alt="">Min-Temp:<div>${temp_min}</div></div>
            <div id="max-temp" class="child-box1"><img src="./Assest/temp.svg" alt="">Max-Temp:<div>${temp_max}</div></div>
            <div id="humidity" class="child-box1"><img src="./Assest/waterDrop.svg">Humidity: ${humidity}%</div>
        </div>
        <div id="footer">
            <div id="box-2" class="child-footer">
                <div id="wind-speed" class="child-box2"><img src="./Assest/windSpeed.svg" alt="">Wind Speed: ${wind_speed}km/h</div>
                <div id="wind-deg" class="child-box2"><img src="./Assest/compass.svg">Wind direction: ${wind_deg}</div>
            </div>
            <div id="box-3" class="child-footer">
                <img src="${flag}" id="flag" alt="">
            </div>
        </div>
    `
}


function getTime(data) {
    // Chuyển số giây (data) thành giờ
    const realTime = data / 3600;

    // Lấy ngày giờ hiện tại
    const currentDate = new Date();

    // Tính toán thời gian mới
    if (realTime >= 7) {
        currentDate.setHours(currentDate.getHours() + (realTime - 7));
    } else {
        currentDate.setHours(currentDate.getHours() - (7 - realTime));
    }
    const formattedDate = `${currentDate.getDate()}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
}


function Ktocelcius(data) {
    return `${(data - 273.15).toFixed(2)}°C`
}



function noFound() {
    search.placeholder = "Not found your country, please try again"; // Use placeholder attribute
    search.focus();
}


function mpsToKmph(mps) {
    return (mps * 3.6).toFixed(1); // 1 m/s = 3.6 km/h
}

function degreeToSymbol(degree) {
    degree = degree % 360;

    if (degree < 0) {
        degree += 360;
    }

    if (degree >= 337.5 || degree < 22.5) {
        return 'N';  // Bắc
    } else if (degree >= 22.5 && degree < 67.5) {
        return 'NE'; // Đông Bắc
    } else if (degree >= 67.5 && degree < 112.5) {
        return 'E';  // Đông
    } else if (degree >= 112.5 && degree < 157.5) {
        return 'SE'; // Đông Nam
    } else if (degree >= 157.5 && degree < 202.5) {
        return 'S';  // Nam
    } else if (degree >= 202.5 && degree < 247.5) {
        return 'SW'; // Tây Nam
    } else if (degree >= 247.5 && degree < 292.5) {
        return 'W';  // Tây
    } else {
        return 'NW'; // Tây Bắc
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}