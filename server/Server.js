const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static("public"));


const upload = multer({ dest: "uploads/" });


app.get("/api/getImage", (req, res) => {
  const name = (req.query.name || "").toLowerCase();

  if (!name) {
    return res.status(400).json({ error: "Name query required" });
  }

  const publicPath = path.join(__dirname, "public");
  const files = fs.readdirSync(publicPath);

 
  const found = files.find((file) => file.toLowerCase().startsWith(name));

  if (!found) {
    return res.status(404).json({ error: "Image not found" });
  }

  res.json({
    filename: found,
    url: "/" + found,
  });
});


app.post("/api/upload", upload.single("file"), (req, res) => {
  const name = (req.query.name || "").toLowerCase();

  if (!name) {
    return res.status(400).json({ error: "Name query required" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "File upload required" });
  }

 
  const ext = path.extname(req.file.originalname) || ".jpg";
  const newFileName = name + ext;
  const newFilePath = path.join(__dirname, "public", newFileName);

  fs.rename(req.file.path, newFilePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error saving file" });
    }

    res.json({
      message: "Upload successful",
      filename: newFileName,
      url: "/" + newFileName,
    });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
