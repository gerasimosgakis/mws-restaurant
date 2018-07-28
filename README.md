## Project Overview

For the Restaurant Reviews projects, I've incrementally converted a static webpage to a mobile-ready web application. I have added a form to allow users to create their own reviews. If the app is offline, my form  defers updating to the remote database until a connection is established. Finally, I've optimized the app to meet the stricted performance specifications. WPA, accessibility and performance all get score &gt;90 from lighthouse.

### Requirements

Add a form to allow users to create their own reviews: In previous versions of the application, users could only read reviews from the database. You will need to add a form that adds new reviews to the database. The form should include the user’s name, the restaurant id, the user’s rating, and whatever comments they have. Submitting the form should update the server when the user is online.

Add functionality to defer updates until the user is connected: If the user is not online, the app should notify the user that they are not connected, and save the users' data to submit automatically when re-connected. In this case, the review should be deferred and sent to the server when connection is re-established (but the review should still be visible locally even before it gets to the server.)

Meet the new performance requirements: In addition to adding new features, the performance targets you met in Stage Two have tightened. Using Lighthouse, you’ll need to measure your site performance against the new targets.

- Progressive Web App score should be at 90 or better.
- Performance score should be at 90 or better.
- Accessibility score should be at 90 or better.

#### IMPORTANT

## 

Please access the server [here](https://github.com/gerasimosgakis/mws-restaurant-stage-2) and follow the instructions to run it. Once the server is up and running you can follow the instructions below to run this app.

#### [](https://github.com/gerasimosgakis/mws-restaurant#what-do-i-do-from-here)What do I do from here?

## 

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

In a terminal, check the version of Python you have: 

python -V. If you have Python 2.x, spin up the server with 

python -m SimpleHTTPServer 8000 (or some other port, if port 8000 is already in use.) For Python 3.x, you can use 

python3 -m http.server 8000. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

1. With your server running, visit the site: 

http://localhost:8000, and look around for a bit to see what the current experience looks like.
2. Explore the provided code, and make start making a plan to implement the required features in three areas: responsive design, accessibility and offline use.
3. Write code to implement the updates to get this site on its way to being a mobile-ready website.


