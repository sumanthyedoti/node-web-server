const net = require("net")

const { parserRequest } = require("./request")
const { sendResponce } = require("./response")
const bodyParser = require("./body-parser")

const port = 3030
const socketTimeout = 20000
// ! \r\n\r\n header done - contnt-type, and length
// ! handle POST
// !   |->  handle chunked body info
// !     check with content-length
//      on("data"), chunk => body += chunk, until equals to content-length
// ! forms - bodyparser
// ! handle cookies, with date/time

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

server.on("connection", function (socket) {
  console.log("client connected to the server")

  let requestData = { head: "", body: "" }
  let request = {}
  let response = {}
  function handleRequestData(data) {
    const delimiter = "\r\n\r\n"
    const delimiterIndex = data.indexOf(delimiter)
    if (delimiterIndex !== -1) {
      requestData.head = data.slice(0, delimiterIndex)
      parserRequest(requestData.head, request)
      requestData.body = data.slice(delimiterIndex + delimiter.length)
      if (!requestData.body.length) {
        sendResponce(socket, request)
      }
    } else if (
      (contentLength = request.headers["content-length"]) &&
      requestData.body.length < contentLength
    ) {
      requestData.body = Buffer.concat([requestData.body, data])
      if (requestData.body.length >= contentLength) {
        bodyParser(requestData.body, request, response)
        sendResponce(socket, request, response)
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
