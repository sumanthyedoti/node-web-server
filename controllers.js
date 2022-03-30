const mime = require("mime")

const todos = require("./todos")

function getTodos(req, res) {
  res.writeHead(200, { "Content-Type": mime.getType("json") })
  const todosList = Object.keys(todos).reduce(
    (todosAcc, todo) => [...todosAcc, todos[todo]],
    []
  )
  res.send(JSON.stringify(todosList))
}

function getTodo(req, res) {
  const id = parseInt(req.params.id)
  const todo = todos[id]
  if (!todo) {
    res.writeHead(404)
    res.end()
  } else {
    res.writeHead(200, { "Content-Type": mime.getType("json") })
    res.send(JSON.stringify(todo))
  }
}

function postTodo(req, res) {
  const id = Object.keys(todos).length + 1
  const todo = {
    id,
    completed: false,
    ...req.body,
  }
  todos[id] = todo
  res.writeHead(201, { "Content-Type": mime.getType("json") })
  res.send(JSON.stringify(todo))
}

function updateTodo(req, res) {
  const id = parseInt(req.params.id)
  const todo = todos[id]
  if (!todo) {
    res.writeHead(400)
    res.end()
  } else {
    todos[id] = {
      ...todos[id],
      ...req.body,
    }
    res.writeHead(200, { "Content-Type": mime.getType("json") })
    res.send(JSON.stringify(todos[id]))
  }
}

function deleteTodo(req, res) {
  const id = parseInt(req.params.id)
  const todo = todos[id]
  if (!todo) {
    res.writeHead(400)
    res.end()
  } else {
    delete todos[id]
    res.writeHead(204)
  }
}

module.exports = {
  getTodos,
  getTodo,
  postTodo,
  updateTodo,
  deleteTodo,
}
