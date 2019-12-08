var deleteHome = document.getElementsByClassName("deleteHome")
Array.from(deleteHome).forEach(function(element) {
  let ul = document.getElementsByClassName("homeList")
  console.log(ul)
      element.addEventListener('click', function(){
        const street = this.parentNode.childNodes[3].innerText
        const city = this.parentNode.childNodes[5].innerText
        const state = this.parentNode.childNodes[7].innerText
        const zipcode = this.parentNode.childNodes[9].innerText
        const bathrooms = this.parentNode.childNodes[11].innerText
        const bedrooms = this.parentNode.childNodes[13].innerText
        const yearBuilt = this.parentNode.childNodes[15].innerText

        // console.log(street, city, state, zipcode, bathrooms, bedrooms, yearBuilt)

        // console.log(name)
        // console.log(income)
        // console.log(collegeDegree)
        fetch('deleteFavoriteHomes', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'street': street,
            'city': city,
            'state': state,
            'zipcode': zipcode,
            'bathrooms': bathrooms,
            'bedrooms': bedrooms,
            'yearBuilt': yearBuilt

          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
