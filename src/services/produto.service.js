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
