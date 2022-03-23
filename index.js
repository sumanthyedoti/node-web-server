const net = require("net")

const { parserRequest } = require("./request")
const { sendResponce } = require("./response")

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

  // socket.on("data", (data) => {
  //   const request = parserRequest(data)
  //   sendResponce(socket, request)
  // })
  socket.on("readable", () => {
    let data = ""
    while ((chunk = socket.read()) !== null) {
      data += chunk
    }
    if (!data) return false
    console.log({ data: data })
    request = parserRequest(data)
    sendResponce(socket, request)
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
