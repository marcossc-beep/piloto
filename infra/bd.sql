
DROP TABLE IF EXISTS movimentacao CASCADE;
DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL
        CHECK (perfil IN ('ADMINISTRADOR', 'OPERADOR')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    valor_unitario NUMERIC(10,2) NOT NULL CHECK (valor_unitario >= 0),
    quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacao (
    id_movimentacao SERIAL PRIMARY KEY,
    id_produto INT NOT NULL REFERENCES produto(id_produto),
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA')),
    quantidade INT NOT NULL CHECK (quantidade > 0),
    data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO produto (nome, descricao, valor_unitario, quantidade) VALUES
('Teclado ABNT2', 'Teclado USB com fio', 89.90, 10),
('Mouse optico', 'Mouse USB', 39.90, 25),
('Monitor', 'Monitor LED', 749.00, 5);

