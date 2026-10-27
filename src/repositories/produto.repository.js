import sql from '../config/db.js'

const CAMPOS = 'id_produto, nome, descricao, valor_unitario, quantidade, data_cadastro'

export async function listar() {
  const resultado = await sql.query('SELECT ' + CAMPOS + ' FROM produto ORDER BY id_produto')
  return resultado.rows
}

export async function buscarPorId(id) {
  const resultado = await sql.query('SELECT ' + CAMPOS + ' FROM produto WHERE id_produto = $1', [id])
  return resultado.rows[0]   // undefined quando não encontra
}

export async function inserir(produto) {
  const resultado = await sql.query(
    'INSERT INTO produto (nome, descricao, valor_unitario, quantidade) VALUES ($1, $2, $3, $4) RETURNING id_produto',
    [produto.nome, produto.descricao, produto.valor, produto.quantidade]
  )
  return resultado.rows[0].id_produto
}

export async function atualizar(id, produto) {
  const resultado = await sql.query(
    'UPDATE produto SET nome = $1, descricao = $2, valor_unitario = $3, quantidade = $4 WHERE id_produto = $5',
    [produto.nome, produto.descricao, produto.valor, produto.quantidade, id]
  )
  return resultado.rowCount   // quantas linhas mudaram (0 = não existe)
}

export async function possuiMovimentacoes(id) {
  const resultado = await sql.query('SELECT 1 FROM movimentacao WHERE id_produto = $1 LIMIT 1', [id])
  return resultado.rows.length > 0
}

export async function remover(id) {
  const resultado = await sql.query('DELETE FROM produto WHERE id_produto = $1', [id])
  return resultado.rowCount
}
