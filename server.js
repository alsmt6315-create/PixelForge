import express from "express";
import cors from "cors";
import multer from "multer";
import { removeBackground } from "@imgly/background-removal";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const input = req.file.buffer;

    const output = await removeBackground(input);

    const base64 = Buffer.from(output).toString("base64");

    res.json({ image: base64 });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error removing background" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
