var trash = document.getElementsByClassName("trash");
var fireUpSymbol = document.getElementsByClassName('fireUpSymbol')


Array.from(trash).forEach(function(element) {
  let ul = document.getElementById("thoughtBox")
  // console.log(ul)
      element.addEventListener('click', function(){
        const title = this.parentNode.childNodes[1].innerText
        const commentArea = this.parentNode.childNodes[3].innerText
        const email = this.parentNode.childNodes[5].innerText
        console.log(title)
        console.log(commentArea)
        console.log(email)
        fetch('shareYourThoughts', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'title': title,
            'commentArea': commentArea,
            'email': email
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
