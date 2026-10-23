import Fastify from 'fastify'
import 'dotenv/config'
import jwt from '@fastify/jwt'


import produtoRoutes from './routes/produto.routes.js'
import movimentacaoRoutes from './routes/movimentacao.routes.js'

const servidor = Fastify()

servidor.register(jwt, {
  secret: process.env.JWT_SECRET || 'troque_esta_chave',
  sign: { expiresIn: '1h' }
})

servidor.register(produtoRoutes)
servidor.register(movimentacaoRoutes)

const porta = Number(process.env.PORT) || 3000

servidor.listen({ port: porta }, (erro) => {
  if (erro) {
    console.log(erro)
    process.exit(1)
  }

  console.log('Servidor rodando na porta ' + porta)
})
