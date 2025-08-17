'use strict';
import { readTurmas } from './turmas.js';
const getLocalStorage = () => JSON.parse(localStorage.getItem('dbAlunos') ?? '[]');
const setLocalStorage = (db) => localStorage.setItem('dbAlunos', JSON.stringify(db));
const createAluno = (aluno) => {
    const db = getLocalStorage();
    db.push(aluno);
    setLocalStorage(db);
};
export const readAlunos = () => getLocalStorage();
const updateAluno = (index, aluno) => {
    const db = getLocalStorage();
    db[index] = aluno;
    setLocalStorage(db);
};
const deleteAluno = (index) => {
    const db = getLocalStorage();
    db.splice(index, 1);
    setLocalStorage(db);
};
const openModal = () => {
    document.getElementById('modalAluno')?.classList.add('active');
    loadTurmasInSelect();
};
const closeModal = () => {
    document.getElementById('modalAluno')?.classList.remove('active');
    clearFields();
    setTitle('Novo Aluno');
};
const setTitle = (text) => {
    const title = document.getElementById('titleAluno');
    if (title)
        title.textContent = text;
};
const clearFields = () => {
    const form = document.getElementById('formAluno');
    form.reset();
    const matriculaInput = document.getElementById('matricula');
    matriculaInput.dataset.index = 'new';
};
const isValidFields = () => {
    const form = document.getElementById('formAluno');
    return form.reportValidity();
};
const fillFields = (aluno, index) => {
    openModal();
    document.getElementById('matricula').value = aluno.matricula;
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('idade').value = aluno.idade.toString();
    const turmaSelect = document.getElementById('turma');
    turmaSelect.value = aluno.turma;
    document.getElementById('matricula').dataset.index = index.toString();
    setTitle(`Editando ${aluno.nome}`);
};
const isMatriculaUnica = (matricula, index) => {
    const db = readAlunos();
    const alunosFiltrados = index !== undefined
        ? db.filter((_, i) => i !== index)
        : db;
    return !alunosFiltrados.some(aluno => aluno.matricula === matricula);
};
const saveAluno = (ev) => {
    ev.preventDefault();
    if (!isValidFields())
        return;
    const matricula = document.getElementById('matricula').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const idade = Number(document.getElementById('idade').value);
    const turma = document.getElementById('turma').value;
    const indexStr = document.getElementById('matricula').dataset.index ?? 'new';
    const index = indexStr === 'new' ? undefined : Number(indexStr);
    if (!isMatriculaUnica(matricula, index)) {
        alert('Erro: A matrícula informada já existe. Por favor, use uma matrícula única.');
        return;
    }
    const aluno = { matricula, nome, idade, turma };
    if (indexStr === 'new') {
        createAluno(aluno);
    }
    else {
        updateAluno(Number(indexStr), aluno);
    }
    updateTable();
    closeModal();
};
const createRow = (aluno, index) => {
    const tbody = document.querySelector('#tableAlunos tbody');
    if (!tbody)
        return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td data-label="Matrícula">${aluno.matricula}</td>
        <td data-label="Nome">${aluno.nome}</td>
        <td data-label="Idade">${aluno.idade}</td>
        <td data-label="Turma">${aluno.turma}</td>
        <td data-label="Ação">
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
    tbody.appendChild(tr);
};
const clearTable = () => {
    const tbody = document.querySelector('#tableAlunos tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
};
const updateTable = () => {
    clearTable();
    const alunos = readAlunos();
    alunos.forEach(createRow);
};
const editDelete = (ev) => {
    const target = ev.target;
    if (target.tagName.toLowerCase() !== 'button')
        return;
    const [action, indexStr] = target.id.split('-');
    const index = Number(indexStr);
    if (isNaN(index))
        return;
    if (action === 'edit') {
        const aluno = readAlunos()[index];
        fillFields(aluno, index);
    }
    else if (action === 'delete') {
        const aluno = readAlunos()[index];
        const confirmDelete = confirm(`Deseja excluir o aluno ${aluno.nome}?`);
        if (confirmDelete) {
            deleteAluno(index);
            updateTable();
        }
    }
};
const loadTurmasInSelect = () => {
    const turmaSelect = document.getElementById('turma');
    if (!turmaSelect)
        return;
    turmaSelect.innerHTML = '<option value="" selected disabled>Selecione uma Turma</option>';
    const turmas = readTurmas();
    turmas.forEach(turma => {
        const option = document.createElement('option');
        option.value = turma.codigo;
        option.textContent = `${turma.nome} (${turma.ano})`;
        turmaSelect.appendChild(option);
    });
};
export function iniciarAlunos() {
    const form = document.getElementById('formAluno');
    if (form?.dataset.iniciado)
        return;
    if (form)
        form.dataset.iniciado = 'true';
    document.getElementById('cadastrarAlunoDesktop')?.addEventListener('click', openModal);
    document.getElementById('modalAluno')?.addEventListener('click', ev => {
        if (ev.target.id === 'modalAluno')
            closeModal();
    });
    document.getElementById('closeAluno')?.addEventListener('click', closeModal);
    document.getElementById('cancelarAluno')?.addEventListener('click', ev => {
        ev.preventDefault();
        closeModal();
    });
    document.getElementById('salvarAluno')?.addEventListener('click', saveAluno);
    document.querySelector('#tableAlunos tbody')?.addEventListener('click', editDelete);
    updateTable();
}
