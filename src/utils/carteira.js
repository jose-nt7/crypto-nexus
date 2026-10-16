
const CHAVE_CARTEIRA = "crypto-nexus-carteira";

const MOEDAS_PERMITIDAS = [
  "bitcoin",
  "ethereum",
  "litecoin",
  "solana",
  "cardano",
  "dogecoin",
];

// Recupera as transações salvas no navegador
export function obterTransacoes() {
  try {
    const dados = localStorage.getItem(CHAVE_CARTEIRA);
    const transacoes = dados ? JSON.parse(dados) : [];

    return Array.isArray(transacoes) ? transacoes : [];
  } catch (error) {
    console.error("Erro ao carregar carteira:", error);
    return [];
  }
}

// Salva as transações no navegador
export function salvarTransacoes(transacoes) {
  try {
    localStorage.setItem(
      CHAVE_CARTEIRA,
      JSON.stringify(transacoes)
    );

    return true;
  } catch (error) {
    console.error("Erro ao salvar carteira:", error);
    return false;
  }
}

// Calcula o saldo de cada criptomoeda
export function calcularSaldos(transacoes) {
  return transacoes.reduce((saldos, transacao) => {
    const { moedaId, tipo, quantidade } = transacao;

    if (!MOEDAS_PERMITIDAS.includes(moedaId)) {
      return saldos;
    }

    const valor = Number(quantidade);

    if (!Number.isFinite(valor) || valor <= 0) {
      return saldos;
    }

    const saldoAtual = saldos[moedaId] || 0;

    saldos[moedaId] =
      tipo === "compra"
        ? saldoAtual + valor
        : tipo === "venda"
          ? saldoAtual - valor
          : saldoAtual;

    return saldos;
  }, {});
}

// Adiciona uma compra ou venda fictícia
export function adicionarTransacao({
  moedaId,
  tipo,
  quantidade,
  precoUnitario,
}) {
  if (!MOEDAS_PERMITIDAS.includes(moedaId)) {
    throw new Error("Criptomoeda não suportada.");
  }

  if (!["compra", "venda"].includes(tipo)) {
    throw new Error("Tipo de transação inválido.");
  }

  const qtd = Number(quantidade);
  const preco = Number(precoUnitario);

  if (!Number.isFinite(qtd) || qtd <= 0) {
    throw new Error("Informe uma quantidade válida.");
  }

  if (!Number.isFinite(preco) || preco <= 0) {
    throw new Error("Cotação inválida.");
  }

  const transacoes = obterTransacoes();

  if (tipo === "venda") {
    const saldos = calcularSaldos(transacoes);
    const saldoDisponivel = saldos[moedaId] || 0;

    if (qtd > saldoDisponivel + 1e-10) {
      throw new Error(
        "Saldo insuficiente para realizar a venda fictícia."
      );
    }
  }

  const novaTransacao = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    moedaId,
    tipo,
    quantidade: qtd,
    precoUnitario: preco,
    valorTotal: qtd * preco,
    data: new Date().toISOString(),
  };

  const novasTransacoes = [...transacoes, novaTransacao];

  if (!salvarTransacoes(novasTransacoes)) {
    throw new Error("Não foi possível salvar a transação.");
  }

  return novasTransacoes;
}

// Remove uma transação fictícia
export function removerTransacao(transacaoId) {
  const transacoes = obterTransacoes();

  const novasTransacoes = transacoes.filter(
    (transacao) => transacao.id !== transacaoId
  );

  if (novasTransacoes.length === transacoes.length) {
    throw new Error("Transação não encontrada.");
  }

  // Evita que a remoção deixe o histórico com saldo negativo.
  const saldos = {};

  for (const transacao of novasTransacoes) {
    const atual = saldos[transacao.moedaId] || 0;

    saldos[transacao.moedaId] =
      transacao.tipo === "compra"
        ? atual + transacao.quantidade
        : atual - transacao.quantidade;

    if (saldos[transacao.moedaId] < -1e-10) {
      throw new Error(
        "Não é possível excluir esta transação, pois ela compromete o saldo de uma venda posterior."
      );
    }
  }

  if (!salvarTransacoes(novasTransacoes)) {
    throw new Error("Não foi possível atualizar a carteira.");
  }

  return novasTransacoes;
}
