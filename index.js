const http = require('http')
const router = require('./router.js')

http.createServer((req, res) => {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })

  req.on('end', () => {
    router.from(req).with(body).to(res)
  })
}).listen(process.env.PORT || 5000)
