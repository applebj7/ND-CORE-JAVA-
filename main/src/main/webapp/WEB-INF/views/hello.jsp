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
        <div id="toast" class="toast"></div>
        <div class="header">
            <div class="logo-container">
                <img src="/images/logo.png" alt="ND-CORE Logo" class="logo-img">
                <div class="header-text">
                    <h1>ND-CORE</h1>
                    <p>Naedam AI Service</p>
                </div>
            </div>
        </div>

        <!-- 기능 html 랜더영역 -->
        <div id="viewContainer">
            <!-- Module html area -->
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