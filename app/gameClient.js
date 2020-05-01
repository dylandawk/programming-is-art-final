const { EventEmitter } = require("events");

module.exports = class GameClient extends EventEmitter {
    constructor(){
        super();
        const pageUrl = new URL(window.location);
        pageUrl.protocol = "wss";
        console.log("Attempting to listen to: " + pageUrl.toString());
        this._websocket = new WebSocket(pageUrl.toString());

        this._websocket.onopen = () => {
            this.emit("connected");
        }

        this._websocket.onmessage = (event) => {
            this.emit("players", JSON.parse(event.data));
        };
    }
    sendPlayer(player) {
        this._websocket.send(
            JSON.stringify(player)
        );
    }
}