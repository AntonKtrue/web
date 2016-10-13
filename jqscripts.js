/**
 *
 */
var newProdsData;
var popProdsData;
var catProdsData;
var categoriesData;
var productsInCategory;
var cartData;
var userData;
var patternEmail = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
var curImg;

Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + "руб.";
};
images = {
    newBadge : function () {
        var imgContainer = document.createElement('div');
        var img = document.createElement("img");
        $(img).attr('src','./img/corner_new.png').appendTo($(imgContainer));
        $(imgContainer).addClass("fl-row").css("align-self","flex-start");
        return imgContainer;
    },
    hotBadge : function () {
        var imgContainer = document.createElement('div');
        var img = document.createElement("img");
        $(img).attr('src','./img/corner_hot.png').appendTo($(imgContainer));
        $(imgContainer).addClass("fl-row").css("align-self","flex-start");
        return imgContainer;
    },
    saleBadge : function () {
        var imgContainer = document.createElement('div');
        var img = document.createElement("img");
        $(img).attr('src','./img/corner_sale.png').appendTo($(imgContainer));
        $(imgContainer).addClass("fl-row").css("align-self","flex-start");
        return imgContainer;
    }
}


$(function () {
    //login
    $.getScript('utils.js');
    $.getScript('ready-generators.js');


    //fetch required data
    initialFetch();
    promoScreen = generateMainPromoScreen();
    navBar = generateNavigationBar();
    $(promoScreen).addClass('shadow').appendTo($('header'));
    $(navBar).appendTo($(promoScreen));
    newProducts = generateProductsContainer("newProducts", "Новые товары", 2, newProdsData);
    $(newProducts).addClass('shadow').css("margin-top", "-76px").appendTo($("#content"));
    promoProducts = generatePromoProductsContainer();
    $(promoProducts).addClass('shadow').css("margin-top", "20px").appendTo($("#content"));
    popProducts = generateProductsContainer("popProducts", "Популярные товары", 1, popProdsData);
    $(popProducts).addClass('shadow').css("margin-top", "20px").appendTo($("#content"));
    aboutShop = generateAboutShop();
    $(aboutShop).addClass('shadow').css("margin-top", "20px").appendTo($("#content"));
    footer = generateFooter();
    $(footer).addClass('shadow').css("margin-top", "20px").css("margin-bottom", "62px").appendTo($("footer"));
    //lean modal init screens
    show_usermenu();
    showLoginForm();
    showRegistration();
    showAccount();
    showZoomFoto();

});

function show_usermenu() {
    $('#signbar').empty();
    $.ajax({
        type: 'POST',
        url: 'utils.php',
        dataType: 'json',
        data: 'usermenu',
        success: function (msg) {
            var loginButton = document.createElement('a');
            var loginButtonImage = document.createElement('img');
            var loginButtonText = document.createElement('div');
            var registerButton = document.createElement('div');
            $(loginButton).addClass("fl-row")
                .addClass("fl-vcenter")
                .css("height", "100%")
                .css("text-decoration", "none")
                .attr('href', '#loginmodal')
                .attr('pos', 'fixed')
                .attr('id', 'modaltrigger')
                .appendTo($('#signbar'));
            $(loginButtonImage).attr("src", "img/login.png")
                .appendTo($(loginButton));
            $(loginButtonText).addClass("magenta-text")
                .addClass("light")
                .css("border-bottom-style", "dashed")
                .css("border-bottom-width", "1px")
                .css("margin-left", "7px")
                .appendTo($(loginButton));
            $(registerButton).addClass("light")
                .attr('id', 'regmodaltrigger')
                .attr('href', '#regmodal')
                .attr('pos', 'absolute')
                .css("border-bottom-style", "dashed")
                .css("border-bottom-width", "1px")
                .css("margin-left", "7px")
                .css("cursor", "pointer")
                .appendTo($('#signbar'));
            if (msg.status == "loggedin") {
                $(loginButtonText).text(msg.user);
                $(loginButton).attr('id', 'accmodaltrigger').attr('pos', 'absolute').attr('href', '#accmodal')
                    .on('click', function () {
                        userData = $.ajax({
                            url: 'login.php',
                            async: false,
                            method: 'POST',
                            dataType: 'json',
                            data: 'getAccount'
                        }).responseJSON;
                        $('#accfio').val(userData.userData.name);
                        $('#acctel').val(userData.userData.tel);
                        $('#accemail').val(userData.login);
                        $('#acccity').val(userData.userData.city);
                        $('#accstreet').val(userData.userData.street);
                        $('#acchome').val(userData.userData.home);
                        $('#accflat').val(userData.userData.flat);
                        $('#selfOrdersContent').empty();
                        $.each(userData.orders, function(i,item) {
                            var order = generateAccOrder(item);
                            $(order).css('margin-bottom','40px').appendTo($('#selfOrdersContent'));
                        });
                    });
                $(registerButton).text("Выход").attr('id', '').attr('href', '#')
                    .on('click', function () {
                        $.ajax({
                            type: 'POST',
                            url: 'login.php',
                            dataType: 'text',
                            data: 'logout',
                            success: function () {
                                show_usermenu();
                                refreshCart();
                                window.location = 'index.php';
                            }
                        });
                    });
            } else if (msg.status == "nobody") {
                $(loginButtonText).text("Войти");
                $(registerButton).text("Регистрация");
            }
            activateLeanModal();
        }
    });
    userData = $.ajax({
        url: 'login.php',
        async: false,
        method: 'POST',
        dataType: 'json',
        data: 'getAccount'
    }).responseJSON;
}

function generateNavigationBar() {		//Генерация панели навигации //TODO доделать функцию выделения выбранного раздела, доделать анимацию при увеличении количества пунктов категорий
    navBar = document.createElement('div');
    $(navBar).attr('id', "navbar")
        .addClass('fl-row')

        .css("margin-top", "27px");
    mainLogo = generateMainLogo();
    $(mainLogo).appendTo($(navBar));
    //-------------------
    cats = generateCategories();
    $(cats).appendTo($(navBar));
    userMenu = document.createElement('div');
    $(userMenu).appendTo($(navBar))
        .addClass('user-menu-area')
        .addClass('fl-col')
        .addClass('fl-vright');
    signMenu = generateSignMenu();
    $(signMenu).appendTo($(userMenu));
    cartMenu = generateCartMenu();
    $(cartMenu).appendTo($(userMenu));
    return navBar;
}

function generateCartMenu() {
    cartData = $.ajax({
        url: 'cart.php',
        async: false,
        method: 'POST',
        dataType: 'json',
        data: "opencart"
    }).responseJSON;
    cartBar = document.createElement('div');
    $(cartBar).addClass('cart-bar-area')
        .addClass('dark-blue-bg white-text').addClass('fl-row fl-vcenter fl-hcenter')
        .css('cursor','pointer').on('click', function() {
            prepareFlat();
            var cartFlat = generateCartFlat(cartData);
            $(cartFlat).appendTo($("#content"));
    });
    cartBarInfoBox = document.createElement('div');
    $(cartBarInfoBox).appendTo(cartBar).addClass('fl-col');
        cartBarSumm = document.createElement('nobr');
        $(cartBarSumm).css('font-size','20px').css('font-weight','bolder').appendTo(cartBarInfoBox);
    cartImg = document.createElement('img');
    $(cartImg).attr("src",'./img/cart.png').css('opacity','0.2').appendTo(cartBar);

    if(cartData.result == null) {
        $(cartBarSumm).attr('id','cartSum').addClass('itogo').text(parseInt(cartData.summa).formatMoney(0,"."," "));
        cartBarCount = generateCartCount(cartData.productsCount);
        $(cartBarCount).appendTo(cartBarInfoBox);
    }

    return cartBar;
}

function generateCartCount(count) {
    var cartCount = document.createElement('nobr');
    var suf = count % 10;
    switch (suf) {
        case 0:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            $(cartCount).text(count + " предметов");
            break;
        case 1:
            $(cartCount).text(count + " предмет");
            break;
        case 2:
        case 3:
        case 4:
            $(cartCount).text(count + " предмета");
            break;
    }
    $(cartCount).attr('id','cartCount').css('color','#999999').css('font-size','12px');
    return cartCount;
}

