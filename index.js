// Creating class for all saved locations
class SavedList {
    list = [];
    nextId = 0;


    //method to add locations to saved list

    //adds location to array
    add(city,state,zipCode,temperature) {
       
        this.list.push({"city": city, "state": state, "zipCode": zipCode, "temperature": temperature, "id": this.nextId++});
        this.updateDOM();

    }
    
       
        
    updateDOM() {
        
        
       
        let savedContainer = document.getElementById("savedContainer");
        savedContainer.innerHTML = "";

        for (let area of this.list) {
            let newRow = document.createElement("tr");
            savedContainer.appendChild(newRow);
            let cityData = document.createElement("td");
            let stateData = document.createElement("td");
            let temperatureData = document.createElement("td");
            newRow.append(cityData, stateData, temperatureData);

            //updating elements
            cityData.textContent = area.city;
            stateData.textContent = area.state;
            temperatureData.textContent = area.temperature;

            //add remove button
            let removeButton = document.createElement("button");
            removeButton.textContent = "remove";
            newRow.appendChild(removeButton);

            //set unique attriburte ID for remove button
            removeButton.setAttribute("removeId", area.id);

            //add event listener
            removeButton.addEventListener("click", (event) => {
                let id = removeButton.getAttribute("removeId");
                this.remove(id);
                console.log(this.list);
                console.log(id);
            })

            //add update button

            let updateButton = document.createElement("button");
            updateButton.textContent = "update";
            newRow.appendChild(updateButton);
            updateButton.setAttribute("updateId", area.id);

            //add event listener to update button

            updateButton.addEventListener("click", (event) => {
                getWeather(area.city,area.state,area.zipCode);

            })
         }
    }

    //method to remove locations from saved list

    remove(id) {
        for (let area of this.list) {
            if (area.id == id) {
                let index = this.list.indexOf(area);
                this.list.splice(index,1);
            }
        }

        this.updateDOM();

        

        
    }


}


//API URL Information

let cityName = document.getElementById("cityInput"); //input value
let stateCode = document.getElementById("stateInput"); //input value
let zipCode = document.getElementById("zipcodeInput"); //input value
let APIKey = "b792b86c35cd0ee0fe26383381098d92";
let unitType;
let weatherDisplay = document.getElementById("weatherDisplay");




//Fetching weather data with API
function getWeather(cityName,stateCode,zipCode) {
    

    // Selecting Unit Type
    let metric = document.getElementById("metric");
    let imperial = document.getElementById("imperial");
    if(metric.checked) {
        unitType = "metric";
    } else if (imperial.checked) {
        unitType = "imperial";
}
     //Fetching Coordinates
 
     let coordinates = [];    
     fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${zipCode}&appid=${APIKey}`,{ mode: "cors" })
     .then(response => response.json())
     .then(data => {
     coordinates[0] = data[0].lat;
     coordinates[1] = data[0].lon;
     return coordinates;
     })
 
     //Using coordinates to fetch weather
     .then((coordinates) => {
         fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${APIKey}&units=${unitType}`,{ mode: "cors" })
         .then(response => response.json())
         .then((data) => {
            console.log(data);
            let temperature = document.getElementById("temperature");
            let city = document.getElementById("city");
            let state = document.getElementById("state");
            temperature.textContent = data.main.temp;
            city.textContent = cityName;
            state.textContent = stateCode;
         })
     })
     .catch(err => {
         console.error(err.message);
     }
     );
 }
 

//Add event listener to form

let form = document.getElementById("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeather(cityName.value, stateCode.value, zipCode.value);
    updateDOM();
});

let savedList = new SavedList;

//Update DOM

function updateDOM() {
    
    //select DOM Elements
    let city = document.getElementById("city");
    let state = document.getElementById("state");
    
    
    //Update DOM Elements
    city.textContent = cityName.value;
    state.textContent = stateCode.value;
    
}

//Add event listener to save button

let saveButton = document.getElementById("saveButton");
let temperature = document.getElementById("temperature");
saveButton.addEventListener("click",(event) => {
    savedList.add(cityName.value, stateCode.value, zipCode.value, temperature.textContent);
    console.log(savedList.list);
}
)

