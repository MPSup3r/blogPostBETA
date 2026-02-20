// Seleziona il bottone del tema
const themeToggleBtn = document.getElementById('themeToggle');

// Funzione per cambiare il tema
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Aggiorna l'attributo nel tag <html>
    html.setAttribute('data-theme', newTheme);
    
    // Aggiorna l'icona e il testo del bottone
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (newTheme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Chiaro';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Scuro';
    }
}

// Aggiungi l'event listener al bottone
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
