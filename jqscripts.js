/**
 *
 */
var newProdsData;
var popProdsData;
var catProdsData;
var categoriesData;
var productsInCategory;
var userData;
var patternEmail = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

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
    activateLoginMenu();
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
    showRegistration();
    showAccount();
});

function activateLoginMenu() {
    $('#loginform').submit(function () {
        var login = {
            user: $('#username').val(),
            password: $('#password').val()
        };
        $.ajax({
            type: 'POST',
            url: 'login.php',
            dataType: 'text',
            data: 'login=' + prepareData(login),
            success: function () {
                show_usermenu();
            }
        });
        return false;
    });
}

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
    var cartData = $.ajax({
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
            cartFlat = generateCartFlat(cartData);
            $(cartFlat).appendTo($("#content"));
    });
    cartBarInfoBox = document.createElement('div');
    $(cartBarInfoBox).appendTo(cartBar).addClass('fl-col');
        cartBarSumm = document.createElement('nobr');
        $(cartBarSumm).css('font-size','20px').css('font-weight','bolder').appendTo(cartBarInfoBox);
    cartImg = document.createElement('img');
    $(cartImg).attr("src",'./img/cart.png').css('opacity','0.2').appendTo(cartBar);

    if(cartData.result == null) {
        $(cartBarSumm).attr('id','cartSum').text(parseInt(cartData.summa).formatMoney(0,"."," "));
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
function generateCartFlat(cartData) {
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

    $(prodText).text('Товар').css('maring-left','20px');
    $(availableText).text('Доступность').css('margin-left','15px');
    $(costText).text('Стоимость').css('margin-left','12px');
    $(countText).text('Количество').css('margin-left','10px');
    $(summaText).text('Итого').css('margin-left','10px');

    $.each(cartData.details, function(i, item) {
        var detail = document.createElement('div');
        $(detail).addClass('fl-row').addClass('order');

        var prod = document.createElement('div');
        var available = document.createElement('div');
        var cost = document.createElement('div');
        var count = document.createElement('div');
        var summa = document.createElement('div');
        $(prod).appendTo(detail); $(available).appendTo(detail); $(cost).appendTo(detail);
        $(count).appendTo(detail); $(summa).appendTo(detail);
            var prodImg = document.createElement('div');
            $(prodImg).addClass('prod-img').css('background-image','url("./img/products/"'+ item.images[0] +')')
                .appendTo(prod);
        $(detail).appendTo(container);
    });



    return container;
}

function generateCategoryFlat(categoryId) { //TODO доделать перелистывание - неправильный подсчет можно сделать кэширование при попадании в одну и туже категорию
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
        var pageSelectors = document.createElement('div');
    for(var pageI = 1; pageI <= Math.ceil(productsInCategory.prods.length/17); pageI++) {
        var page = document.createElement('a');
        $(page).appendTo(pageSelectText).attr('href','#').text(pageI).attr('np',pageI)
            .on('click', function (e) {
                e.preventDefault();
                $(".category-nav .active").removeClass('active');
                $("a[np=" + $(this).attr('np') + "]").addClass('active');
                productsInCategory.offset = 0 + 17*($(this).attr('np') - 1);
                var newBodyProds = getCatBody(productsInCategory,
                    productsInCategory.prods.length - 17*($(this).attr('np') - 1) > 17 ? 17 : productsInCategory.prods.length - 17*($(this).attr('np') - 1) );
                $('#catBodyProds').fadeOut(200, function() {
                    $(this).replaceWith($(newBodyProds));
                    $(newBodyProds).attr('id','catBodyProds');
                    $('#catBodyProds').fadeIn(200);
                });
            });
        if(pageI==1) $(page).addClass('active');
    }
    var startProd = productsInCategory.offset;
    var catBodyProds = getCatBody(productsInCategory, productsInCategory.prods.length - productsInCategory.offset > 17 ? 17 : productsInCategory.prods.length  );
    $(catBodyProds).attr('id','catBodyProds').appendTo(catBody);
    var bottomPagesSelect = $(pagesSelect).clone(true,true,true);
    $(bottomPagesSelect).appendTo(catBody);
    $(countComment).text("Показано " + (startProd+1) + "-" + productsInCategory.offset + " из " + productsInCategory.prods.length + " товаров.")
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
            var zoom = document.createElement('div');
            $(zoom).appendTo($(foto)).css('sefl-align','flex-start')
                .css('margin-top','25px').css('margin-left','25px')
                .css('background-image','url("./img/zoom.png")').width("25px").height("23px")
                .css("cursor","pointer");
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
    $(buyButton).addClass('button').attr('href','#').appendTo($(buyButtonArea))
        .on('click', function () {
            var prData = {
                id: product.id,
                cost: product.details.actionCost > 0 ? product.details.actionCost : product.details.currentCost
            }
            $.ajax({
                url: 'cart.php',
                async: false,
                method: 'POST',
                dataType: 'json',
                data: 'addProd=' + prepareData(prData),
                success: function(msg) {
                    alert("Товар добавлен!");
                    $('#cartSum').text(parseInt(msg.summa).formatMoney(0,'.',' '));
                    $('#cartCount').replaceWith(generateCartCount(msg.products));
                }
            })
        });
    var buyButtonImg  = document.createElement('img');
    $(buyButtonImg).css('margin-left','-5px').attr('src','./img/prod_cart.png').appendTo($(buyButton));
    var buyButtonText = document.createElement('span');
    $(buyButtonText).text("Купить").appendTo($(buyButton));

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
    passwd = generateInputField("Пароль:", 'regpasswd', true);
    rpasswd = generateInputField("Повторите пароль:", 'regrpasswd', true);
    $(username).appendTo($(layoutCol1));
    $(email).appendTo($(layoutCol1));
    $(passwd).appendTo($(layoutCol2));
    $(rpasswd).appendTo($(layoutCol2));

    regSubmit = document.createElement('a');
    $(regSubmit).text('Зарегистрироваться').addClass('redbutton').addClass('hidemodal').appendTo($(layoutCol1))
        .on('click', function () {

            var canRegister = true;
            if(!patternEmail.test($('#regemail').val())) {
                alert("Введен ошибочный e-mail!")
                canRegister = false;
                return;
            } else {

                $.ajax({
                    type: 'POST',
                    url: 'login.php',
                    dataType: 'text',
                    async: false,
                    data: 'usercheck=' + encodeURIComponent($('#regemail').val()),
                    success: function (msg) {
                        if(msg==true) {
                            alert('Пользователь с указанным email уже зарегистрирован!')
                            canRegister = false;
                        }
                    }
                });
            }
            if($('#regusername').val().length < 2) {
                alert("Укажите своё имя!");
                canRegister = false;
                return;
            }
            if($('#regpasswd').val().length > 0) {
                if($('#regpasswd').val().length < 6) {
                    alert("Пароль должен быть не менее 6 символов!");
                    canRegister = false;
                    return;
                }
                if($('#regpasswd').val() != $('#regrpasswd').val()) {
                    alert("Пароли не совпадают!");
                    canRegister = false;
                    return;
                }
                if(canRegister) {
                    var login = {
                        username: $('#regusername').val(),
                        email: $('#regemail').val(),
                        password: $('#regpasswd').val()
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
                }

            } else {
                alert("Введите пароль (не менее 6 символов)!")
            }
        });
    $(layout).addClass("layout").attr('id', 'regmodal').appendTo("body");
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
    $(userfio).appendTo($(layoutCol1));
    $(userphone).appendTo($(layoutCol1));
    $(email).appendTo($(layoutCol1));
    deliveryAddress = document.createElement('div');
    $(deliveryAddress).text("Адрес доставки").addClass('subtitle').appendTo($(layoutCol1));
    city = generateInputField("Город:", 'acccity', false);
    street = generateInputField("Улица:", 'accstreet', false);
    inputDoubleFieldContainer = document.createElement('div');
    home = generateInputField("Дом", 'acchome', false);
    flat = generateInputField("Квартира", 'accflat', false);
    $(inputDoubleFieldContainer).addClass('fl-row').addClass('fl-space');
    $(home).appendTo($(inputDoubleFieldContainer));
    $(flat).appendTo($(inputDoubleFieldContainer));
    $(city).appendTo($(layoutCol1));
    $(street).appendTo($(layoutCol1));
    $(inputDoubleFieldContainer).appendTo($(layoutCol1));
    changePasswod = document.createElement('div');
    $(changePasswod).text("Изменение пароля").addClass('subtitle').appendTo($(layoutCol1));
    passw = generateInputField("Введите новый пароль", 'accpassw', true);
    rpassw = generateInputField("Повторите новый пароль:", 'accrpassw', true);
    $(passw).appendTo($(layoutCol1));
    $(rpassw).appendTo($(layoutCol1));
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
    $(saveSubmit).addClass('redbutton').addClass('hidemodal').appendTo($(layoutCol1));
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
                        data: 'update=' + prepareData(prData),
                        success: function (msg) {
                            alert(msg.response);
                        }
                    })
                }
                $("#lean_overlay").trigger("click");
            }
        });
    selfOrders = document.createElement('div');
    $(selfOrders).text("Ваши заказы").addClass('subtitle').appendTo($(layoutCol2));
    $(layout).addClass("layout").attr('id', 'accmodal').appendTo("body");
}





