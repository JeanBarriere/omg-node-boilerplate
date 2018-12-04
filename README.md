# omg-node-boilerplate
OMG boilerplate to create node-based microservices
_Warning: This repository is currently under development. Don't hesitate to help improve it by making a PR_

## Overview informations
- Dockerfile based on `node:current-alpine`
- 

## How to use
Edit the `src/index.js` file to match your microservices actions:
```js
module.exports = {
  name: 'serviceName',
  routes: {
    '/action': {
      body: [{
        name: 'dataName',
        type: 'number|int|float|string|uuid|list|map|boolean|path|object|any'
        required: true|false
      }],
      fn: 'fnName',
      outputType: 'text/plain|application/json'
    }
  }
}
```
Then create the action file based on its name, like: `src/actions/fnName.js`
```js
module.exports = () => {
  return new Promise(resolve => {
    setTimeout(resolve('hello world'), 1500)
  })
}
```

## You need an extra library ?
Don't forget to import it in your `Dockerfile` as well as your `package.json` 
```Dockerfile
FROM node:current-alpine

RUN npm install dependency
...
```

## Usage

You can run the `omg-cli` to build your service with the command `omg build`
Run any action with `omg exec action -a key:val`
[Full documentation](https://microservice.guide)
