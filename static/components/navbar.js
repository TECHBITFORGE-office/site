class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.render(); // Render initial state
    this.initAuthListener();
  }

  render(isLoggedIn = false, userData = null) {
    const avatarURL = new URL(
      userData?.avatar_url || "/USER.png",
      window.location.origin
    ).href;

    // SVG Icons
    const iconMenu = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    const iconClose = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const iconHome = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;

    this.shadowRoot.innerHTML = `
      <style>
        /* Import Font inside Shadow DOM or inherit */
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        :host {
          display: block;
          font-family: 'Outfit', sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        * { box-sizing: border-box; }

        /* --- GLASSMORPHISM NAVBAR --- */
        nav {
          background: rgba(2, 6, 23, 0.7); /* Dark-950 with opacity */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.75rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          transition: all 0.3s ease;
        }

        /* --- LOGO --- */
        .logo img {
          height: 32px;
          display: block;
          /* Optional: Add a subtle glow to logo if transparency allows */
          filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
        }

        /* --- DESKTOP LINKS --- */
        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .nav-links a {
          color: #94a3b8; /* Gray-400 */
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-links a:hover {
          color: #fff;
        }

        /* Hover Line Effect */
        .nav-links a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: linear-gradient(90deg, #6366f1, #ec4899);
          transition: width 0.3s ease;
        }
        .nav-links a:hover::after {
          width: 100%;
        }

        /* --- ACTION BUTTONS (Sign In / Get Started) --- */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-signin {
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: color 0.2s;
        }
        .btn-signin:hover { color: #fff; }

        .btn-signup {
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          color: white;
          text-decoration: none;
          font-weight: 600;
          padding: 0.6rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-signup:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        /* --- LOGGED IN PILL (The capsule) --- */
        .user-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(30, 41, 59, 0.5); /* Slate-800/50 */
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px;
          padding-left: 12px; /* Space for buttons */
          border-radius: 9999px;
          transition: border-color 0.2s;
        }

        .user-pill:hover, .user-pill.active {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(30, 41, 59, 0.8);
        }

        .pill-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .pill-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .avatar-wrapper {
          position: relative;
          cursor: pointer;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.1);
          display: block;
        }
        .user-avatar:hover { border-color: #6366f1; }

        /* --- DROPDOWN MENU --- */
        .dropdown {
          display: none;
          position: absolute;
          top: 55px;
          right: 0;
          width: 200px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 20px 40px -5px rgba(0,0,0,0.4);
          transform-origin: top right;
          animation: scaleIn 0.2s ease forwards;
          z-index: 10001;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .dropdown.open { display: block; }

        .dropdown a {
          display: block;
          padding: 0.6rem 1rem;
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.9rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .dropdown a:hover {
          background: rgba(99, 102, 241, 0.15); /* Primary tint */
          color: #fff;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 6px 0;
        }

        .signout-link { color: #f43f5e !important; }
        .signout-link:hover { background: rgba(244, 63, 94, 0.1) !important; }

        /* --- MOBILE MENU BUTTON --- */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 0.5rem;
        }

        /* --- MOBILE MENU OVERLAY --- */
        .mobile-menu {
          position: fixed;
          top: 70px;
          left: 0;
          width: 100%;
          background: rgba(2, 6, 23, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transform: translateY(-150%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 999;
        }
        .mobile-menu.open { transform: translateY(0); }

        .mobile-menu a {
          display: block;
          padding: 1rem;
          color: #e2e8f0;
          text-decoration: none;
          font-size: 1.1rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .mobile-user-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .mobile-toggle { display: block; }
        }

        /* Backdrop for clicking outside */
        .backdrop {
          position: fixed;
          inset: 0;
          z-index: 998;
          display: none;
        }
        .backdrop.show { display: block; }
      </style>

      <div class="backdrop" id="backdrop"></div>

      <nav>
        <a class="logo" href="/"><img src="/9020930.png" alt="APINOW"></a>

        <ul class="nav-links">
          <li><a href="/Code_studio">Code Studio</a></li>
          <li><a href="/Templates">Templates</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/About_us">About Us</a></li>
        </ul>

        <div class="nav-actions">
          ${isLoggedIn ? `
            <div class="user-pill">
              <button class="pill-btn home-btn" title="Code Studio">${iconHome}</button>
              <button class="pill-btn menu-btn" title="Menu">${iconMenu}</button>
              
              <div class="avatar-wrapper">
                <img 
                  src="${userData?.avatar_url || '/USER.png'}" 
                  class="user-avatar user-trigger"
                  alt="Profile"
                  referrerpolicy="no-referrer"
                />
                
                <div class="dropdown">
                  <div style="padding: 0 1rem 0.5rem; font-size: 0.8rem; color: #64748b; font-weight:600;">
                    ${userData?.full_name || 'Account'}
                  </div>
                  <a href="/credits">Credits</a>
                  <a href="/keys">API Keys</a>
                  <a href="/activity">Activity</a>
                  <a href="/settings">Settings</a>
                  <div class="dropdown-divider"></div>
                  <a href="/signout" class="signout-link">Sign out</a>
                </div>
              </div>
            </div>
          ` : `
            <a href="/signin" class="btn-signin">Sign in</a>
            <a href="/signup" class="btn-signup">Get Started</a>
          `}
        </div>

        <button class="mobile-toggle">
          ${iconMenu}
        </button>
      </nav>

      <div class="mobile-menu">
        ${isLoggedIn ? `
          <div class="mobile-user-header">
            <img src="${avatarURL}" style="width:40px;height:40px;border-radius:50%;">
            <div>
              <div style="font-weight:600; color:#fff;">${userData?.full_name || 'User'}</div>
              <div style="font-size:0.8rem; color:#94a3b8;">Pro Plan</div>
            </div>
          </div>
        ` : ''}

        <a href="/Code_studio">Code Studio</a>
        <a href="/Templates">Templates</a>
        <a href="/pricing">Pricing</a>
        
        ${isLoggedIn ? `
          <a href="/settings">Settings</a>
          <a href="/signout" style="color: #f43f5e;">Sign Out</a>
        ` : `
          <a href="/signin">Sign In</a>
          <a href="/signup" style="color: #ec4899; font-weight:600;">Get Started</a>
        `}
      </div>
    `;

    // Re-bind events after rendering
    this.bindEvents();
  }

  bindEvents() {
    const shadow = this.shadowRoot;
    
    // Elements
    const dropdown = shadow.querySelector('.dropdown');
    const userPill = shadow.querySelector('.user-pill');
    const mobileMenu = shadow.querySelector('.mobile-menu');
    const backdrop = shadow.querySelector('#backdrop');
    
    // Buttons
    const menuBtn = shadow.querySelector('.menu-btn'); // Desktop pill menu icon
    const avatarTrigger = shadow.querySelector('.user-trigger'); // Desktop avatar
    const mobileToggle = shadow.querySelector('.mobile-toggle'); // Mobile hamburger
    const homeBtn = shadow.querySelector('.home-btn');

    // State Handlers
    const closeAll = () => {
      if(dropdown) dropdown.classList.remove('open');
      if(mobileMenu) mobileMenu.classList.remove('open');
      if(userPill) userPill.classList.remove('active');
      if(backdrop) backdrop.classList.remove('show');
    };

    // 1. Desktop Dropdown Logic
    if (dropdown) {
      const toggleDropdown = (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        closeAll(); // Close others first
        if (!isOpen) {
          dropdown.classList.add('open');
          userPill.classList.add('active');
          backdrop.classList.add('show');
        }
      };

      if(menuBtn) menuBtn.addEventListener('click', toggleDropdown);
      if(avatarTrigger) avatarTrigger.addEventListener('click', toggleDropdown);
    }

    // 2. Mobile Menu Logic
    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.contains('open');
        closeAll();
        if (!isOpen) {
          mobileMenu.classList.add('open');
          backdrop.classList.add('show');
        }
      });
    }

    // 3. Home Button Logic
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
         window.location.href = '/Code_studio';
      });
    }

    // 4. Global Close Logic
    if (backdrop) {
      backdrop.addEventListener('click', closeAll);
    }
  }

  async initAuthListener() {
    try {
      const apiKey = localStorage.getItem("api_key");
      // If no key, render logged out state
      if (!apiKey) return this.render(false);

      const response = await fetch(`/get_user?id=${apiKey}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!response.ok) {
        // Handle invalid token
        return this.render(false);
      }

      const data = await response.json();
      const userObj = data?.data?.[0] || null;
      
      // Render logged in state
      this.render(true, userObj);
    } catch (error) {
      console.error("Auth Error:", error);
      this.render(false);
    }
  }
}

customElements.define("custom-navbar", CustomNavbar);