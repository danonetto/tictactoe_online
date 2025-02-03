const WebSocket = require('ws');
let p1 = 0;
let p2 = 0;
let current_player = 1;
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', socket => {
    if (p1 === 0) {
        socket.id = 1;
        socket.send(JSON.stringify({ id: 1, cp: current_player }));
        p1 = 1;
    } else if (p2 === 0) {
        socket.id = 2;
        socket.send(JSON.stringify({ id: 2, cp: current_player }));
        p2 = 1;
    } else {
        socket.id = 3;
        socket.send(JSON.stringify({ id: 3, cp: current_player }));
    }

    console.log(`Player ${socket.id} csatlakozott`);

    socket.on('message', message => {
        let data = JSON.parse(message);
        if (socket.id !== current_player) return;
        current_player = current_player === 1 ? 2 : 1;
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ cp: current_player, indexa: data.index1, indexb: data.index2 }));
            }
        });
        
        
    });

    socket.on("close", () => {
        console.log(`Player ${socket.id} lecsatlakozott`);
        if (socket.id === 1) p1 = 0;
        if (socket.id === 2) p2 = 0;
    });
});