function generateCategories() { //TODO доделать прокрутку
    var categoriesLine = document.createElement('div');
    $(categoriesLine).addClass("fl-row")
        .addClass("cat-area")
        .addClass("white-bg");
    $.each(categoriesData, function(i, item) {
        var catElement = document.createElement('div');
        var catElementText = document.createElement('span');
        $(catElementText).text(item.name).css('text-align','center').appendTo($(catElement));
        $(catElement).addClass("cat-element-area")
            .addClass("fl-row")
            .addClass("fl-vcenter")
            .addClass("fl-hcenter")
            .addClass("uppercase")
            .css("font-size", "14px")
            .css('cursor', 'pointer')
            .on('click', function () {
                //alert("category " + categoriesData[item.id].name + " clicked");
                prepareFlat();
                categoryFlat = generateCategoryFlat(i);
                $(categoryFlat).appendTo($("#content"));
            });
        $(catElement).appendTo($(categoriesLine));
    });
    return categoriesLine;
}
function generateCartFlat() {

    userData = $.ajax({
        url: 'login.php',
        async: false,
        method: 'POST',
        dataType: 'json',
        data: 'getAccount'
    }).responseJSON;

    var container = document.createElement('div');
    var caption = document.createElement('div');
    var cartBody = document.createElement('div');
    $(container).addClass('fl-col').addClass('products-container');
    $(caption).addClass('flat-caption').appendTo($(container));
    var captionText = document.createElement('h1');
    $(captionText).text('корзина').appendTo($(caption));
    $(cartBody).addClass('order').addClass('order-head').addClass('fl-vcenter').addClass('shadow').css('margin-top','18px').appendTo($(container));
        var prodCol = document.createElement('div');
        var availableCol = document.createElement('div');
        var costCol = document.createElement('div');
        var countCol = document.createElement('div');
        var summaCol = document.createElement('div');

    $(prodCol).appendTo(cartBody);
    $(availableCol).appendTo(cartBody);
    $(costCol).appendTo(cartBody);
    $(countCol).appendTo(cartBody);
    $(summaCol).appendTo(cartBody);

    var prodText = document.createElement('span');
    var availableText = document.createElement('span');
    var costText =  document.createElement('span');
    var countText = document.createElement('span');
    var summaText = document.createElement('span');

    $(prodText).text('Товар').css('margin-left','30px').appendTo(prodCol);
    $(availableText).text('Доступность').css('margin-left','13px').appendTo(availableCol);
    $(costText).text('Стоимость').css('margin-left','25px').appendTo(costCol);
    $(countText).text('Количество').css('margin-left','24px').appendTo(countCol);
    $(summaText).text('Итого').css('margin-left','92px').appendTo(summaCol);

    $.each(cartData.details, function(i, item) {
        $.each(item, function(i2, item2) {
            var detail = document.createElement('div');
            $(detail).addClass('fl-row').addClass('order-row').addClass('fl-vcenter').addClass('order');

            var prod = document.createElement('div');
            var available = document.createElement('div');
            var cost = document.createElement('div');
            var count = document.createElement('div');
            var summa = document.createElement('div');
            $(prod).addClass('fl-row').addClass('prod').appendTo(detail);
            $(available).addClass('magenta-text').css('font-size','14px').css('font-weight','lighter').appendTo(detail);
            $(cost).appendTo(detail);
            $(count).appendTo(detail);
            $(summa).addClass('fl-row').addClass('fl-hcenter').css('justify-content','flex-end').appendTo(detail);
            var prodImg = document.createElement('div');
            $(prodImg).addClass('prod-img').css('background-image','url("./img/products/'+ item2.product_id + '/' + item2.images[0] +'")')
                .appendTo(prod);
            var prodName = document.createElement('div');
            $(prodName).addClass('fl-row').addClass('fl-hcenter').addClass('fl-vcenter').appendTo(prod);
            if(item2.variant) {
                var variant = getDiv();
                $(variant).text(item2.variant).appendTo(prod);
            }
            var prodNameText = document.createElement('span');
            $(prodNameText).text(item2.name).appendTo(prodName);

            var availableName = document.createElement('div');
            $(availableName).addClass('fl-row').addClass('fl-hcenter').addClass('fl-vcenter').appendTo(available);
            var availableNameText = document.createElement('span');
            $(availableNameText).text("Есить в наличии").appendTo(availableName);

            var costName = document.createElement('div');
            $(costName).addClass('fl-row').addClass('fl-hcenter').addClass('fl-vcenter')
                .css('color','#5d5d5d').css('font-size','18px').addClass('italic').addClass('light').appendTo(cost);
            var costNameText = document.createElement('span');
            //alert(item.product_cost);
            //alert(parseInt(item.product_cost));
            //var ttt = parseInt(item.product_cost).formatMoney(0,',',' ');
            //alert(ttt);
            $(costNameText).text(parseInt(item2.product_cost).formatMoney(0,',',' ')).appendTo(costName);

            var summaName = document.createElement('div');
            $(summaName).addClass('fl-row').addClass('fl-hcenter').addClass('fl-vcenter').css('margin-right','47px')
                .css('color','#5d5d5d').css('font-size','18px').addClass('italic').addClass('light').appendTo(summa);
            var summaNameText = document.createElement('span');
            $(summaNameText).text(parseInt(item2.summa).formatMoney(0,',',' ')).appendTo(summaName);
            var deleteProd = document.createElement('img');
            $(deleteProd).attr('src','./img/cart_prod_del.png').css('cursor','pointer').css('margin-right','30px')
                .appendTo(summa).on('click',function() {
                var prData = {
                    id: i,
                    func: 'delete',
                    variant: i2
                };
                cartData = $.ajax({
                    url: 'cart.php',
                    async: false,
                    method: 'POST',
                    dataType: 'json',
                    data: "update=" + prepareData(prData)
                }).responseJSON;
                if(cartData.details[i] == null || cartData.details[i][i2] ==null) {
                    $(this).parent().parent().hide(200);
                }
                $('#itogo').text(parseInt(cartData.summa).formatMoney(0,","," "));
                $('#cartSum').text(parseInt(cartData.summa).formatMoney(0, '.', ' '));
                $('#cartCount').replaceWith(generateCartCount(cartData.productsCount));
        })
            var countBlock = document.createElement('div');
            $(countBlock).addClass('fl-row').css('background-color','#e9e9e9').width('140px').height('47px')
                .appendTo(count);
            var countBlockMinus = document.createElement('div');
            $(countBlockMinus).css('cursor','pointer').width('40px').height('47px').addClass('fl-row')
                .css('color','#999999').css('font-weight','bold').css('font-size','18px')
                .addClass('fl-hcenter').addClass('fl-vcenter').html('<span>-</span>').appendTo(countBlock)
                .on('click',function(){
                    var prData = {
                        id: i,
                        func: 'minus',
                        variant: i2
                    };
                    cartData = $.ajax({
                        url: 'cart.php',
                        async: false,
                        method: 'POST',
                        dataType: 'json',
                        data: "update=" + prepareData(prData)
                    }).responseJSON;
                    $(countBlockCount).children('span').text(cartData.details[i][i2].product_count);
                    $(summaNameText).text(parseInt(cartData.details[i][i2].summa).formatMoney(0,',',' '));
                    $('#itogo').text(parseInt(cartData.summa).formatMoney(0,","," "));
                    $('#cartSum').text(parseInt(cartData.summa).formatMoney(0, '.', ' '));
                    $('#cartCount').replaceWith(generateCartCount(cartData.productsCount));
                });
            var countBlockCount = document.createElement('div');
            $(countBlockCount).width('56px').height('47px').addClass('fl-row').addClass('fl-vcenter').addClass('fl-hcenter')
                .css('color','#000').css('font-weight','bold').css('font-size','16px')
                .css('border-left','2px solid #dadada').css('border-right','2px solid #dadada')
                .html('<span>' + item2.product_count + '</span>').appendTo(countBlock);

            var countBlockPlus = document.createElement('div');
            $(countBlockPlus).css('cursor','pointer').width('40px').height('47px').addClass('fl-row')
                .css('color','#999999').css('font-weight','bold').css('font-size','18px')
                .addClass('fl-hcenter').addClass('fl-vcenter').html('<span>+</span>').appendTo(countBlock)
                .on('click',function(){
                    var prData = {
                        id: i,
                        func: 'plus',
                        variant: i2
                    };
                    cartData = $.ajax({
                        url: 'cart.php',
                        async: false,
                        method: 'POST',
                        dataType: 'json',
                        data: "update=" + prepareData(prData)
                    }).responseJSON;
                    $(countBlockCount).children('span').text(cartData.details[i][i2].product_count);
                    $(summaNameText).text(parseInt(cartData.details[i][i2].summa).formatMoney(0,',',' '));
                    $('#itogo').text(parseInt(cartData.summa).formatMoney(0,","," "));
                    $('#cartSum').text(parseInt(cartData.summa).formatMoney(0, '.', ' '));
                    $('#cartCount').replaceWith(generateCartCount(cartData.productsCount));
                });

            $(detail).appendTo(container);

            });


    });

    var bottomLine = document.createElement('div');
    $(bottomLine).addClass('fl-row').addClass('white-bg').addClass('fl-space').height('162px').width('1170px').appendTo(container);
    var leftBlock = document.createElement('div');
    $(leftBlock).addClass('fl-col').css('order',1).appendTo(bottomLine);
    var rightBlock = document.createElement('div');
    $(rightBlock).addClass('fl-col').addClass('fl-space').css('order',2).css('margin-right','49px').css('margin-bottom','33px')
        .appendTo(bottomLine);

    var returnButton = document.createElement('a');
    $(returnButton).addClass('fl-row').addClass('fl-vcenter').addClass('fl-hcenter').css('font-size','14px').css('font-weight','lighter')
        .height('44px').width('190px').css('background-color','black').css('color','white').text('Вернуться к покупкам').appendTo(leftBlock)
        .attr('href','#').css('text-decoration','none').css('margin-top','83px').css('margin-left','31px').on('click',function(){
        window.location = 'index.php';
    });

    var summaBox = document.createElement('div');
    $(summaBox).addClass('fl-row').addClass('fl-space').css('align-items','flex-end').addClass('bold italic').css('color','black').appendTo(rightBlock);

    if(cartData.productsCount) {
        var makeOrderButton = document.createElement('a');
        $(makeOrderButton).addClass('fl-row').addClass('fl-vcenter').addClass('fl-hcenter').css('font-size','20px').css('font-weight','bold')
            .height('49px').width('292px').addClass('magenta-bg')
            .css('color','white').text('Оформить заказ').appendTo(rightBlock)
            .attr('href','#').css('text-decoration','none').on('click',function(){
            prepareFlat();
            var checkoutFlat = generateCheckoutFlat();
            $(checkoutFlat).appendTo($('#content'));

            var deliveryContent = generateDeliveryContent();
            $(deliveryContent).appendTo($('#deliveryDataPanel'));
            var acceptContent = generateAcceptContent();
            $(acceptContent).appendTo($('#acceptDataPanel'))


            if(userData == null) {
                var accPersContent = generateAccPersContent();
                $(accPersContent).appendTo($('#accPersDataPanel'));
                $('#accPersData').addClass("active");
                $('#accPersDataPanel').addClass("show");
            } else {
                showDeliveryData();
            }

        });
    }
    var summaBoxText = '<span>Итого:</span>';
    $(summaBoxText).appendTo(summaBox).css('font-size','24px');
    var summaBoxSumma = document.createElement('span');
    $(summaBoxSumma).attr('id','itogo').css('font-size','30px').css('line-height','32px').text(parseInt(cartData.summa).formatMoney(0, ',',' ')).appendTo(summaBox);

    return container;
}

