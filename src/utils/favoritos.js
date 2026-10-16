

const CHAVE_FAVORITOS = 'crypto-nexus-favoritos';

// Recupera os favoritos salvos.
export function obterFavoritos() {
  try {
    const dados = localStorage.getItem(CHAVE_FAVORITOS);
    const favoritos = dados ? JSON.parse(dados) : [];

    return Array.isArray(favoritos) ? favoritos : [];
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    return [];
  }
}

// Salva os favoritos no navegador.
export function salvarFavoritos(favoritos) {
  try {
    localStorage.setItem(
      CHAVE_FAVORITOS,
      JSON.stringify(favoritos)
    );

    return true;
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error);
    return false;
  }
}

// Verifica se a moeda é favorita.
export function verificarFavorito(moedaId) {
  return obterFavoritos().includes(moedaId);
}

// Adiciona ou remove uma moeda dos favoritos.
export function alternarFavorito(moedaId) {
  const favoritos = obterFavoritos();

  const novosFavoritos = favoritos.includes(moedaId)
    ? favoritos.filter((id) => id !== moedaId)
    : [...favoritos, moedaId];

  return salvarFavoritos(novosFavoritos)
    ? novosFavoritos
    : favoritos;
}
