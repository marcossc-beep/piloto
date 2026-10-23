CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(10) NOT NULL DEFAULT 'OPERADOR',
  CONSTRAINT chk_perfil_usuario CHECK (perfil IN ('OPERADOR', 'ADMIN'))
);

INSERT INTO produto (nome, descricao, valor_unitario, quantidade) VALUES
  ('Esfregão', 'Esfregão longo para chão', 89.90, 10),
  ('Esponja', 'Esponja amarela e verde', 39.90, 25),
  ('Detergente', 'Produto líquido que gera espuma', 19.00, 5);

INSERT INTO movimentacao (id_produto, tipo, quantidade) VALUES
  (1, 'ENTRADA', 10),
  (2, 'ENTRADA', 25),
  (3, 'ENTRADA', 5);

INSERT INTO usuario (nome, email, senha, perfil) VALUES
	('Guilherme', 'guilherme_machado18@estudante.sesisenai.org.br', '1234', 'ADMIN'),
	('Marcos', 'marquinholindo@gmail.com', '123', 'OPERADOR'),
	('Iago', 'iago@gmail.com', '123', 'OPERADOR');