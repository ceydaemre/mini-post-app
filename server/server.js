const express = require("express");
const app = express();
app.use(express.json());

const postRoutes = require("./routes/postRoutes");
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("Server çalışıyor.");
});

app.listen(5001, () => {
    console.log("Server 5001 portunda çalışıyor.");
});