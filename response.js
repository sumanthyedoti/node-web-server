const fs = require("fs")
const path = require("path")
const mime = require("mime")

const staticFiles = (dirName) => (fileName) =>
  path.resolve(__dirname, dirName, fileName)

const public = staticFiles("public")

const status = Object.freeze({
  ok: {
    code: 200,
    message: "OK",
  },
  created: {
    code: 201,
    message: "CREATED",
  },
  noContent: {
    code: 204,
    message: "NO CONTENT",
  },
  badRequest: {
    code: 400,
    message: "BAD REQUEST",
  },
  forbidden: {
    code: 403,
    message: "FORBIDDEN",
  },
  notFound: {
    code: 404,
    message: "NOT FOUND",
  },
})

function getHeaders(headers) {
  return {
    Server: "nws",
    Date: new Date().toString().slice(0, 28),
    // "Transfer-Encoding": "chunked",
    ...headers,
  }
}
function image() {
  const i = fs.readFileSync(path.resolve( __dirname, "./public/ketchup.png" ))
  console.log(i);
}
// image()

let getStatusLine = ({ code: statusCode, message, httpv = "HTTP/1.1" }) =>
  `${httpv} ${statusCode} ${message}\r\n`

function getHeadersResponse(headers) {
  const headersResponse = Object.keys(headers).reduce(
    (acc, key) => acc + `${key}: ${headers[key]}\r\n`,
    ""
  )
  return headersResponse + "\r\n"
}

function sendResponce(socket, request) {
  const fileName = public(request.uri.slice(1))
  if (!fs.existsSync(fileName)) {
    socket.write(getStatusLine(status.notFound))
    socket.end()
    return false
  }
  const fileExtention = fileName.split(".").slice(-1)[0]
  let headers = getHeaders({
    "Content-Type": mime.getType(fileExtention),
  })
  socket.write(getStatusLine(status) + getHeadersResponse(headers))
  const fileContent = fs.readFileSync(fileName, "utf8")
  socket.write(fileContent)
  socket.end()
}

module.exports = {
  sendResponce,
}
