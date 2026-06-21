document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Data i Rok
    const dateElement = document.getElementById('current-date');
    const yearElement = document.getElementById('year');
    const currentDate = new Date();
    
    if(dateElement) {
        const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        dateElement.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if(yearElement) {
        yearElement.textContent = currentDate.getFullYear();
    }

    // 2. Obsługa podstron (Konta osobiste, Firmowe, Lokaty)
    const navBtns = document.querySelectorAll('.nav-btn');
    const pageSections = document.querySelectorAll('.page-section');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');

    const pageData = {
        'page-osobiste': {
            title: 'Ranking Kont Osobistych',
            desc: 'Wybierz najlepszą ofertę na rynku, uniknij ukrytych opłat i zyskaj premię gotówkową za otwarcie darmowego konta.'
        },
        'page-firmowe': {
            title: 'Ranking Kont Firmowych',
            desc: 'Prowadzisz działalność? Zobacz konta dla firm z darmowymi przelewami ZUS/US i zyskaj bonus za aktywne bankowanie.'
        },
        'page-lokaty': {
            title: 'Ranking Lokat i Oszczędności',
            desc: 'Chroń swój kapitał przed inflacją. Porównaj najwyżej oprocentowane lokaty i konta oszczędnościowe.'
        }
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            pageSections.forEach(section => {
                section.classList.remove('active-section');
                section.classList.add('hidden');
            });

            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            targetSection.classList.remove('hidden');
            // Małe opóźnienie dla płynnej animacji
            setTimeout(() => {
                targetSection.classList.add('active-section');
            }, 10);

            heroTitle.textContent = pageData[targetId].title;
            heroDesc.textContent = pageData[targetId].desc;
        });
    });

    // 3. Przełącznik wieku 18-26 / 26+
    const ageBtns = document.querySelectorAll('.age-btn');
    const table26Plus = document.getElementById('table-26plus');
    const table18To26 = document.getElementById('table-18to26');

    ageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetAge = btn.getAttribute('data-age');

            if(targetAge === '18to26') {
                table26Plus.classList.add('hidden');
                table18To26.classList.remove('hidden');
            } else {
                table18To26.classList.add('hidden');
                table26Plus.classList.remove('hidden');
            }
        });
    });
});
