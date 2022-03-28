const fs = require("fs")
const events = require("events")

const {
  defaultHeaders,
  statusMessages,
  public_folder,
} = require("../../config")
const { staticFiles } = require("../../utils")

const public = staticFiles(public_folder)

const eventEmitter = new events.EventEmitter()

const pipeline = function (socket) {
  const request = { buffer: { head: "", body: "" } }
  const response = { socket }
  const pipes = []
  let isEnd = false
  const send404 = function (req, res) {
    res.writeHead(404, { "Content-Type": "text/html" })
    fs.readFile(public("404.html"), "utf8", function (err, data) {
      if (err) {
        console.log("Error at reading 404.html\n", err)
      } else {
        socket.end(data)
      }
    })
  }

  function _getStatusLine(code, httpv = "HTTP/1.1") {
    return `${httpv} ${code} ${statusMessages[code]}\r\n`
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
    response.statusCode = statusCode
    socket.write(_getStatusLine(statusCode) + _getHeadersResponse(headers))
  }

  response.send = function (body) {
    socket.write(body)
  }

  response.end = function () {
    isEnd = true
    const isKeepAlive =
      (conn = request.headers.connection) && conn == "keep-alive" ? true : false
    isKeepAlive ? null : socket.end()
  }

  response.send404 = () => send404(request, response)

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
    if (request.buffer.head === "") return // ! fix the bug
    const { value: nextPipe, done } = pipeIterator.next()
    if (!nextPipe) return
    if (!done && !isEnd) nextPipe(request, response, next)
    // else if(!isEnd) _lastPipe(request, response)
  })

  return {
    request,
    response,
    addPipes: function (pipeList) {
      pipes.push(...pipeList)
      return this
    },
    addHeadBuffer: function (head) {
      request.buffer.head = head
    },
    addBodyBuffer: function (body) {
      request.buffer.body = body
    },
    start: function () {
      eventEmitter.emit("next")
    },
  }
}

module.exports = pipeline
