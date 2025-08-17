'use strict';


import { Turma, readTurmas } from './turmas.js';

export interface Aluno {
    matricula: string;
    nome: string;
    idade: number;
    turma: string; 
}


const getLocalStorage = (): Aluno[] => JSON.parse(localStorage.getItem('dbAlunos') ?? '[]');
const setLocalStorage = (db: Aluno[]) => localStorage.setItem('dbAlunos', JSON.stringify(db));


const createAluno = (aluno: Aluno) => {
    const db = getLocalStorage();
    db.push(aluno);
    setLocalStorage(db);
};

export const readAlunos = (): Aluno[] => getLocalStorage();

const updateAluno = (index: number, aluno: Aluno) => {
    const db = getLocalStorage();
    db[index] = aluno;
    setLocalStorage(db);
};

const deleteAluno = (index: number) => {
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

const setTitle = (text: string) => {
    const title = document.getElementById('titleAluno');
    if (title) title.textContent = text;
};

const clearFields = () => {
    const form = document.getElementById('formAluno') as HTMLFormElement;
    form.reset();
    const matriculaInput = document.getElementById('matricula') as HTMLInputElement;
    matriculaInput.dataset.index = 'new';
};

const isValidFields = (): boolean => {
    const form = document.getElementById('formAluno') as HTMLFormElement;
    return form.reportValidity();
};

const fillFields = (aluno: Aluno, index: number) => {
    openModal();
    (document.getElementById('matricula') as HTMLInputElement).value = aluno.matricula;
    (document.getElementById('nome') as HTMLInputElement).value = aluno.nome;
    (document.getElementById('idade') as HTMLInputElement).value = aluno.idade.toString();
   
    const turmaSelect = document.getElementById('turma') as HTMLSelectElement;
    turmaSelect.value = aluno.turma;

    (document.getElementById('matricula') as HTMLInputElement).dataset.index = index.toString();
    setTitle(`Editando ${aluno.nome}`);
};


const isMatriculaUnica = (matricula: string, index?: number): boolean => {
    const db = readAlunos();
    const alunosFiltrados = index !== undefined
        ? db.filter((_, i) => i !== index)
        : db;
    return !alunosFiltrados.some(aluno => aluno.matricula === matricula);
};

const saveAluno = (ev: Event) => {
    ev.preventDefault();
    if (!isValidFields()) return;

    const matricula = (document.getElementById('matricula') as HTMLInputElement).value.trim();
    const nome = (document.getElementById('nome') as HTMLInputElement).value.trim();
    const idade = Number((document.getElementById('idade') as HTMLInputElement).value);
    const turma = (document.getElementById('turma') as HTMLSelectElement).value;

    const indexStr = (document.getElementById('matricula') as HTMLInputElement).dataset.index ?? 'new';
    const index = indexStr === 'new' ? undefined : Number(indexStr);

    if (!isMatriculaUnica(matricula, index)) {
        alert('Erro: A matrícula informada já existe. Por favor, use uma matrícula única.');
        return;
    }

    const aluno: Aluno = { matricula, nome, idade, turma };

    if (indexStr === 'new') {
        createAluno(aluno);
    } else {
        updateAluno(Number(indexStr), aluno);
    }
    updateTable();
    closeModal();
};

const createRow = (aluno: Aluno, index: number) => {
    const tbody = document.querySelector('#tableAlunos tbody');
    if (!tbody) return;

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
    if (!tbody) return;
    tbody.innerHTML = '';
};

const updateTable = () => {
    clearTable();
    const alunos = readAlunos();
    alunos.forEach(createRow);
};

const editDelete = (ev: Event) => {
    const target = ev.target as HTMLElement;
    if (target.tagName.toLowerCase() !== 'button') return;

    const [action, indexStr] = target.id.split('-');
    const index = Number(indexStr);
    if (isNaN(index)) return;

    if (action === 'edit') {
        const aluno = readAlunos()[index];
        fillFields(aluno, index);
    } else if (action === 'delete') {
        const aluno = readAlunos()[index];
        const confirmDelete = confirm(`Deseja excluir o aluno ${aluno.nome}?`);
        if (confirmDelete) {
            deleteAluno(index);
            updateTable();
        }
    }
};


const loadTurmasInSelect = () => {
    const turmaSelect = document.getElementById('turma') as HTMLSelectElement;
    if (!turmaSelect) return;
    
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
    const form = document.getElementById('formAluno') as HTMLFormElement;
    if (form?.dataset.iniciado) return;
    if (form) form.dataset.iniciado = 'true';

    document.getElementById('cadastrarAlunoDesktop')?.addEventListener('click', openModal);
    
    document.getElementById('modalAluno')?.addEventListener('click', ev => {
        if ((ev.target as HTMLElement).id === 'modalAluno') closeModal();
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