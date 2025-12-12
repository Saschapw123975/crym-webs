document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme immediately
  const savedTheme = localStorage.getItem('crymson_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Check if activity tracking is enabled
  const activityTrackingEnabled = localStorage.getItem('crymson_activity_tracking') !== 'false';
  
  const shell = document.querySelector('.shell');
  if (!shell) return;

  // Create Account Modal
  window.showCreateAccount = function() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 420px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
      transform: scale(0.7) translateY(40px) rotateX(10deg);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      opacity: 0;
    `;
    
    modalContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px;">
        <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 700; transform: translateY(10px); opacity: 0; animation: slideDown 0.6s ease 0.2s forwards;">Create Account</h2>
        <button onclick="closeCreateAccount()" id="close-x-btn" style="background: none; border: none; color: #6b7280; cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.3s ease; transform: scale(0.8); opacity: 0; animation: fadeInScale 0.5s ease 0.3s forwards;">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      
      <p style="margin: 0 0 28px 0; color: #6b7280; font-size: 15px; line-height: 1.6; transform: translateY(10px); opacity: 0; animation: slideDown 0.6s ease 0.25s forwards;">
        Enter your license key to create a new KeyAuth account and get started with Crymson.
      </p>
      
      <div style="margin-bottom: 20px; transform: translateY(20px); opacity: 0; animation: slideUp 0.6s ease 0.35s forwards;">
        <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 600;">License Key</label>
        <input type="text" id="create-license-key" placeholder="Enter your license key" 
               style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; background: #f9fafb;">
      </div>
      
      <div style="margin-bottom: 20px; transform: translateY(20px); opacity: 0; animation: slideUp 0.6s ease 0.4s forwards;">
        <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 600;">Username</label>
        <input type="text" id="create-username" placeholder="Choose a username" 
               style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; background: #f9fafb;">
      </div>
      
      <div style="margin-bottom: 20px; transform: translateY(20px); opacity: 0; animation: slideUp 0.6s ease 0.45s forwards;">
        <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 600;">Email</label>
        <input type="email" id="create-email" placeholder="Enter your email" 
               style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; background: #f9fafb;">
      </div>
      
      <div style="margin-bottom: 20px; transform: translateY(20px); opacity: 0; animation: slideUp 0.6s ease 0.5s forwards;">
        <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 600;">Password</label>
        <input type="password" id="create-password" placeholder="Create a password" 
               style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; background: #f9fafb;">
      </div>
      
      <div style="margin-bottom: 28px; transform: translateY(20px); opacity: 0; animation: slideUp 0.6s ease 0.55s forwards;">
        <label style="display: block; margin-bottom: 8px; color: #374151; font-size: 14px; font-weight: 600;">Confirm Password</label>
        <input type="password" id="create-confirm-password" placeholder="Confirm your password" 
               style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; background: #f9fafb;">
      </div>
      
      <div style="display: flex; gap: 16px; justify-content: flex-end; transform: translateY(20px); opacity: 0; animation: slideUp 0.6s ease 0.6s forwards;">
        <button onclick="closeCreateAccount()" id="cancel-btn"
                style="padding: 12px 20px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 12px; cursor: pointer; font-size: 15px; font-weight: 600; transition: all 0.3s ease;">Cancel</button>
        <button onclick="performCreateAccount()" id="create-btn"
                style="padding: 12px 24px; border: none; background: linear-gradient(135deg, #3d73ff 0%, #2563eb 100%); color: white; border-radius: 12px; cursor: pointer; font-size: 15px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(61, 115, 255, 0.3);">Create Account</button>
      </div>
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeInScale {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Enhanced input focus animations
    const inputs = modalContent.querySelectorAll('input');
    inputs.forEach((input, index) => {
      input.addEventListener('focus', () => {
        input.style.borderColor = '#3d73ff';
        input.style.background = 'white';
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 0 4px rgba(61, 115, 255, 0.15)';
      });
      
      input.addEventListener('blur', () => {
        input.style.borderColor = '#e5e7eb';
        input.style.background = '#f9fafb';
        input.style.transform = 'scale(1)';
        input.style.boxShadow = 'none';
      });
      
      // Add typing animation
      input.addEventListener('input', () => {
        if (input.value.length > 0) {
          input.style.borderColor = '#10b981';
        } else {
          input.style.borderColor = '#e5e7eb';
        }
      });
    });
    
    // Enhanced button animations
    const closeBtn = modalContent.querySelector('#close-x-btn');
    const cancelBtn = modalContent.querySelector('#cancel-btn');
    const createBtn = modalContent.querySelector('#create-btn');
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = '#f3f4f6';
      closeBtn.style.color = '#374151';
      closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'none';
      closeBtn.style.color = '#6b7280';
      closeBtn.style.transform = 'scale(1) rotate(0deg)';
    });
    
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = '#f3f4f6';
      cancelBtn.style.borderColor = '#d1d5db';
      cancelBtn.style.transform = 'translateY(-2px)';
      cancelBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    });
    
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'white';
      cancelBtn.style.borderColor = '#e5e7eb';
      cancelBtn.style.transform = 'translateY(0)';
      cancelBtn.style.boxShadow = 'none';
    });
    
    createBtn.addEventListener('mouseenter', () => {
      createBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
      createBtn.style.transform = 'translateY(-2px) scale(1.05)';
      createBtn.style.boxShadow = '0 8px 20px rgba(61, 115, 255, 0.4)';
    });
    
    createBtn.addEventListener('mouseleave', () => {
      createBtn.style.background = 'linear-gradient(135deg, #3d73ff 0%, #2563eb 100%)';
      createBtn.style.transform = 'translateY(0) scale(1)';
      createBtn.style.boxShadow = '0 4px 12px rgba(61, 115, 255, 0.3)';
    });
    
    // Animate modal entrance
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      modalContent.style.opacity = '1';
      modalContent.style.transform = 'scale(1) translateY(0) rotateX(0deg)';
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCreateAccount();
    });
    
    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeCreateAccount();
    };
    document.addEventListener('keydown', handleEscape);
    
    // Store reference for cleanup
    modal._cleanup = () => {
      document.removeEventListener('keydown', handleEscape);
      document.head.removeChild(style);
    };
  };
  
  window.closeCreateAccount = function() {
    const modal = document.querySelector('[style*="position: fixed"]');
    if (modal) {
      modal.style.opacity = '0';
      const content = modal.firstElementChild;
      content.style.transform = 'scale(0.9) translateY(20px)';
      
      // Cleanup event listeners
      if (modal._cleanup) modal._cleanup();
      
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 300);
    }
  };
  
  window.performCreateAccount = function() {
    const licenseKey = document.getElementById('create-license-key').value.trim();
    const username = document.getElementById('create-username').value.trim();
    const email = document.getElementById('create-email').value.trim();
    const password = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('create-confirm-password').value;
    
    if (!licenseKey || !username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage(`CREATE_ACCOUNT:${licenseKey}:${username}:${email}:${password}`);
    } else {
      alert(`Creating account with license key: ${licenseKey}`);
    }
  };

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
  
  // Auto login functionality
  function attemptAutoLogin() {
    const autoLoginEnabled = localStorage.getItem('crymson_auto_login') === 'true';
    const savedUsername = localStorage.getItem('crymson_username');
    const savedPassword = localStorage.getItem('crymson_password');
    
    if (autoLoginEnabled && savedUsername && savedPassword) {
      // Fill in the saved credentials
      if (userField) userField.value = savedUsername;
      if (passField) passField.value = savedPassword;
      if (rememberCheckbox) rememberCheckbox.checked = true;
      
      // Auto login after a short delay
      setTimeout(() => {
        if (primaryBtn) primaryBtn.click();
      }, 500);
    }
  }
  
  // Check for auto login on page load
  if (primaryBtn && userField && passField) {
    // Set checkbox state based on saved setting
    if (rememberCheckbox) {
      rememberCheckbox.checked = localStorage.getItem('crymson_auto_login') === 'true';
    }
    
    attemptAutoLogin();
    
    primaryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const user = userField.value.trim();
      const pass = passField.value;
      const autoLoginEnabled = rememberCheckbox ? rememberCheckbox.checked : false;
      if (user && pass) {
        // Show loading animation
        if (window.crymsonAnimations) {
          window.crymsonAnimations.showLoadingSpinner();
        }
        
        // Update auto login setting based on checkbox
        const autoLoginEnabled = rememberCheckbox ? rememberCheckbox.checked : false;
        localStorage.setItem('crymson_auto_login', autoLoginEnabled);
        
        // Save credentials if auto login is enabled
        if (autoLoginEnabled) {
          localStorage.setItem('crymson_username', user);
          localStorage.setItem('crymson_password', pass);
        } else {
          // Clear saved credentials if auto login is disabled
          localStorage.removeItem('crymson_username');
          localStorage.removeItem('crymson_password');
        }
        
        // Send login request to C# backend with remember-me flag
        window.chrome.webview.postMessage(`LOGIN:${user}:${pass}:${autoLoginEnabled}`);
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
