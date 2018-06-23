let restaurants,
  neighborhoods,
  cuisines;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
 document.addEventListener('DOMContentLoaded', (event) => {
   DBHelper.addRestaurants().then(() => {
     fetchNeighborhoods();
     fetchCuisines();
     console.log('test');
   });
   DBHelper.addReviews().then(() => {
    console.log('reviews added');
   });
 })

 /**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.openDatabase().then(db => {
    var tx = db.transaction('restaurants', 'readonly');
    var store = tx.objectStore('restaurants');
    return store.getAll();
  }).then(rests => {
      let neighArr = [];
      Promise.all(rests.map(rest => {
        if (neighArr.indexOf(rest.neighborhood) < 0) {
          neighArr.push(rest.neighborhood);
        }
      })
    )
    return neighArr;
  }).then(neighborhoods => {
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML();
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**￼￼￼￼￼￼
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.openDatabase().then(db => {
    var tx = db.transaction('restaurants', 'readonly');
    var store = tx.objectStore('restaurants');
    return store.getAll();
    }).then(rests => {
        let cuisineArr = [];
        Promise.all( rests.map(rest => {
          if (cuisineArr.indexOf(rest.cuisine_type) < 0) {
            cuisineArr.push(rest.cuisine_type);
          } 
        })
      )
      return cuisineArr;
  }).then(cuisines => {
    console.log(cuisines);
    self.cuisines = cuisines;
    fillCuisinesHTML();
  })
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

 /**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false,
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  const selectedRestArr = [];

  DBHelper.openDatabase().then(db => {
    var tx = db.transaction('restaurants', 'readonly');
    var store = tx.objectStore('restaurants');
    return store.openCursor();
  }).then(function showSelected(cursor) {
    if (!cursor) return;
    if (neighborhood === 'all' && cuisine === 'all') {
      selectedRestArr.push(cursor.value);
    }
    else if (neighborhood === 'all') {
      if (cursor.value.cuisine_type === cuisine) {
        selectedRestArr.push(cursor.value);
      }
    }
    else if (cuisine === 'all') {
      if (cursor.value.neighborhood === neighborhood) {
        selectedRestArr.push(cursor.value);
      }
    }
    else if (cursor.value.neighborhood === neighborhood && cursor.value.cuisine_type === cuisine) {
      selectedRestArr.push(cursor.value);
    }
    return cursor.continue().then(showSelected);
  }).then(() => {
    resetRestaurants(selectedRestArr);
    fillRestaurantsHTML();
  });
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.setAttribute('tabindex', '0');

  // When the width is less than 400 or between 750 and 100px the images are small
  if (window.innerWidth <= 400 || (window.innerWidth > 750 && window.innerWidth <= 1000)) {
    image.src = DBHelper.imageUrlForRestaurantSmall(restaurant);
  }
  else { //otherwise the images are medium
    image.src = DBHelper.imageUrlForRestaurantMedium(restaurant);
  }
  image.alt = restaurant.name + " restaurant's cover photo";
  li.append(image);

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  name.setAttribute('tabindex', '0');
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.setAttribute('tabindex', '0');
  li.append(neighborhood);
  
  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.setAttribute('tabindex', '0');
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
}