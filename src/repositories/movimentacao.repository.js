import sql from '../config/db.js'

export async function registrarEntrada(idProduto, quantidade) {
  await sql.query(
    'INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES ($1, $2, $3)',
    [idProduto, 'ENTRADA', quantidade]
  )
  const resultado = await sql.query(
    'UPDATE produto SET quantidade = quantidade + $1 WHERE id_produto = $2 RETURNING quantidade',
    [quantidade, idProduto]
  )
  return resultado.rows[0].quantidade
}

export async function listar() {
  const resultado = await sql.query(
    'SELECT m.id_movimentacao, m.id_produto, p.nome, m.tipo, m.quantidade ' +
    'FROM movimentacao m ' +
    'INNER JOIN produto p ON p.id_produto = m.id_produto ' +
    'ORDER BY m.id_movimentacao DESC'
  )
  return resultado.rows
}

import sql from '../config/db.js'

export async function registrar({ idProduto, tipo, quantidade, idUsuario }) {
  const cliente = await sql.connect()

  try {
    await cliente.query('BEGIN')

    const produto = await cliente.query(
      'SELECT id_produto, quantidade FROM produto WHERE id_produto = $1 FOR UPDATE',
      [idProduto]
    )

    if (produto.rows.length === 0) {
      await cliente.query('ROLLBACK')
      return { situacao: 'PRODUTO_NAO_ENCONTRADO' }
    }

    const saldo = produto.rows[0].quantidade

    if (tipo === 'SAIDA' && quantidade > saldo) {
      await cliente.query('ROLLBACK')
      return { situacao: 'SALDO_INSUFICIENTE', saldo }
    }

    const sinal = tipo === 'SAIDA' ? -1 : 1

    const movimentacao = await cliente.query(
      'INSERT INTO movimentacao (id_produto, tipo, quantidade, id_usuario) VALUES ($1, $2, $3, $4) ' +
      'RETURNING id_movimentacao, data_hora',
      [idProduto, tipo, quantidade, idUsuario]
    )

    const atualizado = await cliente.query(
      'UPDATE produto SET quantidade = quantidade + $1 WHERE id_produto = $2 RETURNING quantidade',
      [sinal * quantidade, idProduto]
    )

    await cliente.query('COMMIT')

    return {
      situacao: 'OK',
      id_movimentacao: movimentacao.rows[0].id_movimentacao,
      data_hora: movimentacao.rows[0].data_hora,
      quantidade_atual: atualizado.rows[0].quantidade
    }
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  } finally {
    cliente.release()
  }
}

export async function listar() {
  const resultado = await sql.query(
    'SELECT m.id_movimentacao, m.id_produto, p.nome, m.tipo, m.quantidade, m.data_hora, ' +
    'm.id_usuario, u.nome AS usuario ' +
    'FROM movimentacao m ' +
    'INNER JOIN produto p ON p.id_produto = m.id_produto ' +
    'LEFT JOIN usuario u ON u.id_usuario = m.id_usuario ' +
    'ORDER BY m.data_hora DESC, m.id_movimentacao DESC'
  )
  return resultado.rows
}
