const net = require("net")

const pipeline = require("./pipeline")

const socketTimeout = 20000

const server = net.createServer()

function numberOfConnections() {
  server.getConnections(function (err, count) {
    if (err) {
      console.error(err)
    } else {
      console.log(`${count} ${count === 1 ? "connection" : "connections"}`)
    }
  })
}

function getContentLength(data) {
  const matchWithString = "Content-Length: "
  const contentIndex = data.indexOf(matchWithString)
  if (contentIndex === -1) return null
  return parseInt(
    data
      .slice(
        contentIndex + matchWithString.length,
        contentIndex + matchWithString.length + 20
      )
      .toString()
      .split("\r\n")[0]
  )
}

const pipes = []

function start() {
  server.on("connection", function (socket) {
    console.log("client connected to the server")

    let contentLength = null
    const newPipeline = pipeline(socket).addPipes(pipes)

    function handleRequestData(chunk) {
      const delimiter = "\r\n\r\n"
      const delimiterIndex = chunk.indexOf(delimiter)
      if (delimiterIndex !== -1) {
        newPipeline.addHeadBuffer(chunk.slice(0, delimiterIndex))
        contentLength = getContentLength(chunk)
        newPipeline.addBodyBuffer(
          chunk.slice(delimiterIndex + delimiter.length)
        )
        if (!newPipeline.request.buffer.body.length) {
          newPipeline.start()
        } else if (
          contentLength &&
          newPipeline.request.buffer.body.length === contentLength
        ) {
          newPipeline.start()
        }
      } else if (
        contentLength &&
        newPipeline.request.buffer.body.length < contentLength
      ) {
        newPipeline.addBodyBuffer(
          Buffer.concat([newPipeline.request.buffer.body, chunk])
        )
        if (newPipeline.request.buffer.body.length >= contentLength) {
          newPipeline.start()
        }
      }
    }

    socket.on("data", (chunk) => {
      handleRequestData(chunk)
    })
    socket.on("error", (err) => {
      console.error("socket error\n", err)
      socket.end()
      numberOfConnections()
    })
    socket.setTimeout(socketTimeout, () => {
      console.log("socket timeout!")
      socket.end()
      numberOfConnections()
    })
    socket.on("end", () => {
      console.log("client connected ended!")
      numberOfConnections()
    })
  })
}

function listen(port) {
  server.listen(port, function () {
    console.log(`Server listening to ${port}`)
  })
}

module.exports = {
  listen,
  start,
  passThrough: function (pipe) {
    pipes.push(pipe)
    return this
  },
}
