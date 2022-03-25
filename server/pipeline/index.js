const fs = require("fs")
const events = require("events")

const { defaultHeaders, status, public_folder } = require("../../config")
const { staticFiles } = require("../../utils")

const public = staticFiles(public_folder)

const eventEmitter = new events.EventEmitter()

const pipeline = function (socket, request = {}, response = {}) {
  const pipes = []
  const _lastPipe = function (req, res) {
    let isKeepAlive =
      (conn = req.headers.connection) && conn == "keep-alive" ? true : false
    res.writeHead(404, { "Content-Type": "text/html" })
    isKeepAlive ? socket.end() : null
    fs.readFile(public("404.html"), "utf8", function (err, data) {
      if (err) {
        console.log("Error at reading 404.html\n", err)
      } else {
        socket.end(data)
      }
    })
  }

  request.socket = socket
  response.socket = socket

  function _getStatusLine(code, httpv = "HTTP/1.1") {
    return `${httpv} ${code} ${status[code].message}\r\n`
  }

  function _getHeadersResponse(headers) {
    const allHeaders = {
      ...defaultHeaders,
      ...headers,
    }
    const headersResponse = Object.keys(allHeaders).reduce(
      (acc, key) => acc + `${key}: ${allHeaders[key]}\r\n`,
      ""
    )
    return headersResponse + "\r\n"
  }

  response.writeHead = function (statusCode, headers = {}) {
    socket.write(_getStatusLine(statusCode) + _getHeadersResponse(headers))
  }

  response.send = function (body) {
    socket.write(body)
  }

  response.end = function (payload = null) {
    socket.end(payload || "")
  }

  function next() {
    eventEmitter.emit("next")
  }

  function* pipeGenerator() {
    for (let pipe of pipes) {
      yield pipe
    }
  }

  const pipeIterator = pipeGenerator()

  eventEmitter.on("next", function () {
    if (request.data.head === "") return // ! fix the bug
    const { value: nextPipe, done } = pipeIterator.next()
    if (!done) nextPipe(request, response, next)
    // else _lastPipe(request, response)
  })

  return {
    through: function (middlewear) {
      pipes.push(middlewear)
      return this
    },
    start: function () {
      eventEmitter.emit("next")
    },
    getPipes: function () {
      return pipes
    },
  }
}

module.exports = pipeline
