/**
 * apiHelper.js — Utilitário compartilhado para comunicação com o backend
 * Inclui: autenticação, guard de rotas, helpers de API e funções de formatação.
 */

const API = '';

/* ---------- Auth ---------- */

function getToken() {
    return localStorage.getItem('token');
}

function getPerfil() {
    return localStorage.getItem('perfil');
}

function requireAuth() {
    const token = getToken();
    const perfil = getPerfil();
    if (!token || !perfil) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'index.html';
        throw new Error('No token');
    }
    return { token, perfil };
}

function requireRole(...allowedRoles) {
    const { token, perfil } = requireAuth();
    if (!allowedRoles.includes(perfil)) {
        alert('Acesso negado. Perfil: ' + perfil);
        window.location.href = 'index.html';
        throw new Error('Wrong role');
    }
    return { token, perfil };
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    window.location.href = 'index.html';
}

/* ---------- API helpers ---------- */

async function apiCall(endpoint, method = 'GET', body = null) {
    const token = getToken();
    try {
        const opts = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        };
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            opts.body = JSON.stringify(body);
        }

        const res = await fetch(`${API}${endpoint}`, opts);

        if (res.status === 401) {
            logout();
            return null;
        }

        return res.json();
    } catch (err) {
        console.error('API Error', err);
        return null;
    }
}

async function apiGet(endpoint) { return apiCall(endpoint, 'GET'); }
async function apiPost(endpoint, body) { return apiCall(endpoint, 'POST', body); }
async function apiPatch(endpoint, body) { return apiCall(endpoint, 'PATCH', body); }

/* ---------- Formatação ---------- */

function formatarData(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${d.getDate()} ${meses[d.getMonth()]}, ${d.getFullYear()}`;
}

function statusBadge(status) {
    const map = {
        'ATIVO': { class: 'status-ativo-curso', label: 'Ativo' },
        'INATIVO': { class: 'status-rascunho', label: 'Inativo' },
        'PENDENTE': { class: 'status-rascunho', label: 'Pendente' },
        'APROVADO': { class: 'status-ativo-curso', label: 'Aprovado' },
        'REJEITADO': { class: 'status-inativo', label: 'Rejeitado' },
    };
    const s = map[status] || { class: '', label: status || '—' };
    return `<span class="status-tag ${s.class}">${s.label}</span>`;
}

function getInitials(nome) {
    if (!nome) return '??';
    return nome.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function initialsColor(nome) {
    const cores = ['bg-azul', 'bg-laranja', 'bg-verde', 'bg-cinza', 'bg-roxo'];
    const chars = nome || '';
    let sum = 0;
    for (let i = 0; i < chars.length; i++) sum += chars.charCodeAt(i);
    return cores[sum % cores.length];
}
