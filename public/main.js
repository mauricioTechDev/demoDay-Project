var edit = document.getElementsByClassName("edit");
var trash = document.getElementsByClassName("trash");


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
