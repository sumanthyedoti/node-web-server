function cookieParser(req, res, next) {
  if (!req.headers.cookie) {
    next()
    return
  }
  const cookies = req.headers.cookie
    .split("; ")
    .map((cookie) => cookie.split("="))
    .reduce(
      (cookies, cookie) => ((cookies[cookie[0]] = cookie[1]), cookies),
      {}
    )
  req.headers.cookies = cookies
  next()
}

module.exports = cookieParser
