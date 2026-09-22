const tls = require('tls');

const host = 'ac-e2pautj-shard-00-00.gdg98sw.mongodb.net';
const port = 27017;

async function testTlsOptions() {
  const configs = [
    { minVersion: 'TLSv1.2', maxVersion: 'TLSv1.2' },
    { minVersion: 'TLSv1.3', maxVersion: 'TLSv1.3' },
    { servername: host },
    { servername: undefined },
    { ciphers: 'DEFAULT@SECLEVEL=1' },
  ];

  for (let i = 0; i < configs.length; i++) {
    const opt = configs[i];
    console.log(`Testing config ${i + 1}:`, opt);
    try {
      await new Promise((resolve, reject) => {
        const s = tls.connect({
          host,
          port,
          rejectUnauthorized: false,
          ...opt,
          timeout: 5000,
        }, () => {
          console.log(`  Config ${i + 1} SUCCESS! Protocol:`, s.getProtocol(), 'Cipher:', s.getCipher());
          s.end();
          resolve();
        });
        s.on('error', (e) => {
          console.log(`  Config ${i + 1} Error:`, e.message);
          resolve();
        });
        s.on('timeout', () => {
          console.log(`  Config ${i + 1} Timeout`);
          s.destroy();
          resolve();
        });
      });
    } catch (e) {
      console.log(`  Config ${i + 1} Exception:`, e.message);
    }
  }
}

testTlsOptions();
