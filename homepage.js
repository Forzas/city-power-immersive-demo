const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-categories]')];
const resultCount = document.querySelector('#result-count');

function filterTopics(category) {
  for (const filter of filters) {
    const active = filter.dataset.filter === category;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  }

  let visibleCount = 0;
  for (const card of cards) {
    const visible = category === 'all' || card.dataset.categories.split(' ').includes(category);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  }
  resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'topic' : 'topics'} to discover`;
}

document.querySelector('.filters').hidden = false;
for (const filter of filters) {
  filter.addEventListener('click', () => filterTopics(filter.dataset.filter));
}
for (const category of document.querySelectorAll('[data-category]')) {
  category.addEventListener('click', () => filterTopics(category.dataset.category));
}
for (const browseLink of document.querySelectorAll('a[href="#topics"]:not([data-category])')) {
  browseLink.addEventListener('click', () => filterTopics('all'));
}