function showDeliveryData() {
    if(userData != null && userData.userData != null) {
        if (userData.userData.city != null) {
            $('#ordcity').val(userData.userData.city);
        }
        if (userData.userData.street != null) {
            $('#ordstreet').val(userData.userData.street);
        }
        if (userData.userData.home != null) {
            $('#ordhome').val(userData.userData.home);
        }
        if (userData.userData.flat != null) {
            $('#ordflat').val(userData.userData.flat);
        }
    }
    $('#deliveryData').addClass("active");
    $('#deliveryDataPanel').addClass("show");
}

function getDiv(classes) {
    var div = document.createElement('div');
    if(classes) $(div).addClass(classes);
    return div;
}

function generateAccPersContent() {
    var accPersContent = getDiv('fl-row');
    $(accPersContent).appendTo(accPersDataPanel);
    var accPersCol1 = getDiv('fl-col');
    $(accPersCol1).width('390px').css('margin-left','30px').css('margin-top','34px').appendTo(accPersContent);
    var accPersCol1Caption = getDiv('magenta-text bold');
    $(accPersCol1Caption).text("Для новых покупателей").css('margin-bottom','20px').css('font-size','18px').appendTo(accPersCol1);
    userfio = generateInputField("Контактное лицо (ФИО)", 'ordfio', false);
    userphone = generateInputField("Контактный телефон:", 'ordtel', false);
    email = generateInputField("E-mail адрес:", 'ordemail', false);
    passwd = generateInputField("Пароль:", 'ordpasswd', true);
    rpasswd = generateInputField("Повторите пароль:", 'ordrpasswd', true);
    $(userfio).appendTo(accPersCol1);
    $(userphone).appendTo(accPersCol1);
    $(email).appendTo(accPersCol1);
    $(passwd).appendTo(accPersCol1);
    $(rpasswd).appendTo(accPersCol1);

    var contButton = getDiv('fl-row fl-vcenter fl-hcenter light');
    $(contButton).addClass('magenta-bg').width('155px').height('50px').text('Продолжить').attr('href','#')
        .css('font-size','18px').css('color','white').appendTo(accPersCol1)
        .on('click', function () {
            if(checkRegData('#ordfio','#ordemail','#ordtel','#ordpasswd','#ordrpasswd')) {
                //show_usermenu();
                refreshCart();
                $('#accPersData').removeClass("active");
                $('#accPersDataPanel').removeClass("show");
                showDeliveryData();
            }
        });

    var accPersCol2 = getDiv('fl-col');
    $(accPersCol2).width('390px').css('margin-top','34px').css('margin-left','75px').appendTo(accPersContent);
    var accPersCol2Caption = getDiv('magenta-text bold');
    $(accPersCol2Caption).text("Быстрый вход").css('margin-bottom','20px').css('font-size','18px').appendTo(accPersCol2);
    email = generateInputField("E-mail адрес:", 'qeemail', false);
    passwd = generateInputField("Пароль:", 'qepasswd', true);
    $(email).appendTo(accPersCol2);
    $(passwd).appendTo(accPersCol2);
    var loginArea = getDiv('fl-row');
    $(loginArea).css('align-items','center').appendTo(accPersCol2);
    var loginButton = getDiv('fl-row fl-vcenter fl-hcenter light');
    $(loginButton).addClass('magenta-bg').width('105px').height('50px').text('Войти').attr('href','#')
        .css('font-size','18px').css('color','white').appendTo(loginArea)
        .on('click', function () {
            var login = {
                user: $('#qeemail').val(),
                password: $('#qepasswd').val()
            };
            $.ajax({
                type: 'POST',
                url: 'login.php',
                dataType: 'json',
                data: 'login=' + prepareData(login),
                success: function (msg) {
                    if(msg.error==null) {
                        show_usermenu();
                        refreshCart();
                        $('#accPersData').removeClass("active");
                        $('#accPersDataPanel').removeClass("show");
                        showDeliveryData();
                    } else {
                        alert("Ошибка входа!");
                    }
                }
            });
        });
    var recoveryPass = document.createElement('a');
    $(recoveryPass).appendTo(loginArea).text('Восстановить пароль').css('color','#343434')
        .css('font-size','14px').css('font-weight','lighter').attr('href','#')
        .css('margin-left','23px');
    return accPersContent;
}

function checkFieldsNotEmpty() {

    for (var i = 0; i < arguments.length; i++) {
        if(!$(arguments[i]).val()) {
            return false;
        }

    }
    return true;
}

