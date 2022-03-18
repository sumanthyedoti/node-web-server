const net = require("net")

const { parserRequest } = require("./request")
const { sendResponce } = require("./response")

const port = 3030

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = parserRequest(data)
    sendResponce(socket, request)
  })
})

server.on("connection", function () {
  console.log("client connected to the server")
})

server.listen(port, function () {
  console.log(`Server listening to ${port}`)
})
