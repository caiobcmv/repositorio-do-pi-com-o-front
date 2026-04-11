const express = require('express');
const cors = require('cors');
const path = require('path'); 

// AJUSTE AQUI: '..' sai de 'src', 'config' entra na pasta, '.env' lê o arquivo
require('dotenv').config({ path: path.join(__dirname, '..', 'config', '.env') });

const app = express();

app.use(cors());
app.use(express.json()); 

// Configuração dos arquivos estáticos (frontend está fora da pasta backend)
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// Importação das Rotas (estão na mesma pasta src, então usamos './')
const rotasAdmin = require('./routes/admin');
const rotasCoordenador = require('./routes/coordenador');
const rotasAluno = require('./routes/aluno');
const rotasAuth = require('./routes/authRoutes');

app.use('/admin', rotasAdmin);
app.use('/coordenador', rotasCoordenador);
app.use('/aluno', rotasAluno);
app.use('/auth', rotasAuth);

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
    // TESTE DE CONEXÃO: Verifique se as variáveis estão carregando
    console.log("--- Verificação de Configuração ---");
    console.log("Pasta atual (__dirname):", __dirname);
    console.log("DB_USER:", process.env.DB_USER || "NÃO CARREGADO");
    console.log("DB_PASS:", process.env.DB_PASSWORD ? "OK (String carregada)" : "ERRO (Vazio)");
});

process.on('uncaughtException', (err) => {
    console.error('Erro crítico no servidor:', err.message);
});