function generateDeliveryContent() {
    var deliveryContainer = getDiv('fl-row');
    $(deliveryContainer).appendTo(deliveryDataPanel);
    var deliveryCol1 = getDiv('fl-col');
    $(deliveryCol1).css('margin-left','30px').width('390px').appendTo(deliveryContainer);
    var deliveryCol2 = getDiv('fl-col');
    $(deliveryCol2).css('margin-left','54px').appendTo(deliveryContainer);
    var deliveryCol3 = getDiv('fl-col');
    $(deliveryCol3).css('width','400px').css('margin-left','50px').appendTo(deliveryContainer);

    deliveryAddress = getDiv('subtitle');
    $(deliveryAddress).text("Адрес доставки").appendTo(deliveryCol1);
    city = generateInputField("Город:", 'ordcity', false);
    street = generateInputField("Улица:", 'ordstreet', false);
    inputDoubleFieldContainer = getDiv('fl-row fl-space');
    var home = generateInputField("Дом", 'ordhome', false);
    var flat = generateInputField("Квартира", 'ordflat', false);

    $(home).width('170px').appendTo(inputDoubleFieldContainer);
    $(flat).width('170px').appendTo(inputDoubleFieldContainer);
    $(city).appendTo(deliveryCol1);
    $(street).appendTo(deliveryCol1);
    $(inputDoubleFieldContainer).width('390px').appendTo(deliveryCol1);
    var deliveryContinue = document.createElement('a');
    $(deliveryContinue).addClass('redbutton').appendTo(deliveryCol1).attr('href','#')
        .css('margin-top','32px').text("Продолжить").css('font-weight','lighter')
        .css('font-size','18px').on('click',function() {

            if(checkFieldsNotEmpty('#ordcity','#ordstreet','#ordhome','#ordflat')) {
                $('#deliveryData').removeClass("active");
                $('#deliveryDataPanel').removeClass("show");
                $('#acceptData').addClass("active");
                $('#acceptDataPanel').addClass("show");
                $.each(userData.orders[userData.current].details, function(i, item) {
                     var row = generateOrderProd(item);
                     $(row).appendTo($('#detailsTable'));
                });
                $('#itogoSumma').text(parseInt(userData.orders[userData.current].summa).formatMoney(0,","," "));

                $('#infoName').text(userData.userData.fio);
                $('#infoTel').text(userData.userData.tel);
                $('#infoEmail').text(userData.login);
                $('#infoCity').text($('#ordcity').val());
                $('#infoStreet').text($('#ordstreet').val());
                $('#infoHome').text($('#ordhome').val());
                $('#infoFlat').text($('#ordflat').val());
                switch($('input[name=deliveryMethod]:checked').val()) {
                    case "courier": $('#infoMethod').html("Курьерская доставка<br> с оплатой при получении");
                        break;
                    case "rpost": $('#infoMethod').html("Почта России<br> с наложенным платежом");
                        break;
                    case "qpost": $('#infoMethod').html("Доставка через терминалы<br> QIWI Post");
                        break;
                }

                $('#infoComment').text($('#ordcomment').val());
            } else {
                alert('Заполните все поля!');
            }
    });

    deliveryMethods = getDiv('subtitle');
    $(deliveryMethods).text("Способ доставки").appendTo(deliveryCol2);
    var radioDeliveryData = {
        name:"deliveryMethod",
        content: [{
            value: "courier",
            text: "Курьерская доставка<br> с оплатой при получении",
            checked: true
        }, {
            value: "rpost",
            text: "Почта России<br> с наложенным платежом"
        }, {
            value: "qpost",
            text: "Доставка через терминалы<br> QIWI Post"
        }]
    };
    deliveryMethodInput = generateRadioInput(radioDeliveryData);
    $(deliveryMethodInput).appendTo(deliveryCol2);

    orderComment = getDiv('subtitle');
    $(orderComment).text("Комментарий к заказу").appendTo(deliveryCol3);
    var orderCommentArea = generateInputField("Введите ваш комментарий:","ordcomment",false,true);
    $(orderCommentArea).appendTo(deliveryCol3);
    $(orderCommentArea).children('textarea')
        .height('213px').width('355px').css('resize','none')
        .css('background-color','#e9e9e9').css('font-size','16px')
        .css('font-weight','lighter').css('padding-left','16px')
        .css('border','none');
    return deliveryContainer;
}

function generateAcceptContent() {
    var container = getDiv('fl-col');
    var acceptDetail = getDiv('fl-col');
    $(acceptDetail).css('order','1').css('margin-left','30px').appendTo(container);
    var acceptDetailCaption = getDiv('subtitle');
    $(acceptDetailCaption).text("Состав заказа:").appendTo(acceptDetail);
    var detailsTable  = getDiv('fl-col');
    $(detailsTable).addClass('details-table').attr('id','detailsTable').appendTo(acceptDetail);
    var detailsTableCaption = getDiv('fl-row');
    $(detailsTableCaption).appendTo(detailsTable);

    var product = document.createElement('span');
    $(product).text('Товар').appendTo(detailsTableCaption);
    var pcost = document.createElement('span');
    $(pcost).text('Стоимость').appendTo(detailsTableCaption);
    var pcount = document.createElement('span');
    $(pcount).text('Количество').appendTo(detailsTableCaption);
    var psum = document.createElement('span');
    $(psum).text('Итого').appendTo(detailsTableCaption);

    var itogoRow = getDiv('fl-row');
    $(itogoRow).css('order','2').css('justify-content','flex-end').css('margin-right','70px').appendTo(container)
        .height('110px').css('align-items','center');
    var itogoText = document.createElement('span');
    $(itogoText).text("Итого:").addClass('bold italic').css('font-size','24px').css('margin-right','40px')
        .appendTo(itogoRow);
    var itogoSumma = document.createElement('span');
     $(itogoSumma).addClass('bold italic').css('font-size','24px').appendTo(itogoRow).attr('id','itogoSumma');


    var deliveryInfo  = getDiv('fl-col');
    $(deliveryInfo).css('order','3').css('margin-left','30px').appendTo(container);
    var deliveryCaption = getDiv('subtitle');
    $(deliveryCaption).text('Доставка:').appendTo(deliveryInfo);
    var deliveryInfoContent = getDiv('fl-row');
    $(deliveryInfoContent).addClass('delivery-info').appendTo(deliveryInfo);
    var deliveryInfoCol1 = getDiv('fl-col');
    var deliveryInfoCol2 = getDiv('fl-col');
    var deliveryInfoCol3 = getDiv('fl-col');
    $(deliveryInfoCol1).appendTo(deliveryInfoContent);
    $(deliveryInfoCol2).appendTo(deliveryInfoContent);
    $(deliveryInfoCol3).appendTo(deliveryInfoContent);

    var deliveryInfoName = generateLabelField("Контактное лицо (ФИО):", "infoName");
    var deliveryInfoTel = generateLabelField("Контактный телефон:","infoTel");
    var deliveryInfoEmail = generateLabelField("E-mail","infoEmail");
    var deliveryInfoCity = generateLabelField("Город:","infoCity");
    var deliveryInfoStreet = generateLabelField("Улица:","infoStreet");
    var deliveryInfoHome = generateLabelField("Дом:", "infoHome");
    var deliveryInfoFlat = generateLabelField("Квартира", "infoFlat");
    var deliveryInfoMethod = generateLabelField("Способ доставки:", "infoMethod");
    var deliveryInfoComment = generateLabelField("Комментарий к заказу:","infoComment");
    $(deliveryInfoName).appendTo(deliveryInfoCol1);
    $(deliveryInfoTel).appendTo(deliveryInfoCol1);
    $(deliveryInfoEmail).appendTo(deliveryInfoCol1);
    $(deliveryInfoCity).appendTo(deliveryInfoCol2);
    $(deliveryInfoStreet).appendTo(deliveryInfoCol2);
    var homeBox = getDiv('fl-row');
    $(homeBox).appendTo(deliveryInfoCol2);
    $(deliveryInfoHome).width('75px').appendTo(homeBox);
    $(deliveryInfoFlat).width('100px').appendTo(homeBox);
    $(deliveryInfoMethod).appendTo(deliveryInfoCol3);
    $(deliveryInfoComment).appendTo(deliveryInfoCol3);

    var GOGOGO = getDiv('redbutton');
    $(GOGOGO).css('order','4').text("Подтвердить заказ").css('margin','20px 0 30px 30px').appendTo(container)
        .on('click',function () {
            var prData = {
                infoCity : $('#ordcity').val(),
                infoStreet : $('#ordstreet').val(),
                infoHome : $('#ordhome').val(),
                infoFlat : $('#ordflat').val(),
                infoMethod : $('input[name=deliveryMethod]:checked').val(),
                infoComment : $('#ordcomment').val()
            }

            $.ajax(
                {
                    url: 'cart.php',
                    async: false,
                    method: 'POST',
                    dataType: 'json',
                    data: 'close=' + prepareData(prData),
                    success: function () {
                        show_usermenu();
                        refreshCart();
                        window.location = 'index.php';
                    }
                })
        });

    return container;

}

function generateCheckoutFlat() {
    var container = getDiv('fl-col products-container');
    var caption = getDiv('flat-caption'); $(caption).appendTo(container);
    var checkBody = getDiv();
    $(checkBody).appendTo(container);
    var captionText = document.createElement('h1');
    $(captionText).text('оформление заказа').appendTo($(caption));
    //1.Контактная информация
    var accPersData = getDiv('accordion');
    $(accPersData).attr('id','accPersData').appendTo(checkBody).html("<span style='margin-left:30px'>1.</span>&nbsp; Контактная информация");
    var accPersDataPanel = getDiv('panel');
    $(accPersDataPanel).attr('id','accPersDataPanel').appendTo(checkBody);
    //2.Информация о доставке
    var deliveryData = getDiv('accordion');
    $(deliveryData).attr('id','deliveryData').appendTo(checkBody).html("<span style='margin-left:30px'>2.</span>&nbsp; Информация о доставке");
    var deliveryDataPanel = getDiv('panel');
    $(deliveryDataPanel).attr('id','deliveryDataPanel').appendTo(checkBody);
    //3.Подтверждение заказа
    var acceptData = getDiv('accordion');
    $(acceptData).attr('id','acceptData').appendTo(checkBody).html("<span style='margin-left:30px'>3.</span>&nbsp; Подтверждение заказа");
    var acceptDataPanel = getDiv('panel fl-col');
    $(acceptDataPanel).attr('id','acceptDataPanel').appendTo(checkBody);

    return container;

    if(userData!=null)
    {
        $(accPersData).removeClass("active");
        $(accPersDataPanel).removeClass("show");
        $(deliveryData).addClass("active");
        $(deliveryDataPanel).addClass("show");
    }
}

