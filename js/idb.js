// /*
// Copyright 2016 Google Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// */
// 'use strict';

// (function() {
//   function toArray(arr) {
//     return Array.prototype.slice.call(arr);
//   }

//   function promisifyRequest(request) {
//     return new Promise(function(resolve, reject) {
//       request.onsuccess = function() {
//         resolve(request.result);
//       };

//       request.onerror = function() {
//         reject(request.error);
//       };
//     });
//   }

//   function promisifyRequestCall(obj, method, args) {
//     var request;
//     var p = new Promise(function(resolve, reject) {
//       request = obj[method].apply(obj, args);
//       promisifyRequest(request).then(resolve, reject);
//     });

//     p.request = request;
//     return p;
//   }

//   function promisifyCursorRequestCall(obj, method, args) {
//     var p = promisifyRequestCall(obj, method, args);
//     return p.then(function(value) {
//       if (!value) return;
//       return new Cursor(value, p.request);
//     });
//   }

//   function proxyProperties(ProxyClass, targetProp, properties) {
//     properties.forEach(function(prop) {
//       Object.defineProperty(ProxyClass.prototype, prop, {
//         get: function() {
//           return this[targetProp][prop];
//         }
//       });
//     });
//   }

//   function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
//     properties.forEach(function(prop) {
//       if (!(prop in Constructor.prototype)) return;
//       ProxyClass.prototype[prop] = function() {
//         return promisifyRequestCall(this[targetProp], prop, arguments);
//       };
//     });
//   }

//   function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
//     properties.forEach(function(prop) {
//       if (!(prop in Constructor.prototype)) return;
//       ProxyClass.prototype[prop] = function() {
//         return this[targetProp][prop].apply(this[targetProp], arguments);
//       };
//     });
//   }

//   function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
//     properties.forEach(function(prop) {
//       if (!(prop in Constructor.prototype)) return;
//       ProxyClass.prototype[prop] = function() {
//         return promisifyCursorRequestCall(this[targetProp], prop, arguments);
//       };
//     });
//   }

//   function Index(index) {
//     this._index = index;
//   }

//   proxyProperties(Index, '_index', [
//     'name',
//     'keyPath',
//     'multiEntry',
//     'unique'
//   ]);

//   proxyRequestMethods(Index, '_index', IDBIndex, [
//     'get',
//     'getKey',
//     'getAll',
//     'getAllKeys',
//     'count'
//   ]);

//   proxyCursorRequestMethods(Index, '_index', IDBIndex, [
//     'openCursor',
//     'openKeyCursor'
//   ]);

//   function Cursor(cursor, request) {
//     this._cursor = cursor;
//     this._request = request;
//   }

//   proxyProperties(Cursor, '_cursor', [
//     'direction',
//     'key',
//     'primaryKey',
//     'value'
//   ]);

//   proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
//     'update',
//     'delete'
//   ]);

//   // proxy 'next' methods
//   ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
//     if (!(methodName in IDBCursor.prototype)) return;
//     Cursor.prototype[methodName] = function() {
//       var cursor = this;
//       var args = arguments;
//       return Promise.resolve().then(function() {
//         cursor._cursor[methodName].apply(cursor._cursor, args);
//         return promisifyRequest(cursor._request).then(function(value) {
//           if (!value) return;
//           return new Cursor(value, cursor._request);
//         });
//       });
//     };
//   });

//   function ObjectStore(store) {
//     this._store = store;
//   }

//   ObjectStore.prototype.createIndex = function() {
//     return new Index(this._store.createIndex.apply(this._store, arguments));
//   };

//   ObjectStore.prototype.index = function() {
//     return new Index(this._store.index.apply(this._store, arguments));
//   };

//   proxyProperties(ObjectStore, '_store', [
//     'name',
//     'keyPath',
//     'indexNames',
//     'autoIncrement'
//   ]);

//   proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
//     'put',
//     'add',
//     'delete',
//     'clear',
//     'get',
//     'getAll',
//     'getAllKeys',
//     'count'
//   ]);

