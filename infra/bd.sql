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
  ('Teclado ABNT2', 'Teclado USB padrao ABNT2 com fio', 89.90, 10),
  ('Mouse optico', 'Mouse optico USB 1000 DPI', 39.90, 25),
  ('Monitor 21 polegadas', 'Monitor LED 21 polegadas Full HD', 749.00, 5);

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);

  CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(10) NOT NULL DEFAULT 'OPERADOR',
  CONSTRAINT chk_perfil_usuario CHECK (perfil IN ('OPERADOR', 'ADMIN'))
);

SELECT * FROM usuario;

-- OPERADOR: consulta, insere e atualiza
CREATE ROLE operador_almox LOGIN PASSWORD 'operador123';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO operador_almox;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO operador_almox;

-- ADMIN: tudo do operador e também deleta
CREATE ROLE admin_almox LOGIN PASSWORD 'admin123';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin_almox;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin_almox;