function generateLabelField(text, name) {
    var container = getDiv('fl-col');
    var caption = getDiv('fl-row');
    var content = getDiv('fl-row');
    $(caption).text(text).appendTo(container);
    $(content).attr('id',name).appendTo(container);
    return container;
}

function generateOrderProd(prod) {
    var container = getDiv('fl-row');
    var c1 = document.createElement('span');
    var c2 = document.createElement('span');
    var c3 = document.createElement('span');
    var c4 = document.createElement('span');
    $(c1).text(prod.name).appendTo(container);
    $(c2).text(parseInt(prod.product_cost).formatMoney(0,","," ")).appendTo(container);
    $(c3).text(prod.product_count).appendTo(container);
    $(c4).text(parseInt(prod.product_cost * prod.product_count).formatMoney(0,","," ")).appendTo(container);
    return container;
}

function generateCategoryFlat(categoryId) {
    var container = document.createElement('div');
    var caption = document.createElement('div');
    var catBody = document.createElement('div');
    productsInCategory = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'category=' + categoryId,
        async: false
    }).responseJSON;
    productsInCategory.offset = 0;
    $(container).addClass('fl-col').addClass('products-container');
        $(caption).addClass('flat-caption').appendTo($(container));
        var captionText = document.createElement('h1');
        $(captionText).text(categoriesData[categoryId].name).appendTo($(caption));
        var countComment = document.createElement('div');
        $(countComment).addClass('category-progress').appendTo($(caption));
    $(catBody).addClass('shadow').addClass('fl-col').addClass('white-bg').attr('id','catBody').css('margin-top','20px').appendTo($(container));
    var pagesSelect = document.createElement('div');
    $(pagesSelect).addClass('category-nav').addClass('fl-row').css('justify-content','flex-end').height('77px').appendTo(catBody);
        var pageSelectText = document.createElement('div');
        $(pageSelectText).text('Страницы').appendTo($(pagesSelect));
       //var pageSelectors = document.createElement('div');
    for(var pageI = 1; pageI <= Math.ceil(productsInCategory.prods.length/17); pageI++) {
        var page = document.createElement('a');
        $(page).appendTo(pageSelectText).attr('href','#').text(pageI).attr('np',pageI)
            .on('click', function (e) {
                e.preventDefault();
                $(".category-nav .active").removeClass('active');
                $("a[np=" + $(this).attr('np') + "]").addClass('active');
                productsInCategory.offset = 0 + 17*($(this).attr('np') - 1);
                var startProd = productsInCategory.offset;
                var newBodyProds = getCatBody(productsInCategory,
                    productsInCategory.prods.length - 17*($(this).attr('np') - 1) > 17 ? 17 : productsInCategory.prods.length - 17*($(this).attr('np') - 1) );
                $('#catBodyProds').fadeOut(200, function() {
                    $(this).replaceWith($(newBodyProds));
                    $(newBodyProds).attr('id','catBodyProds');
                    $('#catBodyProds').fadeIn(200);
                });
                var endProds = productsInCategory.offset == 0 ? productsInCategory.prods.length : productsInCategory.offset ;
                $(countComment).text("Показано " + (startProd+1) + "-" + endProds + " из " + productsInCategory.prods.length + " товаров.")
            });
        if(pageI==1) $(page).addClass('active');
    }
    var startProd = productsInCategory.offset;
    var catBodyProds = getCatBody(productsInCategory, productsInCategory.prods.length - productsInCategory.offset > 17 ? 17 : productsInCategory.prods.length  );
    $(catBodyProds).attr('id','catBodyProds').appendTo(catBody);
    var bottomPagesSelect = $(pagesSelect).clone(true,true,true);
    $(bottomPagesSelect).appendTo(catBody);
    var endProds = productsInCategory.offset == 0 ? productsInCategory.prods.length : productsInCategory.offset ;
    $(countComment).text("Показано " + (startProd+1) + "-" + endProds + " из " + productsInCategory.prods.length + " товаров.")
    return container;
}

function getCatBody(products, count) {
    var container = document.createElement('div');
    $(container).addClass('fl-col');
    if(count > 1) {
        var descRow = document.createElement('div');
        var description = document.createElement('div');
        $(description).appendTo($(descRow)).addClass('category-desc').addClass('fl-col');
        var descRowProd = generateProductsRow(1,productsInCategory,'forward');
        $(descRowProd).appendTo($(descRow));
        $(descRow).addClass('fl-row').appendTo(container);
        count -= 1;
        if(count === 0) return container;
        if ( count >= 8 && count < 12) {
            var row = generateProductsRow(4, products, 'forward');
            $(row).appendTo(container);
            count -= 4;
            var promoBlock = document.createElement('div');
            $(promoBlock).appendTo($(container)).addClass('fl-row');
            var promoBlockProds = document.createElement('div');
            $(promoBlockProds).addClass('fl-col').appendTo($(promoBlock));
            var promoBlockAction = document.createElement('div');
            $(promoBlockAction).addClass('category-promo-action').appendTo($(promoBlock));
            var promoRow1 = generateProductsRow(2, productsInCategory, 'forward');
            var promoRow2 = generateProductsRow(2, productsInCategory, 'forward');
            $(promoRow1).appendTo($(promoBlockProds));
            $(promoRow2).appendTo($(promoBlockProds));
            count -= 4;
        } else if (count >=12 ) {
            for(var rI = 0; rI<2; rI++) {
                var row = generateProductsRow(4, products, 'forward');
                $(row).appendTo(container);
                count -= 4;
            }
            var promoBlock = document.createElement('div');
            $(promoBlock).appendTo($(container)).addClass('fl-row');
            var promoBlockProds = document.createElement('div');
            $(promoBlockProds).addClass('fl-col').appendTo($(promoBlock));
            var promoBlockAction = document.createElement('div');
            $(promoBlockAction).addClass('category-promo-action').appendTo($(promoBlock));
            var promoRow1 = generateProductsRow(2, productsInCategory, 'forward');
            var promoRow2 = generateProductsRow(2, productsInCategory, 'forward');
            $(promoRow1).appendTo($(promoBlockProds));
            $(promoRow2).appendTo($(promoBlockProds));
            count -= 4;
        }
        while (count > 0) {
            var row = generateProductsRow(count > 4 ? 4 : count, products, 'forward');
            $(row).appendTo(container);
            count -= 4;
        }
        return container;
    }
    return container;
}

