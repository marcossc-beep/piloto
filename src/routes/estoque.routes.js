
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sql from '../config/db.js'
import { autenticar, permitirPerfis } from '../middlewares/auth.js'

export default async function usuariosRoutes(servidor) {
  // Cadastro do primeiro administrador
  servidor.post('/usuarios', async (request, reply) => {
    const { nome, email, senha, perfil } = request.body || {}

    if (
      typeof nome !== 'string' || !nome.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof senha !== 'string' || senha.length < 6
    ) {
      return reply.code(422).send({
        erro: 'Informe nome, email e senha com pelo menos 6 caracteres'
      })
    }

    const conexao = await sql.connect()

    try {
      await conexao.query('BEGIN')

      const total = await conexao.query(
        'SELECT COUNT(*) FROM usuarios'
      )

      const primeiro = Number(total.rows[0].count) === 0
      let perfilFinal = 'ADMINISTRADOR'

      if (!primeiro) {
        const authorization = request.headers.authorization

        if (!authorization?.startsWith('Bearer ')) {
          await conexao.query('ROLLBACK')
          return reply.code(401).send({ erro: 'Login de administrador necessario' })
        }

        let usuario

        try {
          usuario = jwt.verify(
            authorization.slice(7),
            process.env.JWT_SECRET
          )
        } catch {
          await conexao.query('ROLLBACK')
          return reply.code(401).send({ erro: 'Token invalido' })
        }

        if (usuario.perfil !== 'ADMINISTRADOR') {
          await conexao.query('ROLLBACK')
          return reply.code(403).send({ erro: 'Apenas administrador pode cadastrar usuarios' })
        }

        perfilFinal = perfil
      }

      if (!['ADMINISTRADOR', 'OPERADOR'].includes(perfilFinal)) {
        await conexao.query('ROLLBACK')
        return reply.code(422).send({ erro: 'Perfil invalido' })
      }

      const senhaHash = await bcrypt.hash(senha, 10)

      const resultado = await conexao.query(
        `INSERT INTO usuarios (nome, email, senha, perfil)
         VALUES ($1, $2, $3, $4)
         RETURNING id_usuario, nome, email, perfil`,
        [nome.trim(), email.trim().toLowerCase(), senhaHash, perfilFinal]
      )

      await conexao.query('COMMIT')

      return reply.code(201).send({
        mensagem: 'Usuario cadastrado com sucesso',
        usuario: resultado.rows[0]
      })
    } catch (erro) {
      await conexao.query('ROLLBACK')

      if (erro.code === '23505') {
        return reply.code(409).send({ erro: 'Email ja cadastrado' })
      }

      console.error(erro)
      return reply.code(500).send({ erro: 'Erro ao cadastrar usuario' })
    } finally {
      conexao.release()
    }
  })

  // Login
  servidor.post('/login', async (request, reply) => {
    const { email, senha } = request.body || {}

    if (!email || !senha) {
      return reply.code(422).send({ erro: 'Informe email e senha' })
    }

    try {
      const resultado = await sql.query(
        `SELECT id_usuario, nome, email, senha, perfil
         FROM usuarios
         WHERE email = $1 AND ativo = TRUE`,
        [String(email).trim().toLowerCase()]
      )

      if (!resultado.rows.length) {
        return reply.code(401).send({ erro: 'Email ou senha incorretos' })
      }

      const usuario = resultado.rows[0]
      const valida = await bcrypt.compare(String(senha), usuario.senha)

      if (!valida) {
        return reply.code(401).send({ erro: 'Email ou senha incorretos' })
      }

      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          nome: usuario.nome,
          perfil: usuario.perfil
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )

      return reply.send({
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil
        }
      })
    } catch (erro) {
      console.error(erro)
      return reply.code(500).send({ erro: 'Erro ao realizar login' })
    }
  })

  // Consultar usuários: somente administrador
  servidor.get('/usuarios', {
    preHandler: [autenticar, permitirPerfis('ADMINISTRADOR')]
  }, async (request, reply) => {
    try {
      const resultado = await sql.query(
        `SELECT id_usuario, nome, email, perfil, ativo
         FROM usuarios ORDER BY id_usuario`
      )

      return reply.send(resultado.rows)
    } catch (erro) {
      console.error(erro)
      return reply.code(500).send({ erro: 'Erro ao listar usuarios' })
    }
  })
}
