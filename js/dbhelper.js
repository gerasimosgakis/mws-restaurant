/**
 * Common database helper functions.
 */

class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  /*static get DATABASE_URL() {
    const port = 8000 // Change this to your server port
    return `http://localhost:${port}/data/restaurants.json`;
  }*/

  static openDatabase() {
    if (!('indexedDB' in window)) { //in case indexedDB is not supported we skip it
      console.log('No browser support for IndexedDB');
      return;
    }

    return idb.open('restaurants', 2, function(upgradeDB) {
      switch (upgradeDB.oldVersion) {
        case 0:
          // a placeholder case so that the switch block will 
          // execute when the database is first created
          // (oldVersion is 0)
        case 1:
          // Create the restaurants object store
          console.log('Creating the restaurants object store');
          upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});
        case 2:
          console.log('Creating a name index');
          let store = upgradeDB.transaction.objectStore('restaurants');
          store.createIndex('name', 'name');
        case 3:
          console.log('Creating the reviews object store');
          upgradeDB.createObjectStore('reviews', {keyPath: 'id'});
        case 4:
          console.log('Creating a restaurant id index');
          let reviewsStore = upgradeDB.transaction.objectStore('reviews');
          reviewsStore.createIndex('restaurant_id', 'restaurant_id');
      }
    });
  }

  /**
   * Create idexedDB and add the restaurants from the server
   */
  static addIndexedDb(type, items) {
    //Add the restaurants
    DBHelper.openDatabase().then(function(db) {
      let tx = db.transaction(type, 'readwrite');
      let store = tx.objectStore(type);

      return Promise.all(items.map(function(item) {
        store.add(item);
      })
      ).catch(function(error) {
        tx.abort();
        console.log(error);
      }).then(function() {
        console.log('All items added successfully');
      });
    });

  }
 /**
   * Fetch all restaurants.
   */
  // static addRestaurants() {
  //   let xhr = new XMLHttpRequest();
  //   xhr.open('GET', 'http://localhost:1337/restaurants/');
  //   xhr.onload = () => {
  //     if (xhr.status === 200) { // Got a success response from server!
  //       const json = JSON.parse(xhr.responseText);
  //       console.log('JSON FROM SERVER', json);
  //       const restaurants = json;
  //       this.addIndexedDb(restaurants);
  //     } else { // Oops!. Got an error from server.
  //       const error = (`Request failed. Returned status of ${xhr.status}`);
  //       console.log(error);
  //     }
  //   };
  //   xhr.send();
  // }

 /**
   * Fetch all restaurants.
   */
  static addRestaurants() {
    return fetch('http://localhost:1337/restaurants/')
      .then(response => {
        if (response.status === 200) { // Got a success response from server!
          response.json().then(data => {
            const restaurants = data;
            this.addIndexedDb('restaurants', restaurants);
          });
        } else { // Oops!. Got an error from server.
          const error = (`Request failed. Returned status of ${response.status}`);
          console.log(error);
        }
      })
      .catch(err => {
        console.log('Fetch Error:', err)
      });
  }

  /**
   * Fetch all reviews.
   */
  static addReviews() {
    console.log('ADD REVIEWS');
    return fetch('http://localhost:1337/reviews/')
      .then(response => {
        if (response.status === 200) { // Got a success response from server!
          response.json().then(data => {
            const reviews = data;
            console.log('rev2', reviews);
            this.addIndexedDb('reviews', reviews);
          });
        } else { // Oops!. Got an error from server.
          const error = (`Request failed. Returned status of ${response.status}`);
          console.log(error);
        }
      })
      .catch(err => {
        console.log('Fetch Error:', err)
      });
  }

  // static fetchRestaurants(callback) {
  //   DBHelper.openDatabase().then(db => {
  //     var tx = db.transaction('restaurants', 'readonly');
  //     var store = tx.objectStore('restaurants');
  //     return store.getAll();
  //     }).then(val => {
  //         console.log('Hi', val);
  //         const restaurants =  val;
  //         callback(null, restaurants);
  //   })
  // }

  /**
   * Fetch a restaurant by its ID.
   */
  // static fetchRestaurantById(id, callback) {
  //   // fetch all restaurants with proper error handling.
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       const restaurant = restaurants.find(r => r.id == id);
  //       if (restaurant) { // Got the restaurant
  //         callback(null, restaurant);
  //       } else { // Restaurant does not exist in the database
  //         callback('Restaurant does not exist', null);
  //       }
  //     }
  //   });
  // }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  // static fetchRestaurantByCuisine(cuisine, callback) {
  //   // Fetch all restaurants  with proper error handling
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       // Filter restaurants to have only given cuisine type
  //       const results = restaurants.filter(r => r.cuisine_type == cuisine);
  //       callback(null, results);
  //     }
  //   });
  // }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  // static fetchRestaurantByNeighborhood(neighborhood, callback) {
  //   // Fetch all restaurants
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       // Filter restaurants to have only given neighborhood
  //       const results = restaurants.filter(r => r.neighborhood == neighborhood);
  //       callback(null, results);
  //     }
  //   });
  // }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  // static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
  //   // Fetch all restaurants
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       let results = restaurants
  //       if (cuisine != 'all') { // filter by cuisine
  //         results = results.filter(r => r.cuisine_type == cuisine);
  //       }
  //       if (neighborhood != 'all') { // filter by neighborhood
  //         results = results.filter(r => r.neighborhood == neighborhood);
  //       }
  //       callback(null, results);
  //     }
  //   });
  // }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  // static fetchNeighborhoods(callback) {
  //   // Fetch all restaurants
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       // Get all neighborhoods from all restaurants
  //       const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
  //       // Remove duplicates from neighborhoods
  //       const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
  //       callback(null, uniqueNeighborhoods);
  //     }
  //   });
  // }

  /**
   * Fetch all cuisines with proper error handling.
   */
  // static fetchCuisines(callback) {
  //   // Fetch all restaurants
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       // Get all cuisines from all restaurants
  //       const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
  //       // Remove duplicates from cuisines
  //       const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
  //       callback(null, uniqueCuisines);
  //     }
  //   });
  // }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */

  /* I created three different functions so depending
   the screen-width I will be calling them respectively*/
  static imageUrlForRestaurantSmall(restaurant) {
    return (`/img/${restaurant.id}-400_small.jpg`);
  }

  static imageUrlForRestaurantMedium(restaurant) {
    return (`/img/${restaurant.id}-800_medium.jpg`);
  }

  static imageUrlForRestaurantLarge(restaurant) {
    return (`/img/${restaurant.id}-1600_large.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
