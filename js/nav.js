const getFocusable = (container) =>
  [...container.querySelectorAll('a[href]:not([aria-disabled="true"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')];

export function initNavigation() {
  const nav = document.querySelector('.site-nav');
  const menuButton = document.querySelector('.menu-button');
  const scrim = document.querySelector('.nav-scrim');
  const disabledLinks = document.querySelectorAll('[aria-disabled="true"]');

  disabledLinks.forEach((element) => {
    element.addEventListener('click', (event) => event.preventDefault());
  });

  if (!nav || !menuButton || !scrim) return;

  const setOpen = (open) => {
    nav.dataset.open = String(open);
    scrim.dataset.open = String(open);
    scrim.tabIndex = open ? 0 : -1;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('nav-open', open);

    const iconUse = menuButton.querySelector('use');
    if (iconUse) iconUse.setAttribute('href', `assets/icons.svg#${open ? 'close' : 'menu'}`);
    if (open) getFocusable(nav)[0]?.focus();
  };

  menuButton.addEventListener('click', () => {
    setOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  scrim.addEventListener('click', () => setOpen(false));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a:not([aria-disabled="true"])')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menuButton.focus();
    }

    if (event.key !== 'Tab' || menuButton.getAttribute('aria-expanded') !== 'true') return;
    const focusable = getFocusable(nav);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  matchMedia('(min-width: 900px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
export function initStatusFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  const rows = document.querySelectorAll('[data-status]');
  if (!buttons.length || !rows.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      rows.forEach((row) => {
        row.hidden = filter !== 'todos' && row.dataset.status !== filter;
      });
    });
  });
}
