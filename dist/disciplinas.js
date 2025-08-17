;
const getLocalStorageDisciplina = () => JSON.parse(localStorage.getItem('dbDisciplina') ?? '[]');
const setLocalStorageDisciplina = (db) => localStorage.setItem('dbDisciplina', JSON.stringify(db));
const createDisciplina = (disciplina) => {
    const db = getLocalStorageDisciplina();
    db.push(disciplina);
    setLocalStorageDisciplina(db);
};
export const readDisciplinas = () => getLocalStorageDisciplina();
const updateDisciplina = (index, disciplina) => {
    const db = getLocalStorageDisciplina();
    db[index] = disciplina;
    setLocalStorageDisciplina(db);
};
const deleteDisciplina = (index) => {
    const db = getLocalStorageDisciplina();
    db.splice(index, 1);
    setLocalStorageDisciplina(db);
};
const openModalDisciplina = () => {
    document.getElementById('modalDisciplina')?.classList.add('active');
};
const closeModalDisciplina = () => {
    document.getElementById('modalDisciplina')?.classList.remove('active');
    clearFieldsDisciplina();
    setTitleDisciplina('Nova Disciplina');
};
const setTitleDisciplina = (text) => {
    const title = document.getElementById('titleDisciplina');
    if (title)
        title.textContent = text;
};
const clearFieldsDisciplina = () => {
    const form = document.getElementById('formDisciplina');
    form?.reset();
    const nomeInput = document.getElementById('nomeDisciplina');
    if (nomeInput)
        nomeInput.dataset.index = 'new';
};
const isValidFieldsDisciplina = () => {
    const form = document.getElementById('formDisciplina');
    return form?.reportValidity() ?? false;
};
const fillFieldsDisciplina = (disciplina, index) => {
    const form = document.getElementById('formDisciplina');
    form.dataset.index = index.toString();
    document.getElementById('codigoDisciplina').value = disciplina.codigo.toString();
    document.getElementById('nomeDisciplina').value = disciplina.nome;
    document.getElementById('cargaHoraria').value = disciplina.cargaHoraria.toString();
    setTitleDisciplina(`Editando ${disciplina.nome}`);
    openModalDisciplina();
};
const isCodigoUnicoDisciplina = (codigo, index) => {
    const db = readDisciplinas();
    const disciplinasFiltradas = index !== undefined
        ? db.filter((_, i) => i !== index)
        : db;
    return !disciplinasFiltradas.some(d => d.codigo === codigo);
};
const saveDisciplina = (ev) => {
    ev.preventDefault();
    if (!isValidFieldsDisciplina())
        return;
    const codigo = Number(document.getElementById('codigoDisciplina').value);
    const cargaHoraria = Number(document.getElementById('cargaHoraria').value);
    const nome = document.getElementById('nomeDisciplina').value.trim();
    const index = document.getElementById('nomeDisciplina').dataset.index ?? 'new';
    if (!isCodigoUnicoDisciplina(codigo, Number(index))) {
        alert('Erro: A matrícula informada já existe. Por favor, use uma matrícula única.');
        return;
    }
    const disciplina = { cargaHoraria, codigo, nome };
    if (index === 'new') {
        createDisciplina(disciplina);
    }
    else {
        updateDisciplina(Number(index), disciplina);
    }
    updateTableDisciplina();
    closeModalDisciplina();
};
const createRowDisciplina = (disciplina, index) => {
    const tbody = document.querySelector('#tableDisciplinas tbody');
    if (!tbody)
        return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${disciplina.codigo}</td>
    <td>${disciplina.nome}</td>
    <td>${disciplina.cargaHoraria}</td>
    <td>
      <button type="button" class="button green" id="editDisciplina-${index}">Editar</button>
      <button type="button" class="button red" id="deleteDisciplina-${index}">Excluir</button>
    </td>
  `;
    tbody.appendChild(tr);
};
const clearTableDisciplina = () => {
    const tbody = document.querySelector('#tableDisciplinas tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
};
const updateTableDisciplina = () => {
    clearTableDisciplina();
    const professor = readDisciplinas();
    professor.forEach(createRowDisciplina);
};
const editDeleteDisciplina = (ev) => {
    const target = ev.target;
    if (target.tagName.toLowerCase() !== 'button')
        return;
    const id = target.id.replace('Disciplina-', '-');
    const [action, indexStr] = id.split('-');
    const index = Number(indexStr);
    if (isNaN(index))
        return;
    if (action === 'edit') {
        const disciplina = readDisciplinas()[index];
        fillFieldsDisciplina(disciplina, index);
    }
    else if (action === 'delete') {
        const disciplina = readDisciplinas()[index];
        const confirmDelete = confirm(`Deseja excluir a disciplina ${disciplina.nome}?`);
        if (confirmDelete) {
            deleteDisciplina(index);
            updateTableDisciplina();
        }
    }
};
export function iniciarDisciplina() {
    const form = document.getElementById('formDisciplina');
    if (form && form.dataset.iniciado === 'true') {
        updateTableDisciplina();
        return;
    }
    if (form)
        form.dataset.iniciado = 'true';
    document.getElementById('cadastrarDisciplinaDesktop')?.addEventListener('click', openModalDisciplina);
    document.getElementById('modalDisciplina')?.addEventListener('click', (ev) => {
        if (ev.target.id === 'modalDisciplina')
            closeModalDisciplina();
    });
    document.getElementById('closeDisciplina')?.addEventListener('click', closeModalDisciplina);
    document.getElementById('cancelarDisciplina')?.addEventListener('click', (ev) => {
        ev.preventDefault();
        closeModalDisciplina();
    });
    document.getElementById('salvarDisciplina')?.addEventListener('click', saveDisciplina);
    document.querySelector('#tableDisciplinas tbody')?.addEventListener('click', editDeleteDisciplina);
    updateTableDisciplina();
}
