import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import userRoter from "./src/modules/user/user.router.js";
import postRouter from "./src/posts/post.router.js";
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/users", userRoter);
app.use("/post", postRouter);
dbConnection();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
