const routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} }

function matchRoute(req) {
  const method = req.method
  const pathname = req.pathname
  let matchingRoute = null
  const params = {}
  Object.keys(routes[method]).forEach((route) => {
    if (matchingRoute) return
    if (route === pathname) matchingRoute = route
    const routeFrags = route.split("/").filter((fragment) => !!fragment)
    const pathFrags = pathname.split("/").filter((fragment) => !!fragment)
    if (routeFrags.length !== pathFrags.length) return
    let isMatchingRoute = true
    routeFrags.forEach((routeFrag, i) => {
      if (routeFrag[0] === ":") {
        params[routeFrag.slice(1)] = pathFrags[i]
        return
      }
      if (routeFrag !== pathFrags[i]) isMatchingRoute = false
    })
    if (isMatchingRoute) {
      req["params"] = params
      matchingRoute = route
    }
  })
  return matchingRoute
}

function routeHandler(req, res, next) {
  const matchingRoute = matchRoute(req)
  console.log({ matchingRoute })
  if (!matchingRoute) {
    next()
    return false
  }

  routes[req.method][matchingRoute](req, res, next)
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
