document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark'; // default dark for modern SaaS styling
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '☀️'; // Sun icon for light option
            themeToggleBtn.title = 'Switch to Light Mode';
        } else {
            themeToggleBtn.innerHTML = '🌙'; // Moon icon for dark option
            themeToggleBtn.title = 'Switch to Dark Mode';
        }
    }

    // RTL Toggle logic
    const rtlToggleBtn = document.getElementById('rtl-toggle');
    const currentDir = localStorage.getItem('dir') || 'ltr';
    document.body.setAttribute('dir', currentDir);
    updateRtlButton(currentDir);

    if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
            let dir = document.body.getAttribute('dir');
            let newDir = dir === 'rtl' ? 'ltr' : 'rtl';
            document.body.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRtlButton(newDir);
        });
    }

    function updateRtlButton(dir) {
        if (!rtlToggleBtn) return;
        rtlToggleBtn.textContent = '⇄';
        if (dir === 'rtl') {
            rtlToggleBtn.title = 'Switch to Left to Right';
        } else {
            rtlToggleBtn.title = 'Switch to Right to Left';
        }
    }

    // Active navigation link highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile Menu Toggle
    const menuToggleBtn = document.getElementById('menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    if (menuToggleBtn && navLinksContainer) {
        menuToggleBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }

    // Back to Top Button injection and behavior
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dashboard Mobile Sidebar Toggle
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (sidebarCloseBtn && sidebar) {
        sidebarCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Auto-close sidebar on item click on mobile
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 1024 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
});

