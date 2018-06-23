/**
 * Common database helper functions.
 */

 class DBHelper {
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
          console.log('Create a name index');
          let store = upgradeDB.transaction.objectStore('restaurants');
          store.createIndex('name', 'name');
        case 3:
          console.log('Creating the reviews object store');
          upgradeDB.createObjectStore('reviews', {keyPath: 'id'});
        case 4:
          console.log('Creating a restaurant id index');
          let reviewStore = upgradeDB.transaction.objectStore('reviews');
          reviewStore.createIndex('restaurant_id', 'restaurant_id');
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
        //console.log('Adding item: ', item);
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
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static addRestaurants() {
    return fetch('http://localhost:1337/restaurants/')
      .then(response => {
        if(response.status === 200) { // Got a success response from server!
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
        console.log('Fetch Error:', err);
      });
  }

  /**
   * Fetch all reviews.
   */
  static addReviews() {
    return fetch('http://localhost:1337/reviews/')
      .then(response => {
        if (response.status === 200) { // Got a success response from server!
          response.json().then(data => {
            const reviews = data;
            this.addIndexedDb('reviews', reviews);
          });
        } else { // Oops!. Got an error from server.
          const error = (`Request failed. Returned status of ${response.status}`);
          console.log(error);
        }
      })
      .catch(err => {
        console.log('Fetch Error:', err);
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