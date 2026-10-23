import * as movimentacaoService from '../services/movimentacao.service.js'
import { responderErro } from '../utils/responderErro.js'

export async function registrar(request, reply) {
  try {
    const quantidadeAtual = await movimentacaoService.registrar(request.body)
    return reply.status(201).send({ mensagem: 'Entrada registrada com sucesso', quantidade_atual: quantidadeAtual })
  } catch (erro) {
    return responderErro(reply, erro)
  }
}

export async function listar(request, reply) {
  try {
    const movimentacoes = await movimentacaoService.listar()
    return reply.status(200).send(movimentacoes)
  } catch (erro) {
    return responderErro(reply, erro)
  }
}
