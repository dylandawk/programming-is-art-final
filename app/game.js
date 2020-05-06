const { EventEmitter } = require("events");
const { v4: uuidv4 } = require("uuid");

function clamp(x, min, max){
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

let ellipseScale = 4;
let ellipseX = 200;
let ellipseY = 200;

module.exports = class Game extends EventEmitter {
    constructor(columns, rows) {
        super(); 
        this._columns = columns;
        this._rows = rows;

        // Position the player in the center of the board
        this._player = this._makePlayer(
            Math.floor(this._columns / 2),
            Math.floor(this._rows / 2),
            1,
            this._makeRandomHue()
        )
        this._connected = false;
        this._points = [];
        this._players = {};
        this._players[this._player.id] = this._player;
    }

    // Return an HSBA color (Hue, Saturation, Brighness, Alpha)
    // with a random hue
    _makeRandomHue() {
        return [
            Math.random() * 255,
            255,
            255,
            255
        ];
    }

    // Make a new player object out of a position and a color
    _makePlayer(px, py, pz, color) {
        return {
            id: uuidv4(),
            x: px,
            y: py,
            z: pz,
            color
        };
    }

    // Draw the player as a square at the appropriate position
    draw(p, cellWidth, cellHeight) {
        p.push();
        p.strokeWeight(0);
        p.colorMode(p.HSB);

        // // Draw all players
        // const playersAsArray = Object.values(this._players);
        // playersAsArray.forEach(player => {
        //     p.fill(player.color);
        //     p.rect(
        //         player.x * cellWidth,
        //         player.y * cellHeight,
        //         cellWidth,
        //         cellHeight
        //     );
        // });

        // Draw single player
        const player = this._players[this._player.id]
        let point = {
            x : player.x,
            y : player.y,
            z : player.z
        };
        this._points.push(point);
        if(this._points.length > 15){
            this._points.splice(0,1);
        }
        for(let i = 0; i < this._points.length; i ++){
            p.noStroke();
            p.fill(this._player.color);
            ellipseX += (this._points[i].x - ellipseX)*.1;
            ellipseY += (this._points[i].y - ellipseY)*.1;
            p.ellipse(
                ellipseX, 
                ellipseY,
                this._points[i].z * i * ellipseScale,
                this._points[i].z * i * ellipseScale
            );
        }

        p.pop();
    }

    _movePlayer(x, y){
        // Player to mouse position clamp on window width, height
        this._player.x = clamp(x, 0, 400);
        this._player.y = clamp(y, 0, 400);
        if(this._connected) this.emit("playerMoved", this._player);
    }

    connectPlayer(){
        this._connected = true;
    }
    disconnectPlayer(){
        this._connected = false;
    }

    scaleEllipse(event){
        //how to scale properly?
        this._player.z = clamp(this._player.z + ((event.scale -1)*0.5), 0.2, 4);
        console.log(this._player.z);
    }

    handleMouse(p){
        p.touchStarted = () => {
            this._movePlayer(p.mouseX, p.mouseY);
        } 
    }

    updatePlayers(players) {
        const myPlayerObject = {};
        myPlayerObject[this._player.id] = this._player;

        this._players = Object.assign(players, myPlayerObject);
    }
}
    