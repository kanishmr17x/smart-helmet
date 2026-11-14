const clients = new Set();

export function registerClient(ws) {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
}

export function broadcast(event, payload) {
    const message = JSON.stringify({
        type: event,
        payload,
        timestamp: new Date().toISOString(),
    });

    for (const client of clients) {
        if (client.readyState === 1) {
            client.send(message);
        }
    }
}

export function clientCount() {
    return clients.size;
}
