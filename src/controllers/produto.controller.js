import * as produtoService from '../services/produto.service.js'
import { responderErro } from '../utils/responderErro.js'

export async function listar(request, reply) {
  try {
    const produtos = await produtoService.listar()
    return reply.status(200).send(produtos)
  } catch (erro) {
    return responderErro(reply, erro)
  }
}

export async function consultar(request, reply) {
  try {
    const produto = await produtoService.consultar(request.params.id)
    return reply.status(200).send(produto)
  } catch (erro) {
    return responderErro(reply, erro)
  }
}

export async function cadastrar(request, reply) {
  try {
    const id = await produtoService.cadastrar(request.body)
    return reply.status(201).send({ mensagem: 'Produto cadastrado com sucesso', id_produto: id })
  } catch (erro) {
    return responderErro(reply, erro)
  }
}

export async function atualizar(request, reply) {
  try {
    await produtoService.atualizar(request.params.id, request.body)
    return reply.status(200).send({ mensagem: 'Produto atualizado com sucesso' })
  } catch (erro) {
    return responderErro(reply, erro)
  }
}

export async function remover(request, reply) {
  try {
    const body = request.body || {}
    await produtoService.remover(body.id_produto)
    return reply.status(200).send({ mensagem: 'Produto removido com sucesso' })
  } catch (erro) {
    return responderErro(reply, erro)
  }
}