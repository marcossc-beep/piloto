-- Antes de rodar: crie o banco "empresa" no pgAdmin
-- (botao direito em Databases > Create > Database...) e abra o Query Tool nele.

DROP TABLE IF EXISTS movimentacao;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(10) NOT NULL DEFAULT 'OPERADOR',
  CONSTRAINT chk_perfil_usuario CHECK (perfil IN ('OPERADOR', 'ADMIN'))
);


CREATE TABLE produto (
  id_produto SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255) NULL,
  valor_unitario NUMERIC(10,2) NOT NULL,
  quantidade INT NOT NULL DEFAULT 0,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacao (
  id_movimentacao SERIAL PRIMARY KEY,
  id_produto INT NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  quantidade INT NOT NULL,
  CONSTRAINT chk_tipo_movimentacao CHECK (tipo IN ('ENTRADA','SAIDA')),
  CONSTRAINT fk_movimentacao_produto FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
);

INSERT INTO produto (nome, descricao, valor_unitario, quantidade) VALUES
  ('Detergente', 'Sabão liquido para louça', 11.90, 30),
  ('Bombril', 'Esponja de aço', 5.50, 25),
  ('Luva', 'Luva de borracha para limpeza', 23.90, 20);

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 30),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 20);

  INSERT INTO usuario (nome, email, senha, perfil) VALUES
  ('Davi souza', 'davi@email', 'cachorro123', 'ADMIN'),
  ('Igor melo', 'igor@email', 'gato123', 'OPERADOR'),
  ('Vinicius silva', 'vini@email', 'passaro123', 'OPERADOR');

