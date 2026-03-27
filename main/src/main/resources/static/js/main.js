// ─────────────────────────────────────────
// 00. 설정, 전역변수
// ─────────────────────────────────────────

// DOM 참조
// Apps
const appContainer = document.getElementById('appContainer');
const mainContainer = document.getElementById('mainContainer');
// btn Back
const backBtnContainer = document.getElementById('backBtnContainer');
const backBtn = document.getElementById('backBtn');
const settingsBtnContainer = document.getElementById('settingsBtnContainer');
// Modal
const modal = document.getElementById('dynamicModal');
const contentArea = document.getElementById('modalContent');

// 아이콘 색상 유틸
function getIconByName(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const map = {
        xlsx: 'fa-file-excel', xls: 'fa-file-excel',
        csv: 'fa-file-csv',
        pptx: 'fa-file-powerpoint', ppt: 'fa-file-powerpoint',
        docx: 'fa-file-word', doc: 'fa-file-word',
        pdf: 'fa-file-pdf',
        png: 'fa-file-image', jpg: 'fa-file-image',
        gif: 'fa-file-image', bmp: 'fa-file-image',
        js: 'fa-file-code', ts: 'fa-file-code',
        py: 'fa-file-code', html: 'fa-file-code',
        css: 'fa-file-code', java: 'fa-file-code',
        md: 'fa-file-alt', txt: 'fa-file-alt',
        json: 'fa-file-alt', xml: 'fa-file-alt',
        zip: 'fa-file-archive', rar: 'fa-file-archive',
        mp4: 'fa-file-video', avi: 'fa-file-video',
        mp3: 'fa-file-audio',
    };
    return map[ext] || 'fa-file';
}

// ─────────────────────────────────────────
// 01. 공통, 메인
// ─────────────────────────────────────────

// 초기 로딩
document.addEventListener('DOMContentLoaded', () => {
    renderAppGrid(); // 홈 화면(앱 그리드)
});

// 뒤로가기 버튼
if (backBtn) {
    backBtn.addEventListener('click', () => {
        renderAppGrid();
    });
}

// 화면 이동
function moveScreen(path) {
    location.href = path;
}

// Toast 메시지
const showToast = (message, type) => {
    let toast = document.getElementById('toast');
    toast.textContent = message; // 메시지 설정
    if (type === 'error') {
        toast.className = "toast error show";
    } else if (type === 'info') {
        toast.className = "toast info show";
    } else if (type === 'success') {
        toast.className = "toast success show";
    } else {
        toast.className = "toast show";
    }
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 1000);
};

// HTML 부분랜더
async function router(path) {
    const container = document.getElementById('viewContainer');
    try {
        const res = await fetch(path);
        const html = await res.text();
        container.innerHTML = html;

        return true; // 성공적으로 렌더링됨을 알림
    } catch (err) {
        showToast('HTML 렌더링 오류', 'error');
    }
}


// 팝업 호출
// @param {string} url - 불러올 HTML 파일 경로 (예: '/users/list.html')
// @param {string} title - 모달 상단 제목
async function openDynamicModal(url, title) {
    try {
        modal.style.display = 'flex';
        // 1. 제목 설정
        document.getElementById('modalTitle').innerText = title;
        
        // 2. 모달 먼저 열기 (로딩 표시)
        contentArea.innerHTML = '<div class="loader">로딩 중...</div>';
        modal.showModal();

        // 3. HTML 파일 가져오기
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('파일을 불러오는데 실패했습니다.');
        }

        const html = await response.text();
        
        // 4. 받아온 HTML 삽입
        contentArea.innerHTML = html;

    } catch (error) {
        contentArea.innerHTML = `<p style="color:red;">오류: ${error.message}</p>`;
    }
}

// 팝업 닫기
function closeModal() {
    modal.close();
    modal.style.display = 'none';
}

