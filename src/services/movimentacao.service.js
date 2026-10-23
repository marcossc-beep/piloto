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
