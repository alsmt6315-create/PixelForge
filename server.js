import express from "express";
import cors from "cors";
import multer from "multer";
import { pipeline } from "@xenova/transformers";

const app = express();
const upload = multer();

app.use(cors());

let removeBg;

(async () => {
  removeBg = await pipeline("image-segmentation", "Xenova/deeplabv3-resnet50");
})();

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    if (!removeBg) return res.status(503).json({ error: "Model loading..." });

    const inputBuffer = req.file.buffer;

    const output = await removeBg(inputBuffer, {
      threshold: 0.9,
    });

    const base64 = output.toString("base64");

    res.json({ image: base64 });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to remove background" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
