import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors());

// الرابط الخاص بإزالة الخلفية من HuggingFace
const API_URL = "https://api-inference.huggingface.co/models/briaai/RMBG-1.4";

// التوكن المخزّن داخل Render
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

app.post("/remove-bg", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "لا توجد صورة مرسلة" });
    }

    // ارسال الصورة للهجنج فيس
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: image,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("API ERROR:", errorText);
      return res.status(500).json({ error: "خطأ من API" });
    }

    const result = await response.arrayBuffer();
    const base64Image = Buffer.from(result).toString("base64");

    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "خطأ داخلي بالسيرفر" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
