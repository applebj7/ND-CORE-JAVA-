// ─────────────────────────────────────────
// 00. 설정, 전역변수
// ─────────────────────────────────────────

// btn Back
const backBtnContainer = document.getElementById('backBtnContainer');
const backBtn = document.getElementById('backBtn');

// Menu
const menuContainer = document.getElementById('menu-list');

// Category
const categoryContainer = document.getElementById('category-list');


// ─────────────────────────────────────────
// 01. 공통, 메인
// ─────────────────────────────────────────

// 초기 로딩
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    // loadCategory();
});

// 상단메뉴, 카테고리
async function loadMenu() {
    // DB 호출
    const data = await callService('/menus', {});
    let menuList = data ? JSON.parse(data) : [];

    if (menuList.length === 0) return;

    menuList.forEach(menu => {
        let html = "";
        if(menu.category === 'nav') { // 상단메뉴
            html = `<li><a href="javascript:void(0);" onclick="loadPage('${menu.id}')"><i class="${menu.icon}"></i> ${menu.name}</a></li>`;
            menuContainer.insertAdjacentHTML('beforeend', html);
        } else { // 카테고리
            html = `<li><a href="javascript:void(0);" onclick="loadPage('${menu.id}')"> ${menu.name} </a></li>`;
            categoryContainer.insertAdjacentHTML('beforeend', html);
        }
    });
}

// Home
function goHome() {
    location.href = '/board';
}

// 뒤로가기 버튼
if (backBtn) {
    backBtn.addEventListener('click', () => {
        location.href = '/';
    });
}

// 메뉴 클릭
function loadPage(id) {
    alert(`메뉴 클릭: ${id}`);
}

// 자바호출
async function callService(path, params) {
    try {
        if(!path) return;
        
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        if (params) {
            options.body = JSON.stringify(params);
        }

        const response = await fetch(path, options);

        if (!response.ok) {
            // 서버 에러 메시지를 더 자세히 보기 위해 status 추가
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error:', error);
    }
}

// ─────────────────────────────────────────
// 02. Navbar
// ─────────────────────────────────────────

// ─────────────────────────────────────────
// 03. Category
// ─────────────────────────────────────────