// 자바호출
async function callService(path, reqData) {
    try {
        if(!path) return;
        
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        if (reqData) {
            options.body = JSON.stringify(reqData);
        }

        const response = await fetch(path, options);

        if (!response.ok) {
            // 서버 에러 메시지를 더 자세히 보기 위해 status 추가
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error:', error);
        throw error; // 에러를 던져야 catch 블록이 작동함
    }
}

function setIconHtml(app) {
    let html = '';
    let btnId = 'btnOpen' + app.id;
    const checkbox = `<input type="checkbox" class="app-checkbox" data-id="${app.id}">`;
    let badge = '';

    if(app.id === "Users") {
        badge = `<div class="app-badge">DB</div>`;
    } else if(app.id === "Info") {
        badge = `<div class="app-badge">Pop</div>`;
    } else if(app.id === "Board") {
        badge = `<div class="app-badge">Web</div>`;
    } else if(app.id === "Ollama") {
        badge = `<div class="app-badge">Chat</div>`;
    }

    html = `
        <div class="app-item">
            ${checkbox}
            <div class="app-icon ${app.color}" id="${btnId}">
                <i class="fas ${app.icon}"></i>
                ${badge}
            </div>
            <div class="app-name" title="${app.name}">${app.name}</div>
        </div>
    `;
    return html;
}

// 앱 아이콘 EVENT 매핑
const renderAppGrid = async () => {
    viewContainer.innerHTML = '';
    backBtnContainer.classList.remove('active');
    appContainer.classList.remove('list-view');
    appContainer.classList.add('grid-view');
    appContainer.innerHTML = '';
    appContainer.classList.add('active');

    ensureSettingsToolbar();
    const isSettings = appContainer.classList.contains('settings-mode');
    toggleSettingsMode(isSettings);

    // DB 호출
    const data = await callService('/apps');
    let apps = data ? JSON.parse(data) : [];
    let renderedCount = 0;

    apps.forEach(app => {
        if (app.id) {
            appContainer.insertAdjacentHTML('beforeend', setIconHtml(app));
            renderedCount++;
        }
    });

    // 앱 아이콘이 10개 미만인 경우 빈 슬롯(+) 추가
    for (let i = renderedCount; i < 10; i++) {
        const emptyHtml = `
            <div class="app-item empty-slot" style="opacity: 0.6; cursor: default;">
                <div class="app-icon" style="border: 2px dashed var(--glass-border); background: transparent; box-shadow: none;">
                    <i class="fas fa-plus" style="color: var(--text-muted);"></i>
                </div>
            </div>
        `;
        appContainer.insertAdjacentHTML('beforeend', emptyHtml);
    }
    
    // 드래그 앤 드롭 이벤트 바인딩
    initAppDragEvents();
    
    // [파일찾기]
    const btnOpenSearchFile = document.getElementById('btnOpenSearchFile');
    if (btnOpenSearchFile) {
        btnOpenSearchFile.addEventListener('click', async () => {
            await router('/html/fileSearch.html'); // html render

            let searchInput = document.getElementById('searchInput');
            let searchBtn = document.getElementById('searchBtn');
            let searchIcon = document.getElementById('searchIcon');
            let searchSpinner = document.getElementById('searchSpinner');
            let searchType = document.getElementById('searchType');

            // 파일찾기 영역 init
            searchIcon.style.display = 'block';
            searchSpinner.style.display = 'none';
            searchBtn.disabled = false;
            searchInput.focus();

            // Main 영역 init
            backBtnContainer.classList.add('active');
            appContainer.innerHTML = '';
            appContainer.classList.remove('active');
            appContainer.classList.remove('grid-view');

            // event
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') performSearch();
            });

            // selectBox 변경
            searchType.addEventListener('change', onChangeSearchtype);
        });
    }
    // [사용자 목록] - DB 연동
    const btnOpenUsers = document.getElementById('btnOpenUsers');
    if (btnOpenUsers) {
        btnOpenUsers.addEventListener('click', async () => {
            await router('/html/users.html'); // html render
            // Main 영역 init
            backBtnContainer.classList.add('active');
            appContainer.classList.remove('active');
            appContainer.classList.remove('grid-view');
            appContainer.innerHTML = '';

            // link 리스트 set
            const resultsContainer = document.getElementById('resultsContainer');
            resultsContainer.innerHTML = '';
            resultsContainer.classList.add('active');
            resultsContainer.classList.add('list-view');

            // DB 호출
            const data = await callService('/users');
            
            let users = data ? JSON.parse(data) : [];
            let count = 0;

            users.forEach(user => {
                const link = {
                    icon: "fa-solid fa-user",
                    color: "#1278a4ff",
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
                resultsContainer.insertAdjacentHTML('beforeend', renderuserResult(link));
                count++;
            });

            // 사용자 수
            document.getElementById('count').textContent = count;

            // 결과 클릭 → 새 창에서 열기
            resultsContainer.querySelectorAll('.result-item').forEach(el => {
                el.addEventListener('click', () => {
                    const path = el.dataset.path;
                    if (path) openInNewWindow(path);
                });
            });
        });
    }
    // [게시판]
    const btnOpenBoard = document.getElementById('btnOpenBoard');
    if (btnOpenBoard) {
        btnOpenBoard.addEventListener('click', () => {
            moveScreen('/board');
        });
    }
    // [Link]
    const btnOpenLink = document.getElementById('btnOpenLink');
    if (btnOpenLink) {
        btnOpenLink.addEventListener('click', async () => {
            await router('/html/link.html'); // html render

            let links = [
                {
                    icon: "fa-brands fa-github",
                    color: "#000000",
                    name: "GitHub > ND-CORE",
                    path: "https://github.com/applebj7/ND-CORE"
                },
                {
                    icon: "fa-brands fa-google",
                    color: "#3b82f6",
                    name: "Google",
                    path: "https://www.google.com/"
                },
                {
                    icon: "fa-solid fa-graduation-cap",
                    color: "#aac4edff",
                    name: "KOSTA EDU",
                    path: "https://edu3.kosta.or.kr/"
                },
                {
                    icon: "fa-solid fa-square-rss",
                    color: "#000000",
                    name: "Chat GPT",
                    path: "https://chatgpt.com/"
                },
                {
                    icon: "fa-solid fa-square-rss",
                    color: "#319efdff",
                    name: "GEMINI",
                    path: "https://gemini.google.com/"
                },
                {
                    icon: "fa-brands fa-youtube",
                    color: "#ef4444",
                    name: "Youtube",
                    path: "https://www.youtube.com/"
                },
                {
                    icon: "fa-solid fa-building",
                    name: "NAEDAM C&C",
                    path: "http://www.ndcc.co.kr/"
                },
                {
                    icon: "fa-solid fa-share-from-square",
                    color: "#1c7e57ff",
                    name: "장고실습",
                    path: "http://127.0.0.1:8000/"
                },
            ];


            // Main 영역 init
            backBtnContainer.classList.add('active');
            appContainer.classList.remove('active');
            appContainer.classList.remove('grid-view');
            appContainer.innerHTML = '';

            // link 리스트 set
            const resultsContainer = document.getElementById('resultsContainer');
            resultsContainer.innerHTML = '';
            resultsContainer.classList.add('active');
            resultsContainer.classList.add('list-view');

            let count = 0;

            links.forEach(link => {
                resultsContainer.insertAdjacentHTML('beforeend', renderLinkResult(link));
                count++;
            });

            // 링크 수
            document.getElementById('count').textContent = count;

            // 결과 클릭 → 새 창에서 열기
            resultsContainer.querySelectorAll('.result-item').forEach(el => {
                el.addEventListener('click', () => {
                    const path = el.dataset.path;
                    if (path) openInNewWindow(path);
                });
            });
        });
    }
    // [Settings]
    const btnOpenSettings = document.getElementById('btnOpenSettings');
    if (btnOpenSettings) {
        btnOpenSettings.addEventListener('click', () => {
            const isMode = appContainer.classList.contains('settings-mode');
            toggleSettingsMode(!isMode);
        });
    }
    // [Info]
    const btnOpenInfo = document.getElementById('btnOpenInfo');
    if (btnOpenInfo) {
        btnOpenInfo.addEventListener('click', async () => {
            openDynamicModal('/html/popup/info.html', 'Info'); // 팝업 렌더링
        });
    }
    // [Ollama Chat]
    const btnOpenOllama = document.getElementById('btnOpenOllama');
    if (btnOpenOllama) {
        btnOpenOllama.addEventListener('click', async () => {
            await router('/html/ollamaChat.html'); // 채팅 UI 렌더링

            // UI 상태 전환 (그리드 숨기고 뒤로가기 활성화)
            backBtnContainer.classList.add('active');
            appContainer.innerHTML = '';
            appContainer.classList.remove('active');
            appContainer.classList.remove('grid-view');

            // 채팅 서비스 초기화
            initOllamaChat();
        });
    }
}

