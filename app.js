import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

// Данные Supabase (подставь свои)
const SUPABASE_URL = "https://xtfzljerpkrnarnmsshq.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZnpsamVycGtybmFybm1zc2hxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI2MzA0NCwiZXhwIjoyMDc2ODM5MDQ0fQ.qY85Bo-suA59S5-M1g3sDGJ8zYLbNqAWbM2OgySmdrE";

// ✅ ВКЛЮЧАЕМ CORS для всех доменов
app.use(cors());

// ✅ Опционально: поддержка JSON в body
app.use(express.json());

// Эндпоинт для получения категорий
app.get("/categories", async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Товары по категории
app.get("/category/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?category_id=eq.${categoryId}`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Сохранение заказа
app.post("/checkout", async (req, res) => {
  try {
    const orderItems = req.body; // массив строк заказа

    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(orderItems)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase error: ${text}`);
    }

    const data = await response.json();
    res.json({
      success: true,
      items_saved: data.length,
      order: data
    });

  } catch (err) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
