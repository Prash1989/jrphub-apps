
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 250);
});

const root = document.documentElement;
const savedTheme = localStorage.getItem('jrp-theme');
if (savedTheme) root.dataset.theme = savedTheme;

const themeToggle = document.querySelector('.theme-toggle');
const refreshThemeIcon = () => {
  if (themeToggle) themeToggle.textContent = root.dataset.theme === 'light' ? '☾' : '☼';
};
refreshThemeIcon();
themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('jrp-theme', root.dataset.theme);
  refreshThemeIcon();
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const search = document.getElementById('appSearch');
const filters = document.querySelectorAll('.filter');
const cards = [...document.querySelectorAll('.app-card')];
const emptyState = document.getElementById('emptyState');
let activeFilter = 'all';

function applyFilters() {
  const query = (search?.value || '').trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const haystack = `${card.dataset.name} ${card.dataset.category}`;
    const filterMatch = activeFilter === 'all' || card.dataset.category.includes(activeFilter);
    const searchMatch = !query || haystack.includes(query);
    const show = filterMatch && searchMatch;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  if (emptyState) emptyState.style.display = visible ? 'none' : 'block';
}
search?.addEventListener('input', applyFilters);
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  activeFilter = button.dataset.filter;
  applyFilters();
}));

document.getElementById('year').textContent = new Date().getFullYear();
