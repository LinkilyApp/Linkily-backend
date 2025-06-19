import { AedesOptions, Client } from 'aedes';
import { Server, createServer } from 'net';

export function createAedesServer(port: number = 1883, options?: AedesOptions): Server {
    const aedes = require('aedes')(options);
    const server = createServer(aedes.handle);

    server.listen(port, () => {
        console.log(`Aedes MQTT broker is running on port ${port}`);
    });

    aedes.on('client', (client: Client) => {
        console.log(`Client connected: ${client.id}`);
    });

    aedes.on('clientDisconnect', (client: Client) => {
        console.log(`Client disconnected: ${client.id}`);
    });

    aedes.on('publish', (packet: any, client?: Client) => {
        if (client) {
            console.log(`Message from ${client.id}: ${packet.topic} - ${packet.payload.toString()}`);
        }
    });

    return server;
}