function generateProductFlat(product) {
    var container = document.createElement('div');
    var caption = document.createElement('div');
    var prodBody = document.createElement('div');
    var categoryProducts = document.createElement('div');
    $(container).addClass('fl-col').addClass('products-container');
        $(caption).addClass('flat-caption').appendTo($(container));
        var captionText = document.createElement('h1');
        $(captionText).text(categoriesData[product.category].name).appendTo($(caption));
        var captionBackHref = document.createElement('a');
        $(captionBackHref).text("Вернуться в каталог").attr('href','#').addClass('magenta-text')
            .css('font-size','14px').addClass('uppercase')
            .on('click', function() {
                //alert("goto category " + categoriesData[product.category].name );
                prepareFlat();
                categoryFlat = generateCategoryFlat(product.category);
                $(categoryFlat).appendTo($("#content"));
            })
            .appendTo($(caption));

    $(prodBody).addClass('shadow').addClass('fl-row').addClass('white-bg').css('margin-top','18px').appendTo($(container));
        var gallery = document.createElement('div');
        var specification = document.createElement('div');
        var buy = document.createElement('div');

        $(gallery).width("470px").height("580px")
            .addClass("fl-col").appendTo($(prodBody));

        var foto = document.createElement('div');
        $(foto).width("470px").height("470px").addClass("fl-row")
            .css('background-color','#cccccc')
            .addClass('fl-row').appendTo($(gallery));
            var azoom = document.createElement('a');
            $(azoom).appendTo(foto).css('sefl-align','flex-start').attr('id','fotomodaltrigger')
                .css('margin-top','25px').css('margin-left','25px').attr('href','#fotomodal').attr('pos', 'absolute');
            var zoom = document.createElement('div');
            $(zoom).appendTo(azoom).css('background-image','url("./img/zoom.png")').width("25px").height("23px");

        var picBar = document.createElement('div');
        $(picBar).height("108px").addClass('fl-row').addClass('fl-vcenter').addClass('fl-hcenter')
            .css('background-color','white').appendTo($(gallery));

        if(product.images.length>0) {

            if(product.images.length>4) {
                var scrollLeft = document.createElement('div');
                var scrollLeftImg = document.createElement('img');

                var scrollRight = document.createElement('div');
                var scrollRightImg = document.createElement('img');
                $(scrollLeftImg).attr('src','./img/arrow_left.png').appendTo($(scrollLeft));
                $(scrollRightImg).attr('src','./img/arrow_right.png').appendTo($(scrollRight));
            }

            var scroll = document.createElement('div');
            $(scrollLeft).css('cusor','pointer')
                .appendTo($(picBar)).click(function () {
                $(scroll).trigger('backward');
            });;
            $(scroll).addClass('scroll-img').attr("id","imgRuler").appendTo($(picBar));
            $(scrollRight).css('cusor','pointer')
                .appendTo($(picBar)).click(function () {
                $(scroll).trigger('forward');
            });;
            var ul = document.createElement('ul');
            $(ul).appendTo($(scroll));
            var flag = false;
            $.each(product.images, function (i, item) {
                var li = document.createElement('li');
                $(li).appendTo($(ul));

                var thumbImg = document.createElement('div');
                $(thumbImg).css('background','url("./img/products/' + product.id + '/' + item + '") left center no-repeat')
                    .addClass('ruler-thumb').css("background-position","center").css('background-size','contain')
                    .width("60px").height("60px").appendTo($(li))
                    .on('click', function () {
                        $('.ruler-thumb-checked').removeClass('ruler-thumb-checked');
                        $(this).addClass('ruler-thumb-checked');

                        $('#imgBox').css("background","url('./img/products/" + product.id + "/" + item + "') left center no-repeat ")
                            .css("background-position","center").css('background-size','contain');
                        $(foto).css("background","url('./img/products/" + product.id + "/" + item + "') left center no-repeat ")
                            .css("background-position","center").css('background-size','contain');
                    });
                if(!flag) {
                    flag=true;
                    $(thumbImg).trigger('click');
                }

            });
             $(scroll).scrollbox({
                 direction: 'h',
                 autoPlay: false
             });

        }
    $(specification).addClass('fl-col')
        .width("430px").height("580px").appendTo($(prodBody));
    var specProdName = document.createElement('div');
    var specProdDesc = document.createElement('div');

    $(specProdName).text(product.name).css('font-size','36px').css('font-weight','lighter')
        .css('font-style','italic').css('color','black')
        .addClass('fl-col').css('margin-top','40px').css('margin-left','28px').appendTo($(specification))
    var magentaLine = document.createElement('div');
    $(magentaLine).height("3px").width('370px').addClass('magenta-bg').appendTo($(specProdName));
    $(specProdDesc).text(product.details.desc).css('margin-left','28px').css('margin-right','30px')
        .css('max-height','200px').css('overflow','auto')
        .css('font-size','14px').css('color','#555555').css('font-weight','lighter').appendTo($(specification));

    if($(product.details.vars).size() > 0 ) {
        var specProdVars = document.createElement('div');
        var specProdVarsCaption = document.createElement('span');
        $(specProdVarsCaption).text("Выберите вариант:").appendTo($(specProdVars));
        $(specProdVars).addClass('varselect').css('margin-left','28px')
            .css('margin-top','28px').appendTo($(specification));
        var specProdVarsSelect = document.createElement('select');
        $(specProdVarsSelect).appendTo($(specProdVars));

        $.each(product.details.vars, function (i, item) {
            var optVar = document.createElement('option');
            $(optVar).appendTo($(specProdVarsSelect)).text(item).attr('value',i);
        })
    }

    $(buy).addClass('product-buy').appendTo($(prodBody));
    var cost = document.createElement('div');
    $(cost).addClass('cost').appendTo($(buy));
    if(product.details.actionCost != null && product.details.actionCost > 0) {
        var oldCost = document.createElement('div');
        $(oldCost).addClass('oldcost').text(parseInt(product.details.currentCost).formatMoney(0,"."," ")).appendTo($(cost));
        var newCost = document.createElement('div');
        $(newCost).addClass('newcost').text(parseInt(product.details.actionCost).formatMoney(0,"."," ")).appendTo($(cost));
    } else {
        var newCost = document.createElement('div');
        $(newCost).addClass('newcost').text(parseInt(product.details.currentCost).formatMoney(0,"."," ")).appendTo($(cost));
}

    var stock = document.createElement('div');
    $(stock).addClass('stock').appendTo($(cost));
    var stockImg = document.createElement('img');
    $(stockImg).attr('src','./img/stock.png').appendTo($(stock));
    var stockCapt = document.createElement('span');
    $(stockCapt).text("есть в наличии").appendTo($(stock));
    var buyButtonArea = document.createElement('div');
    $(buyButtonArea).addClass('buy-button-area').appendTo($(buy));

    var buyButton = document.createElement('a');
    $(buyButton).attr('id','buyButton').addClass('button').attr('href', '#').appendTo($(buyButtonArea));
    var buyButtonImg  = document.createElement('img');
    $(buyButtonImg).css('margin-left','-5px').attr('src','./img/prod_cart.png').appendTo($(buyButton));
    var buyButtonText = document.createElement('span');

    // if(cartData.details[product.id]==null) {
        $(buyButtonText).text("Купить").appendTo($(buyButton));
        $(buyButton).on('click', function () {
                var prData = {
                    id: product.id,
                    cost: product.details.actionCost > 0 ? product.details.actionCost : product.details.currentCost,
                    variant: specProdVarsSelect ? $(specProdVarsSelect).val() : false
                }
                $.ajax({
                    url: 'cart.php',
                    async: false,
                    method: 'POST',
                    dataType: 'json',
                    data: 'addProd=' + prepareData(prData),
                    success: function (msg) {
                        alert("Товар добавлен!");
                        $('#cartSum').text(parseInt(msg.summa).formatMoney(0, '.', ' '));
                        $('#cartCount').replaceWith(generateCartCount(msg.productsCount));
                        // $('#buyButton').off('click');
                        // $('#buyButton').on('click', function () {
                        //     prepareFlat();
                        //     var cartFlat = generateCartFlat(cartData);
                        //     $(cartFlat).appendTo($("#content"));
                        // });
                        //$('#buyButton span').text('В корзине')
                    }
                })
            });
    // } else {
    //     $(buyButtonText).text("В корзине").appendTo($(buyButton));
    //
    //     $(buyButton).on('click', function () {
    //         prepareFlat();
    //         var cartFlat = generateCartFlat(cartData);
    //         $(cartFlat).appendTo($("#content"));
    //     });
    // }

    var bonusFreeDelivery = productBonus("bonus-car.png","бесплатная доставка", "по всей России");
    var bonusHotLine = productBonus("bonus-man.png","горячая линия","8-800-000-00-00");
    var bonusGift = productBonus("bonus-gift.png","подарки","каждому покупателю");
    $(bonusFreeDelivery).appendTo($(buy));
    $(bonusHotLine).appendTo($(buy));
    $(bonusGift).appendTo($(buy));

    fetchCatProdsData(product.category);
    var sameProducts = generateProductsContainer(
        "sameProducts",
        "Другие товары из категории \"" + categoriesData[product.category].name + "\"",
        1,
        catProdsData);
    $(sameProducts).addClass('shadow').css("margin-top",'24px').appendTo($(container));

    return container;
}

function productBonus(img, topText, bottomText) {
    var bonusBox = document.createElement('div');
    var bonusImg = document.createElement('img');
    var bonusCaption = document.createElement('div');
    var bonusTopText = document.createElement('div');
    var bonusBottomText = document.createElement('div');
    $(bonusTopText).text(topText).appendTo($(bonusCaption));
    $(bonusBottomText).text(bottomText).appendTo($(bonusCaption));
    $(bonusImg).attr('src','./img/' + img).appendTo($(bonusBox));
    $(bonusCaption).appendTo($(bonusBox));
    $(bonusBox).addClass("product-bonus").css('margin-top','15px');
    return bonusBox;
}

