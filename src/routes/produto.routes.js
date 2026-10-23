import * as produtoController from '../controllers/produto.controller.js'

export default async function produtoRoutes(servidor) {
  servidor.get('/listar_produtos', produtoController.listar)
  servidor.get('/listar_produto/:id', produtoController.consultar)
  servidor.post('/add_produto', produtoController.cadastrar)
  servidor.put('/atualizar_produto/:id', produtoController.atualizar)
  servidor.delete('/deletar_produto', produtoController.remover)
}