//   proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
//     'openCursor',
//     'openKeyCursor'
//   ]);

//   proxyMethods(ObjectStore, '_store', IDBObjectStore, [
//     'deleteIndex'
//   ]);

//   function Transaction(idbTransaction) {
//     this._tx = idbTransaction;
//     this.complete = new Promise(function(resolve, reject) {
//       idbTransaction.oncomplete = function() {
//         resolve();
//       };
//       idbTransaction.onerror = function() {
//         reject(idbTransaction.error);
//       };
//     });
//   }

//   Transaction.prototype.objectStore = function() {
//     return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
//   };

//   proxyProperties(Transaction, '_tx', [
//     'objectStoreNames',
//     'mode'
//   ]);

//   proxyMethods(Transaction, '_tx', IDBTransaction, [
//     'abort'
//   ]);

//   function UpgradeDB(db, oldVersion, transaction) {
//     this._db = db;
//     this.oldVersion = oldVersion;
//     this.transaction = new Transaction(transaction);
//   }

//   UpgradeDB.prototype.createObjectStore = function() {
//     return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
//   };

//   proxyProperties(UpgradeDB, '_db', [
//     'name',
//     'version',
//     'objectStoreNames'
//   ]);

//   proxyMethods(UpgradeDB, '_db', IDBDatabase, [
//     'deleteObjectStore',
//     'close'
//   ]);

//   function DB(db) {
//     this._db = db;
//   }

//   DB.prototype.transaction = function() {
//     return new Transaction(this._db.transaction.apply(this._db, arguments));
//   };

//   proxyProperties(DB, '_db', [
//     'name',
//     'version',
//     'objectStoreNames'
//   ]);

//   proxyMethods(DB, '_db', IDBDatabase, [
//     'close'
//   ]);

//   // Add cursor iterators
//   // TODO: remove this once browsers do the right thing with promises
//   ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
//     [ObjectStore, Index].forEach(function(Constructor) {
//       Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
//         var args = toArray(arguments);
//         var callback = args[args.length - 1];
//         var request = (this._store || this._index)[funcName].apply(this._store, args.slice(0, -1));
//         request.onsuccess = function() {
//           callback(request.result);
//         };
//       };
//     });
//   });

//   // polyfill getAll
//   [Index, ObjectStore].forEach(function(Constructor) {
//     if (Constructor.prototype.getAll) return;
//     Constructor.prototype.getAll = function(query, count) {
//       var instance = this;
//       var items = [];

//       return new Promise(function(resolve) {
//         instance.iterateCursor(query, function(cursor) {
//           if (!cursor) {
//             resolve(items);
//             return;
//           }
//           items.push(cursor.value);

//           if (count !== undefined && items.length == count) {
//             resolve(items);
//             return;
//           }
//           cursor.continue();
//         });
//       });
//     };
//   });

//   var exp = {
//     open: function(name, version, upgradeCallback) {
//       var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
//       var request = p.request;

//       request.onupgradeneeded = function(event) {
//         if (upgradeCallback) {
//           upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
//         }
//       };

//       return p.then(function(db) {
//         return new DB(db);
//       });
//     },
//     delete: function(name) {
//       return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
//     }
//   };

//   if (typeof module !== 'undefined') {
//     module.exports = exp;
//   }
//   else {
//     self.idb = exp;
//   }
// }());

/**
 * idb by https://github.com/jakearchibald
 * LICENSE: https://github.com/jakearchibald/idb/blob/master/LICENSE
 */
