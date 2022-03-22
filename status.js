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
  internalServerError: {
    code: 500,
    message: "Internal Server Error",
  },
})

module.exports = status
