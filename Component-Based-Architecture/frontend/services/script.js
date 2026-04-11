/**
 * script.js — Login + Helpers de API
 * Localizado em: /frontend/services/script.js
 */

const API = ''; // Caminho relativo - usa a mesma origem do servidor

/* ========== LOGIN ========== */

function acessarPortal() {
    const perfilSelecionado = document.querySelector('input[name="perfil"]:checked');
    const email = document.getElementById('usuario')?.value?.trim();
    const senha = document.getElementById('senha')?.value;

    if (!perfilSelecionado) {
        alert('Selecione um perfil.');
        return;
    }
    if (!email || !senha) {
        alert('Preencha e-mail e senha.');
        return;
    }

    // O fetch aponta para /auth/login (definido no seu server.js)
    fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert(data.erro);
            return;
        }

        // Salva os dados da sessão
        localStorage.setItem('token', data.token);
        localStorage.setItem('perfil', data.perfil);
        if (data.nome) localStorage.setItem('nome', data.nome);
        if (data.email) localStorage.setItem('email', data.email);

        // REDIRECIONAMENTO COM CAMINHO ABSOLUTO
        // Usamos /pages/ para garantir que o navegador ache a pasta correta
        const perfilReal = data.perfil;
        if (perfilReal === 'ALUNO') {
            window.location.href = '/pages/Dasboard.html';
        } else if (perfilReal === 'COORDENADOR') {
            window.location.href = '/pages/dashboardadm.html';
        } else if (perfilReal === 'SUPER_ADMIN') {
            window.location.href = '/pages/configadm.html';
        } else {
            alert('Perfil não reconhecido: ' + perfilReal);
        }
    })
    .catch(err => {
        console.error('Erro no login:', err);
        alert('Erro na conexão com o servidor. Verifique se o backend está ligado.');
    });
}

/* ========== AUTH GUARD (Proteção de Páginas) ========== */

function protegerPagina(perfisPermitidos) {
    const token = localStorage.getItem('token');
    const perfil = localStorage.getItem('perfil');

    if (!token || !perfil) {
        window.location.href = '/pages/index.html';
        return null;
    }

    if (perfisPermitidos && !perfisPermitidos.includes(perfil)) {
        alert('Acesso negado para o perfil ' + perfil);
        window.location.href = '/pages/index.html';
        return null;
    }

    return { token, perfil };
}

function logout() {
    localStorage.clear(); // Limpa tudo de uma vez
    window.location.href = '/pages/index.html';
}

/* ========== API HELPERS ========== */

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const opts = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...(options.headers || {})
        }
    };

    if (options.body && typeof options.body === 'object') {
        opts.body = JSON.stringify(options.body);
    }

    try {
        const res = await fetch(API + endpoint, opts);
        if (res.status === 401) {
            logout();
            throw new Error('Sessão expirada.');
        }
        return await res.json();
    } catch (err) {
        console.error(`Erro em ${endpoint}:`, err);
        throw err;
    }
}

const apiGet = (endpoint) => apiFetch(endpoint, { method: 'GET' });
const apiPost = (endpoint, body) => apiFetch(endpoint, { method: 'POST', body });
const apiPatch = (endpoint, body) => apiFetch(endpoint, { method: 'PATCH', body });

/* ========== UTILS (Formatação e UI) ========== */

function formatarData(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${d.getDate()} ${meses[d.getMonth()]}, ${d.getFullYear()}`;
}

function getIniciais(nome) {
    if (!nome) return '??';
    return nome.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function colorAvatar(nome) {
    const cores = ['bg-azul', 'bg-laranja', 'bg-verde', 'bg-cinza', 'bg-roxo'];
    let h = 0;
    if (nome) {
        for (let i = 0; i < nome.length; i++) h = ((h << 5) - h) + nome.charCodeAt(i);
    }
    return cores[Math.abs(h) % cores.length];
}
const corAvatar = colorAvatar;