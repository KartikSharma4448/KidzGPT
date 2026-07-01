/* ============================================================
   KIDZGPT GAMES PAGE — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -------- 0. Theme & Sidebar Toggling (Shared with Dashboard) --------
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.querySelector('.theme-label');

  if (themeToggle && themeLabel) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.checked = true;
      themeLabel.innerHTML = '🌙 Dark Mode';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.checked = false;
      themeLabel.innerHTML = '☀️ Light Mode';
    }

    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        document.body.classList.add('dark-theme');
        themeLabel.innerHTML = '🌙 Dark Mode';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        themeLabel.innerHTML = '☀️ Light Mode';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Sidebar Hamburger Toggle
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarElement = document.getElementById('sidebar');
  const dbContainer = document.querySelector('.db-container');

  const toggleSidebar = () => {
    if (window.innerWidth > 1024) {
      if (dbContainer) {
        dbContainer.classList.toggle('sidebar-collapsed');
      }
    } else {
      if (sidebarElement && sidebarOverlay) {
        sidebarElement.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
      }
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 1024) {
      if (sidebarElement && sidebarOverlay) {
        sidebarElement.classList.remove('show');
        sidebarOverlay.classList.remove('show');
      }
    }
  };

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', toggleSidebar);
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Stats / Leaderboard Toggle Button (For resolutions where it hides)
  const statsToggleBtn = document.getElementById('stats-toggle-btn');
  if (statsToggleBtn && dbContainer) {
    statsToggleBtn.addEventListener('click', () => {
      const sidePane = document.querySelector('.games-side-pane');
      if (window.innerWidth <= 1200) {
        // Toggle slide drawer/show on tablet
        if (sidePane) {
          sidePane.classList.toggle('show-drawer');
        }
      } else {
        dbContainer.classList.toggle('right-collapsed');
      }
    });
  }

  // -------- 1. Category Tabs Filtering --------
  const catTabs = document.querySelectorAll('.cat-tab');
  const gameCards = document.querySelectorAll('.game-card');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selectedCat = tab.getAttribute('data-cat');
      gameCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (selectedCat === 'all') {
          card.classList.remove('hidden');
        } else {
          card.classList.toggle('hidden', cardCat !== selectedCat);
        }
      });
    });
  });

  // -------- 2. Game Search Filtering --------
  const searchInput = document.getElementById('game-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Reset category tabs to "All Games"
      catTabs.forEach(t => t.classList.remove('active'));
      if (catTabs[0]) catTabs[0].classList.add('active');

      gameCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        const cat = card.getAttribute('data-cat') || '';
        const match = title.includes(query) || desc.includes(query) || cat.includes(query);
        card.classList.toggle('hidden', !match);
      });
    });
  }

  // -------- 3. Play Button Click Handler --------
  const playButtons = document.querySelectorAll('.play-game-btn');
  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.game-card');
      const title = card ? card.querySelector('h4').textContent : 'the game';
      alert(`🎮 Launching Game: "${title}"\nLoading your interactive challenges...`);
    });
  });

  // -------- 4. More Options Button for Continue Playing --------
  const cpMoreOptions = document.querySelectorAll('.cp-more-options');
  cpMoreOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.cp-game-card');
      const title = card ? card.querySelector('h4').textContent : 'Game';
      const action = prompt(`Options for "${title}":\n1. Remove from Continue list\n2. View Game Stats\n\nEnter option number:`);
      if (action === '1' && card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.3s ease';
        setTimeout(() => card.remove(), 300);
      }
    });
  });

});
