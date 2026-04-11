// init-db.js — Rodar: node src/init-db.js
// Cria as tabelas e o Super Admin inicial do sistema

const pool = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function init() {
    try {
        // Tabela cursos
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cursos (
                id SERIAL PRIMARY KEY,
                nome_curso VARCHAR(150) NOT NULL,
                sigla VARCHAR(10) NOT NULL UNIQUE,
                carga_horaria INT NOT NULL,
                duracao VARCHAR(50),
                criado_em TIMESTAMP DEFAULT NOW()
            )
        `);

        // Tabela regras_atividades
        await pool.query(`
            CREATE TABLE IF NOT EXISTS regras_atividades (
                id SERIAL PRIMARY KEY,
                curso_id INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
                nome_categoria VARCHAR(100) NOT NULL,
                limite_horas INT NOT NULL,
                peso DECIMAL(3,2) DEFAULT 1.00,
                criado_em TIMESTAMP DEFAULT NOW(),
                UNIQUE(curso_id, nome_categoria)
            )
        `);

        // Tabela usuarios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                matricula VARCHAR(50) UNIQUE,
                perfil VARCHAR(30) NOT NULL CHECK (perfil IN ('ALUNO', 'COORDENADOR', 'SUPER_ADMIN')),
                curso_id INT REFERENCES cursos(id) ON DELETE SET NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            )
        `);

        // Tabela atividades_enviadas
        await pool.query(`
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
                data_validacao TIMESTAMP
            )
        `);

        // Tabela logs
        await pool.query(`
            CREATE TABLE IF NOT EXISTS system_logs (
                id SERIAL PRIMARY KEY,
                usuario_id INT REFERENCES usuarios(id),
                acao VARCHAR(100) NOT NULL,
                descricao TEXT,
                ip VARCHAR(45),
                criado_em TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('✅ Tabelas criadas com sucesso.');

        // Criar Super Admin se não existir
        const existe = await pool.query("SELECT id FROM usuarios WHERE perfil = 'SUPER_ADMIN'");
        if (existe.rows.length === 0) {
            const senhaHash = await bcrypt.hash('admin123', 10);
            await pool.query(
                `INSERT INTO usuarios (nome, email, senha, perfil) VALUES ('Super Admin', 'admin@senac.br', $1, 'SUPER_ADMIN')`,
                [senhaHash]
            );
            console.log('✅ Super Admin criado: admin@senac.br / admin123');
        } else {
            console.log('ℹ️  Super Admin já existe.');
        }

        // Inserir dados de exemplo se estiver vazio
        const countCursos = await pool.query('SELECT COUNT(*) FROM cursos');
        if (parseInt(countCursos.rows[0].count) === 0) {
            const cursos = [
                ['Análise e Desenvolvimento de Sistemas', 'ADS', 2400, '8 Semestres'],
                ['Design Gráfico', 'DSG', 1600, '4 Semestres'],
                ['Gastronomia', 'GSR', 2000, '5 Semestres'],
                ['Administração', 'ADM', 2400, '8 Semestres'],
                ['Enfermagem', 'ENF', 2400, '8 Semestres'],
                ['Engenharia de Software', 'ENG', 3200, '10 Semestres'],
            ];
            for (const c of cursos) {
                await pool.query(
                    `INSERT INTO cursos (nome_curso, sigla, carga_horaria, duracao) VALUES ($1, $2, $3, $4)`,
                    c
                );
            }
            console.log('✅ 6 cursos de exemplo inseridos.');

            // Coordenador de exemplo
            const coordSenha = await bcrypt.hash('coord123', 10);
            const resCurso = await pool.query("SELECT id FROM cursos WHERE sigla = 'ADS'");
            const cursoId = resCurso.rows[0].id;
            await pool.query(
                `INSERT INTO usuarios (nome, email, senha, perfil, curso_id) VALUES ('Carlos Mendes', 'carlos@senac.br', $1, 'COORDENADOR', $2)`,
                [coordSenha, cursoId]
            );
            console.log('✅ Coordenador de exemplo: carlos@senac.br / coord123');

            // Aluno de exemplo
            const alunoSenha = await bcrypt.hash('aluno123', 10);
            await pool.query(
                `INSERT INTO usuarios (nome, email, senha, matricula, perfil, curso_id) VALUES ('Ana Silva', 'ana@senac.br', $1, '202400001', 'ALUNO', $2)`,
                [alunoSenha, cursoId]
            );
            console.log('✅ Aluno de exemplo: ana@senac.br / aluno123');

            // Regras de exemplo
            await pool.query(
                `INSERT INTO regras_atividades (curso_id, nome_categoria, limite_horas, peso) VALUES ($1, 'Monitoria Acadêmica', 40, 1.50)`,
                [cursoId]
            );
            await pool.query(
                `INSERT INTO regras_atividades (curso_id, nome_categoria, limite_horas, peso) VALUES ($1, 'Eventos e Palestras', 20, 1.00)`,
                [cursoId]
            );
            console.log('✅ Regras de horas inseridas.');
        } else {
            console.log('ℹ️  Dados de exemplo já existem.');
        }

        console.log('\n🎉 Banco de dados inicializado!');
        console.log('\n--- Credenciais de exemplo ---');
        console.log('  Super Admin: admin@senac.br / admin123');
        console.log('  Coordenador: carlos@senac.br / coord123');
        console.log('  Aluno:       ana@senac.br / aluno123');

        process.exit(0);
    } catch (err) {
        console.error('❌ Erro:', err.message);
        process.exit(1);
    }
}

init();
