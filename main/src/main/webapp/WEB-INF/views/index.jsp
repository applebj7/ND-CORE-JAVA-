<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ND-CORE</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/css/style.css">
</head>
<body>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <div class="container" id="mainContainer">
        <!-- Toast -->
        <div id="toast" class="toast"></div>
        <!-- Modal -->
        <dialog id="dynamicModal" class="modal-box" style="display: none;">
            <div class="modal-header">
                <h3 id="modalTitle">화면 로드</h3>
            </div>
            <div id="modalContent" class="modal-body">
                <p>데이터를 불러오는 중입니다...</p>
            </div>
            <div class="modal-footer">
                <button onclick="closeModal()" class="btn-close-footer">닫기</button>
            </div>
        </dialog>

        <div class="header">
            <div class="logo-container">
                <img src="/images/logo.png" alt="ND-CORE Logo" class="logo-img">
                <div class="header-text">
                    <h1>ND-CORE</h1>
                    <p>Naedam AI Service</p>
                </div>
            </div>
        </div>

        <!-- 개별 html 랜더영역 -->
        <div id="viewContainer">
            <!-- Module html rendered this area -->
        </div>
        <!-- App Area -->
        <div class="app-container" id="appContainer"></div>
        <!-- Back -->
        <div class="back-btn-container" id="backBtnContainer">
            <button id="backBtn" class="back-btn">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>
    </div>

    <footer>
        <p>© 2026 NAEDAM C&C. All rights reserved.</p>
    </footer>

    <script src="/js/main.js"></script>
</body>
</html>