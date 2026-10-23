import Fastify from 'fastify'
import 'dotenv/config'

import estoqueRoutes from './routes/estoque.routes.js'

const servidor = Fastify()

import jwt from '@fastify/jwt'

servidor.register(jwt, {
  secret: process.env.JWT_SECRET || 'troque_esta_chave',
  sign: { expiresIn: '1h' }
})


servidor.register(estoqueRoutes)

const porta = Number(process.env.PORT) || 3000

servidor.listen({ port: porta }, (erro) => {
  if (erro) {
    console.log(erro)
    process.exit(1)
  }
  console.log('Servidor rodando na porta ' + porta)
})
