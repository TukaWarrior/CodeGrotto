// ==========================
// tab-switcher.js
// ==========================

export function setupTabSwitching(onTabChange) {
  const tabButtons = document.querySelectorAll('.tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;

      tabButtons.forEach(tab => tab.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(`${tabId}List`)?.classList.add('active');

      if (typeof onTabChange === 'function') {
        onTabChange(tabId);
      }
    });
  });
}
