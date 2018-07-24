let restaurant;
let reviews = [];
var map;
const reviewButton = document.getElementById('reviewButton');

document.addEventListener('DOMContentLoaded', (event) => {
  // DBHelper.addReviews().then(() => {
  //   console.log('reviews added');
    fetchReviewsFromURL((error, reviews) => {
      if (error) { // Got an error!
        console.error(error);
      } else {
        console.log('revvvvv', reviews);
      }
    });
  // });
  
});

window.onload = () => {
  // fetchReviewsFromURL((error, reviews) => {
  //   if (error) { // Got an error!
  //     console.error(error);
  //   } else {
  //     console.log('revvvvv', reviews);
  //   }
  // });
  // DBHelper.addReviews().then(() => {
  //   console.log('reviews added');
  //   fetchReviewsFromURL((error, reviews) => {
  //     if (error) { // Got an error!
  //       console.error(error);
  //     } else {
  //       console.log('revvvvv', reviews);
  //     }
  //   });
  // });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.openDatabase().then(db => {
      var tx = db.transaction('restaurants', 'readonly');
      var store = tx.objectStore('restaurants');
      return store.get(parseInt(id));
      }).then(restaurant => {
        self.restaurant = restaurant;
        if (!restaurant) {
          console.error(error);
          return;
        }
        fillRestaurantHTML();
        callback(null, restaurant);
      })
  }
}

/**
 * Get current reviews from page URL.
 */
