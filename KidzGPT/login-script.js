/* ============================================================
   KidzGPT Login & Signup — Interactive Script
   Tab switcher, password toggle, cursor eye tracking, & shy state
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -------- Tab Switcher Logic --------
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const groupName = document.getElementById('group-name');
  const inputName = document.getElementById('input-name');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const submitText = document.getElementById('submitText');
  const rememberRow = document.getElementById('formOptionsRow');

  const switchTab = (mode) => {
    if (mode === 'signup') {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      groupName.classList.remove('hidden');
      inputName.setAttribute('required', 'true');
      formTitle.textContent = 'Create an account! 🚀';
      formSubtitle.textContent = 'Start your interactive learning path today';
      submitText.textContent = 'Sign Up';
      rememberRow.style.display = 'none';
    } else {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      groupName.classList.add('hidden');
      inputName.removeAttribute('required');
      formTitle.textContent = 'Welcome back! 👋';
      formSubtitle.textContent = 'Continue your learning adventure';
      submitText.textContent = 'Log In';
      rememberRow.style.display = 'flex';
    }
  };

  if (tabLogin && tabSignup) {
    tabLogin.addEventListener('click', () => switchTab('login'));
    tabSignup.addEventListener('click', () => switchTab('signup'));
  }

  // Parse URL parameters to check active tab
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab');
  if (initialTab === 'signup') {
    switchTab('signup');
  } else {
    switchTab('login');
  }

  // -------- Password Visibility Toggle --------
  const passwordToggle = document.getElementById('passwordToggle');
  const inputPassword = document.getElementById('input-password');

  if (passwordToggle && inputPassword) {
    passwordToggle.addEventListener('click', () => {
      if (inputPassword.type === 'password') {
        inputPassword.type = 'text';
        passwordToggle.textContent = '👁️‍🗨️';
      } else {
        inputPassword.type = 'password';
        passwordToggle.textContent = '👁️';
      }
    });
  }

  // -------- Eye-Tracking Cursor Follow --------
  const eyes = document.querySelectorAll('.eye');
  const cylinders = document.querySelectorAll('.cylinder');
  let isShy = false;

  const trackMouse = (e) => {
    if (isShy) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    eyes.forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;

      // Distance and angle
      const angle = Math.atan2(mouseY - eyeY, mouseX - eyeX);
      
      // Limit travel distance of pupil
      const maxDistance = 7;
      const dx = Math.cos(angle) * maxDistance;
      const dy = Math.sin(angle) * maxDistance;

      pupil.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  };

  document.addEventListener('mousemove', trackMouse);

  // -------- Password Input Focus (Shy / Cover Eyes State) --------
  if (inputPassword) {
    inputPassword.addEventListener('focus', () => {
      isShy = true;
      cylinders.forEach(cyl => {
        cyl.classList.add('shy');
      });
    });

    inputPassword.addEventListener('blur', () => {
      isShy = false;
      cylinders.forEach(cyl => {
        cyl.classList.remove('shy');
      });
      // Reset pupil positions to center first
      eyes.forEach(eye => {
        const pupil = eye.querySelector('.pupil');
        pupil.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // -------- Fun Speech Bubble Reactions --------
  const speechBubble = document.getElementById('speechBubble');
  const inputs = document.querySelectorAll('.input-wrapper input');

  inputs.forEach(input => {
    input.addEventListener('focus', (e) => {
      if (speechBubble) {
        if (e.target.id === 'input-name') {
          speechBubble.innerHTML = 'Nice name! Let me remember it! 📝';
        } else if (e.target.id === 'input-email') {
          speechBubble.innerHTML = 'Type your email address! 📧';
        } else if (e.target.id === 'input-password') {
          speechBubble.innerHTML = 'I won\'t look at your password, promise! 🙈';
        }
      }
    });

    input.addEventListener('blur', () => {
      if (speechBubble) {
        speechBubble.innerHTML = 'Hey there! 👋<br>Move your mouse around, I follow you!';
      }
    });
  });

  // -------- Step 1 Auth Form Submit -> Onboarding Transition --------
  const authForm = document.getElementById('authForm');
  const authStep = document.getElementById('auth-step');
  const onboardingStep = document.getElementById('onboarding-step');

  if (authForm && authStep && onboardingStep) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Fade out auth step
      authStep.style.opacity = '0';
      authStep.style.transform = 'translateY(-15px)';
      
      setTimeout(() => {
        authStep.classList.add('hidden');
        onboardingStep.classList.remove('hidden');
        
        // Trigger reflow for transition
        void onboardingStep.offsetWidth;
        
        // Fade in onboarding step
        onboardingStep.style.opacity = '1';
        onboardingStep.style.transform = 'translateY(0)';
        
        if (speechBubble) {
          speechBubble.innerHTML = 'Choose your buddy and course to start learning! 🌟';
        }
      }, 400);
    });
  }

  // -------- Onboarding Grade Pills Selection --------
  const gradePills = document.querySelectorAll('.grade-pill');
  gradePills.forEach(pill => {
    pill.addEventListener('click', () => {
      gradePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // -------- Onboarding Buddy Selection --------
  const buddyAvatars = document.querySelectorAll('.buddy-avatar');
  buddyAvatars.forEach(avatar => {
    avatar.addEventListener('click', () => {
      buddyAvatars.forEach(av => av.classList.remove('active'));
      avatar.classList.add('active');

      const buddyColor = avatar.getAttribute('data-buddy');
      
      // Highlight matching cylinder on the left
      cylinders.forEach(cyl => cyl.classList.remove('selected-buddy'));
      const targetCyl = document.getElementById(`cyl-${buddyColor}`);
      if (targetCyl) {
        targetCyl.classList.add('selected-buddy');
      }

      // Update speech bubble based on chosen buddy
      if (speechBubble) {
        if (buddyColor === 'blue') {
          speechBubble.innerHTML = 'Yay! Let\'s explore science and code together! 🤖';
        } else if (buddyColor === 'yellow') {
          speechBubble.innerHTML = 'Awesome! I love math adventures, let\'s go! ➕';
        } else if (buddyColor === 'purple') {
          speechBubble.innerHTML = 'Great choice! We will learn CBSE and ICSE paths! 📚';
        } else if (buddyColor === 'red') {
          speechBubble.innerHTML = 'Super! Let\'s play games and logic puzzles! 🎮';
        }
      }
    });
  });

  // -------- Onboarding Course Cards Selection --------
  const courseCards = document.querySelectorAll('.course-select-card');
  courseCards.forEach(card => {
    card.addEventListener('click', () => {
      courseCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // -------- Onboarding Form Submit -> Dashboard Redirect --------
  const onboardingForm = document.getElementById('onboardingForm');
  if (onboardingForm) {
    onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (speechBubble) {
        speechBubble.innerHTML = 'Saving your preferences... Let\'s go! 🚀';
      }
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }

});
