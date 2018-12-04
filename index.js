const http = require('http')
const service = require('./src/index.js')
const router = require('./router.js')

http.createServer((req, res) => {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })

  req.on('end', () => {
    router.process(service.routes).from(req).with(body).to(res)
  })
}).listen(process.env.PUBSUB_PORT || 5000)
