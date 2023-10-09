let position
let myMap
//Function to get coordinates from your Browers API. 
//Not Leaflet Map mention or used here. 
async function getCoordinates() {
    const position = await new Promise((resolve, reject) => {
        return navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
}
//Getting and placing information from FourSqaure
async function getFoursquare(business, limit){
    const options = {
        method: 'GET',
        headers: {
                Accept: 'application/json',
                Authorization: 'API Key',
            }
        }
    // let limit = document.getElementById('resultsNumber').innerHTML.value
	let lat = position[0]
	let lon = position[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
//Event Handler that states, when user opens [onload] the window (Browser[Google Chrome]) runs the following function. 
window.onload = async () => {
    position = await getCoordinates()
    //L.map is the first time Leaflet Map is being used. So for this Javascript code, it is a function variable and does not have global meaning beyond this section of the code. 
    myMap= L.map('map',{
        center: position,
        zoom: 12,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: '14.75'
        }).addTo(myMap)
    const marker = L.marker(position)
    marker.addTo(myMap).bindPopup('<p1><b>Your Location</b></p1>').openPopup()
}
// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
    let limit = document.getElementById('resultsNumber').value 
	//Note the getElementById refers to the ~id ="business"~ element called out in the HTML document.       
	let data = await getFoursquare(business, limit)
    data.forEach(business => {
        console.log(business)
        const marker = L.marker([business.geocodes.main.latitude, business.geocodes.main.longitude])
        marker.addTo(myMap).bindPopup(`<p1><b>${business.name}</b></p1>`).openPopup()// put marker here
     })
})