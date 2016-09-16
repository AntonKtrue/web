<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>SUPER SHOP</title>
    <link href="./styles/new.css" rel="stylesheet" type="text/css"/>
    <link href="./styles/login.css" rel="stylesheet" type="text/css"/>
    <link href="./styles/jquery-ui.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="./jquery-2.2.3.min.js"></script>
    <script type="text/javascript" src="./jquery.leanModal.min.js"></script>
    <script type="text/javascript" src="./jquery-ui.js"></script>
    <script type="text/javascript" src="jqscripts.js"></script>
</head>
<header></header>
<div id="content"></div>
<footer></footer>
<div id="loginmodal" style="display:none;">
    <div id="logincaption">
        <h1>Вход</h1>
    </div>
    <div id="logincols">
        <div class="logincol">
            <div class="login-cols-caption">
                Зарегистрированный пользователь
            </div>
            <form id="loginform" name="loginform" method="post" action="login.php">
                <label for="username">Email адрес:</label>
                <input type="text" name="username" id="username" class="txtfield" tabindex="1">
                <label for="password">Пароль:</label>
                <input type="password" name="password" id="password" class="txtfield" tabindex="2">
                <input type="submit" name="loginbtn" id="loginbtn" class="redborderbutton hidemodal" value="Войти"
                       tabindex="3">
                <a class="forgotbtn" href="#">Забыли пароль?</a>
            </form>
        </div>
        <div class="logincol">
            <div class="login-cols-caption">
                Новый пользователь
            </div>
            <a class="redbutton" href="#">Зарегистрироваться</a>
        </div>
    </div>
</div>
</body>
</html>
