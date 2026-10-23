DROP TABLE IF EXISTS movimentacao;
DROP TABLE IF EXISTS produto;

create table usuario(
	id_usuario SERIAL primary key,
	nome VARCHAR(100) not null,
	 senha VARCHAR(255) not null,
	 cpf VARCHAR(255) not null unique,
   email VARCHAR(255) not null unique
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

INSERT INTO usuario (nome, senha, cpf, email) VALUES
  ('vitor', 'coracao de mae', '111.222.333-44' 'vitorml'),
  ('bigpanca', 'zumbi do jantares', '555.666.777-88' 'bigpanca'),
  ('alexandre', 'qual seu tom pele', '999.123.456-78' 'gadotti');

INSERT INTO produto (nome, descricao, valor_unitario, quantidade) VALUES
  ('agua sanitaria', 'agua sanitaria 2L', 40.90, 10),
  ('rodo', 'rodo para puxar agua', 29.90, 25),
  ('buxa', 'esponja amarela e verde', 22.22, 22);

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);

  select * from usuario
  select * from produto
  select * from movimentacao
