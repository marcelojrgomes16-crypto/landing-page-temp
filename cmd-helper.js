const http = require('http');
const { exec } = require('child_process');

const PORT = 3099;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/open-cmd') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { dir, file } = JSON.parse(body);
        const cmd = file
          ? `start cmd /k "cd /d "${dir}" && code "${file}""`
          : `start cmd /k "cd /d "${dir}""`;
        exec(cmd);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`CMD Helper rodando em http://localhost:${PORT}`);
  console.log('Abra o cerebro.html e clique em "Abrir no CMD"');
});
