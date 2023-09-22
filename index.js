require("dotenv").config();
const notFound = require("./middleware/notFound");
const errorMiddleWare = require("./middleware/errorMiddleWare");
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

app.use(notFound);
app.use(errorMiddleWare);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("server on port", port));





