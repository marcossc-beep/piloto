
import sql from '../config/db.js'

export default async function movimentacaoRoutes(servidor) {
  servidor.post('/movimentar_produto', async (request, reply) => {
    const { id_produto, tipo, quantidade } = request.body || {}

    if (id_produto === undefined || id_produto === null || isNaN(Number(id_produto))) {
      return reply.status(422).send({ erro: 'O campo id_produto e obrigatorio' })
    }

    if (tipo !== 'ENTRADA') {
      return reply.status(422).send({ erro: 'Somente movimentacoes do tipo ENTRADA estao implementadas' })
    }

    if (quantidade === undefined || quantidade === null || isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
      return reply.status(422).send({ erro: 'O campo quantidade deve ser um numero maior que zero' })
    }

    try {
      const produtos = await sql.query(
        'SELECT id_produto, quantidade FROM produto WHERE id_produto = $1',
        [Number(id_produto)]
      )

      if (produtos.rows.length === 0) {
        return reply.status(404).send({ erro: 'Produto nao encontrado' })
      }

      await sql.query(
        'INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES ($1, $2, $3)',
        [Number(id_produto), tipo, Number(quantidade)]
      )

      await sql.query(
        'UPDATE produto SET quantidade = quantidade + $1 WHERE id_produto = $2',
        [Number(quantidade), Number(id_produto)]
      )

      return reply.status(201).send({
        mensagem: 'Entrada registrada com sucesso',
        quantidade_atual: produtos.rows[0].quantidade + Number(quantidade)
      })
    } catch (erro) {
      console.log(erro)
      return reply.status(500).send({ erro: 'Erro ao movimentar produto' })
    }
  })

  servidor.get('/listar_movimentacoes', async (request, reply) => {
    try {
      const movimentacoes = await sql.query(
        'SELECT m.id_movimentacao, m.id_produto, p.nome, m.tipo, m.quantidade ' +
        'FROM movimentacao m ' +
        'INNER JOIN produto p ON p.id_produto = m.id_produto ' +
        'ORDER BY m.id_movimentacao DESC'
      )

      return reply.status(200).send(movimentacoes.rows)
    } catch (erro) {
      console.log(erro)
      return reply.status(500).send({ erro: 'Erro ao listar movimentacoes' })
    }
  })
}
