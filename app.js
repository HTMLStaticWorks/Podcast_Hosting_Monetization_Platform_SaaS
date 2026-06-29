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
});
