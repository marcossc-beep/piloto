import * as produtoRepository from '../repositories/produto.repository.js'

function validarId(id, mensagem = 'O id informado e invalido') {
  if (id === undefined || id === null || isNaN(Number(id))) {
    throw { status: 422, erro: mensagem }
  }
  return Number(id)
}

function validarDados(dados) {
  const { nome, descricao, valor, quantidade } = dados || {}

  if (!nome || nome.trim() === '') {
    throw { status: 422, erro: 'O campo nome e obrigatorio' }
  }
  if (valor === undefined || valor === null || isNaN(Number(valor)) || Number(valor) < 0) {
    throw { status: 422, erro: 'O campo valor deve ser um numero maior ou igual a zero' }
  }
  if (quantidade === undefined || quantidade === null || isNaN(Number(quantidade)) || Number(quantidade) < 0) {
    throw { status: 422, erro: 'O campo quantidade deve ser um numero maior ou igual a zero' }
  }

  return { nome, descricao: descricao || null, valor: Number(valor), quantidade: Number(quantidade) }
}

export async function listar() {
  return produtoRepository.listar()
}

export async function consultar(id) {
  const produto = await produtoRepository.buscarPorId(validarId(id))
  if (!produto) {
    throw { status: 404, erro: 'Produto nao encontrado' }
  }
  return produto
}

export async function cadastrar(dados) {
  const produto = validarDados(dados)
  return produtoRepository.inserir(produto)
}

export async function atualizar(id, dados) {
  const idValido = validarId(id)
  const produto = validarDados(dados)

  const alterados = await produtoRepository.atualizar(idValido, produto)
  if (alterados === 0) {
    throw { status: 404, erro: 'Produto nao encontrado' }
  }
}

export async function remover(id) {
  const idValido = validarId(id, 'O campo id_produto e obrigatorio')

  if (await produtoRepository.possuiMovimentacoes(idValido)) {
    throw { status: 409, erro: 'O produto possui movimentacoes e nao pode ser removido' }
  }

  const removidos = await produtoRepository.remover(idValido)
  if (removidos === 0) {
    throw { status: 404, erro: 'Produto nao encontrado' }
  }
}

export async function listar({ nome, dataInicio, dataFim, limite, offset }) {
  const condicoes = []
  const valores = []

  if (nome) {
    valores.push('%' + nome + '%')
    condicoes.push('nome ILIKE $' + valores.length)
  }
  if (dataInicio) {
    valores.push(dataInicio)
    condicoes.push('data_cadastro::date >= $' + valores.length)
  }
  if (dataFim) {
    valores.push(dataFim)
    condicoes.push('data_cadastro::date <= $' + valores.length)
  }

  const where = condicoes.length > 0 ? ' WHERE ' + condicoes.join(' AND ') : ''

  const total = await sql.query('SELECT COUNT(*) AS total FROM produto' + where, valores)

  valores.push(limite)
  const posLimite = valores.length
  valores.push(offset)
  const posOffset = valores.length

  const produtos = await sql.query(
    'SELECT id_produto, nome, descricao, valor_unitario, quantidade, data_cadastro FROM produto' +
    where +
    ' ORDER BY id_produto LIMIT $' + posLimite + ' OFFSET $' + posOffset,
    valores
  )

  return { total: Number(total.rows[0].total), produtos: produtos.rows }
}

export async function listar(query) {
  const pagina = Number(query.pagina) || 1
  const limite = Number(query.limite) || 10

  if (pagina < 1 || limite < 1) {
    throw { status: 422, erro: 'Pagina e limite devem ser maiores que zero' }
  }

  const dataValida = /^\d{4}-\d{2}-\d{2}$/
  if ((query.data_inicio && !dataValida.test(query.data_inicio)) ||
      (query.data_fim && !dataValida.test(query.data_fim))) {
    throw { status: 422, erro: 'Datas devem estar no formato AAAA-MM-DD' }
  }

  const resultado = await produtoRepository.listar({
    nome: query.nome,
    dataInicio: query.data_inicio,
    dataFim: query.data_fim,
    limite,
    offset: (pagina - 1) * limite
  })

  return {
    pagina,
    limite,
    total: resultado.total,
    total_paginas: Math.ceil(resultado.total / limite),
    dados: resultado.produtos
  }
}
