function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { amount, memo, metadata } = req.body || {};
  if (!amount) return res.status(400).json({ error: "amount required" });

  const PI_PLATFORM_URL = process.env.PI_PLATFORM_URL || "https://api.minepi.com";
  const PI_API_KEY = process.env.PI_API_KEY;

  try {
    const r = await fetch(`${PI_PLATFORM_URL}/v2/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${PI_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        memo: memo || "Tekyildiz Protocol test payment",
        metadata: metadata || {},
      }),
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
