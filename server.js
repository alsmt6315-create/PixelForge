import express from "express";
import cors from "cors";
import multer from "multer";
import rembg from "rembg-node";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const input = req.file.buffer;

    const output = await rembg.remove(input);

    const base64 = output.toString("base64");

    res.json({ image: base64 });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to remove background" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
