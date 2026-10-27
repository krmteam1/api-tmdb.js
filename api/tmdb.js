```javascript
export default async function handler(request, response) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const { endpoint, ...params } = request.query;

  if (!endpoint) {
    return response.status(400).json({ error: "Endpoint é obrigatório." });
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'pt-BR',
    ...params
  });

  const url = `https://api.themoviedb.org/3/${endpoint}?${queryParams}`;

  try {
    const tmdbResponse = await fetch(url);
    const data = await tmdbResponse.json();

    // Libera o acesso para o seu site conseguir ler a resposta
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: 'Falha ao buscar dados do TMDB.' });
  }
}
