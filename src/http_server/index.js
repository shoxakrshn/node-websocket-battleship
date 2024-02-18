const fs = require('fs');
const path = require('path');
const http = require('http');

const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const HTTP_PORT = 8181;

console.log(`Start static http server on the http://localhost:${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);
