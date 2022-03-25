const net = require("net")

const requestParser = require("./pipeline/requestParser")
const bodyParser = require("./pipeline/bodyParser")
const staticHandler = require("./pipeline/staticHandler")
const pipeline = require("./pipeline")

const port = 3030
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

server.on("connection", function (socket) {
  console.log("client connected to the server")

  let request = { data: { head: "", body: "" } }
  let response = {}
  let contentLength = null
  const newPipeline = pipeline(socket, request, response)
    .through(requestParser)
    .through(bodyParser)
    .through(staticHandler)

  function handleRequestData(data) {
    const delimiter = "\r\n\r\n"
    const delimiterIndex = data.indexOf(delimiter)
    if (delimiterIndex !== -1) {
      request.data.head = data.slice(0, delimiterIndex)
      contentLength = getContentLength(data)
      request.data.body = data.slice(delimiterIndex + delimiter.length)
      if (!request.data.body.length) {
        newPipeline.start()
      }
    } else if (contentLength && request.data.body.length < contentLength) {
      request.data.body = Buffer.concat([request.data.body, data])
      if (request.data.body.length >= contentLength) {
        newPipeline.start()
      }
    }
  }

  socket.on("data", (data) => {
    handleRequestData(data)
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

server.listen(port, function () {
  console.log(`Server listening to ${port}`)
})
