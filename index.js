const mime = require("mime")

const app = require("./server")
const requestParser = require("./server/pipeline/requestParser")
const bodyParser = require("./server/pipeline/bodyParser")
const staticHandler = require("./server/pipeline/staticHandler")
const { router, routeHandler } = require("./server/pipeline/routeHandler")

const port = 3030

app
  .passThrough(requestParser)
  .passThrough(bodyParser)
  .passThrough(staticHandler)
  .passThrough(routeHandler)
  .start()

const sampleTodo = {
  id: Date.now(),
  isComplete: false,
  text: "This a sample todo, please ignore or delete it!",
}

const todo = [sampleTodo]

router.get("/todos", function (req, res) {
  res.writeHead(200, { "Content-Type": mime.getType("json") })
  res.send(JSON.stringify(todo))
})
router.get("/todo/:id", function (req, res) {
  res.writeHead(200, { "Content-Type": mime.getType("json") })
  res.send(JSON.stringify(todo))
})
router.post("/hello", function (req, res) {
  res.writeHead(200, { "Content-Type": mime.getType("json") })
  res.send(JSON.stringify(todo))
})

app.listen(port)
