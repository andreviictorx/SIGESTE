;
const getLocalStorageProfessor = () => JSON.parse(localStorage.getItem('dbProfessor') ?? '[]');
const setLocalStorageProfessor = (db) => localStorage.setItem('dbProfessor', JSON.stringify(db));
const createProfessor = (professor) => {
    const db = getLocalStorageProfessor();
    db.push(professor);
    setLocalStorageProfessor(db);
};
export const readProfessores = () => getLocalStorageProfessor();
const updateProfessor = (index, professor) => {
    const db = getLocalStorageProfessor();
    db[index] = professor;
    setLocalStorageProfessor(db);
};
const deleteProfessor = (index) => {
    const db = getLocalStorageProfessor();
    db.splice(index, 1);
    setLocalStorageProfessor(db);
};
const openModalProfessor = () => {
    document.getElementById('modalProfessor')?.classList.add('active');
};
const closeModalProfessor = () => {
    document.getElementById('modalProfessor')?.classList.remove('active');
    clearFieldsProfessor();
    setTitleProfessor('Novo Professor');
};
const setTitleProfessor = (text) => {
    const title = document.getElementById('titleProfessor');
    if (title)
        title.textContent = text;
};
const clearFieldsProfessor = () => {
    const form = document.getElementById('formProfessor');
    form?.reset();
    const nomeInput = document.getElementById('nomeProfessor');
    if (nomeInput)
        nomeInput.dataset.index = 'new';
};
const isValidFieldsProfessor = () => {
    const form = document.getElementById('formProfessor');
    return form?.reportValidity() ?? false;
};
const fillFieldsProfessor = (professor, index) => {
    const form = document.getElementById('formProfessor');
    form.dataset.index = index.toString();
    document.getElementById('matriculaProfessor').value = professor.matricula.toString();
    document.getElementById('nomeProfessor').value = professor.nome;
    document.getElementById('areaProfessor').value = professor.area;
    setTitleProfessor(`Editando ${professor.nome}`);
    openModalProfessor();
};
const isMatriculaUnicaProfessor = (matricula, index) => {
    const db = readProfessores();
    const profFiltrados = index !== undefined
        ? db.filter((_, i) => i !== index)
        : db;
    return !profFiltrados.some(prof => prof.matricula === matricula);
};
const saveProfessor = (ev) => {
    ev.preventDefault();
    if (!isValidFieldsProfessor())
        return;
    const matricula = document.getElementById('matriculaProfessor').value.trim();
    const nome = document.getElementById('nomeProfessor').value.trim();
    const area = document.getElementById('areaProfessor').value;
    const index = document.getElementById('nomeProfessor').dataset.index ?? 'new';
    if (!isMatriculaUnicaProfessor(matricula, Number(index))) {
        alert('Erro: A matrícula informada já existe. Por favor, use uma matrícula única.');
        return;
    }
    const professor = { area, nome, matricula };
    if (index === 'new') {
        createProfessor(professor);
    }
    else {
        updateProfessor(Number(index), professor);
    }
    updateTableProfessor();
    closeModalProfessor();
};
const createRowProfessor = (professor, index) => {
    const tbody = document.querySelector('#tableProfessores tbody');
    if (!tbody)
        return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${professor.matricula}</td>
    <td>${professor.nome}</td>
    <td>${professor.area}</td>
    <td>
      <button type="button" class="button green" id="editProfessor-${index}">Editar</button>
      <button type="button" class="button red" id="deleteProfessor-${index}">Excluir</button>
    </td>
  `;
    tbody.appendChild(tr);
};
const clearTableProfessor = () => {
    const tbody = document.querySelector('#tableProfessores tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
};
const updateTableProfessor = () => {
    clearTableProfessor();
    const professor = readProfessores();
    professor.forEach(createRowProfessor);
};
const editDeleteProfessor = (ev) => {
    const target = ev.target;
    if (target.tagName.toLowerCase() !== 'button')
        return;
    const id = target.id.replace('Professor-', '-');
    const [action, indexStr] = id.split('-');
    const index = Number(indexStr);
    if (isNaN(index))
        return;
    if (action === 'edit') {
        const professor = readProfessores()[index];
        fillFieldsProfessor(professor, index);
    }
    else if (action === 'delete') {
        const professor = readProfessores()[index];
        const confirmDelete = confirm(`Deseja excluir o professor ${professor.nome}?`);
        if (confirmDelete) {
            deleteProfessor(index);
            updateTableProfessor();
        }
    }
};
export function iniciarProfessores() {
    const form = document.getElementById('formProfessor');
    if (form && form.dataset.iniciado === 'true') {
        updateTableProfessor();
        return;
    }
    if (form)
        form.dataset.iniciado = 'true';
    document.getElementById('cadastrarProfessorDesktop')?.addEventListener('click', openModalProfessor);
    document.getElementById('modalProfessor')?.addEventListener('click', (ev) => {
        if (ev.target.id === 'modalProfessor')
            closeModalProfessor();
    });
    document.getElementById('closeProfessor')?.addEventListener('click', closeModalProfessor);
    document.getElementById('cancelarProfessor')?.addEventListener('click', (ev) => {
        ev.preventDefault();
        closeModalProfessor();
    });
    document.getElementById('salvarProfessor')?.addEventListener('click', saveProfessor);
    document.querySelector('#tableProfessores tbody')?.addEventListener('click', editDeleteProfessor);
    updateTableProfessor();
}
