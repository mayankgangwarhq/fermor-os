const net = require('net');
const tls = require('tls');

const host = 'ac-e2pautj-shard-00-00.gdg98sw.mongodb.net';
const port = 27017;

console.log(`Testing TCP connection to ${host}:${port}...`);
const socket = net.createConnection(port, host, () => {
  console.log('TCP Connected successfully!');
  
  console.log('Testing TLS handshake...');
  const secureSocket = tls.connect({
    socket: socket,
    servername: host,
    rejectUnauthorized: false
  }, () => {
    console.log('TLS Handshake SUCCESSFUL! Protocol:', secureSocket.getProtocol());
    secureSocket.end();
  });

  secureSocket.on('error', (err) => {
    console.log('TLS Error:', err.message);
  });
});

socket.on('error', (err) => {
  console.log('TCP Socket Error:', err.message);
});
