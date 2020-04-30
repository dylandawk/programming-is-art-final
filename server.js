// server.js

// init project
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

// Special piece for running with webpack dev server
if (process.env.NODE_ENV === "development") {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('./webpack.dev.config.js');
  const compiler = webpack(config);

  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

// listen for requests :)
const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});

const players = {};
const socketIdToPlayerId = {}; //keys socket ids: values player ids

const WebSocketServer = new WebSocket.Server({
  server: listener
});

WebSocketServer.on("connection", ws => {
  
  const wsid = uuidv4();
  
  ws.send(JSON.stringify(players));
  
  ws.on("message", (data) => {
    const player = JSON.parse(data);
    players[player.id] = player;
    socketIdToPlayerId[wsid] = player.id;

    WebSocketServer.clients.forEach(client => {
      client.send(JSON.stringify(players));
    });
  });

  ws.on("close", () => {
    const playerid = socketIdToPlayerId[wsid];
    delete players[playerid];
    delete socketIdToPlayerId[wsid];

    WebSocketServer.clients.forEach(client => {
      client.send(JSON.stringify(players));
    });
    
  });
});
