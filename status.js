const status = Object.freeze({
  ok: {
    code: 200,
    message: "Ok",
  },
  created: {
    code: 201,
    message: "Created",
  },
  noContent: {
    code: 204,
    message: "No Content",
  },
  partialContent: {
    code: 206,
    messsage: "Partial Content",
  },
  badRequest: {
    code: 400,
    message: "Bad Request",
  },
  forbidden: {
    code: 403,
    message: "Forbidden",
  },
  notFound: {
    code: 404,
    message: "Not Found",
  },
  rangeNotSatisfiable: {
    code: 416,
    messsage: "Range Not Satisfiable",
  },
  internalServerError: {
    code: 500,
    message: "Internal Server Error",
  },
})

module.exports = status
