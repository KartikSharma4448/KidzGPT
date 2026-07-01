/* ============================================================
   KidzGPT Student Dashboard — Script
   Handles theme switching, modal overlays, dropdowns, and search filtering
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -------- 1. Theme Toggling (Light / Dark Mode) --------
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.querySelector('.theme-label');

  if (themeToggle && themeLabel) {
    // Check local storage for preference
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

  // -------- 2. Interactive Search Filtering --------
  const dbSearch = document.getElementById('db-search');
  const learningCards = document.querySelectorAll('.learning-card');
  const subjectCards = document.querySelectorAll('.subject-card');

  if (dbSearch) {
    dbSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Filter Continue Learning Cards
      learningCards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        if (title.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      // Filter Subject Cards
      subjectCards.forEach(card => {
        const subject = card.getAttribute('data-subject') || '';
        if (subject.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // -------- 3. Dropdown Menu Handlers (Bell & Profile) --------
  const bellBtn = document.getElementById('bell-btn');
  const bellDropdown = document.getElementById('bell-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  const toggleDropdown = (btn, dropdown) => {
    if (dropdown.classList.contains('hidden')) {
      // Close all dropdowns first
      closeAllDropdowns();
      dropdown.classList.remove('hidden');
    } else {
      dropdown.classList.add('hidden');
    }
  };

  const closeAllDropdowns = () => {
    if (bellDropdown) bellDropdown.classList.add('hidden');
    if (profileDropdown) profileDropdown.classList.add('hidden');
  };

  if (bellBtn && bellDropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(bellBtn, bellDropdown);
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(profileBtn, profileDropdown);
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  // Prevent dropdown closing when clicking inside it
  const dropdowns = document.querySelectorAll('.db-dropdown');
  dropdowns.forEach(drop => {
    drop.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // -------- 4. Sidebar Nav Active State Switching --------
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't prevent default on links that actually navigate
      const href = item.getAttribute('href');
      if (href === '#' || !href) {
        e.preventDefault();
      }
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // -------- 5. Premium Upgrade Modal Flow --------
  const upgradeModal = document.getElementById('upgradeModal');
  const openModalButtons = document.querySelectorAll('.open-upgrade-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const selectPlanButtons = document.querySelectorAll('.btn-select-plan');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const btnSuccessClose = document.getElementById('btnSuccessClose');
  const coinsValue = document.getElementById('coins-value');

  const openModal = () => {
    if (upgradeModal) {
      upgradeModal.classList.remove('hidden');
      if (modalSuccessState) modalSuccessState.classList.add('hidden');
    }
  };

  const closeModal = () => {
    if (upgradeModal) {
      upgradeModal.classList.add('hidden');
    }
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside modal-card content
  if (upgradeModal) {
    upgradeModal.addEventListener('click', (e) => {
      if (e.target === upgradeModal) {
        closeModal();
      }
    });
  }

  // Pricing selection success state trigger
  selectPlanButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalSuccessState) {
        modalSuccessState.classList.remove('hidden');
      }
    });
  });

  // Close success state and award coins
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      closeModal();
      
      // Award +500 premium coins dynamically!
      if (coinsValue) {
        const currentCoins = parseInt(coinsValue.textContent.replace(',', ''), 10);
        const newCoins = currentCoins + 500;
        
        // Animate coin counter!
        let tempCoins = currentCoins;
        const interval = setInterval(() => {
          tempCoins += 10;
          if (tempCoins >= newCoins) {
            tempCoins = newCoins;
            clearInterval(interval);
          }
          coinsValue.textContent = tempCoins.toLocaleString();
        }, 15);
      }
    });
  }

  // -------- 6. Lesson Play Buttons Interaction --------
  const playButtons = document.querySelectorAll('.video-play-btn');
  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.learning-card');
      const title = card ? card.querySelector('h3').textContent : 'this lesson';
      alert(`🎥 Starting Lesson: "${title}"\nSetting up your AI tutor space...`);
    });
  });
  // -------- 7. Sidebar Hamburger Menu Toggle --------
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
  // -------- 8. Right Panel (Progress Overview) Toggle --------
  const statsToggleBtn = document.getElementById('stats-toggle-btn');
  if (statsToggleBtn && dbContainer) {
    statsToggleBtn.addEventListener('click', () => {
      dbContainer.classList.toggle('right-collapsed');
    });
  }

});
