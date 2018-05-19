const submitButton = document.getElementById('submit')
const rating = 0;
/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

function reviewSubmit() {
    fetch('http://localhost:1337/reviews', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "restaurant_id": parseInt(getParameterByName('id')),
            "name": document.getElementById('name').value,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "rating": this.rating,
            "comments": document.getElementById('comment').value
        })
    })
    .then((data) => {
        window.confirm("sometext");
        console.log('Request succeeded with JSON response', data);
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function select() {
    let id = event.srcElement.id;
    switch (id) {
        case 'star1':
            if (this.rating === 1 && document.getElementById('star1').className.includes('star-checked')) {
                document.getElementById('star1').className = 'fa fa-star';
                this.rating = 0;
            }
            else {
                for (let i=1; i<=5; i++){
                    document.getElementById('star'+i).className = 'fa fa-star';
                }
                document.getElementById('star1').className += ' star-checked';
                this.rating = 1;
            }
            break;
        case 'star2':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 2;
            for (let i=1; i<=2; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        case 'star3':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 3;
            for (let i=1; i<=3; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        case 'star4':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 4;
            for (let i=1; i<=4; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        case 'star5':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 5;
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        default:
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
    }
}