
export type Inicializadores = Record<string, () => void>;

export function setupNavigation(options: {
  defaultTab: string;
  initializers: Inicializadores;
}) {
  const { defaultTab, initializers } = options;

  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('nav .tab-button[data-tab]')
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('section.tab-content')
  );


  function show(id: string) {
    sections.forEach((sec) => {
      sec.style.display = sec.id === id ? 'block' : 'none';
    });

    buttons.forEach((btn) => {
      if (btn.dataset.tab === id) {
        btn.classList.add('active');
      }else{
        btn.classList.remove('active');
      } 
    });
       if (initializers[id]) {
           initializers[id]();
       }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab!;
      show(tab);
    });
  });

  show(defaultTab);
  return { show };
}
