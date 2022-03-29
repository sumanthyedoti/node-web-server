const app = require("./server")
const requestParser = require("./server/pipeline/requestParser")
const bodyParser = require("./server/pipeline/bodyParser")
const staticHandler = require("./server/pipeline/staticHandler")
const { router, routeHandler } = require("./server/pipeline/routeHandler")

const {
  getTodos,
  getTodo,
  postTodo,
  updateTodo,
  deleteTodo,
} = require("./controllers")

const port = 3030

app
  .passThrough(requestParser)
  .passThrough(bodyParser)
  .passThrough(staticHandler)
  .passThrough(routeHandler)
  .start()

router.get("/todos", getTodos)
router.get("/todos/:id", getTodo)
router.post("/todos", postTodo)
router.put("/todos/:id", updateTodo)
router.delete("/todos/:id", deleteTodo)

app.listen(port)
