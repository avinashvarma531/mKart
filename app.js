const express = require("express");
const morgan = require("morgan");
const routes = require("./Routes/routing");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded());
app.use("/", routes);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));