'use strict';(function(){function a(q){return Array.prototype.slice.call(q)}function b(q){return new Promise(function(r,s){q.onsuccess=function(){r(q.result)},q.onerror=function(){s(q.error)}})}function c(q,r,s){var t,u=new Promise(function(v,w){t=q[r].apply(q,s),b(t).then(v,w)});return u.request=t,u}function d(q,r,s){var t=c(q,r,s);return t.then(function(u){return u?new j(u,t.request):void 0})}function e(q,r,s){s.forEach(function(t){Object.defineProperty(q.prototype,t,{get:function get(){return this[r][t]},set:function set(u){this[r][t]=u}})})}function f(q,r,s,t){t.forEach(function(u){u in s.prototype&&(q.prototype[u]=function(){return c(this[r],u,arguments)})})}function g(q,r,s,t){t.forEach(function(u){u in s.prototype&&(q.prototype[u]=function(){return this[r][u].apply(this[r],arguments)})})}function h(q,r,s,t){t.forEach(function(u){u in s.prototype&&(q.prototype[u]=function(){return d(this[r],u,arguments)})})}function i(q){this._index=q}function j(q,r){this._cursor=q,this._request=r}function k(q){this._store=q}function l(q){this._tx=q,this.complete=new Promise(function(r,s){q.oncomplete=function(){r()},q.onerror=function(){s(q.error)},q.onabort=function(){s(q.error)}})}function m(q,r,s){this._db=q,this.oldVersion=r,this.transaction=new l(s)}function n(q){this._db=q}e(i,'_index',['name','keyPath','multiEntry','unique']),f(i,'_index',IDBIndex,['get','getKey','getAll','getAllKeys','count']),h(i,'_index',IDBIndex,['openCursor','openKeyCursor']),e(j,'_cursor',['direction','key','primaryKey','value']),f(j,'_cursor',IDBCursor,['update','delete']),['advance','continue','continuePrimaryKey'].forEach(function(q){q in IDBCursor.prototype&&(j.prototype[q]=function(){var r=this,s=arguments;return Promise.resolve().then(function(){return r._cursor[q].apply(r._cursor,s),b(r._request).then(function(t){return t?new j(t,r._request):void 0})})})}),k.prototype.createIndex=function(){return new i(this._store.createIndex.apply(this._store,arguments))},k.prototype.index=function(){return new i(this._store.index.apply(this._store,arguments))},e(k,'_store',['name','keyPath','indexNames','autoIncrement']),f(k,'_store',IDBObjectStore,['put','add','delete','clear','get','getAll','getKey','getAllKeys','count']),h(k,'_store',IDBObjectStore,['openCursor','openKeyCursor']),g(k,'_store',IDBObjectStore,['deleteIndex']),l.prototype.objectStore=function(){return new k(this._tx.objectStore.apply(this._tx,arguments))},e(l,'_tx',['objectStoreNames','mode']),g(l,'_tx',IDBTransaction,['abort']),m.prototype.createObjectStore=function(){return new k(this._db.createObjectStore.apply(this._db,arguments))},e(m,'_db',['name','version','objectStoreNames']),g(m,'_db',IDBDatabase,['deleteObjectStore','close']),n.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},e(n,'_db',['name','version','objectStoreNames']),g(n,'_db',IDBDatabase,['close']),['openCursor','openKeyCursor'].forEach(function(q){[k,i].forEach(function(r){q in r.prototype&&(r.prototype[q.replace('open','iterate')]=function(){var s=a(arguments),t=s[s.length-1],u=this._store||this._index,v=u[q].apply(u,s.slice(0,-1));v.onsuccess=function(){t(v.result)}})})}),[i,k].forEach(function(q){q.prototype.getAll||(q.prototype.getAll=function(r,s){var t=this,u=[];return new Promise(function(v){t.iterateCursor(r,function(w){return w?(u.push(w.value),void 0!==s&&u.length==s?void v(u):void w.continue()):void v(u)})})})});var o={open:function open(q,r,s){var t=c(indexedDB,'open',[q,r]),u=t.request;return u&&(u.onupgradeneeded=function(v){s&&s(new m(u.result,v.oldVersion,u.transaction))}),t.then(function(v){return new n(v)})},delete:function _delete(q){return c(indexedDB,'deleteDatabase',[q])}};'undefined'==typeof module?self.idb=o:(module.exports=o,module.exports.default=module.exports)})();