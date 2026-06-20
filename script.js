document.addEventListener('DOMContentLoaded', () => {
    // Automatyczna aktualizacja daty w nagłówku
    const dateElement = document.getElementById('current-date');
    
    if(dateElement) {
        const months = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ];
        
        const currentDate = new Date();
        const currentMonth = months[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();
        
        dateElement.textContent = `${currentMonth} ${currentYear}`;
    }

    // Proste śledzenie kliknięć w linki afiliacyjne (opcjonalne)
    const affiliateLinks = document.querySelectorAll('a[rel="sponsored"]');
    
    affiliateLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Tutaj można dodać np. kod Google Analytics do śledzenia konwersji
            console.log('Kliknięto link afiliacyjny do: ' + link.href);
        });
    });
});
