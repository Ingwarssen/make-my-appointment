# make-my-appointment

# Start your DB (mongoDB)
sudo mongod

# Start server in dev mode
NODE_ENV=production node src/server.js

# Start server in prod mode
NODE_ENV=development node src/server.js
