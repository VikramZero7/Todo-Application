import { PORT } from "./config/eslint.js";

import express from "express";
import installDatabase from "./database/sqlite.js";
import todoRouter from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(todoRouter);

app.listen(PORT, () => {
  installDatabase();
  console.log(`Server is running http://localhost:${PORT}`);
});

export default app;
