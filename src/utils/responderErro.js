throw { status: 404, erro: 'Produto nao encontrado' }

export function responderErro(reply, erro) {
  if (erro.status) {
    return reply.status(erro.status).send({ erro: erro.erro })
  }
  console.log(erro)
  return reply.status(500).send({ erro: 'Erro interno no servidor' })
}