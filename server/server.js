const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/notify", require("./routes/notifyRoute"));
// app.use("/user", require("./routes/usersRoute"));

app.listen(PORT, () => console.log(`app listening on port: ${PORT}`));