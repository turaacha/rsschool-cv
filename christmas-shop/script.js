/* --- Burger Menu --- */
const burgerBtn = document.querySelector('.burger-menu');
const nav = document.querySelector('.nav');

if (burgerBtn && nav) {
    burgerBtn.addEventListener('click', () => {
        nav.classList.toggle('is-open');
    });
}

/* --- Timer --- */
function updateTimer() {
    const daysEl = document.getElementById('days');
    if (!daysEl) return;

    const targetDate = new Date('June 6, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
        daysEl.innerText = "0";
        document.getElementById('hours').innerText = "0";
        document.getElementById('minutes').innerText = "0";
        document.getElementById('seconds').innerText = "0";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}
setInterval(updateTimer, 1000);
updateTimer();

/* --- Slider --- */
const slider = document.querySelector('.row_slider');
const nextBtn = document.querySelector('.arrow-button');
const prevBtn = document.querySelector('.arrow-button1');

if (slider && nextBtn && prevBtn) {
    const step = 310;
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: step, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -step, behavior: 'smooth' });
    });
}

/* --- Random Gifts --- */
const giftContainer = document.querySelector('.best_gifts_container');
const giftCards = Array.from(document.querySelectorAll('.card_1'));


if (giftContainer && giftCards.length > 0 && !document.body.classList.contains('gifts-page')) {
    const shuffled = giftCards.sort(() => 0.5 - Math.random());
    giftContainer.innerHTML = '';
    shuffled.slice(0, 4).forEach(card => giftContainer.appendChild(card));
}

/* --- Category Switching --- */
const tabs = document.querySelectorAll('.nav-item a[data-category]');
const allGifts = document.querySelectorAll('.grid_container .card_1');

if (tabs.length > 0) {
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const category = tab.dataset.category;

            allGifts.forEach(gift => {
                if (category === 'all' || gift.dataset.category === category) {
                    gift.style.display = 'block';
                } else {
                    gift.style.display = 'none';
                }
            });
        });
    });
}

/* --- Button UP --- */

const btnUp = document.getElementById('btnUp');

if (btnUp) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnUp.style.display = 'flex';
        } else {
            btnUp.style.display = 'none';
        }
    });

    btnUp.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
