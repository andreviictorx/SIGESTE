'use strict';
import { readAlunos } from './alunos.js';
import { readProfessores } from './professor.js';
import { readDisciplinas } from './disciplinas.js';
const getLocalStorageTurma = () => JSON.parse(localStorage.getItem('dbTurmas') ?? '[]');
const setLocalStorageTurma = (db) => localStorage.setItem('dbTurmas', JSON.stringify(db));
export const createTurma = (turma) => {
    const db = getLocalStorageTurma();
    db.push(turma);
    setLocalStorageTurma(db);
};
export const readTurmas = () => getLocalStorageTurma();
export const updateTurma = (index, turma) => {
    const db = getLocalStorageTurma();
    db[index] = turma;
    setLocalStorageTurma(db);
};
export const deleteTurma = (index) => {
    const db = getLocalStorageTurma();
    db.splice(index, 1);
    setLocalStorageTurma(db);
};
const openModalTurma = () => {
    loadAssociacoesInSelects();
    document.getElementById('modalTurma')?.classList.add('active');
};
const closeModalTurma = () => {
    document.getElementById('modalTurma')?.classList.remove('active');
    clearFieldsTurma();
    setTitleTurma('Nova Turma');
};
const setTitleTurma = (text) => {
    const title = document.getElementById('titleTurma');
    if (title)
        title.textContent = text;
};
const clearFieldsTurma = () => {
    const form = document.getElementById('formTurma');
    form?.reset();
    const nomeInput = document.getElementById('nomeTurma');
    if (nomeInput)
        nomeInput.dataset.index = 'new';
};
const isValidFieldsTurma = () => {
    const form = document.getElementById('formTurma');
    return form?.reportValidity() ?? false;
};
const fillFieldsTurma = (turma, index) => {
    openModalTurma();
    document.getElementById('codigoTurma').value = turma.codigo;
    document.getElementById('nomeTurma').value = turma.nome;
    document.getElementById('anoTurma').value = turma.ano.toString();
    document.getElementById('nomeTurma').dataset.index = index.toString();
    setTitleTurma(`Editando ${turma.nome}`);
    const alunosSelect = document.getElementById('alunosTurma');
    const professoresSelect = document.getElementById('professoresTurma');
    const disciplinasSelect = document.getElementById('disciplinasTurma');
    alunosSelect.querySelectorAll('option').forEach(option => {
        option.selected = turma.alunos.includes(option.value);
    });
    professoresSelect.querySelectorAll('option').forEach(option => {
        option.selected = turma.professores.includes(option.value);
    });
    disciplinasSelect.querySelectorAll('option').forEach(option => {
        option.selected = turma.disciplinas.includes(option.value);
    });
};
const isCodigoUnico = (codigo, index) => {
    const db = readTurmas();
    const turmasFiltradas = index !== undefined
        ? db.filter((_, i) => i !== index)
        : db;
    return !turmasFiltradas.some(turma => turma.codigo === codigo);
};
const saveTurma = (ev) => {
    ev.preventDefault();
    if (!isValidFieldsTurma())
        return;
    const codigo = document.getElementById('codigoTurma').value.trim();
    const nome = document.getElementById('nomeTurma').value.trim();
    const ano = Number(document.getElementById('anoTurma').value);
    const alunos = Array.from(document.querySelectorAll('#alunosTurma option:checked')).map(option => option.value);
    const professores = Array.from(document.querySelectorAll('#professoresTurma option:checked')).map(option => option.value);
    const disciplinas = Array.from(document.querySelectorAll('#disciplinasTurma option:checked')).map(option => option.value);
    const indexStr = document.getElementById('nomeTurma').dataset.index ?? 'new';
    const index = indexStr === 'new' ? undefined : Number(indexStr);
    if (!isCodigoUnico(codigo, index)) {
        alert('Erro: O código da turma informado já existe. Por favor, use um código único.');
        return;
    }
    const turma = { codigo, nome, ano, alunos, professores, disciplinas };
    if (indexStr === 'new') {
        createTurma(turma);
    }
    else {
        updateTurma(Number(indexStr), turma);
    }
    updateTableTurma();
    closeModalTurma();
};
const createRowTurma = (turma, index) => {
    const tbody = document.querySelector('#tableTurmas tbody');
    if (!tbody)
        return;
    const alunos = turma.alunos.map(m => `<span class="tag">${m}</span>`).join(', ');
    const professores = turma.professores.map(m => `<span class="tag">${m}</span>`).join(', ');
    const disciplinas = turma.disciplinas.map(c => `<span class="tag">${c}</span>`).join(', ');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td data-label="Código">${turma.codigo}</td>
        <td data-label="Nome">${turma.nome}</td>
        <td data-label="Ano">${turma.ano}</td>
        <td data-label="Alunos">${alunos || '-'}</td>
        <td data-label="Professores">${professores || '-'}</td>
        <td data-label="Disciplinas">${disciplinas || '-'}</td>
        <td data-label="Ação">
            <button type="button" class="button green" id="editTurma-${index}">Editar</button>
            <button type="button" class="button red" id="deleteTurma-${index}">Excluir</button>
        </td>
    `;
    tbody.appendChild(tr);
};
const clearTableTurma = () => {
    const tbody = document.querySelector('#tableTurmas tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
};
const updateTableTurma = () => {
    clearTableTurma();
    const turmas = readTurmas();
    turmas.forEach(createRowTurma);
};
const editDeleteTurma = (ev) => {
    const target = ev.target;
    if (target.tagName.toLowerCase() !== 'button')
        return;
    const id = target.id.replace('Turma-', '-');
    const [action, indexStr] = id.split('-');
    const index = Number(indexStr);
    if (isNaN(index))
        return;
    if (action === 'edit') {
        const turma = readTurmas()[index];
        fillFieldsTurma(turma, index);
    }
    else if (action === 'delete') {
        const turma = readTurmas()[index];
        const confirmDelete = confirm(`Deseja excluir a turma ${turma.nome}?`);
        if (confirmDelete) {
            deleteTurma(index);
            updateTableTurma();
        }
    }
};
const loadAssociacoesInSelects = () => {
    const alunosSelect = document.getElementById('alunosTurma');
    alunosSelect.innerHTML = '<option value="" disabled>Adicionar Alunos</option>';
    readAlunos().forEach(aluno => {
        const option = document.createElement('option');
        option.value = aluno.matricula;
        option.textContent = `${aluno.nome} (${aluno.matricula})`;
        alunosSelect.appendChild(option);
    });
    const professoresSelect = document.getElementById('professoresTurma');
    professoresSelect.innerHTML = '<option value="" disabled>Adicionar Professores</option>';
    readProfessores().forEach(professor => {
        const option = document.createElement('option');
        option.value = professor.matricula;
        option.textContent = `${professor.nome} (${professor.matricula})`;
        professoresSelect.appendChild(option);
    });
    const disciplinasSelect = document.getElementById('disciplinasTurma');
    disciplinasSelect.innerHTML = '<option value="" disabled>Adicionar Disciplinas</option>';
    readDisciplinas().forEach(disciplina => {
        const option = document.createElement('option');
        option.value = disciplina.codigo.toString();
        option.textContent = `${disciplina.nome} (${disciplina.codigo})`;
        disciplinasSelect.appendChild(option);
    });
};
export function iniciarTurmas() {
    const form = document.getElementById('formTurma');
    if (form && form.dataset.iniciado === 'true') {
        updateTableTurma();
        return;
    }
    if (form)
        form.dataset.iniciado = 'true';
    document.getElementById('cadastrarTurmaDesktop')?.addEventListener('click', openModalTurma);
    document.getElementById('modalTurma')?.addEventListener('click', (ev) => {
        if (ev.target.id === 'modalTurma')
            closeModalTurma();
    });
    document.getElementById('closeTurma')?.addEventListener('click', closeModalTurma);
    document.getElementById('cancelarTurma')?.addEventListener('click', (ev) => {
        ev.preventDefault();
        closeModalTurma();
    });
    document.getElementById('salvarTurma')?.addEventListener('click', saveTurma);
    document.querySelector('#tableTurmas tbody')?.addEventListener('click', editDeleteTurma);
    updateTableTurma();
}
