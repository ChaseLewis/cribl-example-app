# HOW TO SETUP DEVELOPMENT ENVIRONMENT
Make sure you have node.js installed, have confirmed it works with v14.16 but should be compatible with most recent versions.

## SERVER SETUP
1. Open a new terminal and navigate to root
2. cd server
3. npm install (only must be done the first time)
4. npm start

## FRONTEND SETUP
1. Open a new terminal and navigate to root
2. cd frontend 
3. npm install (only must be done the first time)
4. npm run serve
5. open browser and navigate to http://localhost:8080 to view

The frontend is configured to run on http://localhost:8080 by default and will proxy all calls to the backend server on http://localhost:3000