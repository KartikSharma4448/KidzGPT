/* ============================================================
   MY COURSES PAGE — JavaScript
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

  // -------- 1. Tab Switching --------
  const tabs = document.querySelectorAll('.cp-tab');
  const cards = document.querySelectorAll('.cp-course-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;
      cards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          card.classList.toggle('hidden', card.dataset.status !== filter);
        }
      });
    });
  });

  // -------- 2. Search Filtering --------
  const searchInput = document.getElementById('course-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      // Reset tabs to "All Courses"
      tabs.forEach(t => t.classList.remove('active'));
      tabs[0].classList.add('active');

      cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.cp-course-body p')?.textContent.toLowerCase() || '';
        const subject = card.dataset.subject || '';
        const match = title.includes(query) || desc.includes(query) || subject.includes(query);
        card.classList.toggle('hidden', !match);
      });
    });
  }

  // -------- 3. Sort by Select --------
  const sortSelect = document.getElementById('sort-select');
  const courseList = document.getElementById('course-list');

  if (sortSelect && courseList) {
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      const cardsArr = Array.from(courseList.querySelectorAll('.cp-course-card'));

      cardsArr.sort((a, b) => {
        if (sortBy === 'name') {
          const nameA = a.querySelector('h3')?.textContent || '';
          const nameB = b.querySelector('h3')?.textContent || '';
          return nameA.localeCompare(nameB);
        }
        if (sortBy === 'progress') {
          const getProgress = el => {
            const fill = el.querySelector('.cp-progress-fill');
            return fill ? parseInt(fill.style.width) || 0 : 0;
          };
          return getProgress(b) - getProgress(a);
        }
        return 0; // 'recent' keeps original DOM order
      });

      cardsArr.forEach(card => courseList.appendChild(card));
    });
  }

  // -------- 4. Continue / Start / Review Button Alerts --------
  document.querySelectorAll('.cp-btn-continue').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cp-course-card');
      const title = card?.querySelector('h3')?.textContent || 'this course';
      const action = btn.textContent.trim();
      alert(`${action === 'Start' ? '🚀' : action === 'Review' ? '📖' : '▶️'} ${action}: "${title}"\nLoading your learning session...`);
    });
  });

  // -------- 5. Bookmark Toggle --------
  document.querySelectorAll('.cp-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('bookmarked');
      const svg = btn.querySelector('svg');
      if (btn.classList.contains('bookmarked')) {
        svg.style.fill = '#7C4DFF';
        svg.style.color = '#7C4DFF';
      } else {
        svg.style.fill = 'none';
        svg.style.color = '';
      }
    });
  });

  // -------- 6. More Options Button --------
  document.querySelectorAll('.cp-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.cp-course-card');
      const title = card?.querySelector('h3')?.textContent || 'Course';
      const action = prompt(`Options for "${title}":\n1. Remove from list\n2. Share\n3. Report\n\nEnter number:`);
      if (action === '1') {
        card.style.opacity = '0';
        card.style.transform = 'translateX(100px)';
        card.style.transition = 'all 0.4s ease';
        setTimeout(() => card.remove(), 400);
      }
    });
  });

});
