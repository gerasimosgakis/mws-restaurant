const submitButton = document.getElementById('submit')

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
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "restaurant_id": getParameterByName('id'),
            "name": document.getElementById('name').value,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "rating": 5,
            "comments": document.getElementById('comment').value
        })
    })
    .then((data) => {
        console.log('Request succeeded with JSON response', data);
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}
