document.addEventListener('DOMContentLoaded', () => {
  // Auto-detect system theme preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply saved theme or auto-detect system preference
  const savedTheme = localStorage.getItem('crymson_theme') || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply theme to document
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-change if user hasn't manually set a preference
    if (!localStorage.getItem('crymson_theme_manual')) {
      const newTheme = e.matches ? 'dark' : 'light';
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('crymson_theme', newTheme);
    }
  });
  
  // Check if activity tracking is enabled
  const activityTrackingEnabled = localStorage.getItem('crymson_activity_tracking') !== 'false';
  
  const shell = document.querySelector('.shell');
  if (!shell) return;

  // Theme toggle functionality
  window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('crymson_theme', newTheme);
    localStorage.setItem('crymson_theme_manual', 'true');
    
    // Update theme toggle button if it exists
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
      themeToggle.title = newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
    
    // Track theme change
    if (activityTrackingEnabled) {
      activityTracker.addActivity('click', `Theme changed to ${newTheme}`, 'Theme toggle');
    }
  };

  // Add theme toggle button to all pages
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = savedTheme === 'dark' ? '🌙' : '☀️';
  themeToggle.title = savedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  themeToggle.onclick = window.toggleTheme;
  
  // Add theme toggle to header or navigation
  const header = document.querySelector('header') || document.querySelector('.shell-header') || document.querySelector('.nav') || document.body;
  if (header) {
    header.appendChild(themeToggle);
  }


  // Login functionality tracking system (only if enabled)
  const activityTracker = {
    activities: [],
    
    addActivity(type, title, details = '') {
      if (!activityTrackingEnabled) return;
      
      const activity = {
        id: Date.now(),
        type,
        title,
        details,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now'
      };
      
      this.activities.unshift(activity);
      this.saveActivities();
    },
    
    saveActivities() {
      try {
        localStorage.setItem('crymson_activities', JSON.stringify(this.activities));
      } catch (e) {
        console.warn('Could not save activities');
      }
    },
    
    loadActivities() {
      try {
        const saved = localStorage.getItem('crymson_activities');
        if (saved) {
          this.activities = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not load activities');
      }
    }
  };

  // Load existing activities
  if (activityTrackingEnabled) {
    activityTracker.loadActivities();
  }

  // Track button clicks across the application
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button, .btn-primary, .nav-item, .activity-item');
    if (button) {
      const buttonText = button.textContent.trim() || button.getAttribute('aria-label') || 'Unknown button';
      const page = window.location.pathname.split('/').pop() || 'unknown';
      
      // Don't track login button clicks (already tracked above)
      if (!button.classList.contains('primary')) {
        activityTracker.addActivity('click', `Button clicked: ${buttonText}`, `Page: ${page}`);
      }
    }
  });

  // Track page navigation
  const originalLocationAssign = window.location.assign;
  window.location.assign = function(url) {
    const page = url.split('/').pop() || 'unknown';
    activityTracker.addActivity('navigation', `Navigated to ${page}`, 'Page change');
    return originalLocationAssign.call(this, url);
  };

  // Handle successful login with welcome message
  window.handleLoginSuccess = async (username) => {
    // Use animation system for page transition
    if (window.crymsonAnimations) {
      window.crymsonAnimations.showLoadingSpinner();
    }
    
    // Show welcome message covering the entire screen
    const welcomeDiv = document.createElement('div');
    welcomeDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(145deg, #3d73ff, #6dd8ff);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: 700;
      z-index: 10000;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.6s ease;
    `;
    welcomeDiv.innerHTML = `Welcome, ${username}!`;
    document.body.appendChild(welcomeDiv);
    
    // Hide loading spinner
    if (window.crymsonAnimations) {
      window.crymsonAnimations.hideLoadingSpinner();
    }
    
    // Animate in
    requestAnimationFrame(() => {
      welcomeDiv.style.opacity = '1';
      welcomeDiv.style.transform = 'scale(1)';
    });
    
    // Animate to welcome screen after 2 seconds
    setTimeout(async () => {
      welcomeDiv.style.opacity = '0';
      welcomeDiv.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (document.body.contains(welcomeDiv)) {
          document.body.removeChild(welcomeDiv);
        }
        // Navigate to welcome page with transition
        if (window.crymsonAnimations) {
          window.crymsonAnimations.pageTransition('forward').then(() => {
            window.location.href = 'welcome.html';
          });
        } else {
          window.location.href = 'welcome.html';
        }
      }, 500);
    }, 2000);
  };

  // If user prefers reduced motion, skip the slide-in choreography.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    shell.classList.remove('fx-start');
    return;
  }

  // Ensure we start hidden for the animation (in case the class was removed in SSR/rehydrate).
  shell.classList.add('fx-start');

  // Two rAFs ensure style application before we remove the class to trigger transitions.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      shell.classList.remove('fx-start');
    });
  });

  // KeyAuth login handler
  const primaryBtn = document.querySelector('.primary');
  const userField = document.querySelector('#user');
  const passField = document.querySelector('#pass');
  const rememberCheckbox = document.querySelector('#remember-me');

  function postJsonMessage(payload) {
    try {
      if (window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage(JSON.stringify(payload));
      }
    } catch (e) {
      console.log('postMessage failed', e);
    }
  }

  if (primaryBtn && userField && passField) {
    primaryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const user = userField.value.trim();
      const pass = passField.value;
      if (user && pass) {
        // Show loading animation
        if (window.crymsonAnimations) {
          window.crymsonAnimations.showLoadingSpinner();
        }

        const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;
        postJsonMessage({ type: 'LOGIN', username: user, password: pass, rememberMe });
      } else {
        // Shake animation for invalid input
        if (window.crymsonAnimations) {
          userField.style.animation = 'shake 0.5s ease';
          passField.style.animation = 'shake 0.5s ease';
          setTimeout(() => {
            userField.style.animation = '';
            passField.style.animation = '';
          }, 500);
        }
        alert('Please enter username and password');
      }
    });

    // Also handle Enter key
    userField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') primaryBtn.click();
    });
    passField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') primaryBtn.click();
    });
  }
});
