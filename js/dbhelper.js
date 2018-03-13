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

  /**
   * Create idexedDB and add the restaurants from the server
   */
  static addIndexedDb(restaurants) {
    if (!('indexedDB' in window)) { //in case indexedDB is not supported we skip it
      console.log('No browser support for IndexedDB');
      return;
    }

    let dbPromise = idb.open('restaurants', 1, function(upgradeDB) {
      switch (upgradeDB.oldVersion) {
        case 0:
          // a placeholder case so that the switch block will 
          // execute when the database is first created
          // (oldVersion is 0)
        case 1:
          // Create the restaurants object store
          console.log('Creating the restaurants object store');
          upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});
      }
    });

    //Add the restaurants
    dbPromise.then(function(db) {
      let tx = db.transaction('restaurants', 'readwrite');
      let store = tx.objectStore('restaurants');

      return Promise.all(restaurants.map(function(restaurant) {
        console.log('Adding restaurant: ', restaurant);
        return store.add(restaurant);
      })
      ).catch(function(error) {
        tx.abort();
        console.log(error);
      }).then(function() {
        console.log('All restaurants added successfully');
      });
    });

    dbPromise.then(function(db) {
      var tx = db.transaction('restaurants');
      var store = tx.objectStore('restaurants');

      return store.getAll();
    }).then(function(restaurants) {
      console.log('YEah!!!',restaurants);
    });

  }

 /**
   * Fetch all restaurants.
   */
  static addRestaurants() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:1337/restaurants/');
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const restaurants = JSON.parse(xhr.responseText);
        console.log('json', restaurants);
        this.addIndexedDb(restaurants);
        //this.addRestaurants(restaurants);
        //callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  static fetchRestaurants(callback) {
    let dbPromise = idb.open('restaurants');
    return dbPromise.then(function(db) {
      var tx = db.transaction('restaurants');
      var store = tx.objectStore('restaurants');

      const restaurants = store.getAll();
      //callback(null, restaurants);
    }).then((res) => {
      return res;
    });
  }
  

  /*static searchDB(callback) {
    let dbPromise = idb.open('restaurants', 1, function(upgradeDB) {
      switch (upgradeDB.oldVersion) {
        case 0:
          // a placeholder case so that the switch block will 
          // execute when the database is first created
          // (oldVersion is 0)
        case 1:
          // Create the restaurants object store
          console.log('Creating the restaurants object store');
          upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});
      }
    });
  }*/

  //console.log(restaurants);

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

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