fetchReviewsFromURL = (callback) => {
  if (self.reviews) { // restaurant already fetched!
    callback(null, self.reviews);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.openDatabase().then(db => {
      console.log('here');
      var tx = db.transaction('reviews', 'readonly');
      var store = tx.objectStore('reviews');
      var index = store.index('restaurant_id');
      return index.openCursor()  //get(parseInt(id));
      }).then(function show(cursor) {
        if(!cursor) {return;}
        if (cursor.key === parseInt(id)) {
          reviews.push(cursor.value);
        }
        return cursor.continue().then(show)
      }).then(() => {
        fillReviewsHTML();
        callback(null, reviews);
      })
      
      // .then(reviews => {
      //   self.reviews = reviews;
      //   if (!reviews) {
      //     console.error(error);
      //     return;
      //   }
      //   fillReviewsHTML();
      //   callback(null, reviews);
      // })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.setAttribute('tabindex', '0');

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name + " restaurant's cover photo";
  image.setAttribute('tabindex', '0');

  // If screen width is smaller than 400px the small photo is loaded
  if (window.innerWidth <= 400) {
    image.src = DBHelper.imageUrlForRestaurantSmall(restaurant);
  }
  //if the screen width is between 400 and 1600 the medium photo is more than good
  else if (window.innerWidth > 400 && window.innerWidth <= 1600) {
    image.src = DBHelper.imageUrlForRestaurantMedium(restaurant);
  }
  //other wise for really wide screens we load the large photo
  else {
    image.src = DBHelper.imageUrlForRestaurantLarge(restaurant);
  }

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.setAttribute('tabindex', '0');

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  //fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.setAttribute('tabindex', '0');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = () => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.setAttribute('tabindex', '0');

  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  if (!navigator.onLine) {
    const isOnline = document.createElement('p');
    isOnline.classList.add('offline-label');
    isOnline.innerHTML = "Offline";
    //li.classList.add('reviews-offline');
    li.appendChild(isOnline);
  }
  const name = document.createElement('p');
  name.setAttribute('tabindex', '0');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  /* Convert date to a nice format */
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  var niceDate = new Date(review.updatedAt);
  var theyear = niceDate.getFullYear();
  var themonth = monthNames[niceDate.getMonth()];
  var thetoday = niceDate.getDate();
  date.innerHTML = thetoday + ' ' + themonth + ', ' + theyear;
  date.setAttribute('tabindex', '0');
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.setAttribute('tabindex', '0');
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.setAttribute('tabindex', '0');
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('tabindex', '0');
  breadcrumb.appendChild(li);
}

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

/**
 * Open review form page with id parameter = current restaurant.
 */
openPage = function() {
  location.href = "/reviewForm.html?id="+getParameterByName('id')+"#?name="+self.restaurant.name;
}

/**
 * Select rating by clicking on the star buttons
 */
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

function reviewSubmit() {
  event.preventDefault();
  // let restaurantId = getParameterByName('id');
  // let name = document.getElementById('name').value;
  // let rating = this.rating;
  // let comments = document.getElementById('comment').value;
  // const review = [name, rating,  comments, restaurantId];

  // Add to Html
  const showReview = {
    restaurant_id: parseInt(getParameterByName('id')),
    name: document.getElementById('name').value,
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: this.rating || 0,
    comments: document.getElementById('comment').value
  }

  DBHelper.addReview(showReview);
  createReviewHTML(showReview);
  document.getElementById('reviewForm').reset();
  // Get the data points for the review
  // const name = document
  // .getElementById("name")
  // .value;
  // const rating = this.ratingTemp;
  // const comment = document
  // .getElementById("comment")
  // .value;

  // console.log("reviewName: ", name);
  // console.log('RESTTT', self.restaurant);
  // DBHelper.saveReview(id, name, rating, comment, (error, review) => {
  //     console.log("got saveReview callback");
  //     if (error) {
  //         console.log("Error saving review")
  //     }
  //     // Update the button onclick event
  //     const btn = document.getElementById("submit");
  //     btn.onclick = event => saveReview();

  //     //window.location.href = "/restaurant.html?id=" + self.restaurant.id;
  // });
  // console.log('IN Review submit');

      // fetch('http://localhost:1337/reviews', {
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     method: 'POST',
      //     body: JSON.stringify({
      //         "restaurant_id": parseInt(getParameterByName('id')),
      //         "name": document.getElementById('name').value,
      //         "createdAt": new Date(),
      //         "updatedAt": new Date(),
      //         "rating": this.rating || 0,
      //         "comments": document.getElementById('comment').value
      //     })
      // })
      // .then((data) => {
      //     // window.confirm("sometext");
      //     //console.log('Request succeeded with JSON response', data);
      //     navigator.serviceWorker.controller.postMessage({action: 'formSubmitted'});
      //     console.log(navigator.serviceWorker);
      // })
      // .then(() => {
      //     window.location.href = '/restaurant.html?id='+getParameterByName('id');
      // //     //modal.style.display = "block";
      // //     window.location.href = '/restaurant.html?id='+getParameterByName('id');
      // })
      // .catch(function (error) {
      //     console.log('Request failed', error);
      // });



  // fetch('http://localhost:1337/reviews/', {
  //     headers: {
  //                 'Content-Type': 'application/json',
  //                 'Accept': 'application/json'
  //             },
  //             method: 'POST',
  //             body: JSON.stringify({
  //                 "restaurant_id": parseInt(getParameterByName('id')),
  //                 "name": document.getElementById('name').value,
  //                 "createdAt": new Date(),
  //                 "updatedAt": new Date(),
  //                 "rating": this.rating || 0,
  //                 "comments": document.getElementById('comment').value
  //             })
  // })
  // //fetch(myRequest)
  // .then(function(response) {
  //     //return data.json();
  //     //console.log('SUBMITTED');
  //     // console.log('DATA', data.json());
  //     // DBHelper.openDatabase().then(function(db) {
  //     //     let tx = db.transaction('reviews', 'readwrite');
  //     //     let store = tx.objectStore('reviews');
  //     //     store.add(data);
  //     //     console.log('UKUKHIUKHKU');
  //         // return Promise.all(
  //         //     store.add(data)
  //         // ).catch(function(error) {
  //         //   tx.abort();
  //         //   console.log(error);
  //         // }).then(function() {
  //         //   console.log('All items added successfully');
  //         // });
  //       //});
  //     // window.confirm("sometext");
  //     console.log('Request succeeded with JSON response', response);
      
  //     //navigator.serviceWorker.controller.postMessage({action: 'formSubmitted'});
  //     console.log(navigator.serviceWorker);
  //     return response.json();
  // })
  // .then((dataJSON) => {
  //     console.log('DATA', dataJSON);
  //     DBHelper.openDatabase().then(function(db) {
  //         let tx = db.transaction('reviews', 'readwrite');
  //         let store = tx.objectStore('reviews');
  //         store.add(dataJSON);
  //         console.log('UKUKHIUKHKU');
  //     })
  // })
  // .then(() => {
  //     console.log('redirect');
  //     window.location.href = "/restaurant.html?id="+parseInt(getParameterByName('id'));
  // })
  // // .then((res) => {
  // //     //window.location.href = "/restaurant.html?id="+parseInt(getParameterByName('id'));
  // //     console.log(res);
  // //     DBHelper.addReviews().then(() => {
  // //         console.log('now called reviews');
  // //     });
  // // //     //modal.style.display = "block";
  // // //     window.location.href = '/restaurant.html?id='+getParameterByName('id');
  // // })
  // .catch(function (error) {
  //     console.log('Request failed', error);
  // });
}