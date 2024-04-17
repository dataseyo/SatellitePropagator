# Orbit Propagator

## Tech Stack

This application uses Next.js with a Python backend and a Flask webserver that the frontend calls in order to numerically integrate orbits, convert orbital elements to state vectors, and compute various other salient quantities in orbital mechanics. It also leverages Docker and Docker compose for local development and deployment, as well as tailwind for styling, framer motion for animating JSX elements, and typescript.

### Client

In /client, run "npm run dev" to run the application in development mode, or "npm run build" and "npm start" in order to serve a more compact, optimized version of the application for production. 

### Server

In /server, run the Flask application with python app.py. 

### The Physics

I'm integrating the unperturbed restricted 2 body equations of motion in order to propagate orbits given their current state at epoch, but adding in perturbations due to the obliquity of the Earth, solar radiation, and so on is in the works. 

I'm also ignoring the fact that the Earth is best represented by a Spheroid, which means that the ground tracks being drawn will be some kilometers off and are best used as a mere visualization tool rather than as a scientific one. The third edition of the "Supplement to the Astronomical Almanac" goes over the steps that would be required in order to more precisely track the SSP (satellite sub-point) by computing the true height above spheroid at which a line between the satellite and Earth's center would intersect the surface. 