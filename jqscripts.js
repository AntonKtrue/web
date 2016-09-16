/**
 *
 */
var newProdsData;
var popProdsData;
var catProdsData;
var categoriesData;
var productsInCategory;

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

function fetchCatProdsData(catId) {
    catProdsData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'samecategory=' + catId,
        async: false
    }).responseJSON;
    catProdsData.offset = 0;


}

$(function () {
    //login
    activateLoginMenu();
    //---
    //fetch required data
    categoriesData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'filledcategories',
        async: false
    }).responseJSON;

    newProdsData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'newprods',
        async: false
    }).responseJSON;
    newProdsData.offset = 0;

    popProdsData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'popprods',
        async: false
    }).responseJSON;
    popProdsData.offset = 0;


    promoScreen = generateMainPromoScreen();
    navBar = generateNavigationBar();
    $(promoScreen).appendTo($('header'));
    $(navBar).appendTo($(promoScreen));



    newProducts = generateProductsContainer("newProducts", "Новые товары", 2, newProdsData);

    $(newProducts).css("margin-top", "-76px")
        .appendTo($("#content"));
    promoProducts = generatePromoProductsContainer();
    $(promoProducts).css("margin-top", "20px").appendTo($("#content"));

    popProducts = generateProductsContainer("popProducts", "Популярные товары", 1, popProdsData);
    $(popProducts).css("margin-top", "20px").appendTo($("#content"));

    aboutShop = generateAboutShop();
    $(aboutShop).css("margin-top", "20px").appendTo($("#content"));

    footer = generateFooter();
    $(footer).css("margin-top", "20px").css("margin-bottom", "62px").appendTo($("footer"));

    show_usermenu();

    showRegistration();
    showAccount();

});

function prepareFlat() {
    $('header').empty();
    $("#content").empty();
    navBar = generateNavigationBar();
    $(navBar).appendTo($("header"));
    show_usermenu();
}


function prepareData(prData) {
    return encodeURIComponent(JSON.stringify(prData))
}

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
                //generateSignMenu();
            }
        });
        return false;
    });
}

