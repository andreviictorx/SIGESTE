import { setupNavigation } from './navegacao.js';
import { iniciarAlunos } from './alunos.js';
import { iniciarTurmas } from './turmas.js';
import { iniciarProfessores } from './professor.js';
import { iniciarDisciplina } from './disciplinas.js';
document.addEventListener('DOMContentLoaded', () => {
    const { show } = setupNavigation({
        defaultTab: 'alunos',
        initializers: {
            alunos: iniciarAlunos,
            turmas: iniciarTurmas,
            disciplinas: iniciarDisciplina,
            professores: iniciarProfessores
        }
    });
    window.mostrar = show;
});
