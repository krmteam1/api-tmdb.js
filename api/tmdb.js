module.exports = async (req, res) => {
  const key = process.env.TMDB_KEY;
  if (!key) return res.status(500).json({ error: "TMDB_KEY não configurada" });

  const { endpoint = "", ...rest } = req.query;
  if (!/^[A-Za-z0-9/_-]+$/.test(endpoint))
    return res.status(400).json({ error: "endpoint inválido" });

  const params = new URLSearchParams({ language: "pt-BR", ...rest, api_key: key });
  const r = await fetch(`https://api.themoviedb.org/3/${endpoint}?${params}`);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=300");
  res.status(r.status).send(await r.text());
};