const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/cursos', authMiddleware(['super_admin']), adminController.getListaCursos);
router.post('/curso', authMiddleware(['super_admin']), adminController.postCriarCurso);
router.put('/curso/:id', authMiddleware(['super_admin']), adminController.putAtualizarCurso);
router.delete('/curso/:id', authMiddleware(['super_admin']), adminController.deleteCurso);

router.get('/coordenadores', authMiddleware(['super_admin']), adminController.getListaCoordenadores);
router.post('/coordenador', authMiddleware(['super_admin']), adminController.postCadastrarCoordenador);
router.put('/coordenador/:id', authMiddleware(['super_admin']), adminController.putAtualizarCoordenador);
router.delete('/coordenador/:id', authMiddleware(['super_admin']), adminController.deleteCoordenador);

router.get('/submissoes', authMiddleware(['super_admin']), adminController.getListaSubmissoes);
router.get('/alunos', authMiddleware(['super_admin']), adminController.getListaAlunos);

// Categorias (tipos de atividade)
router.get('/categorias', authMiddleware(['super_admin']), adminController.getListaCategorias);
router.post('/categoria', authMiddleware(['super_admin']), adminController.postCriarCategoria);
router.delete('/categoria/:id', authMiddleware(['super_admin']), adminController.deleteCategoria);

// Logs de auditoria
router.get('/logs', authMiddleware(['super_admin']), adminController.getLogs);

// Limites por curso
router.get('/limites-cursos', authMiddleware(['super_admin']), adminController.getLimitesCursos);

module.exports = router;