function generatePromoProductsContainer() {
    var promoProductsContainer = document.createElement('div');
    $(promoProductsContainer).addClass("products-container")
        .addClass("fl-row")
        .addClass("fl-space")
        .css("height", "311px");
    //TODO Доделать после БД
    var promoProds = $.ajax({
        type: 'POST',
        url: 'content.php',
        async: false,
        dataType: 'json',
        data: 'promoprods'}).responseJSON;


    var promo1 = generatePromoProductDiv("img/promo1.jpg", false, false, "black",promoProds.result[0]);
    var promo2 = generatePromoProductDiv("img/promo2.jpg", false, true, "black",promoProds.result[1]);
    var promo3 = generatePromoProductDiv("img/promo3.jpg", true, false, "white",promoProds.result[2]);
    $(promo1).appendTo($(promoProductsContainer));
    $(promo2).appendTo($(promoProductsContainer));
    $(promo3).appendTo($(promoProductsContainer));
    return promoProductsContainer;
}

function generatePromoProductDiv(bgimage, double, alignRight, color, promoProd) { //TODO доделать!!!
    var promoProductBox = document.createElement('div');
    $(promoProductBox).addClass("fl-col")
        .addClass("italic")
        .css("height", "100%")
        .css("justify-content", "flex-end")
        .css("font-size", "32px")
        .css("color", color)
        .css("cursor","pointer")
        .on('click', function () {
            prepareFlat();
            prodcutFlat = generateProductFlat(promoProd);
            $(prodcutFlat).appendTo($("#content"));
            $('#fotomodaltrigger').leanModal({top: 300, overlay: 0.45});
            $.ajax({
                type: 'POST',
                url: 'utils.php',
                data: 'clickCounter&productId=' + promoProd.id,
                dataType: 'text'
            });
        })
        .appendTo($(promoProductBox));

    var firstLine = document.createElement('div');
    var secondLine = document.createElement('div');
    $(firstLine).text(promoProd.firstLine)
        .addClass("bold")
        .addClass("uppercase")
        .appendTo($(promoProductBox));
    $(secondLine).text(promoProd.secondLine)
        .addClass("light")
        .addClass("uppercase")
        .css('margin-bottom','28px')
        .appendTo($(promoProductBox));

    if(alignRight) {
        $(promoProductBox).css('align-items','flex-end');
        $(firstLine).attr('align','right').css('margin-right','14px');
        $(secondLine).attr('align','right').css('margin-right','14px');
    } else {
        $(firstLine).css('margin-left','20px');
        $(secondLine).css('margin-left','20px');
    }
    if (double) {
        $(promoProductBox).addClass("promo-product-dbox");
    } else {
        $(promoProductBox).addClass("promo-product-box");
    }
    $(promoProductBox).css('background-size', 'cover')
        .css('background-image', 'url("./' + bgimage + '")');
    return promoProductBox;
}

function checkRegData(usernameId, emailId, telId, passwdId, rpasswdId) {
    var canRegister = true;
    if(!patternEmail.test($(emailId).val())) {
        alert("Введен ошибочный e-mail!")
        canRegister = false;
        return false;
    } else {

        $.ajax({
            type: 'POST',
            url: 'login.php',
            dataType: 'text',
            async: false,
            data: 'usercheck=' + encodeURIComponent($(emailId).val()),
            success: function (msg) {
                if(msg==true) {
                    alert('Пользователь с указанным email уже зарегистрирован!')
                    canRegister = false;
                }
            }
        });
    }
    if($(usernameId).val().length < 2) {
        alert("Укажите своё имя!");
        canRegister = false;
        return false;
    }
    if($(passwdId).val().length > 0) {
        if($(passwdId).val().length < 6) {
            alert("Пароль должен быть не менее 6 символов!");
            canRegister = false;
            return false;
        }
        if($(passwdId).val() != $(rpasswdId).val()) {
            alert("Пароли не совпадают!");
            canRegister = false;
            return false;
        }
        if(canRegister) {
            var login = {
                username: $(usernameId).val(),
                email: $(emailId).val(),
                tel: $(telId).val(),
                password: $(rpasswdId).val()
            };
            $.ajax({
                type: 'POST',
                url: 'login.php',
                dataType: 'text',
                async: false,
                data: 'register=' + prepareData(login),
                success: function () {
                    show_usermenu();
                }
            });
            return true;
        }

    } else {
        alert("Введите пароль (не менее 6 символов)!")
    }
}

function showZoomFoto() {
    var container = getDiv();
    var imgBox = getDiv();
    $(imgBox).attr('id','imgBox').css('margin','0 auto').width('850px').height('850px').appendTo(container);

    $(container).css('background-color','white').attr('id','fotomodal').addClass("layout").appendTo("body")
        .width('900px').height('900px');
}

function showRegistration() {
    layout = document.createElement('div');
    layoutCaption = document.createElement('div');
    $(layoutCaption).addClass("layout-caption").appendTo($(layout));
    layoutCaptionText = document.createElement('h1');
    $(layoutCaptionText).text("Регистрация").appendTo($(layoutCaption));
    layoutBody = document.createElement('div');
    $(layoutBody).css('height', '395px').css('margin-top', '30px').addClass("fl-row").appendTo($(layout));
    layoutCol1 = document.createElement('div');
    layoutCol2 = document.createElement('div');
    $(layoutCol1).addClass("layout-half-col").appendTo($(layoutBody));
    $(layoutCol2).addClass("layout-half-col").appendTo($(layoutBody));
    username = generateInputField("Контактное лицо (ФИО)", 'regusername', false);
    email = generateInputField("E-mail адрес:", 'regemail', false);
    tel = generateInputField("Телефон:", 'regtel', false);
    passwd = generateInputField("Пароль:", 'regpasswd', true);
    rpasswd = generateInputField("Повторите пароль:", 'regrpasswd', true);
    $(username).appendTo($(layoutCol1));
    $(email).appendTo($(layoutCol1));
    $(tel).appendTo(layoutCol1);
    $(passwd).appendTo($(layoutCol2));
    $(rpasswd).appendTo($(layoutCol2));

    regSubmit = document.createElement('a');
    $(regSubmit).text('Зарегистрироваться').addClass('redbutton hidemodal').appendTo($(layoutCol1))
        .on('click', function () {
            checkRegData('#regusername','#regemail','#regtel','#regpasswd','#regrpasswd');
        });
    $(layout).addClass("layout").attr('id', 'regmodal').appendTo("body");
}

function showLoginForm() {

    var layoutLogin = document.createElement('div');
    layoutCaption = document.createElement('div');
    $(layoutCaption).addClass("layout-caption").appendTo(layoutLogin);
    layoutCaptionText = document.createElement('h1');
    $(layoutCaptionText).text("Вход").appendTo(layoutCaption);
    layoutBody = document.createElement('div');
    $(layoutBody).css('margin-top', '30px').addClass("fl-row").appendTo(layoutLogin);
    layoutCol1 = document.createElement('div');
    layoutCol2 = document.createElement('div');
    $(layoutCol1).css('margin-left','30px').addClass("layout-half-col").appendTo(layoutBody);
    $(layoutCol2).addClass("layout-half-col").appendTo($(layoutBody));
    layoutCol1Caption = getDiv("login-cols-caption");
    $(layoutCol1Caption).text("Зарегистрированный пользователь").appendTo(layoutCol1);
    layoutCol2Caption = getDiv("login-cols-caption");
    $(layoutCol2Caption).text("Новый пользователь").appendTo(layoutCol2);

    loginemail = generateInputField("E-mail адрес:", 'loginemail', false);
    loginpasswd = generateInputField("Пароль:", 'loginpasswd', true);
    $(loginemail).appendTo($(layoutCol1));
    $(loginpasswd).appendTo($(layoutCol1));
    loginSubmit = document.createElement('a');
    $(loginSubmit).attr('id', 'loginbtn').attr('href','#').addClass("redborderbutton hidemodal").text("Войти").appendTo(layoutCol1)
        .on('click', function () {
            var login = {
                user: $('#loginemail').val(),
                password: $('#loginpasswd').val()
            };
            $.ajax({
                type: 'POST',
                url: 'login.php',
                dataType: 'text',
                data: 'login=' + prepareData(login),
                success: function () {
                    show_usermenu();
                    refreshCart()
                }
            });
            $("#lean_overlay").trigger("click");
        });
    forgotBtn = document.createElement('a');
    $(forgotBtn).addClass('forgotbtn').attr('href','#').text("Забыли пароль?").appendTo(layoutCol1);
    regBtn = document.createElement('a');
    $(regBtn).addClass('redbutton').attr('href','#').text('Зарегистрироваться').appendTo(layoutCol2);
    $(layoutLogin).addClass('layout').attr('id', 'loginmodal').appendTo("body");
}

function refreshCart() {
    cartData = $.ajax({
        url: 'cart.php',
        async: false,
        method: 'POST',
        dataType: 'json'
    }).responseJSON;
    $('#cartSum').text(parseInt(cartData.summa).formatMoney(0, '.', ' '));
    $('#cartCount').replaceWith(generateCartCount(cartData.productsCount));
}