// ─────────────────────────────────────────
// 02. 파일찾기
// ─────────────────────────────────────────

// 검색
const performSearch = async () => {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    const searchSpinner = document.getElementById('searchSpinner');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');

    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    const searchTypeEl = document.getElementById('searchType');
    const searchType = searchTypeEl ? searchTypeEl.value : 'name';

    // 검색어 없으면 → toast 메시지
    if (!query) {
        showToast('검색어를 입력하세요.', 'info');
        return;
    }

    // UI 로딩 상태
    searchIcon.style.display = 'none';
    searchSpinner.style.display = 'block';
    searchBtn.disabled = true;
    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('grid-view');
    resultsContainer.classList.add('list-view');
    resultsContainer.classList.add('active');
    resultsContainer.style.overflowY = 'auto';

    try {
        // 자바 컨트롤러(/search) 호출
        const responseText = await callService('/search', { 
            query: query.toLowerCase(), 
            searchType: searchType 
        });

        if (!responseText) throw new Error("서버로부터 응답이 없습니다.");
        const data = JSON.parse(responseText);

        // 로딩 복구
        searchIcon.style.display = 'block';
        searchSpinner.style.display = 'none';
        searchBtn.disabled = false;

        // slots 배열에서 file_info 추출 (기존 API 반환 형식)
        const slots = data.slots || [];
        const files = slots.map(s => s.file_info).filter(Boolean); // 제한 없이 전부 가져옴

        if (files.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search-minus" style="font-size:2rem;margin-bottom:1rem;color:#475569;"></i>
                    <h3>'${query}'에 대한 결과가 없습니다.</h3>
                    <p style="margin-top:0.5rem;font-size:0.9rem;">다른 검색어를 입력해 보세요.</p>
                </div>
            `;
        } else {
            files.forEach(file => {
                resultsContainer.insertAdjacentHTML('beforeend', renderFileResult(file, query));
            });

            // 결과 클릭 → 파일 탐색기에서 열기
            resultsContainer.querySelectorAll('.result-item').forEach(el => {
                el.addEventListener('click', () => {
                    const path = el.dataset.path;
                    if (path) openInExplorer(path);
                });
            });
        }

    } catch (err) {
        searchIcon.style.display = 'block';
        searchSpinner.style.display = 'none';
        searchBtn.disabled = false;
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle" style="font-size:2rem;margin-bottom:1rem;color:#ef4444;"></i>
                <h3>검색 중 오류 발생</h3>
                <p style="margin-top:0.5rem;font-size:0.9rem;">${err.message}</p>
                <p style="margin-top:0.3rem;font-size:0.85rem;color:#64748b;">서버 로그를 확인해 주세요.</p>
            </div>
        `;
    }
}

// selectBox 변경
function onChangeSearchtype() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput');
    const statusIndicator = document.getElementById('statusIndicator');

    console.info("searchType = ", searchType);
}

