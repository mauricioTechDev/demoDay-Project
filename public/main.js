var edit = document.getElementsByClassName("edit");
var trash = document.getElementsByClassName("trash");
// myDomuus.com
// EDIT USER INPUT FIELD
Array.from(edit).forEach(function(element) {
  element.addEventListener("click", function() {
    console.log(edit);
    const name = this.parentNode.childNodes[5].innerText
    const income = this.parentNode.childNodes[9].innerText
    const interestedInTheCityOf = this.parentNode.childNodes[13].innerText

    console.log(name, income, interestedInTheCityOf)
    fetch("updateUser", {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'name': name,
        'income': income,
        'interestedInTheCityOf': interestedInTheCityOf
      })
    }).then(function(response) {
      console.log(response);
      window.location.reload()
    });
  });
});
// DELETE A USER PROFILE
Array.from(trash).forEach(function(element) {
  let ul = document.getElementsByClassName("userInfo")
  // console.log(ul)
      element.addEventListener('click', function(){
        const name = this.parentNode.childNodes[5].innerText
        const income = this.parentNode.childNodes[9].innerText
        console.log(income)
        // const collegeDegree = this.parentNode.childNodes[13].innerText
        const interestedInTheCityOf = this.parentNode.childNodes[13].innerText
        console.log(interestedInTheCityOf)
        // console.log(name)
        // console.log(income)
        // console.log(collegeDegree)
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'income': income,
            'interestedInTheCityOf': interestedInTheCityOf
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


//  CORS proxy added in to have access to API. CORS Anywhere is a NodeJS proxy which adds CORS headers to the proxied request.
(()=>{
  fetch(`https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz17iidor3ax7_2xcn2&state=ma&city=boston&childtype=neighborhood`)
  .then(res => res.text())
  .then(res => {
    // The DOMParser interface provides the ability to parse XML or HTML source code from a string into a DOM Document
    parser = new DOMParser();
    // Once you have created a parser object, you can parse XML from a string using the parseFromString() method:
    xmlDoc = parser.parseFromString(res,"application/xml")
    console.log("zillow")
    console.log(xmlDoc)
    let choiceOfCityUserIsInnterestedIn = document.querySelector(".cityOfChoice").innerText
    var latitude;
    var longitude;
    for(let i = 0; i<=31; i++){
      if (xmlDoc.getElementsByTagName("name")[i].childNodes[0].nodeValue == choiceOfCityUserIsInnterestedIn){
        console.log(xmlDoc.getElementsByTagName("name")[i].childNodes[0].nodeValue)
        console.log(xmlDoc.getElementsByTagName("zindex")[i].childNodes[0].nodeValue)
        document.querySelector(".averageHomePrice").innerHTML = xmlDoc.getElementsByTagName("zindex")[i].childNodes[0].nodeValue
        var latitude = xmlDoc.getElementsByTagName("latitude")[i+1].childNodes[0].nodeValue
        var longitude = xmlDoc.getElementsByTagName("longitude")[i+1].childNodes[0].nodeValue
        console.log(longitude)
        console.log(latitude)
        // reversegeocoding
        fetch(`https://cors-anywhere.herokuapp.com/https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${tileAPIkey}`)
        .then(res => res.json())
        .then(res => {
          console.log("getting exact address")
          let addressOfExampleHome = res.features[0].place_name
          let arrayOfAddressExample = addressOfExampleHome.split(',')
          console.log(arrayOfAddressExample)
          let address = arrayOfAddressExample.splice(0,1)
          let city = arrayOfAddressExample.splice(0,1)
          let state = (arrayOfAddressExample.splice(0,1))
          // document.querySelector('#rawAddress').textContent = rawAddress
        fetch(`https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz17iidor3ax7_2xcn2&address=${address}&citystatezip=${city}${state}`)
          // SAVE THIS INFO TO THE DATABASE SO I CAN GET IT ON ANOTHER PAGE OR EVEN ON THE SAME PAGE ;>/
          .then(res => res.text())
          .then(res => {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(res,"application/xml")
            console.log("house INFO")
            console.log("zillow")
            console.log(xmlDoc)
            console.log(xmlDoc.getElementsByTagName("street")[0].childNodes[0].nodeValue)
            console.log(xmlDoc.getElementsByTagName("zipcode")[0].childNodes[0].nodeValue)
            console.log(xmlDoc.getElementsByTagName("city")[0].childNodes[0].nodeValue)
            console.log(xmlDoc.getElementsByTagName("state")[0].childNodes[0].nodeValue)
            console.log(xmlDoc.getElementsByTagName("yearBuilt")[0].childNodes[0].nodeValue)
            console.log(xmlDoc.getElementsByTagName("bathrooms")[0].childNodes[0].nodeValue)
            console.log(xmlDoc.getElementsByTagName("bedrooms")[0].childNodes[0].nodeValue)


          })
        })
      }
    }
    // .catch(err => {
    //     console.log(`error ${err}`)
    //     alert("sorry, there are no results for your search")
    // });
  })
})()






// =============================================
//                   LEAFLET
// =============================================

// GEOLOCATION OF THE USER
if ("geolocation" in navigator) {
  console.log("geolocation available")
  navigator.geolocation.getCurrentPosition(position => {
  console.log(position);
  const currentUserLat = position.coords.latitude
  const currentUserLon = position.coords.longitude
  const userCordinates ={currentUserLat, currentUserLon}
  const options = {
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userCordinates)
  };
  fetch('/userCordinatesApi', options)
  .then(res => res.json())
  .then(res => {
    console.log(res)
    // MARKS USERS CURRENT LOCATION
    const marker = L.marker([res.latitude, res.longitude]).addTo(mymap);
    const markerPopUp = marker.bindPopup(`This is your current Location!`,{"width": "600"})
  });
});
} else {
  console.log("geolocation not available")
}
// STARTING LOCATION FOR MAP AND ZOOM
const mymap = L.map('mapid').setView([42.357, -71.038], 12);

// MAP TILE LAYERS
let tileAPIkey = "pk.eyJ1IjoibWF1cmljaW90ZWNoZGV2IiwiYSI6ImNrM2VuZDFqODAwMXEzbXFqZm5xdDFlNjgifQ.UJHQD2CDzYEEiB7CVxZulg"
L.tileLayer(`https://api.mapbox.com/styles/v1/mauriciotechdev/ck3fgsovo23vj1cunzfdsjj3a/tiles/256/{z}/{x}/{y}@2x?access_token=${tileAPIkey}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

// IIFE City and Town boundaries from MassGIS(Bureau of GeographicInformation)
const cityBoundaries = (()=>{
  fetch(`https://opendata.arcgis.com/datasets/3525b0ee6e6b427f9aab5d0a1d0a1a28_0.geojson`)
  .then(res => res.json())
  .then(res => {
    const maBoundaryData = res
    L.geoJSON(maBoundaryData).addTo(mymap);
  })
})()
// Census Tract 203.03, Suffolk, MA
const  westEndMarker = L.marker([42.364316,-71.063739]).addTo(mymap);
const westEndMarkerPopUp = westEndMarker.bindPopup(`<iframe id="cr-embed-14000US25025020303-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025020303&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>  <iframe id="cr-embed-14000US25025020303-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025020303&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 203.01, Suffolk, MA
const  westEndMarkerTwo = L.marker([42.361780,-71.069744]).addTo(mymap);
const westEndMarkerPopUpTwo = westEndMarkerTwo.bindPopup(`<iframe id="cr-embed-14000US25025020301-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025020301&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>  <iframe id="cr-embed-14000US25025020301-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025020301&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 606, Suffolk, MA
const  seaportMarker = L.marker([42.351701,-71.043670]).addTo(mymap);
const seaportMarkerPopUp = seaportMarker.bindPopup(`<iframe id="cr-embed-14000US25025060600-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025060600&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>      <iframe id="cr-embed-14000US25025060600-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025060600&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 601.01, Suffolk, MA
  const  southBostonCityPointMarker = L.marker([42.335526,-71.025422]).addTo(mymap);
  const southBostonCityPointMarkerPopUp = southBostonCityPointMarker.bindPopup(`<iframe id="cr-embed-14000US25025060101-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025060101&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>       <iframe id="cr-embed-14000US25025060101-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025060101&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 604, Suffolk, MA
    const  dorchesterHeightsMarker = L.marker([42.33296717834766,-71.04480473312037]).addTo(mymap);
    const dorchesterHeightsMarkerPopUp = dorchesterHeightsMarker.bindPopup(`<iframe id="cr-embed-14000US25025060400-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025060400&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025060400-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025060400&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 305, Suffolk, MA
      const  northEndMarker = L.marker([42.36678190648063,-71.05244349675672]).addTo(mymap);
      const northEndMarkerPopUp = northEndMarker.bindPopup(`<iframe id="cr-embed-14000US25025030500-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025030500&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025030500-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025030500&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 303, Suffolk, MA
      const  governmentCenterMarker = L.marker([42.36044330158236,-71.05803481290536]).addTo(mymap);
      const governmentCenterMarkerPopUp = governmentCenterMarker.bindPopup(`<iframe id="cr-embed-14000US25025030300-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025030300&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025030300-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025030300&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 201.01, Suffolk, MA
      const  beaconHillMarker= L.marker([42.35794860925813,-71.06829878861504]).addTo(mymap);
      const beaconHillMarkerPopUp = beaconHillMarker.bindPopup(`<iframe id="cr-embed-14000US25025020101-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025020101&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>      <iframe id="cr-embed-14000US25025020101-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025020101&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 107.02, Suffolk, MA
      const  backBayMarker = L.marker([42.353217848667995,-71.07648086721497]).addTo(mymap);
      const backBayMarkerPopUp = backBayMarker.bindPopup(`<iframe id="cr-embed-14000US25025010702-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025010702&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025010702-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025010702&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 705, Suffolk, MA
      const  southEndTremontMarker = L.marker([42.34357349152857,-71.06968993308442]).addTo(mymap);
      const southEndTremontMarkerPopUp = southEndTremontMarker.bindPopup(`<iframe id="cr-embed-14000US25025070500-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025070500&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025070500-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025070500&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 711.01, Suffolk, MA
      const  buMedicalCampusMarker = L.marker([42.33526787304622,-71.07237415375607]).addTo(mymap);
      const buMedicalCampusMarkerPopUp = buMedicalCampusMarker.bindPopup(`<iframe id="cr-embed-14000US25025071101-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025071101&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>  <iframe id="cr-embed-14000US25025071101-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025071101&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 102.03, Suffolk, MA
      const  fenwayParkMarker = L.marker([42.34590731312637,-71.09797349187033]).addTo(mymap);
      const fenwayParkMarkerPopUp = fenwayParkMarker.bindPopup(`<iframe id="cr-embed-14000US25025010203-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025010203&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025010203-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025010203&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 810.01, Suffolk, MA
      const  longwoodMedicalCanterMarker = L.marker([42.3404780953926,-71.1050327307214]).addTo(mymap);
      const longwoodMedicalCanterMarkerPopUp = longwoodMedicalCanterMarker.bindPopup(`<iframe id="cr-embed-14000US25025010300-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025010300&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025010300-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025010300&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 8.02, Suffolk, MA
      const  allstonMarker = L.marker([42.357361495488284,-71.13208314391272]).addTo(mymap);
      const allstonMarkerPopUp = allstonMarker.bindPopup(`<iframe id="cr-embed-14000US25025000802-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025000802&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025000802-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025000802&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1, Suffolk, MA
      const  northBrightonMarker = L.marker([42.35959781277908,-71.14430127652781]).addTo(mymap);
      const northBrightonMarkerPopUp = northBrightonMarker.bindPopup(`<iframe id="cr-embed-14000US25025000100-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025000100&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025000100-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025000100&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 3.01, Suffolk, MA

      const  birghtonMarker = L.marker([42.351670190274476,-71.17034200566309]).addTo(mymap);
      const birghtonMarkerPopUp = birghtonMarker.bindPopup(`<iframe id="cr-embed-14000US25025000301-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025000301&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025000301-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025000301&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 804.01, Suffolk, MA
      const  roxburyCorssingMarker = L.marker([42.33214790227547,-71.08239689829247]).addTo(mymap);
      const roxburyCorssingMarkerPopUp = roxburyCorssingMarker.bindPopup(`<iframe id="cr-embed-14000US25025080401-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025080401&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025080401-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025080401&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
      //Census Tract 821, Suffolk, MA
      const  franklinParkMarker = L.marker([42.31058301518217,-71.0864106564452]).addTo(mymap);
      const franklinParkMarkerPopUp = franklinParkMarker.bindPopup(`<iframe id="cr-embed-14000US25025082100-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025082100&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>  <iframe id="cr-embed-14000US25025082100-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025082100&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 811, Suffolk, MA
      const  newEnglandBabtistHospitalMarker = L.marker([42.32919737901697,-71.1020523774107]).addTo(mymap);
      const newEnglandBabtistHospitalMarkerPopUp = newEnglandBabtistHospitalMarker.bindPopup(`<iframe id="cr-embed-14000US25025081100-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025081100&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025081100-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025081100&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1204, Suffolk, MA
      const  greenStreetStationMarker = L.marker([42.3113600511055,-71.1089441458364]).addTo(mymap);
      const greenStreetStationMarkerPopUp = greenStreetStationMarker.bindPopup(`<iframe id="cr-embed-14000US25025120400-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025120400&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025120400-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025120400&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1201.05, Suffolk, MA
      const  jamaicaPondMarker = L.marker([42.30944075000121,-71.12623802373605]).addTo(mymap);
      const jamaicaPondMarkerPopUp = jamaicaPondMarker.bindPopup(`<iframe id="cr-embed-14000US25025120105-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025120105&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025120105-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025120105&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1105.02, Suffolk, MA
      const  rosindaleVillageMarker = L.marker([42.284612530577505,-71.12729670001613]).addTo(mymap);
      const rosindaleVillageMarkerPopUp = rosindaleVillageMarker.bindPopup(`<iframe id="cr-embed-14000US25025110502-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025110502&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025110502-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025110502&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1303, Suffolk, MA
      const  westRoxburyMarker = L.marker([42.279874268653515,-71.14524336053478]).addTo(mymap);
      const westRoxburyMarkerPopUp = westRoxburyMarker.bindPopup(`<iframe id="cr-embed-14000US25025130300-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025130300&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025130300-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025130300&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)

      const  westRoxburyCrushedStoneQuarryMarker = L.marker([42.27042471080535,-71.1656536300336]).addTo(mymap);
      const westRoxburyCrushedStoneQuarryMarkerPopUp = westRoxburyCrushedStoneQuarryMarker.bindPopup(`<iframe id="cr-embed-14000US25025130402-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025130402&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025130402-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025130402&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1403, Suffolk, MA
      const  hydeParkMarker = L.marker([42.254522069713715,-71.12553746426897]).addTo(mymap);
      const hydeParkMarkerPopUp = hydeParkMarker.bindPopup(`<iframe id="cr-embed-14000US25025140300-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025140300&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025140300-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025140300&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)

      const  readvilleMarker = L.marker([42.23552730219132,-71.1307962703188]).addTo(mymap);
      const readvilleMarkerPopUp = readvilleMarker.bindPopup(`<iframe id="cr-embed-14000US25025140201-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025140201&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025140201-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025140201&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)

      const  oaklawnCemetaryMarker = L.marker([42.27066601577623,-71.112135639288]).addTo(mymap);
      const oaklawnCemetaryMarkerPopUp = oaklawnCemetaryMarker.bindPopup(`<iframe id="cr-embed-14000US25025140400-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025140400&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025140400-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025140400&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1010.02, Suffolk, MA
      const  mattapanMarker = L.marker([42.27380026044294,-71.08562133262353]).addTo(mymap);
      const wmattapanMarkerPopUp = mattapanMarker.bindPopup(`<iframe id="cr-embed-14000US25025101002-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025101002&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025101002-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025101002&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1011.01, Suffolk, MA
      const  wellingtonHillMarker = L.marker([42.28222623564642,-71.09502834255295]).addTo(mymap);
      const wellingtonHillMarkerPopUp = wellingtonHillMarker.bindPopup(`<iframe id="cr-embed-14000US25025101101-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025101101&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025101101-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025101101&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1008, Suffolk, MA
      const  dorchesterParkMarker = L.marker([42.28219166357973,-71.05809155838982]).addTo(mymap);
      const dorchesterParkMarkerPopUp = dorchesterParkMarker.bindPopup(`<iframe id="cr-embed-14000US25025100800-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025100800&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025100800-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025100800&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 1004, Suffolk, MA
      const  ashmontDorchesterMarker = L.marker([42.283588111929504,-71.06874395149246]).addTo(mymap);
      const ashmontDorchesterMarkerPopUp = ashmontDorchesterMarker.bindPopup(`<iframe id="cr-embed-14000US25025100400-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025100400&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025100400-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025100400&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 903, Suffolk, MA
      const  groveHallDorchesterMarker = L.marker([42.3110482089482,-71.07528703274622]).addTo(mymap);
      const groveHallDorchesterMarkerPopUp = groveHallDorchesterMarker.bindPopup(`<iframe id="cr-embed-14000US25025090300-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025090300&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025090300-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025090300&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)

      const  fieldsCornerMarker = L.marker([42.29838577788378,-71.0561300254096]).addTo(mymap);
      const fieldsCornerMarkerPopUp = fieldsCornerMarker.bindPopup(`<iframe id="cr-embed-14000US25025092101-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025092101&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025092101-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025092101&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)

      const  savinHillMarker = L.marker([42.311986891936584,-71.05383480886414]).addTo(mymap);
      const savinHillMarkerPopUp = savinHillMarker.bindPopup(`<iframe id="cr-embed-14000US25025091001-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025091001&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025091001-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025091001&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 512, Suffolk, MA
      const  jeffriesPointMarker = L.marker([42.36500097836774,-71.03279120276167]).addTo(mymap);
      const jeffriesPointMarkerPopUp = jeffriesPointMarker.bindPopup(`<iframe id="cr-embed-14000US25025051200-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025051200&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025051200-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025051200&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 503, Suffolk, MA
      const  eastBostonMarker = L.marker([42.37448860561617,-71.04000533918335]).addTo(mymap);
      const eastBostonMarkerPopUp = eastBostonMarker.bindPopup(`<iframe id="cr-embed-14000US25025050300-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025050300&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025050300-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025050300&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)

      const  orientHightsMarker = L.marker([42.387490088420286,-71.00567239324047]).addTo(mymap);
      const orientHightsMarkerPopUp = orientHightsMarker.bindPopup(`<iframe id="cr-embed-14000US25025051101-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025051101&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>    <iframe id="cr-embed-14000US25025051101-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025051101&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
// Census Tract 408.01, Suffolk, MA
      const  charlestownMarker = L.marker([42.377319852859955,-71.05029932210638]).addTo(mymap);
      const charlestownMarkerPopUp = charlestownMarker.bindPopup(`<iframe id="cr-embed-14000US25025040801-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025040801&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>   <iframe id="cr-embed-14000US25025040801-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025040801&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)
//Census Tract 406, Suffolk, MA
      const  bunkerHillMarker = L.marker([42.38278916580383,-71.07008547509506]).addTo(mymap);
      const bunkerHillMarkerPopUp = bunkerHillMarker.bindPopup(`<iframe id="cr-embed-14000US25025040600-economics-income-household_distribution" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025040600&chartDataID=economics-income-household_distribution&dataYear=2017&releaseID=ACS_2017_5-year&chartType=histogram&chartHeight=200&chartQualifier=&chartTitle=Household+income&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="259" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>     <iframe id="cr-embed-14000US25025040600-demographics-race" class="census-reporter-embed" src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/iframe.html?geoID=14000US25025040600&chartDataID=demographics-race&dataYear=2017&releaseID=ACS_2017_5-year&chartType=column&chartHeight=200&chartQualifier=Hispanic+includes+respondents+of+any+race.+Other+categories+are+non-Hispanic.&chartTitle=&initialSort=&statType=scaled-percentage" frameborder="0" width="100%" height="509" style="margin: 1em; max-width: 720px;"></iframe>
<script src="https://s3.amazonaws.com/embed.censusreporter.org/1.0/js/embed.chart.make.js"></script>`)

      // const  westEndMarkerTwo = L.marker([42.361780,-71.069744]).addTo(mymap);
      // const westEndMarkerPopUpTWO = westEndMarkerTwo.bindPopup()





// 42.361780,-71.069744


//
// var popup = L.popup();
// function onMapClick(e) {
//   console.log(e.latlng)
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(mymap);
// }
//
// mymap.on('click', onMapClick);




    var circle = L.circle([42.357, -71.07000], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);
