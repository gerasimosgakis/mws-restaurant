const submitButton = document.getElementById('submit')

function reviewSubmit() {
    fetch('http://localhost:1337/reviews', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "restaurant_id": 10,
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
