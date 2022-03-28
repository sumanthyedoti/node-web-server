const defaultHeaders = Object.freeze({
  Server: "nws",
  Date: new Date().toString().slice(0, 28),
  "Accept-Ranges": "bytes",
})

const statusMessages = Object.freeze({
  200: "Ok",
  201: "Created",
  204: "No Content",
  206: "Partial Content",
  400: "Bad Request",
  403: "Forbidden",
  404: "Not Found",
  416: "Range Not Satisfiable",
  500: "Internal Server Error",
})

module.exports = {
  defaultHeaders,
  statusMessages,
  public_folder: "public",
}
