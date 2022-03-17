const net = require("net")
const port = 3030

const parrotFace = "(*)c;"
const endPhrase = "shut up"
const intro = `${parrotFace} Hello, I can talk, I can talk, I can talk. I don't 'shut up' unless you tell me so!\n\n`

const server = net.createServer((socket) => {
  socket.write(intro)

  socket.on("data", (data) => {
    const recieved = data.toString()
    if (endPhrase === recieved.slice(0, endPhrase.length).toLowerCase()) {
      setTimeout(() => {
        socket.write(`${parrotFace} ...\n`)
      }, 300)
      setTimeout(() => {
        socket.end()
      }, 1400)
    } else {
      setTimeout(() => {
        socket.write(`${parrotFace} ${data}\n`)
      }, 500)
    }
  })
})

server.on("connection", function () {
  console.log("client connected to the server")
})

server.listen(port, function () {
  console.log(`Server listening to ${port}`)
})
