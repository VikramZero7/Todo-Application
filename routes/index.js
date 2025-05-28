import { Router } from "express";
import { getDb } from "./database/sqlite.js";

const todoRouter = Router();

const getPriorityAndStatus = (query) => {
  return query.priority !== undefined && query.status !== undefined;
};

const getStatus = (query) => {
  return query.status !== undefined;
};

const getPriority = (query) => {
  return query.priority !== undefined;
};

// api 1

todoRouter.get("/todos/", async (req, res) => {
  const db = getDb();
  const { priority, status, search_q } = req.query;

  let query = null;

  switch (true) {
    case getStatus(req.query):
      query = `SELECT * 
                FROM todo 
                WHERE status = "${status}";`;
      break;
    case getPriority(req.query):
      query = `SELECT 
                 *
                FROM todo 
                WHERE priority = "${priority}";`;
      break;
    case getPriorityAndStatus(req.query):
      query = `SELECT 
                 *
                FROM todo 
                WHERE status = "${status}" AND priority = "${priority}";`;
      break;
    default:
      query = `SELECT 
                 *
                FROM todo 
                WHERE todo LIKE "%${search_q}%";`;
  }

  const getQuery = await db.all(query);
  res.send(getQuery);
});

// api 2

todoRouter.get("/todos/:todoId/", async (req, res) => {
  const db = getDb();
  const { todoId } = req.params;
  const getTodoQuery = `
        SELECT * 
        FROM todo
        WHERE id = ${todoId}
  `;
  const getTodo = await db.get(getTodoQuery);
  res.send(getTodo);
});

// api 3

todoRouter.post("/todos/", async (req, res) => {
  const db = getDb();
  const { id, status, todo, priority } = req.body;
  const createTodo = `
        INSERT INTO todo(id,todo,priority,status)
        VALUES(${id},"${todo}","${priority}","${status}");`;
  const updated = await db.run(createTodo);
  res.send("Todo Successfully Added");
});

todoRouter.get("/todos/:todoId/", async (req, res) => {
  const db = getDb();
  const getTodoQuery = `
        SELECT * 
        FROM todo
  `;
  const getTodo = await db.all(getTodoQuery);
  res.send(getTodo);
});

// api 4

todoRouter.put("/todos/:todoId/", async (req, res) => {
  const db = getDb();
  const { todoId } = req.params;
  const specificQuery = `
      SELECT * 
      FROM todo 
      WHERE id = ${todoId};
  `;
  const specificTodo = await db.get(specificQuery);

  const {
    todo = specificTodo.todo,
    priority = specificTodo.priority,
    status = specificTodo.status,
  } = req.body;
  const updateQuy = `
      UPDATE todo
      SET 
         todo = "${todo}",
         priority = "${priority}",
         status = "${status}"
      WHERE id = ${todoId}   
  
  `;
  await db.run(updateQuy);
  const objkey = Object.keys(req.body);
  const word = objkey[0][0].toUpperCase() + objkey[0].slice(1);
  res.send(`${word} Updated`);
});

todoRouter.delete("/todos/:todoId/", async (req, res) => {
  const db = getDb();
  const { todoId } = req.params;
  const deletequery = `DELETE FROM todo WHERE id = ${todoId}`;
  await db.run(deletequery);
  res.send("Todo Deleted");
});

export default todoRouter;
