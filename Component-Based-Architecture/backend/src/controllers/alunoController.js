const pool = require('../config/database');

// Dashboard do aluno
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.usuario.id;
        const cursoId = req.usuario.curso_id;

        const alunoRes = await pool.query(
            'SELECT id, nome, email, matricula, curso_id FROM usuarios WHERE id = $1', [userId]
        );
        if (!alunoRes.rows.length) return res.status(404).json({ erro: 'Aluno não encontrado.' });
        const aluno = alunoRes.rows[0];

        const horasRes = await pool.query(
            `SELECT COALESCE(SUM(horas_aprovadas), 0) as total FROM atividades_enviadas
             WHERE aluno_id = $1 AND status = 'APROVADO'`, [userId]
        );

        const pendRes = await pool.query(
            `SELECT COUNT(*) FROM atividades_enviadas WHERE aluno_id = $1 AND status = 'PENDENTE'`, [userId]
        );

        const totalRes = await pool.query(
            `SELECT COUNT(*) FROM atividades_enviadas WHERE aluno_id = $1`, [userId]
        );

        let cursoNome = 'Não vinculado';
        let cargaHoraria = 0;
        if (aluno.curso_id) {
            const cursoRes = await pool.query('SELECT nome_curso, carga_horaria FROM cursos WHERE id = $1', [aluno.curso_id]);
            if (cursoRes.rows.length) {
                cursoNome = cursoRes.rows[0].nome_curso;
                cargaHoraria = cursoRes.rows[0].carga_horaria;
            }
        }

        res.json({
            aluno: { ...aluno, curso_nome: cursoNome, carga_horaria_curso: cargaHoraria },
            horas_aprovadas: parseFloat(horasRes.rows[0].total),
            pendentes: parseInt(pendRes.rows[0].count),
            total_submissoes: parseInt(totalRes.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Enviar atividade
exports.postEnviarAtividade = async (req, res) => {
    try {
        const { nome_atividade, categoria, horas_solicitadas, arquivo_url } = req.body;
        const aluno_id = req.usuario.id;
        const curso_id = req.usuario.curso_id;

        if (!curso_id) return res.status(400).json({ erro: 'Aluno não está vinculado a um curso.' });
        if (!nome_atividade || !categoria || !horas_solicitadas)
            return res.status(400).json({ erro: 'Preencha todos os campos.' });

        const query = `
            INSERT INTO atividades_enviadas (aluno_id, curso_id, nome_atividade, categoria, horas_solicitadas, arquivo_url, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'PENDENTE') RETURNING *`;

        const result = await pool.query(query, [aluno_id, curso_id, nome_atividade, categoria, horas_solicitadas, arquivo_url || null]);
        res.status(201).json({ mensagem: 'Atividade enviada com sucesso!', atividade: result.rows[0] });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Minhas submissões
exports.getMinhasSubmissoes = async (req, res) => {
    try {
        const aluno_id = req.usuario.id;
        const result = await pool.query(
            `SELECT a.*, c.sigla as curso_sigla
             FROM atividades_enviadas a
             JOIN cursos c ON a.curso_id = c.id
             WHERE a.aluno_id = $1
             ORDER BY a.data_envio DESC`, [aluno_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Regras do meu curso
exports.getRegrasMeuCurso = async (req, res) => {
    try {
        const curso_id = req.usuario.curso_id;
        if (!curso_id) return res.status(400).json({ erro: 'Aluno não está vinculado a um curso.' });

        const result = await pool.query('SELECT * FROM regras_atividades WHERE curso_id = $1', [curso_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
