export interface Professor {
    nome:string,
    area: string,
    matricula:string
  
};

const getLocalStorageProfessor = (): Professor[] => JSON.parse(localStorage.getItem('dbProfessor') ?? '[]');
const setLocalStorageProfessor = (db: Professor[]) => localStorage.setItem('dbProfessor', JSON.stringify(db));

const createProfessor = (professor: Professor) => {
  const db = getLocalStorageProfessor();
  db.push(professor);
  setLocalStorageProfessor(db);
};

export const readProfessores = (): Professor[] => getLocalStorageProfessor();

const updateProfessor = (index: number, professor: Professor) => {
  const db = getLocalStorageProfessor();
  db[index] = professor;
  setLocalStorageProfessor(db);
};

const deleteProfessor = (index: number) => {
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


const setTitleProfessor = (text: string) => {
  const title = document.getElementById('titleProfessor');
  if (title) title.textContent = text;
};

const clearFieldsProfessor = () => {
  const form = document.getElementById('formProfessor') as HTMLFormElement | null;
  form?.reset();
  const nomeInput = document.getElementById('nomeProfessor') as HTMLInputElement | null;
  if (nomeInput) nomeInput.dataset.index = 'new';
};

const isValidFieldsProfessor = (): boolean => {
  const form = document.getElementById('formProfessor') as HTMLFormElement | null;
  return form?.reportValidity() ?? false;
};

const fillFieldsProfessor = (professor: Professor, index: number) => {
  const form = document.getElementById('formProfessor') as HTMLFormElement;
  form.dataset.index = index.toString();

  (document.getElementById('matriculaProfessor') as HTMLInputElement).value = professor.matricula.toString();
  (document.getElementById('nomeProfessor') as HTMLInputElement).value = professor.nome;
  (document.getElementById('areaProfessor') as HTMLInputElement).value = professor.area;

  setTitleProfessor(`Editando ${professor.nome}`);
  openModalProfessor();
};


const isMatriculaUnicaProfessor = (matricula: string, index?: number): boolean => {
    const db = readProfessores();
    const profFiltrados = index !== undefined
        ? db.filter((_, i) => i !== index)
        : db;
    return !profFiltrados.some(prof => prof.matricula === matricula);
};



const saveProfessor = (ev: Event) => {
  ev.preventDefault();
  if (!isValidFieldsProfessor()) return;

  const matricula = (document.getElementById('matriculaProfessor') as HTMLInputElement).value.trim();
  const nome = (document.getElementById('nomeProfessor') as HTMLInputElement).value.trim();
  const area = (document.getElementById('areaProfessor') as HTMLInputElement).value;

  const index = (document.getElementById('nomeProfessor') as HTMLInputElement).dataset.index ?? 'new';

  if(!isMatriculaUnicaProfessor(matricula, Number(index))){
    alert('Erro: A matrícula informada já existe. Por favor, use uma matrícula única.');
    return;
  }
  const professor: Professor = { area, nome, matricula };

  if (index === 'new') {
    createProfessor(professor);
  } else {
    updateProfessor(Number(index), professor);
  }
  updateTableProfessor();
  closeModalProfessor();
};


const createRowProfessor = (professor: Professor, index: number) => {
  const tbody = document.querySelector('#tableProfessores tbody');
  if (!tbody) return;

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
  if (!tbody) return;
  tbody.innerHTML = '';
};

const updateTableProfessor = () => {
  clearTableProfessor();
  const professor = readProfessores();
  professor.forEach(createRowProfessor);
};


const editDeleteProfessor = (ev: Event) => {
  const target = ev.target as HTMLElement;
  if (target.tagName.toLowerCase() !== 'button') return;


  const id = target.id.replace('Professor-', '-');
  const [action, indexStr] = id.split('-');
  const index = Number(indexStr);
  if (isNaN(index)) return;

  if (action === 'edit') {
    const professor = readProfessores()[index];
    fillFieldsProfessor(professor, index);
  } else if (action === 'delete') {
    const professor = readProfessores()[index];
    const confirmDelete = confirm(`Deseja excluir o professor ${professor.nome}?`);
    if (confirmDelete) {
      deleteProfessor(index);
      updateTableProfessor();
    }
  }
};

export function iniciarProfessores() {
  const form = document.getElementById('formProfessor') as HTMLFormElement | null;

 
  if (form && form.dataset.iniciado === 'true') {
    updateTableProfessor();
    return;
  }
  if (form) form.dataset.iniciado = 'true';

  document.getElementById('cadastrarProfessorDesktop')?.addEventListener('click', openModalProfessor);

  document.getElementById('modalProfessor')?.addEventListener('click', (ev: Event) => {
    if ((ev.target as HTMLElement).id === 'modalProfessor') closeModalProfessor();
  });

  document.getElementById('closeProfessor')?.addEventListener('click', closeModalProfessor);

  document.getElementById('cancelarProfessor')?.addEventListener('click', (ev: Event) => {
    ev.preventDefault();
    closeModalProfessor();
  });

  document.getElementById('salvarProfessor')?.addEventListener('click', saveProfessor);

  document.querySelector('#tableProfessores tbody')?.addEventListener('click', editDeleteProfessor);

  updateTableProfessor();
}