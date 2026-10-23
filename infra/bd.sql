-- Antes de rodar: crie o banco "empresa" no pgAdmin
-- (botao direito em Databases > Create > Database...) e abra o Query Tool nele.

DROP TABLE IF EXISTS movimentacao;
DROP TABLE IF EXISTS produto;

ENUM AS TYPE usuario ("administrador", "operador")


CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  perfil_usuario ENUM AS TYPE
)

CREATE TABLE produto (
  id_produto SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255) NULL,
  valor_unitario NUMERIC(10,2) NOT NULL,
  estoque_disponivel INT NOT NULL DEFAULT 0,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacao (
  id_movimentacao SERIAL PRIMARY KEY,
  id_produto INT NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  quantidade INT NOT NULL,
  data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  CONSTRAINT chk_tipo_movimentacao CHECK (tipo IN ('ENTRADA','SAIDA')),
  CONSTRAINT fk_movimentacao_produto FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
);

INSERT INTO produto (nome, descricao, valor_unitario, quantidade) VALUES
  ('detergente', 'sabor coco', 9.90, 10),
  ('sabonete', 'liquido', 9.90, 25),
  ('agua sanitaria', 'Qboa', 49.00, 5);

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);
