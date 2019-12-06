var trash = document.getElementsByClassName("trash");
var fireUpSymbol = document.getElementsByClassName('fireUpSymbol')


Array.from(trash).forEach(function(element) {
  let ul = document.getElementById("thoughtBox")
  console.log(ul)
      element.addEventListener('click', function(){
        const title = this.parentNode.childNodes[1].innerText
        const commentArea = this.parentNode.childNodes[3].innerText
        // const email = this.parentNode.childNodes[5].innerText
        console.log(title)
        console.log(commentArea)
        console.log(email)
        fetch('deleteShareYourThoughts', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'title': title,
            'commentArea': commentArea,
            // 'email': email
          })
        }).then(function (response) {
          // window.location.reload()
        })
      });
});

Array.from(fireUpSymbol).forEach(function(element) {
      element.addEventListener('click', function(){
        const title = this.parentNode.childNodes[1].innerText
        const commentArea = this.parentNode.childNodes[3].innerText
        const name = this.parentNode.childNodes[5].innerText
        console.log(name)
        console.log(title)
        console.log(name)

        // const fireUp = parseFloat(this.parentNode.childNodes[5].innerText)
        fetch('shareYourThoughts', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'title': title,
            'commentArea': commentArea,
            // 'email': email
            "name": name
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});
