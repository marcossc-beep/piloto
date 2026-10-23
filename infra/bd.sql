DROP TABLE IF EXISTS movimentacao;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
id_usuarios SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
senha VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL unique,
cpf VARCHAR(100) NOT NULL unique
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

INSERT INTO usuarios (nome, senha, email, cpf) VALUES
('Fylipe', '676767','fylipe@gmail.com','676.676.676-67'),
('Marcos', '424242','marcos@gmail.com','424.424.424-42'),
('Joana', '1234567','joana@gmail.com','123.456.678-90');

INSERT INTO produto (nome, descricao, valor_unitario, quantidade) VALUES
  ('rodo', 'rodo de chão', 30.99, 10),
  ('pano', 'pano de chão', 25.99, 25),
  ('balde', 'balde verde para botar água', 999.99, 5);

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);

  select * from usuarios;
  select * from produto;
  select * from movimentacao;
  
