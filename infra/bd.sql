-- Antes de rodar: crie o banco "empresa" no pgAdmin
-- (botao direito em Databases > Create > Database...) e abra o Query Tool nele.

CREATE TYPE ENUEM perfil_usuario ('Operador' , 'Administrador')

DROP TABLE IF EXISTS movimentacao;
DROP TABLE IF EXISTS produto;

CREATE TABLE usuario (
  id_produto SERIAL PRIMARY KEY,
  nome VARCHAR(225) NOT NULL,
  perfil perfil_usuario NOT NULL DEFAULT 'Operador'
  senha NUMERIC(167) NOT NULL,
  cpf VARCHAR (11) UNIQUE NOT NULL
);

CREATE TABLE movimentacao (
  id_movimentacao SERIAL PRIMARY KEY,
  id_produto INT NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  quantidade INT NOT NULL,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  fk_movimentacao_produto FOREIGN KEY (id_usuario) REFERENCES produto (id_usuario)
);

INSERT INTO usuario (nome, senha, cpf) VALUES
  ('Heleninha', "1234", "12295556929"),
  ('Karatekinha', "4321", "12295556929"),
  ('Vavazinha', "1423", "12295556929");

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);
