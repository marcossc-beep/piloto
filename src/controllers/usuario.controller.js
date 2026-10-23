import * as usuarioService from '../services/usuario.service.js'
import { responderErro } from '../utils/responderErro.js'
import * as usuarioController from '../controllers/usuario.controller.js'

export default async function usuarioRoutes(servidor) {
  servidor.post('/usuarios', usuarioController.cadastrar)
  servidor.post('/login', usuarioController.login)
}


export async function cadastrar(request, reply) {
  try {
    const usuario = await usuarioService.cadastrar(request.body)
    return reply.status(201).send({ mensagem: 'Usuario cadastrado com sucesso', usuario })
  } catch (erro) {
    return responderErro(reply, erro)
  }
}

export async function login(request, reply) {
  try {
    const usuario = await usuarioService.login(request.body)
    const token = await reply.jwtSign(usuario)   // { id, nome, perfil } vão dentro do token
    return reply.status(200).send({ mensagem: 'Login realizado com sucesso', token, usuario })
  } catch (erro) {
    return responderErro(reply, erro)
  }
}
