import * as movimentacaoController from '../controllers/movimentacao.controller.js'

export default async function movimentacaoRoutes(servidor) {
  servidor.post('/movimentar_produto', movimentacaoController.registrar)
  servidor.get('/listar_movimentacoes', movimentacaoController.listar)
}