function logout() {
    $.ajax({
        type: 'POST',
        url: 'login.php',
        dataType: 'text',
        data: 'logout',
        success: function () {
            show_usermenu();
            //generateSignMenu();
        }
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
                $(loginButton).attr('id', 'accmodaltrigger').attr('pos', 'absolute').attr('href', '#accmodal');
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

function activateLeanModal() {
    $('#modaltrigger').leanModal({top: 175, overlay: 0.45, closeButton: ".hidemodal"});
    $('#regmodaltrigger').leanModal({top: 175, overlay: 0.45, closeButton: ".hidemodal"});
    $('#accmodaltrigger').leanModal({top: 175, overlay: 0.45, closeButton: ".hidemodal"});
}

function generateMainPromoScreen() {   // Генерация начальной страницы  - с элементами товара промо акции
    mainPromo = document.createElement('div');
    $(mainPromo).addClass("main-promo")
        .addClass("fl-col")
        .addClass("fl-vcenter");

    $.ajax({	// Для динамической генерации
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'mainpromo',
        success: function (msg) {
            promoProductArea = document.createElement('div');
            firstLine = document.createElement('div');
            secondLine = document.createElement('div');
            desc = document.createElement('div');
            button = document.createElement('div');
            $(promoProductArea).addClass("fl-col")
                .css("align-self", "flex-start")
                .addClass("promo-product").css('width','600px')
                .css('height','400px')
                .css('overflow','hidden');;
            $(firstLine).text(msg.firstLine)
                .addClass("uppercase")
                .addClass("bold")
                .addClass("italic")
                .css("font-size", "72px")
                .css("line-height", "65px")
                .css("letter-spacing", "-2px")
                .appendTo($(promoProductArea));
            $(secondLine).text(msg.secondLine)
                .addClass("uppercase")
                .addClass("light")
                .addClass("italic")
                .css("font-size", "72px")
                .css("line-height", "65px")
                .css("letter-spacing", "-2px")
                .appendTo($(promoProductArea));
            $(desc).text(msg.desc)
                .addClass("white-text")
                .css("font-size", "16px")
                .css("line-height", "17px")
                .css("margin-top",'30px')
                .appendTo($(promoProductArea));
            $(button).text("Посмотреть +")
                .addClass("bt-promo-view")
                .on('click', function () {			//TODO Идём смотреть промо товар
                    alert("clicked");
                })
                .appendTo($(promoProductArea));
            $(promoProductArea).appendTo($(mainPromo));

        }
    });
    return mainPromo;
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

function generateSignMenu() {
    signBar = document.createElement('div');
    $(signBar).addClass('sign-bar-area')
        .addClass('white-bg')
        .addClass('fl-row')
        .addClass("fl-vcenter")
        .attr('id', 'signbar');
    //TODO ajax sign menu elements

    return signBar;
}

function generateCartMenu() {
    cartBar = document.createElement('div');
    $(cartBar).addClass('cart-bar-area')
        .addClass('dark-blue-bg');
    return cartBar;
}

function generateCategories() {
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

function generateMainLogo() {
    mainLogo = document.createElement('div');
    $(mainLogo).appendTo($(navBar))
        .addClass('magenta-bg')
        .addClass('main-logo-area')
        .addClass('white-text')
        .addClass('fl-row')
        .addClass('fl-vcenter')
        .css('cursor', 'pointer')
        .click(function () {
            window.location = 'index.php';
        });
    logoText = document.createElement('div');
    $(logoText).appendTo($(mainLogo))
        .addClass('fl-col')
        .addClass('fl-vcenter')
        .css('width', '100%');
    //server side?
    super_text = document.createElement('span');
    $(super_text).appendTo($(logoText))
        .text("super")
        .addClass('uppercase')
        .css("font-size", "33px")
        .css("line-height", "33px");
    shop_text = document.createElement('span');
    $(shop_text).appendTo($(logoText))
        .text("shop")
        .addClass('uppercase')
        .addClass('bold')
        .css("font-size", "41px")
        .css("line-height", "33px");
    return mainLogo;
}

function generateCategoryFlat(categoryId) { //TODO можно сделать кэширование при попадании в одну и туже категорию
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


    $(catBody).addClass('fl-col').addClass('white-bg').attr('id','catBody').css('margin-top','20px').appendTo($(container));

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

    $(prodBody).addClass('fl-row').addClass('white-bg').css('margin-top','18px').appendTo($(container));
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
    $(buyButton).addClass('button').attr('href','#').appendTo($(buyButtonArea));
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
    $(sameProducts).css("margin-top",'24px').appendTo($(container));

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

function generateFotoRuler(product) {
    var ruler = document.createElement('div');
    $(ruler).height("60px").addClass('fl-row');

    $.each(product.images, function (i, item) {
        var thumb = document.createElement('div');
        $(thumb).addClass('ruler-thumb').attr('name','thumb')
            .css('background','url("./img/products/' + product.id + '/' + item + '") left center no-repeat')
            .css('margin-left','7.5px').css('margin-right','7.5px')
            .css("background-position","center").css('background-size','contain')
            .on('click',function () {
                $('div[name=thumb]').removeClass('ruler-thumb-checked');
                $(this).addClass('ruler-thumb-checked');
            })
            .appendTo($(ruler));
    });

    return ruler;
}

function generateProductDiv(product) {
    var productBox = document.createElement('div');
    var productAction = document.createElement('div');
    var productImage = document.createElement('div');
    var productSpec = document.createElement('div');
    var productName = document.createElement('div');
    var productCost = document.createElement('nobr');
    $(productBox).addClass("product-box").css('cursor','pointer')
        .addClass("white-bg")
        .on('click', function() {
            prepareFlat();
            prodcutFlat = generateProductFlat(product);
            $(prodcutFlat).appendTo($("#content"));
            $.ajax({
                type: 'POST',
                url: 'utils.php',
                data: 'clickCounter&productId=' + product.id,
                dataType: 'text'
            });
        });
    $(productAction).addClass("product-action")
        .appendTo($(productBox));
    $(productImage).addClass("product-image")
        .appendTo($(productBox));
    $(productSpec).addClass("product-spec")
        .addClass("fl-row")
        .addClass("fl-vcenter")
        .addClass("fl-space")
        .appendTo($(productBox));
    $(productName).addClass("gray-text")
        .css("font-size", "14px")
        .css("margin-left", "7px")
        .appendTo($(productSpec));
    var productCostBox = document.createElement('div');
    $(productCostBox).addClass('fl-col').addClass('fl-vcenter').addClass('fl-hcenter').appendTo($(productSpec));;
    $(productCost).addClass("magenta-text")
        .addClass("italic")
        .addClass("light")
        .css("font-size", "18px")
        .css("margin-right", "7px")
        .appendTo($(productCostBox));

    $(productName).text(product.name);
    if(product.details.actionCost != null & product.details.actionCost > 0) {
        var oldCost = document.createElement('nobr');
        $(oldCost).addClass("italic").addClass('light').css('font-size','14px').css('color','#999999')
            .css('text-decoration','line-through')
            .text(parseInt(product.details.currentCost).formatMoney(0,'.',' ')).appendTo($(productCostBox));
        $(productCost).text(parseInt(product.details.actionCost).formatMoney(0,'.',' '));
    } else {
        $(productCost).text(parseInt(product.details.currentCost).formatMoney(0,'.',' '));
    }
    $(productImage).css('background-image', 'url("./img/products/' + product.id + "/" + product.images[0] + '")');
    switch (product.details.badge) {
        case "new": var badge = images.newBadge();
            $(badge).appendTo(productImage); break;
        case "hot": var badge = images.hotBadge();
            $(badge).appendTo(productImage); break;
        case "sale": var badge = images.saleBadge();
            $(badge).appendTo(productImage); break;
    };
    return productBox;
}

function generateProductsContainer(id, caption, rowsCount, prodContData) {
    var rows = rowsCount;
    var productsContainer = id;
    var productsObjects = prodContData;

    var container = document.createElement('div');
    var rowsWrap = document.createElement('div');
    $(rowsWrap).addClass('fl-col').attr('id','rows' + id);
    $(container).addClass('fl-col').attr('id',productsContainer)
        .addClass('fl-vcenter').css('overflow','hidden')
        .addClass('products-container');
    titleBar = document.createElement('div');
    $(titleBar).addClass('fl-row')
        .addClass('fl-vcenter')
        .addClass('fl-space')
        .addClass('white-bg')
        .css("height", "76px")
        .css("width", "1170px");
        titleCaption = document.createElement('div');

    var scrollNav = document.createElement('div');
    var left = document.createElement('a');
    var right = document.createElement('a');
    var lessImage = document.createElement('img');
    var moreImage = document.createElement('img');
    $(lessImage).attr('src', 'img/less.png').appendTo($(left));
    $(moreImage).attr('src', 'img/more.png').appendTo($(right));

    $(left).attr('href','#').appendTo($(scrollNav));
    $(right).attr('href','#').css("margin-left", "10px").appendTo($(scrollNav));

    $(left).on('click', function(e){ //backward
        e.preventDefault();
        var newRows = document.createElement('div');
        $(newRows).addClass('fl-col').attr('id','rows' + id);
        if(productsObjects.lastDirection == 'forward') {
             if(productsObjects.firstProd == 0) {
                 productsObjects.offset = productsObjects.prods.length - 1;
             } else {
                 productsObjects.offset = productsObjects.firstProd - 1;
             }
        }
        for(var i = 0; i < rows; i++) {
            var row = generateProductsRow(4, productsObjects, 'backward');
            $(row).appendTo($(newRows));
        }
        $('#rows' + id).fadeOut(200, function () {
            $(this).replaceWith(newRows);
            $('#rows' + id).fadeIn(200);

        });
        productsObjects.lastDirection = 'backward';
    });
    $(right).on('click', function (e) {
        e.preventDefault();
        var newRows = document.createElement('div');
        $(newRows).addClass('fl-col').attr('id','rows' + id);
        if(productsObjects.lastDirection == 'backward') {
            if(productsObjects.firstProd == productsObjects.prods.length) {
                productsObjects.offset = 0;
            } else {
                productsObjects.offset = productsObjects.firstProd + 1;
            }
        }
        for(var i = 0; i < rows; i++) {
            var row = generateProductsRow(4, productsObjects, 'forward');
            $(row).appendTo($(newRows));
        }
        $('#rows' + id).fadeOut(200, function () {
            $(this).replaceWith(newRows);
            $('#rows' + id).fadeIn(200);

        });
        productsObjects.lastDirection = 'forward';
    })

    $(titleCaption).text(caption)
        .addClass("dark-blue-text")
        .css("font-size", "24px")
        .css("margin-left", "30px")
        .appendTo(titleBar);
    $(scrollNav).css("margin-right", "30px").appendTo(titleBar);
    $(titleBar).appendTo($(container));
    productsObjects.firstProd = productsObjects.offset;

    for (i1 = 0; i1 < rowsCount; i1++) {
        var row = generateProductsRow(4, productsObjects, 'forward');
        $(row).appendTo($(rowsWrap));
    }
    productsObjects.lastProd = productsObjects.offset;
    productsObjects.lastDirection = 'forward';
    //$(container).attr('last-prod',productsObjects.offset);
    //$(container).attr('last-direction','forward');
    $(rowsWrap).appendTo($(container));
    return container;
}

function generateProductsRow(count, prodContData, direction) {
    var row = document.createElement('div');
    $(row).addClass("fl-row");
       // .addClass("fl-space");
        //.css("width", "1170px");
    if(direction == 'forward') {
        for(i2 = 0; i2 < count; i2++) {
            var box = generateProductDiv(prodContData.prods[prodContData.offset]);
            var offset = prodContData.offset;
            $(box).attr('num', offset);
            $(box).appendTo($(row));
            prodContData.offset++;
            if(prodContData.offset>=prodContData.prods.length) {
                prodContData.offset=0;
            }
        }
    } else if (direction == 'backward') {
        for(i2 = 0; i2 < count; i2++) {
            var box = generateProductDiv(prodContData.prods[prodContData.offset]);
            var offset = prodContData.offset;
            $(box).attr('num', offset);
            $(box).appendTo($(row));
            prodContData.offset--;
            if(prodContData.offset<0) {
                prodContData.offset=prodContData.prods.length-1;
            }
        }
    }

    return row;
}

function generatePromoProductsContainer() {
    var promoProductsContainer = document.createElement('div');
    $(promoProductsContainer).addClass("products-container")
        .addClass("fl-row")
        .addClass("fl-space");
    //TODO Доделать после БД
    var promo1 = generatePromoProductDiv("img/promo1.jpg", false, false, "black");
    var promo2 = generatePromoProductDiv("img/promo2.jpg", false, true, "black");
    var promo3 = generatePromoProductDiv("img/promo3.jpg", true, false, "white");
    $(promo1).appendTo($(promoProductsContainer));
    $(promo2).appendTo($(promoProductsContainer));
    $(promo3).appendTo($(promoProductsContainer));
    return promoProductsContainer;


}

function generatePromoProductDiv(bgimage, double, alignRight, color) { //TODO доделать после БД
    var promoProductBox = document.createElement('div');
    $(promoProductBox).addClass("fl-row");

    var productText = document.createElement('div');
    $(productText).addClass("fl-col")
        .addClass("italic")
        .css("height", "100%")
        .css("align-self", "flex-end")
        .css("font-size", "32px")
        .css("color", color)
        .appendTo($(promoProductBox));

    var firstLine = document.createElement('div');
    var secondLine = document.createElement('div');
    $(firstLine).text("название")
        .addClass("bold")
        .addClass("uppercase")
        .appendTo($(productText));
    $(secondLine).text("промо-товара")
        .addClass("light")
        .addClass("uppercase")
        .appendTo($(productText));
    if (double) {
        $(promoProductBox).addClass("promo-product-dbox");
    } else {
        $(promoProductBox).addClass("promo-product-box");
    }
    $(promoProductBox).css('background-size', 'cover')
        .css('background-image', 'url("./' + bgimage + '")');
    return promoProductBox;
}

function generateAboutShop() {
    var aboutShopContainer = document.createElement('div');
    ($(aboutShopContainer)).addClass("products-container")
        .css("height", "269px")
        .css("padding-top", "42px");
    var aboutText = document.createElement('div');
    var aboutCaption = document.createElement('div');
    var aboutContent = document.createElement('div');
    $(aboutCaption).addClass("bold")
        .addClass("dark-blue-text")
        .addClass("italic")
        .css("font-size", "24px")
        .appendTo(aboutText);
    $(aboutContent).css("height", "190px")
        .css("font-size", "14px")
        .css("line-height", "24px")
        .css("margin-top", "20px")
        .addClass("light")
        .addClass("gray-text")
        .css("overflow", "hidden")
        .appendTo(aboutText);
    $(aboutText).css("width", "510px")
        .css("margin-left", "500px")

        .appendTo($(aboutShopContainer));
    $.ajax({
        type: 'POST',
        url: 'utils.php',
        dataType: 'json',
        data: 'aboutblock',
        success: function (msg) {
            $(aboutCaption).text(msg.caption);
            $(aboutContent).html(msg.content);
            $(aboutShopContainer).css('background-image', 'url("./' + msg.bgimage + '")')
                .css('background-size', 'cover');
        }
    });
    return aboutShopContainer;
}

function generateFooter() {
    var footerContainer = document.createElement('div');
    $(footerContainer).addClass("dark-blue-bg")
        .addClass("fl-row")
        .addClass("fl-space")
        .addClass("products-container")
        .css("height", "59px");
    var textBlock = document.createElement('div');
    $(textBlock).html("Шаблон для экзаменационного задания<br>Разработан специально для «Всероссийской Школы Программирования»<br>http://bedev.ru/")
        .appendTo($(footerContainer));
    var upBlock = document.createElement('div');
    $(textBlock).addClass("fl-col")
        .css("font-size", "11px")
        .css("color", "#999999")
        .appendTo($(footerContainer));
    $(upBlock).addClass("fl-row")
        .css("cursor", "pointer")
        .css("margin-right", "30px")
        .css("font-size", "16px")
        .addClass("white-text")
        .addClass("light")
        .addClass("fl-vcenter")
        .click(function () {
            $("html, body").animate({scrollTop: 0}, "slow");
        })
        .appendTo($(footerContainer));
    var upText = document.createElement('div');
    var upImage = document.createElement('img');
    $(upText).text("Наверх")
        .appendTo($(upBlock));
    ;
    $(upImage).attr("src", "img/totop.png")
        .css("margin-left", "5px")
        .appendTo($(upBlock));


    return footerContainer;
}

function layoutAggregator() {
    //TODO подумать может чего хорошего придумаю
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
    username = generateInputField("Контактное лицо (ФИО)", 'username', false);
    userphone = generateInputField("Контактный телефон:", 'userphone', false);
    email = generateInputField("E-mail адрес:", 'email', false);
    $(username).appendTo($(layoutCol1));
    $(userphone).appendTo($(layoutCol1));
    $(email).appendTo($(layoutCol1));

    deliveryAddress = document.createElement('div');
    $(deliveryAddress).text("Адрес доставки").addClass('subtitle').appendTo($(layoutCol1));
    city = generateInputField("Город:", 'city', false);
    street = generateInputField("Улица:", 'street', false);
    home = generateDoubleInputField("Дом", 'home', false, "Квартира", 'flat', false);
    $(city).appendTo($(layoutCol1));
    $(street).appendTo($(layoutCol1));
    $(home).appendTo($(layoutCol1));

    changePasswod = document.createElement('div');
    $(changePasswod).text("Изменение пароля").addClass('subtitle').appendTo($(layoutCol1));
    passw = generateInputField("Введите новый пароль", 'passw', true);
    rpassw = generateInputField("Повторите новый пароль:", 'rpassw', true);
    $(passw).appendTo($(layoutCol1));
    $(rpassw).appendTo($(layoutCol1));

    saveSubmit = document.createElement('a');
    $(saveSubmit).text('Сохранить').addClass('redbutton').addClass('hidemodal').appendTo($(layoutCol1));
    $(saveSubmit).css("width", "134px");

    selfOrders = document.createElement('div');
    $(selfOrders).text("Ваши заказы").addClass('subtitle').appendTo($(layoutCol2));

    $(layout).addClass("layout").attr('id', 'accmodal').appendTo("body");
}

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

function generateInputField(caption, name, password) {
    var inputFieldContainer = document.createElement('div');
    var inputFieldCaption = document.createElement('label');
    var inputField = document.createElement('input');
    if (password == true) {
        $(inputField).attr('type', 'password');
    }
    $(inputFieldCaption).attr('for', name).text(caption).appendTo($(inputFieldContainer));
    $(inputField).attr('id', name).appendTo($(inputFieldContainer));
    $(inputFieldContainer).addClass('layout-input');
    return inputFieldContainer;
}

function generateDoubleInputField(cap1, name1, pass1, cap2, name2, pass2) {
    var inputDoubleFieldContainer = document.createElement('div');
    var inputField1 = generateInputField(cap1, name1, pass1);
    var inputField2 = generateInputField(cap2, name2, pass2);
    $(inputDoubleFieldContainer).addClass('fl-row').addClass('fl-space');
    $(inputField1).appendTo($(inputDoubleFieldContainer));
    $(inputField2).appendTo($(inputDoubleFieldContainer));
    return inputDoubleFieldContainer;
}