function showAccount() {
    var passChanged = false;
    var emailChanged = false;
    var fioChanged = false;
    var telChanged = false;
    var cityChanged = false;
    var streetChanged = false;
    var homeChanged = false;
    var flatChanged = false;
    layout = document.createElement('div');
    layoutCaption = document.createElement('div');
    $(layoutCaption).addClass("layout-caption").appendTo($(layout));
    layoutCaptionText = document.createElement('h1');
    $(layoutCaptionText).text("Личный кабинет").appendTo($(layoutCaption));
    layoutBody = document.createElement('div');
    $(layoutBody).css('height', '1153px').addClass("fl-row").appendTo($(layout));
    layoutCol1 = document.createElement('div');
    layoutCol2 = document.createElement('div');
    $(layoutCol1).addClass("layout-half-col").appendTo($(layoutBody));
    $(layoutCol2).addClass("layout-half-col").appendTo($(layoutBody));
    persData = document.createElement('div');
    $(persData).text("Ваши данные").addClass('subtitle').appendTo($(layoutCol1));
    userfio = generateInputField("Контактное лицо (ФИО)", 'accfio', false);
    userphone = generateInputField("Контактный телефон:", 'acctel', false);
    email = generateInputField("E-mail адрес:", 'accemail', false);
    $(userfio).css('margin-bottom','19px').appendTo($(layoutCol1));
    $(userphone).css('margin-bottom','19px').appendTo($(layoutCol1));
    $(email).css('margin-bottom','19px').appendTo($(layoutCol1));
    deliveryAddress = document.createElement('div');
    $(deliveryAddress).text("Адрес доставки").addClass('subtitle').appendTo(layoutCol1);
    city = generateInputField("Город:", 'acccity', false);
    street = generateInputField("Улица:", 'accstreet', false);
    inputDoubleFieldContainer = document.createElement('div');
    home = generateInputField("Дом", 'acchome', false);
    flat = generateInputField("Квартира", 'accflat', false);
    $(inputDoubleFieldContainer).css('margin-bottom','19px').addClass('fl-row').addClass('fl-space');
    $(home).appendTo($(inputDoubleFieldContainer));
    $(flat).appendTo($(inputDoubleFieldContainer));
    $(city).css('margin-bottom','19px').appendTo($(layoutCol1));
    $(street).css('margin-bottom','19px').appendTo($(layoutCol1));
    $(inputDoubleFieldContainer).appendTo($(layoutCol1));
    changePasswod = document.createElement('div');
    $(changePasswod).text("Изменение пароля").addClass('subtitle').appendTo($(layoutCol1));
    passw = generateInputField("Введите новый пароль", 'accpassw', true);
    rpassw = generateInputField("Повторите новый пароль:", 'accrpassw', true);
    $(passw).css('margin-bottom','19px').appendTo($(layoutCol1));
    $(rpassw).css('margin-bottom','19px').appendTo($(layoutCol1));
    $(city).children('input').on('change', function() {cityChanged = true;});
    $(street).children('input').on('change', function() {streetChanged = true;});
    $(home).children('input').on('change', function() {homeChanged = true;});
    $(flat).children('input').on('change', function() {flatChanged = true;});
    $(userfio).children('input').on('change', function() {fioChanged = true;});
    $(userphone).children('input').on('change', function() {telChanged = true;});
    $(email).children('input').on('change', function() {emailChanged = true;});
    $(passw).children('input').on('change', function() {passChanged = true;});
    $(rpassw).children('input').on('change', function() {passChanged = true;})
    saveSubmit = document.createElement('a');
    $(saveSubmit).addClass('redbutton').addClass('hidemodal').appendTo(layoutCol1);
    saveSubmitText = document.createElement('span');
    $(saveSubmitText).text('Сохранить').appendTo(saveSubmit);
    $(saveSubmit).css("width", "134px")
        .on('click', function (e) {
            e.preventDefault();
            var canUpdate = true;
            if (emailChanged) {
                if (!patternEmail.test($('#accemail').val())) {
                    alert("Введен ошибочный e-mail!")
                    canUpdate = false;
                    return;
                } else {
                    $.ajax({
                        type: 'POST',
                        url: 'login.php',
                        dataType: 'text',
                        async: false,
                        data: 'usercheck=' + encodeURIComponent($('#accemail').val()),
                        success: function (msg) {
                            if (msg == true) {
                                alert('Пользователь с указанным email уже зарегистрирован!')
                                canUpdate = false;
                            }
                        }
                    });
                }
            }
            if ($('#accfio').val().length < 2) {
                alert("Укажите своё имя!");
                canUpdate = false;
                return;
            }

            if (passChanged) {
                if ($('#accpassw').val().length > 0) {
                    if ($('#accpassw').val().length < 6) {
                        alert("Пароль должен быть не менее 6 символов!");
                        canUpdate = false;
                        return;
                    }
                    if ($('#accpassw').val() != $('#accrpassw').val()) {
                        alert("Пароли не совпадают!");
                        canUpdate = false;
                        return;
                    }
                } else {
                    alert("Введите пароль (не менее 6 символов)!")
                    canUpdate = false;
                }
            }
            if (canUpdate) {
                if (
                    cityChanged ||
                    streetChanged ||
                    homeChanged ||
                    flatChanged ||
                    fioChanged ||
                    telChanged ||
                    emailChanged ||
                    passChanged) {
                    var prData = {
                        userData: {
                            city: $('#acccity').val(),
                            street: $('#accstreet').val(),
                            home: $('#acchome').val(),
                            flat: $('#accflat').val(),
                            fio: $('#accfio').val(),
                            tel: $('#acctel').val()
                        }
                    };

                    if (emailChanged) prData.email = $('#accemail').val();
                    if (passChanged) prData.passw = $('#accpassw').val();
                    $.ajax({
                        url: 'login.php',
                        method: 'POST',
                        dataType: 'json',
                        data: 'update=' + prepareData(prData)
                    })
                }
                $("#lean_overlay").trigger("click");
            }
        });
    selfOrders = document.createElement('div');
    $(selfOrders).text("Ваши заказы").addClass('subtitle').appendTo(layoutCol2);
    selfOrdersContent = getDiv("fl-col");
    $(selfOrdersContent).css('margin-left','30px').css('overflow-y','auto').css('max-height','800px')
        .css('margin-right','25px').attr('id','selfOrdersContent').appendTo(layoutCol2);

    $(layout).addClass("layout").attr('id', 'accmodal').appendTo("body");
}

function generateRadioInput(data) {
    var radioBlock = document.createElement('div');
    $(radioBlock).addClass('fl-col');
    $.each(data.content, function(i, item) {
        var radioButton = document.createElement('div');
        $(radioButton).addClass('radio-block').attr('id',data.name + "_" + item.value).appendTo($(radioBlock));
        var radioInput = document.createElement('input');
        $(radioInput).attr('name',data.name).attr("value",item.value).attr('type','radio')
            .attr('id',item.value).appendTo($(radioButton));
        if(item.checked) {
            $(radioInput).attr('checked', 'checked');
        }
        var radioLabel = document.createElement('label');
        $(radioLabel).attr('for',item.value).html(item.text).css('color','#000')
            .css('font-size','16px').css('font-weight','lighter')
            .appendTo($(radioButton));

    });
    return radioBlock;
}

function generateAccOrder(order) {
    var container = getDiv('acc-order-block');
    var leftCol = getDiv();
    var rightCol = getDiv();
    $(leftCol).appendTo(container);
    $(rightCol).appendTo(container);
    var status = document.createElement('span');
    var orderStatus;
    switch (order.status) {
        case "0" : orderStatus = "Формируется";
            break;
        case "1" : orderStatus = "Принят";
            break;
        case "2": orderStatus = "Отгружен";
            break;
        case "3": orderStatus = "Ожидает доставки";
            break;
        case "4": orderStatus = "Доставлен";
            break;
        case "5": orderStatus = "Отмена";
            break;
    }
    $(status).text(orderStatus).appendTo(rightCol);
    var number = getDiv();
    $(number).appendTo(leftCol).text("№" + order.id);
    var summa = getDiv();
    $(summa).appendTo(leftCol).text("("+ parseInt(order.summa).formatMoney(0,"."," ")+")");
    var parseDate = order.order_date.split(" ");
    var date = parseDate[0].split("-");
    var time = parseDate[1].split(":");

    var orderDate = "<div>" + date[2] + "." + date[1] + "." + date[0] + " в " + time[0] + ":" + time[1] + "</div>";
    $(orderDate).appendTo(leftCol);

    return container;
}