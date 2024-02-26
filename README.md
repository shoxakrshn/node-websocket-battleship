# node-websocket-battleship
WebSocket Battleship Server RS NodeJS2024Q1

# WebSocket Battleship
> Static http server and base task packages. 
> By default WebSocket client tries to connect to the 3000 port.

## Installation
1. Clone/download repo
2. `npm install`

## Usage
**Launch HTTP-server for Frontend:**
`npm run start:http`
* HTTP-server served @ `http://localhost:8181`


**Launch WebSocket server:**
`npm run start:ws`
* WebSocket-server served @ `ws://localhost:3000`

**Both servers (http and websocket) must be started**

---

**All commands**

Command | Description
--- | ---
`npm run build:prod` | Build the application (http and websocket servers)
`npm run start:http` | HTTP-server served @ `http://localhost:8181`
`npm run start:ws` | WebSocket-server served @ `ws://localhost:3000`

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.