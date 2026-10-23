
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
  ('Esfregão', 'Esfregão com cabo de aço e pano de microfibra', 89.90, 10),
  ('Pano de microfibra', 'Pano para limpar superfícies seníveis', 39.90, 25),
  ('Detergente', 'usado pra fazer espuma', 749.00, 5);

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);

  INSERT INTO usuario (nome, email, senha, perfil) VALUES
  ('Iago','iagogames@gmail.com','docepraanimaodia123', 'ADMIN'),
  ('Guilherme','guiprogamador@gmail.com','euusojava', 'OPERADOR'),
  ('Giulia','giulialinda@gmail.com','gostodebatata', 'OPERADOR');