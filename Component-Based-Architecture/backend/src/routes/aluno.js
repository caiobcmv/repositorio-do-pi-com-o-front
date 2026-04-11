const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const authMiddleware = require('../middleware/auth');

// Teste
router.get('/teste', (req, res) => res.json({ msg: "Rota Aluno funcionando!" }));

// Dados do aluno logado (meus dados)
router.get('/dashboard', authMiddleware(['ALUNO']), alunoController.getDashboard);
router.get('/meus-dados', authMiddleware(['ALUNO']), alunoController.getDashboard);

// Enviar atividade
router.post('/atividades', authMiddleware(['ALUNO']), alunoController.postEnviarAtividade);

// Minhas submissões
router.get('/submissoes', authMiddleware(['ALUNO']), alunoController.getMinhasSubmissoes);

// Regras do meu curso
router.get('/regras', authMiddleware(['ALUNO']), alunoController.getRegrasMeuCurso);

module.exports = router;