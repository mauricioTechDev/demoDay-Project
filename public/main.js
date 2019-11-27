var edit = document.getElementsByClassName("edit");
var trash = document.getElementsByClassName("trash");

// EDIT USER INPUT FIELD
Array.from(edit).forEach(function(element) {
  element.addEventListener("click", function() {
    console.log(edit);
    const name = this.parentNode.childNodes[5].innerText
    const income = this.parentNode.childNodes[9].innerText
    const collegeDegree = this.parentNode.childNodes[13].innerText
    const race = this.parentNode.childNodes[17].innerText

    console.log(name, income, collegeDegree, race)
    fetch("updateUser", {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'name': name,
        'income': income,
        'collegeDegree': collegeDegree,
        'race': race
      })
    }).then(function(response) {
      console.log(response);
      // window.location.reload()
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
        const collegeDegree = this.parentNode.childNodes[13].innerText
        const race = this.parentNode.childNodes[17].innerText
        // console.log(name)
        // console.log(income)
        // console.log(collegeDegree)
        // console.log(race)
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'income': income,
            'collegeDegree': collegeDegree,
            'race': race
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

// GEOLOCATION INFO
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
    const marker = L.marker([res.latitude, res.longitude]).addTo(mymap);
    const markerPopUp = marker.bindPopup('<a href="http://www.google.com">Visit Google</a>"')
  });
});
} else {
  console.log("geolocation not available")
}

// LEAFLET MAP AREA
// This sets the staring location for the map and lat and lon  zoom level
const mymap = L.map('mapid').setView([42.404142199999995 , -71.0383346], 15);
// const marker = L.marker([42.404142199999995, -71.0383346]).addTo(mymap);
// const markerPopUp = marker.bindPopup('<a href="http://www.google.com">Visit Google</a>"')



    var circle = L.circle([42.357, -71.07000], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);




// TILE LAYERS
L.tileLayer('https://api.mapbox.com/styles/v1/mauriciotechdev/ck3fgsovo23vj1cunzfdsjj3a/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWF1cmljaW90ZWNoZGV2IiwiYSI6ImNrM2VuZDFqODAwMXEzbXFqZm5xdDFlNjgifQ.UJHQD2CDzYEEiB7CVxZulg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);






// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = this.parentNode.parentNode.childNodes[5].innerText
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'income': name,
//             'collegeDegree': msg,
//             '':"PAID!"
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });
