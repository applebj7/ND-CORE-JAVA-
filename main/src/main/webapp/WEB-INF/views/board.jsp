<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>NAEDAM Board System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="/css/board.css">
</head>
<body>

    <header class="main-header">
        
        <div class="logo">
            <img src="/images/logo.png" alt="ND-CORE Logo" class="logo-img">
            <span  onclick="goHome()">ND-CORE(BOARD)</span>
            <!-- Back -->
            <div class="back-btn-container" id="backBtnContainer">
                <button id="backBtn" class="back-btn">
                    <i class="fas fa-arrow-left"></i> Back to Apps
                </button>
            </div>
        </div>
        <div class="user-info">
            <span>반갑습니다, <strong>관리자</strong>님</span>
            <button class="btn-logout">로그아웃</button>
        </div>
    </header>

    <nav class="main-navbar">
        <ul id="menu-list">
             <!-- Menu html rendered this area -->
        </ul>
    </nav>

    <div class="main-container">
        
        <aside class="sidebar">
            <h3>카테고리</h3>
            <ul id="category-list">
                <!-- Category html rendered this area -->
            </ul>
        </aside>

        <main id="content-area" class="content">
            <div class="welcome-msg">
                <h2>환영합니다!</h2>
                <p>좌측 메뉴를 선택하여 업무를 시작하세요.</p>
            </div>
        </main>
    </div>

    <footer class="main-footer">
        <p>&copy; 2026 NAEDAM C&C. All Rights Reserved.</p>
    </footer>

    <script src="/js/board.js"></script>
</body>
</html>