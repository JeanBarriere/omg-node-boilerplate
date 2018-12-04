# omg-node-boilerplate
OMG boilerplate to create node-based microservices

_Warning: This repository is currently under development. Don't hesitate to help improve it by making a PR_

## Overview informations
- Dockerfile based on `node:current-alpine`
- auto-fetch actions and routes from the `src` directory
- simple usage to integrate actions fast

## How to use
Create a `routes.json` file inside the `src` directory to match your microservices actions:
```json
{
  "/action": {
    "arguments": [{
      "name": "dataName",
      "type": "string",
      "required": true
    }],
    "fn": "fnName",
    "outputType": "text/plain"
  }
}
```
> You can split the routes into different files, like `action1.json`, `action2.json`, still in the src directory

> action `types` possible values: `number|int|float|string|uuid|list|map|boolean|path|object|any`

> `outputType` can also be `application/json` if you want to return an object, other values accepted

Then create the action file based on its `fn` property name, like: `src/fnName.js`
```js
module.exports = (dataName) => {
  return new Promise(resolve => {
    setTimeout(resolve(`hello world ${dataName}`), 1500)
  })
}
```

## Usage
You can run the `omg-cli` to build your service with the command `omg build`

Run any action with `omg exec action -a dataName="!"`

In our case, it will wait for 1500ms and then return `hello world !`

[Full documentation](https://microservice.guide)

## You need an extra library ?
Don't forget to import it in your `Dockerfile` as well as your `package.json` 
```Dockerfile
FROM node:current-alpine

RUN npm install dependency
...
```