// 검색어 하이라이트
function highlightMatch(text, query) {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index >= 0) {
        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);
        return `${before}<span style="color:#60a5fa;font-weight:bold;background:rgba(96,165,250,0.2);border-radius:4px;padding:0 2px;">${match}</span>${after}`;
    }
    return text;
}

// 확장자 아이콘
function getIconColorHex(iconClass) {
    if (iconClass.includes('excel') || iconClass.includes('csv')) return '#22c55e';
    if (iconClass.includes('powerpoint')) return '#f97316';
    if (iconClass.includes('word')) return '#3b82f6';
    if (iconClass.includes('pdf')) return '#ef4444';
    if (iconClass.includes('image')) return '#a855f7';
    if (iconClass.includes('code')) return '#eab308';
    if (iconClass.includes('archive')) return '#f97316';
    if (iconClass.includes('video')) return '#06b6d4';
    if (iconClass.includes('audio')) return '#ec4899';
    return '#60a5fa';
}

// 검색 결과 렌더링 (목록형)
function renderFileResult(item, query) {
    const icon = getIconByName(item.name);
    const iconColor = getIconColorHex(icon);
    const fileDir = item.path.replace(/[\\/][^\\/]+$/, ''); // 경로에서 파일명 제거

    return `
        <div class="result-item" data-path="${item.path}" title="클릭하여 탐색기에서 열기">
            <div class="file-icon" style="color:${iconColor};background:${iconColor}22;">
                <i class="fas ${icon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${highlightMatch(item.name, query)}</div>
                <div class="file-meta">
                    <span class="file-size">${item.size}</span>
                    <span class="file-path" title="${fileDir}">
                        <i class="fas fa-folder-open" style="margin-right:4px;"></i>${fileDir}
                    </span>
                </div>
                <div class="file-meta" style="margin-top:0.3rem;">
                    <span class="file-modified" title="최종 수정일">
                        <i class="far fa-clock" style="margin-right:4px;"></i>${item.modified}
                    </span>
                </div>
                ${item.snippet ? (() => {
            const escaped = item.snippet.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const highlighted = escaped.replace(
                new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'),
                match => `<span style="color:#60a5fa;font-weight:bold;background:rgba(96,165,250,0.2);border-radius:4px;padding:0 2px;">${match}</span>`
            );
            return `<div class="file-snippet">${highlighted}</div>`;
        })() : ''}
            </div>
        </div>
    `;
}

// ─────────────────────────────────────────
// 03. 사용자 목록
// ─────────────────────────────────────────

// 사용자 렌더링 (목록형)
function renderuserResult(item) {
    let color = '';
    if (item.color == '' || item.color == null) {
        color = '#1278a4ff';
    } else {
        color = item.color;
    }
    return `
        <div class="result-item" title="${item.name}">
            <div class="file-icon" style="color:${color};background:#ffffff;">
                <i class="${item.icon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${item.name}</div>
                <div class="file-meta">
                    <span class="file-path">
                        ID : ${item.id}
                    </span>
                </div>
                <div class="file-meta">
                    <span class="file-path">
                        Email : ${item.email}
                    </span>
                </div>
            </div>
        </div>
    `;
};

// ─────────────────────────────────────────
// 04. 링크
// ─────────────────────────────────────────

// 링크 렌더링 (목록형)
function renderLinkResult(item) {
    let color = '';
    if (item.color == '' || item.color == null) {
        color = '#1278a4ff';
    } else {
        color = item.color;
    }
    return `
        <div class="result-item" data-path="${item.path}" title="${item.name}">
            <div class="file-icon" style="color:${color};background:#ffffff;">
                <i class="${item.icon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${item.name}</div>
                <div class="file-meta">
                    <span class="file-path" title="${item.path}">
                        <i class="fas fa-link" style="margin-right:4px;"></i>${item.path}
                    </span>
                </div>
            </div>
        </div>
    `;
};

// 새 창에서 링크 열기
async function openInNewWindow(path) {
    try {
        window.open(path, '_blank');
    } catch (e) {
        showToast('링크를 여는 중 문제가 발생했습니다.', 'error');
    }
}

// ─────────────────────────────────────────
// 05. Ollama Chat
// ─────────────────────────────────────────

/**
 * Ollama 채팅 인터페이스 초기화 및 메시지 전송 로직
 */
function initOllamaChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatResults = document.getElementById('chatResults');

    if (!chatInput || !sendBtn || !chatResults) return;

    chatInput.focus();

    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // 사용자 메시지 화면에 추가
        appendChatMessage('user', message);
        chatInput.value = '';

        // 응답 대기용 임시 메시지 생성 (ID 부여)
        const botMsgId = 'bot-' + Date.now();
        appendChatMessage('bot', 'AI가 답변을 생성 중입니다...', botMsgId);

        try {
            // 백엔드 엔드포인트(/ollama/chat) 호출 
            // (해당 엔드포인트에서 ollama_chat.py를 실행하도록 구성되어야 합니다)
            const response = await callService('/ollama/chat', { prompt: message });
            let replyText = "";
            
            try {
                const data = JSON.parse(response);
                replyText = data.reply || data.response || response;
            } catch (e) {
                replyText = response;
            }

            document.getElementById(botMsgId).innerText = replyText;
        } catch (error) {
            document.getElementById(botMsgId).innerText = "오류 발생: " + error.message;
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function appendChatMessage(sender, text, id) {
    const chatResults = document.getElementById('chatResults');
    if (!chatResults) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    if (id) msgDiv.id = id;
    msgDiv.innerText = text;
    
    chatResults.appendChild(msgDiv);
    chatResults.scrollTop = chatResults.scrollHeight;
}

// ─────────────────────────────────────────
// 06. 설정 모드 유틸리티
// ─────────────────────────────────────────

function ensureSettingsToolbar() {
    const btnSaveApps = document.getElementById('btnSaveApps');
    const btnDeleteApps = document.getElementById('btnDeleteApps');

    if (btnSaveApps && !btnSaveApps.getAttribute('data-event')) {
        btnSaveApps.addEventListener('click', saveApps);
        btnSaveApps.setAttribute('data-event', 'true');
    }
    if (btnDeleteApps && !btnDeleteApps.getAttribute('data-event')) {
        btnDeleteApps.addEventListener('click', deleteSelectedApps);
        btnDeleteApps.setAttribute('data-event', 'true');
    }
}

function toggleSettingsMode(active) {
    if (active) {
        appContainer.classList.add('settings-mode');
        if (settingsBtnContainer) settingsBtnContainer.classList.add('active');
        document.querySelectorAll('.app-item').forEach(item => {
            item.setAttribute('draggable', true);
            const nameDiv = item.querySelector('.app-name');
            if (nameDiv) nameDiv.setAttribute('contenteditable', 'true');
        });
    } else {
        appContainer.classList.remove('settings-mode');
        if (settingsBtnContainer) settingsBtnContainer.classList.remove('active');
        document.querySelectorAll('.app-item').forEach(item => {
            item.removeAttribute('draggable');
            const nameDiv = item.querySelector('.app-name');
            if (nameDiv) nameDiv.setAttribute('contenteditable', 'false');
        });
    }
}

// 드래그 앤 드롭 로직
let dragSrcEl = null;

function initAppDragEvents() {
    const items = document.querySelectorAll('.app-item');
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    if (!appContainer.classList.contains('settings-mode')) {
        e.preventDefault();
        return;
    }
    this.classList.add('dragging');
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this === dragSrcEl) return;
    
    // 애니메이션 효과와 함께 위치 스왑
    const children = Array.from(appContainer.children);
    const dragIdx = children.indexOf(dragSrcEl);
    const targetIdx = children.indexOf(this);

    if (dragIdx < targetIdx) {
        appContainer.insertBefore(dragSrcEl, this.nextSibling);
    } else {
        appContainer.insertBefore(dragSrcEl, this);
    }
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    return false;
}

// 저장 서비스 호출
async function saveApps() {
    // 빈 슬롯을 제외한 실제 앱 아이템만 선택
    const appItems = appContainer.querySelectorAll('.app-item:not(.empty-slot)');
    
    const appDTOs = Array.from(appItems).map((item, index) => {
        const checkbox = item.querySelector('.app-checkbox');
        const nameDiv = item.querySelector('.app-name');
        const iconI = item.querySelector('.app-icon i');
        const iconDiv = item.querySelector('.app-icon');
        
        // 아이콘 클래스 추출 (fa- 로 시작하는 클래스 찾기)
        let iconClass = "";
        if (iconI) {
            iconClass = Array.from(iconI.classList).find(c => c.startsWith('fa-') && !['fas', 'fa-solid', 'fa-brands'].includes(c));
        }
        
        // 색상 클래스 추출
        let colorClass = "";
        if (iconDiv) {
            colorClass = Array.from(iconDiv.classList).find(c => ['blue', 'green', 'orange', 'red', 'purple', 'yellow', 'gray'].includes(c));
        }

        return {
            id: checkbox ? checkbox.dataset.id : '',
            name: nameDiv ? nameDiv.innerText.trim() : '',
            icon: iconClass || 'fa-app-store',
            color: colorClass || 'blue',
            idx: index
        };
    }).filter(app => app.id);

    try {
        // 전체 삭제 후 삽입을 수행하는 새로운 엔드포인트 호출
        await callService('/apps/save', appDTOs);
        showToast('저장되었습니다.', 'success');
        toggleSettingsMode(false);
        renderAppGrid(); // 변경된 이름 반영을 위해 새로고침
    } catch (e) {
        showToast('저장 중 오류 발생', 'error');
    }
}

// 삭제 서비스 호출
async function deleteSelectedApps() {
    const checkedNodes = document.querySelectorAll('.app-checkbox:checked');
    const ids = Array.from(checkedNodes).map(cb => cb.dataset.id);

    if (ids.length === 0) {
        showToast('삭제할 앱을 선택해주세요.', 'info');
        return;
    }

    if (confirm(`${ids.length}개의 앱을 삭제하시겠습니까?`)) {
        try {
            await callService('/apps/delete', ids);
            showToast('삭제 성공', 'success');
            renderAppGrid(); // 목록 새로고침
        } catch (e) {
            showToast('삭제 실패: ' + e.message, 'error');
        }
    }
}