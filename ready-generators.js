/**
 * Created by Anton on 18.09.2016.
 */
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
                .css('order',2)
                .css('height','420px')
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
            $short_desc = msg.product.details.desc.split(/\.|\!/);
            $(desc).text($short_desc[0])
                .addClass("white-text")
                .css("font-size", "16px")
                .css("line-height", "17px")
                .css("margin-top",'30px')
                .appendTo($(promoProductArea));
            $(button).text("Посмотреть +")
                .addClass("bt-promo-view")
                .on('click', function () {
                    prepareFlat();
                    prodcutFlat = generateProductFlat(msg.product);
                    $(prodcutFlat).appendTo($("#content"));
                    $.ajax({
                        type: 'POST',
                        url: 'utils.php',
                        data: 'clickCounter&productId=' + msg.product.id,
                        dataType: 'text'
                    });
                })
                .appendTo($(promoProductArea));
            $(promoProductArea).appendTo($(mainPromo));

        }
    });
    return mainPromo;
}

function generateSignMenu() {
    signBar = document.createElement('div');
    $(signBar).addClass('sign-bar-area')
        .addClass('white-bg')
        .addClass('fl-row')
        .addClass("fl-vcenter")
        .attr('id', 'signbar');
    return signBar;
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
    $(rowsWrap).appendTo($(container));
    return container;
}

function generateProductsRow(count, prodContData, direction) {
    var row = document.createElement('div');
    $(row).addClass("fl-row");
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
        .css('margin-left','20px').css('margin-top','10px').appendTo($(footerContainer));
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