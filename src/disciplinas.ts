export interface Disciplina{
    codigo:number,
    cargaHoraria: number,
    nome:string
};


const getLocalStorageDisciplina = ():Disciplina[] => JSON.parse(localStorage.getItem('dbDisciplina') ?? '[]');
const setLocalStorageDisciplina = (db: Disciplina[]) => localStorage.setItem('dbDisciplina', JSON.stringify(db));

const createDisciplina = (disciplina: Disciplina) => {
  const db = getLocalStorageDisciplina();
  db.push(disciplina);
  setLocalStorageDisciplina(db);
};

export const readDisciplinas = (): Disciplina[] => getLocalStorageDisciplina();

const updateDisciplina = (index: number, disciplina: Disciplina) => {
  const db = getLocalStorageDisciplina();
  db[index] = disciplina;
  setLocalStorageDisciplina(db);
};

const deleteDisciplina = (index:number)=>{
  const db = getLocalStorageDisciplina();
  db.splice(index,1);
  setLocalStorageDisciplina(db)
}

const openModalDisciplina = () => {
  document.getElementById('modalDisciplina')?.classList.add('active');
};

const closeModalDisciplina = () => {
  document.getElementById('modalDisciplina')?.classList.remove('active');
  clearFieldsDisciplina();
  setTitleDisciplina('Nova Disciplina');
};

const setTitleDisciplina = (text: string) => {
  const title = document.getElementById('titleDisciplina');
  if (title) title.textContent = text;
};

const clearFieldsDisciplina = () => {
  const form = document.getElementById('formDisciplina') as HTMLFormElement | null;
  form?.reset();
  const nomeInput = document.getElementById('nomeDisciplina') as HTMLInputElement | null;
  if (nomeInput) nomeInput.dataset.index = 'new';
};

const isValidFieldsDisciplina = (): boolean => {
  const form = document.getElementById('formDisciplina') as HTMLFormElement | null;
  return form?.reportValidity() ?? false;
};


const fillFieldsDisciplina = (disciplina: Disciplina, index: number) => {
  const form = document.getElementById('formDisciplina') as HTMLFormElement;
  form.dataset.index = index.toString();

  (document.getElementById('codigoDisciplina') as HTMLInputElement).value = disciplina.codigo.toString();
  (document.getElementById('nomeDisciplina') as HTMLInputElement).value = disciplina.nome;
  (document.getElementById('cargaHoraria') as HTMLInputElement).value = disciplina.cargaHoraria.toString();

  setTitleDisciplina(`Editando ${disciplina.nome}`);
  openModalDisciplina();
};


const isCodigoUnicoDisciplina = (codigo: number, index?: number): boolean => {
    const db = readDisciplinas();
    const disciplinasFiltradas = index !== undefined
        ? db.filter((_, i) => i !== index)
        : db;
    return !disciplinasFiltradas.some(d => d.codigo === codigo);
};
const saveDisciplina = (ev: Event) => {
  ev.preventDefault();
  if (!isValidFieldsDisciplina()) return;

  const codigo = Number((document.getElementById('codigoDisciplina') as HTMLInputElement).value);
  const cargaHoraria = Number((document.getElementById('cargaHoraria') as HTMLInputElement).value);
  const nome = (document.getElementById('nomeDisciplina') as HTMLInputElement).value.trim();

  const index = (document.getElementById('nomeDisciplina') as HTMLInputElement).dataset.index ?? 'new';

  if(!isCodigoUnicoDisciplina(codigo, Number(index))){
    alert('Erro: A matrícula informada já existe. Por favor, use uma matrícula única.');
    return;
  }
  const disciplina: Disciplina = { cargaHoraria, codigo, nome };

  if (index === 'new') {
    createDisciplina(disciplina);
  } else {
    updateDisciplina(Number(index), disciplina);
  }
  updateTableDisciplina();
  closeModalDisciplina();
};
const createRowDisciplina = (disciplina: Disciplina, index: number) => {
  const tbody = document.querySelector('#tableDisciplinas tbody');
  if (!tbody) return;

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
  if (!tbody) return;
  tbody.innerHTML = '';
};


const updateTableDisciplina = () => {
  clearTableDisciplina();
  const professor = readDisciplinas();
  professor.forEach(createRowDisciplina);
};


const editDeleteDisciplina = (ev: Event) => {
  const target = ev.target as HTMLElement;
  if (target.tagName.toLowerCase() !== 'button') return;


  const id = target.id.replace('Disciplina-', '-');
  const [action, indexStr] = id.split('-');
  const index = Number(indexStr);
  if (isNaN(index)) return;

  if (action === 'edit') {
    const disciplina = readDisciplinas()[index];
    fillFieldsDisciplina(disciplina, index);
  } else if (action === 'delete') {
    const disciplina = readDisciplinas()[index];
    const confirmDelete = confirm(`Deseja excluir a disciplina ${disciplina.nome}?`);
    if (confirmDelete) {
      deleteDisciplina(index);
      updateTableDisciplina();
    }
  }
};


export function iniciarDisciplina() {
  const form = document.getElementById('formDisciplina') as HTMLFormElement | null;

 
  if (form && form.dataset.iniciado === 'true') {
    updateTableDisciplina();
    return;
  }
  if (form) form.dataset.iniciado = 'true';

  document.getElementById('cadastrarDisciplinaDesktop')?.addEventListener('click', openModalDisciplina);

  document.getElementById('modalDisciplina')?.addEventListener('click', (ev: Event) => {
    if ((ev.target as HTMLElement).id === 'modalDisciplina') closeModalDisciplina();
  });

  document.getElementById('closeDisciplina')?.addEventListener('click', closeModalDisciplina);

  document.getElementById('cancelarDisciplina')?.addEventListener('click', (ev: Event) => {
    ev.preventDefault();
    closeModalDisciplina();
  });

  document.getElementById('salvarDisciplina')?.addEventListener('click', saveDisciplina);

  document.querySelector('#tableDisciplinas tbody')?.addEventListener('click', editDeleteDisciplina);

  updateTableDisciplina();
}