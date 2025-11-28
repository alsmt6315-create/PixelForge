import express from "express";
import cors from "cors";
import multer from "multer";
import { Rembg } from "@xixihaha/rembg-js";

const app = express();
const upload = multer();
const rembg = new Rembg(); // إنشاء كائن واحد من Rembg

app.use(cors());

// مسار إزالة الخلفية
app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const inputBuffer = req.file.buffer;

    // إزالة الخلفية
    const outputBuffer = await rembg.remove(inputBuffer);

    const base64 = outputBuffer.toString("base64");
    res.json({ image: base64 });

  } catch (err) {
    console.log("Error removing background:", err);
    res.status(500).json({ error: "Error removing background" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Background removal server running on port ${PORT}`);
});
