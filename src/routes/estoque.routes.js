
import produtoRoutes from './routes/produto.routes.js'
import movimentacaoRoutes from './routes/movimentacao.routes.js'

// Dentro da inicializacao do Fastify:
await servidor.register(produtoRoutes)
await servidor.register(movimentacaoRoutes)
