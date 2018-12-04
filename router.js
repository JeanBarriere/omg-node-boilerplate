const requireContext = require('require-context')
const src = require('path').join(__dirname, './src')
const files = requireContext(src, false, /\.js$/)
const routeFiles = requireContext(src, false, /\.json$/)
/* list of available actions */
const actions = {}
var routes = {}

files.keys().forEach(key => {
  if (key === 'index.js') return
  actions[key.slice(0, -3)] = files(key) // slice(0, -3) to delete the extension ('.js')
})

routeFiles.keys().forEach(key => {
  if (key === 'index.js') return
  routes = { ...routes, ...files(key) }
})

/* fetchBody ensure the body arguments are there, based from the route */
const fetchBody = (route, body) => {
  return new Promise((resolve, reject) => {
    try {
      body = JSON.parse(body)
      for (let c of route.arguments) {
        if (!body[c.name] && c.required) throw new Error(`${c.name} is required`)
        if (c.type && typeof body[c.name] !== c.type) throw new Error(`${c.name} of type ${typeof body[c.name]} should be of type ${c.type}`)
      }
      resolve(body)
    } catch (err) {
      reject(err)
    }
  })
}

/* makeBody create the arguments array, based on the body */
const makeBody = (route, body) => {
  let args = []
  for (let c of route.arguments) {
    args.push(body[c.name] || undefined)
  }
  return args
}

/* call the route function with proper parameters */
const call = (route, body) => {
  return actions[route.fn].apply(undefined, makeBody(route, body))
}

/* write content to res or console for debugging */
const write = (code, res, err, headers = {}) => {
  if (code !== 200 && err) {
    console.log(err)
  }
  res.writeHead(code, headers)
  res.end(code === 200 ? err : undefined)
}

module.exports = {
  req: undefined, // request to use
  body: undefined, // body to use
  from: function (req) { this.req = req; return this }, // assign request
  with: function (body) { this.body = body; return this }, // assign body
  to: function (res) { // process to res
    if (!this.body || !this.req) { // if we're missing anything => 500 response
      write(500, res, 'Request or body not found');
      return
    }
    let route = this.req.url.substr(1)
    if (Object.keys(routes).includes(route)) { // if the route is defined
      fetchBody(routes[route], this.body).then((body) => { // clean the body based on the route
        call(routes[route], body).then((ret) => { // call the route action and get the return value
          write(200, res, ret, { 'Content-Length': Buffer.byteLength(ret), 'Content-Type': routes[route].outputType })
        }).catch((err) => { // if any error from call()
          write(400, res, err)
        })
      }).catch((err) => { // if any error from fetchBody()
        write(400, res, err)
      })
    } else {
      write(404, res, 'Action not found') // the route is not defined -> 404 response
    }
  }
}
