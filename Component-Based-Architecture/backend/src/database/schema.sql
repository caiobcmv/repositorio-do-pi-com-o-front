-- Schema do Sistema de Horas Complementares - Senac

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nome_curso VARCHAR(150) NOT NULL,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    carga_horaria INT NOT NULL,
    duracao VARCHAR(50),
 criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de regras de atividades por curso
CREATE TABLE IF NOT EXISTS regras_atividades (
    id SERIAL PRIMARY KEY,
    curso_id INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    nome_categoria VARCHAR(100) NOT NULL,
    limite_horas INT NOT NULL,
    peso DECIMAL(3,2) DEFAULT 1.00,
    criado_em TIMESTAMP DEFAULT NOW(),
    UNIQUE(curso_id, nome_categoria)
);

-- Tabela de usuários (alunos, coordenadores, admin)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) UNIQUE,
    perfil VARCHAR(30) NOT NULL CHECK (perfil IN ('ALUNO', 'COORDENADOR', 'SUPER_ADMIN')),
    curso_id INT REFERENCES cursos(id) ON DELETE SET NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de atividades enviadas pelos alunos
CREATE TABLE IF NOT EXISTS atividades_enviadas (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    nome_atividade VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    horas_solicitadas DECIMAL(5,2) NOT NULL,
    horas_aprovadas DECIMAL(5,2),
    arquivo_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO')),
    feedback TEXT,
    coordenador_id INT REFERENCES usuarios(id),
    data_envio TIMESTAMP DEFAULT NOW(),
    data_validacao TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de logs do sistema
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    ip VARCHAR(45),
    criado_em TIMESTAMP DEFAULT NOW()
);

==========================
