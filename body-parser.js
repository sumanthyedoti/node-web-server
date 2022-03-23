const contentTypes = {
  json: "application/json",
  formURLEncoded: "application/x-www-form-urlencoded",
}

function bodyParser(request) {
  if (!!request.header["content-length"]) return false
}
