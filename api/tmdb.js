export default async function handler(request, response) {
  try {
    console.log("Iniciando requisição...");
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    
    if (!TMDB_API_KEY) {
      console.error("ERRO CRÍTICO: TMDB_API_KEY não encontrada.");
      return response.status(500).json({ error: "Configuração do servidor incompleta." });
    }

    const { endpoint, ...params } = request.query;
    if (!endpoint) return response.status(400).json({ error: "Endpoint é obrigatório." });

    const queryParams = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', ...params });
    const url = `https://api.themoviedb.org/3/${endpoint}?${queryParams}`;
    console.log("Buscando:", url.replace(TMDB_API_KEY, "CHAVE_OCULTA"));

    const tmdbResponse = await fetch(url);
    const data = await tmdbResponse.json();

    if (!tmdbResponse.ok) {
      console.error("Erro do TMDB:", data);
      return response.status(tmdbResponse.status).json(data);
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json(data);

  } catch (error) {
    console.error("ERRO NA FUNÇÃO:", error);
    return response.status(500).json({ error: "Falha interna no proxy." });
  }
}