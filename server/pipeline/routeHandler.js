const routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} }

function routeHandler(req, res, next) {
  const method = req.method
  const route = req.pathname

  if (!routes[method][route]) {
    next()
    return false
  }

  console.log({ method }, { route })
  routes[method][route](req, res, next)
  next()
}

function get(route, handler) {
  routes["GET"][route] = handler
}
function post(route, handler) {
  routes["POST"][route] = handler
}
function put(route, handler) {
  routes["PUT"][route] = handler
}
function delete_(route, handler) {
  routes["DELETE"][route] = handler
}

const router = Object.freeze({
  get,
  post,
  put,
  delete: delete_,
})

module.exports = {
  routeHandler,
  router,
}
