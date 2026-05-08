const shoeDatabase = [
    { id: 1, brand: "NIKE", line: "LEBRON", name: "LeBron 21 'Vertex'", price: 200, hype: 5, tech: "Zoom Turbo", date: "2026-05-08", img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/0329433d-c019-4822-8b4e-28268c15985b/lebron-xxi-basketball-shoes-SPh6ms.png" },
    { id: 2, brand: "ADIDAS", line: "AE1", name: "AE1 'Ascent'", price: 120, hype: 5, tech: "Jet Boost", date: "2026-05-15", img: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7f6517a618e04099a43e49e061c27df6_9366/AE_1_Velocity_Blue_Shoes_Blue_IF1864_01_standard.jpg" },
    { id: 3, brand: "JORDAN", line: "LUKA", name: "Luka 3 'Midnight'", price: 130, hype: 4, tech: "IsoPlate", date: "2026-05-10", img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/609426f3-8f0c-4e5a-8b38-d7a8d9a4242d/luka-2-basketball-shoes-v4V9L6.png" },
    { id: 4, brand: "PUMA", line: "LAMELO", name: "MB.04 'Galaxy'", price: 130, hype: 5, tech: "Nitro Foam", date: "2026-05-22", img: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:f3f3f3,w_600,h_600/global/309851/01/sv01/fnd/PNA/fmt/png/MB.03-Blue-Hive-Basketball-Shoes" },
    { id: 5, brand: "NIKE", line: "KD", name: "KD 17 'Suns'", price: 150, hype: 4, tech: "Air Zoom", date: "2026-05-28", img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/60451a94-486a-495c-9c98-17a7e3d23f39/kd17-basketball-shoes-0pB6Dq.png" }
];

let locker = JSON.parse(localStorage.getItem('ghLocker')) || [];
let compareList = [];

// NAVIGATION
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    window.scrollTo(0,0);
    if(pageId === 'collection') renderArchive();
    if(pageId === 'calendar') renderCalendar();
    if(pageId === 'locker') renderLocker();
}

// RENDER CARDS
function createCard(shoe) {
    const isFav = locker.includes(shoe.id);
    const isComp = compareList.includes(shoe.id);
    const today = new Date().toISOString().split('T')[0];
    const isUpcoming = shoe.date > today;

    const card = document.createElement('div');
    card.className = 'shoe-card';
    card.onclick = () => openModal(shoe);
    card.innerHTML = `
        <div class="image-container">
            <button class="fav-btn ${isFav?'active':''}" onclick="toggleLocker(${shoe.id},event)">${isFav?'♥':'♡'}</button>
            <button class="comp-btn ${isComp?'active':''}" onclick="toggleCompare(${shoe.id},event)">VS</button>
            <img src="${shoe.img}">
            ${isUpcoming ? `<div class="drop-tag">DROPS ${shoe.date}</div>` : ''}
        </div>
        <p style="color:var(--accent); font-weight:900; font-size:0.6rem; margin-top:12px;">${shoe.brand} // ${shoe.line}</p>
        <div class="shoe-name" style="font-weight:900;">${shoe.name}</div>
    `;
    return card;
}

// ARCHIVE PAGE
function renderArchive() {
    const grid = document.getElementById('archive-grid');
    const query = document.getElementById('search-bar').value.toLowerCase();
    grid.innerHTML = '';
    shoeDatabase.filter(s => s.name.toLowerCase().includes(query) || s.brand.toLowerCase().includes(query))
                .forEach(s => grid.appendChild(createCard(s)));
}

// CALENDAR PAGE
function renderCalendar() {
    const list = document.getElementById('calendar-list');
    list.innerHTML = '';
    const sorted = [...shoeDatabase].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    sorted.forEach(shoe => {
        const item = document.createElement('div');
        item.className = 'calendar-item';
        item.innerHTML = `
            <div class="calendar-date">${shoe.date.split('-')[2]}<br><span style="font-size:0.7rem; color:var(--black)">MAY</span></div>
            <img src="${shoe.img}" width="150">
            <div>
                <div style="font-weight:900; font-size:1.5rem;">${shoe.name}</div>
                <div style="color:var(--accent); font-weight:900;">${shoe.brand} // $${shoe.price}</div>
            </div>
            <button class="explore-btn" style="border-color:black; color:black; margin-left:auto;" onclick="openModalById(${shoe.id})">TECH SPECS</button>
        `;
        list.appendChild(item);
    });
}

// LOCKER PAGE
function renderLocker() {
    const grid = document.getElementById('locker-grid');
    grid.innerHTML = '';
    const saved = shoeDatabase.filter(s => locker.includes(s.id));
    saved.length ? saved.forEach(s => grid.appendChild(createCard(s))) : grid.innerHTML = '<p>YOUR LOCKER IS EMPTY.</p>';
}

// DAILY HERO RANDOMIZER
function initHero() {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shoe = shoeDatabase[seed % shoeDatabase.length];
    document.getElementById('featured-hero').innerHTML = `
        <div class="hero-content">
            <div class="hero-text"><h3>MAY SPOTLIGHT</h3><h2>${shoe.name}</h2><button class="explore-btn" onclick="showPage('collection')">EXPLORE ARCHIVE</button></div>
            <div class="hero-img"><img src="${shoe.img}"></div>
        </div>
    `;
}

// FUNCTIONALITY
function toggleLocker(id, e) {
    e.stopPropagation();
    const idx = locker.indexOf(id);
    idx > -1 ? locker.splice(idx, 1) : locker.push(id);
    localStorage.setItem('ghLocker', JSON.stringify(locker));
    document.getElementById('locker-count').innerText = locker.length;
    renderArchive(); renderLocker();
}

function toggleCompare(id, e) {
    e.stopPropagation();
    const idx = compareList.indexOf(id);
    if (idx > -1) compareList.splice(idx, 1);
    else if (compareList.length < 2) compareList.push(id);
    updateCompareTray(); renderArchive();
}

function updateCompareTray() {
    const tray = document.getElementById('compare-tray');
    const slots = document.getElementById('compare-slots');
    tray.classList.toggle('active', compareList.length > 0);
    slots.innerHTML = compareList.map(id => {
        const s = shoeDatabase.find(x => x.id === id);
        return `<div class="slot-img"><img src="${s.img}" width="100%"></div>`;
    }).join('');
}

function openCompareModal() {
    if(compareList.length < 2) return;
    const [s1, s2] = compareList.map(id => shoeDatabase.find(x => x.id === id));
    document.getElementById('compare-results').innerHTML = [s1, s2].map(s => `
        <div class="compare-col">
            <img src="${s.img}" width="100%">
            <h2>${s.name}</h2>
            <p><strong>TECH:</strong> ${s.tech}</p>
            <p><strong>PRICE:</strong> $${s.price}</p>
        </div>
    `).join('');
    document.getElementById('compare-modal').style.display = 'block';
}

function openModal(shoe) {
    document.getElementById('modal-body').innerHTML = `
        <img src="${shoe.img}" width="100%">
        <div>
            <h2>${shoe.name}</h2>
            <p><strong>TECH:</strong> ${shoe.tech}</p>
            <p><strong>RELEASE DATE:</strong> ${shoe.date}</p>
            <p style="text-transform:none; color:#555; line-height:1.6;">Global Hoops scouting report: High-performance signature model designed for the modern positionless player. Maximum lockdown and elite energy return.</p>
            <button class="explore-btn" style="background:black; color:white; width:100%;" onclick="closeModal()">CLOSE</button>
        </div>
    `;
    document.getElementById('modal').style.display = 'block';
}

function openModalById(id) { openModal(shoeDatabase.find(x => x.id === id)); }
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function closeCompareModal() { document.getElementById('compare-modal').style.display = 'none'; }
function clearCompare() { compareList = []; updateCompareTray(); renderArchive(); }

document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('dark-theme');

// BOOT APP
initHero();
document.getElementById('locker-count').innerText = locker.length;
