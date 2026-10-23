CREATE TYPE ENUM perfil_usuario ('Operador', 'Administrador')

DROP TABLE IF EXISTS movimentacao;
DROP TABLE IF EXISTS produto;

CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(10) NOT NULL DEFAULT 'OPERADOR',
  CONSTRAINT chk_perfil_usuario CHECK (perfil IN ('OPERADOR', 'ADMIN'))
);

CREATE TABLE movimentacao (
  id_movimentacao SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  quantidade INT NOT NULL,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  fk_movimentacao_produto FOREIGN KEY (id_usuario) REFERENCES produto (id_usuario)
);

INSERT INTO usuario (nome, cpf, senha) VALUES
  ('Vassina', '12345678910', 'covid-19')
  ('Vinícius', '23456789011', 'serelepe191'),
  ('Silviane', '23456789014', '6767676767');

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);
