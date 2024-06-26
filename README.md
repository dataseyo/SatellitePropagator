# Orbit Propagator

See the application [deployed here](https://satellite-propagator.vercel.app/) (in early stages of development).

## Tech Stack

This application uses Next.js with a Python backend and a Flask webserver that the frontend calls in order to numerically integrate orbits, convert orbital elements to state vectors (and vice-versa), and compute various other salient quantities in orbital mechanics. It also leverages Docker and Docker compose for local development and deployment, as well as tailwind for styling, framer motion for animating JSX elements, and typescript.

The Next.js frontend was deployed with Vercel, and the backend was deployed with an AWS EC2 Ubuntu instance.

### Client

In /client, run "npm run dev" to run the application in development mode, or "npm run build" and "npm start" in order to serve a more compact, optimized version of the application for production.

### Server

In /server, run the Flask application with python app.py.

### The Physics

I'm integrating the unperturbed restricted 2 body equations of motion in order to propagate orbits given their current state at epoch, but adding in perturbations due to the obliquity of the Earth, solar radiation, and so on is in the works.

I'm also ignoring the fact that the Earth is best represented by a Spheroid, which means that the ground tracks being drawn will often be some kilometers off from the WGS84 coordinates and are best used as a mere visualization tool rather than as a scientific one. The third edition of the "Supplement to the Astronomical Almanac" goes over the steps that would be required in order to more precisely track the SSP (satellite sub-point) by computing the height above spheroid, the geodetic latitude, and the longitude from some epoch. Most of this work involves performing the correct coordinate transformations between from PQW -> ECI -> ECEF -> geodetic (or geocentric). At the moment, the logic in this application stops in the ECI frame and ignores the actual Earth orientation parameters.

### Resourced Used

- "Fundamentals of Astrodynamics" by Bate, Mueller, White, and Saylor.
- "Analytical Mechanics of Space Systems" by Schaub.
- "Fundamentals of Astrodynamics and Applications" by Vallado.
- "Fundamentals of Celestial Mechanics" by Danby.
- "Explanatory Supplement to the Astronomical Almanac (3rd ed.)" by Urban and Seidelmann.

### To-Do

- Astrodynamics/Backend
  - Modify Keplerian element <--> state vector to use Universal Variable formulation.
  - Numerically integrate the perturbed equations of motion (with the Lagrangian bracket method) and include graphs of the functional variation in the orbital elements as a function of the perturbative terms.
  - Extract backend route logic into separate controller folders.
  - Implement orbital transfers and rendezvous.
  - Add ground track algorithm to Sat class.
  - Implement topocentric viewer.
  - Add backend api [testing](https://flask.palletsprojects.com/en/3.0.x/testing/)
- Frontend
  - Add Element/Period/etc. data for active orbit to bottom left of screen.
  - Sanitize orbit input (e.g., either allow for parabolic/hyperbolic orbits, or prevent them)
  - Add Mobile menu functionality.
  - Add react-markdown and latex parsing for /physics explanation page.
  - Add presets tab to "Add Orbit" modal which allows users to either (1) hit an API endpoint that returns TLEs of actual satellites and propagates their orbits, or (2) select from a list of common orbit categories to be added
  - Add Suspense to three.js scenes.
  - Add "delete orbit" and "clear all orbits" options.
  - Handle wide screen UI.
- Bugs
  - Investigate bug that causes ground tracks to keep drawing, but three.js to stop rendering orbits, when user's client is not open to the application.

Author: Zachary Shifrel
