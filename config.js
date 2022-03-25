const defaultHeaders = Object.freeze({
  Server: "nws",
  Date: new Date().toString().slice(0, 28),
  "Accept-Ranges": "bytes",
})

const status = Object.freeze({
  200: {
    code: 200,
    message: "Ok",
  },
  201: {
    code: 201,
    message: "Created",
  },
  204: {
    code: 204,
    message: "No Content",
  },
  206: {
    code: 206,
    messsage: "Partial Content",
  },
  400: {
    code: 400,
    message: "Bad Request",
  },
  403: {
    code: 403,
    message: "Forbidden",
  },
  404: {
    code: 404,
    message: "Not Found",
  },
  416: {
    code: 416,
    messsage: "Range Not Satisfiable",
  },
  500: {
    code: 500,
    message: "Internal Server Error",
  },
})

module.exports = {
  defaultHeaders,
  status,
  public_folder: "public",
}
