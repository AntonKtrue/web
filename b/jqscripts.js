/**
 * 
 */
Number.prototype.formatMoney = function(c, d, t){
	var n = this,
		c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$(function() {
	mainFrame = generateMainFrame();
	$(mainFrame).appendTo("#content");
	$('.menu-item').on(
			"click",
			function() {
				$('#workspace').empty();
				$('.content-caption').empty();
				//$('.content-caption').text($(this).next('.uppercase').context.innerText);
				var netxtObj = $(this).children('.uppercase');
				$('.content-caption').text($(netxtObj[0]).text());
				contentBuild = getContent($(this).attr('id'));
				$(contentBuild).appendTo('#workspace');

			});
});

function getElement(type, classes) {
	var element = document.createElement(type);
	if(classes) $(element).addClass(classes);
	return element;
}

function getDiv(classes) {
	var div = getElement('div',classes);
	return div;
}
function getOl(classes) {
	var ol = getElement('ol',classes);
	return ol;
}
function getLi(classes) {
	var li = getElement('li',classes);
	return li;
}

function prepareData(prData) {
	return encodeURIComponent(JSON.stringify(prData))
}

function generateMainFrame() {
	mainFrameContainer = document.createElement('div');
	$(mainFrameContainer).addClass('main-frame shadow').addClass('fl-row').css('margin-bottom','30px');

	leftMenuCol = document.createElement('div');
	$(leftMenuCol).css('min-height','996px').addClass('fl-col').addClass('gray-blue-bg')
		.appendTo(mainFrameContainer);
	leftMenuColSpacer = getDiv('fl-col fl-space');
	$(leftMenuColSpacer).css('height','100%').css('order','2').appendTo(leftMenuCol);

	rightContent = document.createElement('div');
	$(rightContent).addClass('fl-col').attr('id', 'rightContent').addClass(
			'gray-bg').css('width', '780px').appendTo($(mainFrameContainer));
	rightCaption = document.createElement('div');
	$(rightCaption).addClass('content-caption').appendTo($(rightContent));
	workspace = document.createElement('div');
	$(workspace).addClass("fl-col").attr('id', 'workspace').appendTo(
			$(rightContent));
	mainLogo = generateMainLogo();
	$(mainLogo).css('order','1').appendTo($(leftMenuCol));

	menuItems = generateMenuItems();
	$(menuItems).appendTo($(leftMenuColSpacer));

	var adminData = $.ajax({
		url: 'content.php',
		dataType: 'json',
		async: false,
		data: "admin",
		method: 'POST'
	}).responseJSON;
	var loginBox = getDiv('fl-col fl-hcenter fl-vcenter');
	$(loginBox).appendTo(leftMenuColSpacer).css('font-size','16px');
	var userName = getDiv()
	$(userName).text(adminData.login).appendTo(loginBox).css('color','#fff');
	var logOutButton = document.createElement('a');
	$(logOutButton).appendTo(loginBox).css('color','#2ecc71').css('margin-bottom','20px').attr('href','#').text('выйти')
		.on('click', function() {
			$.ajax({
				type: 'POST',
				url: '../login.php',
				dataType: 'text',
				data: 'logout',
				success: function () {
					window.location = '../index.php';
				}
			});
		});
	return mainFrameContainer;
}

function generateMenuItems() {
	var menuItemsContainer = getDiv('fl-col');

	var ordersItem = generateMenuItem("заказы", "orders", "../img/b_orders.png",
			"../img/b_orders_a.png");
	$(ordersItem).appendTo($(menuItemsContainer));
	var usersItem = generateMenuItem("Пользователи", "users", "../img/b_users.png",
			"../img/b_users_a.png");
	$(usersItem).appendTo($(menuItemsContainer));
	var productsItem = generateMenuItem("товары", "products",
			"../img/b_products.png", "../img/b_products_a.png");
	$(productsItem).appendTo($(menuItemsContainer));
	var categoriesItem = generateMenuItem("категории", "categories",
			"../img/b_categories.png", "../img/b_categories_a.png");
	$(categoriesItem).appendTo($(menuItemsContainer));
	var syslogItem = generateMenuItem("журнал событий","systemlog",
		"../img/b_syslog.png","../img/b_syslog_a.png");
	$(syslogItem).appendTo(menuItemsContainer);
	return menuItemsContainer;
}

function generateMenuItem(caption, name, picbase, picover) {
	var itemContainer = document.createElement('div');
	var itemPicture = document.createElement('img');

	$(itemContainer).addClass('fl-row').addClass('fl-vcenter').addClass(
			'menu-item').attr('id', name);
	itemPicArea = document.createElement('div');
	$(itemPicArea).addClass('menu-item-pic-area').appendTo($(itemContainer))
	$(itemPicture).attr('src', picbase).appendTo($(itemPicArea));
	var itemText = document.createElement('div');
	$(itemText).addClass('uppercase').addClass('gray-green-text').css(
			'font-size', '14px').css('margin-left', '10px').text(caption)
			.appendTo($(itemContainer));
	$(itemContainer).hover(function() {
		$(itemPicture).attr('src', picover);
		$(itemText).removeClass('gray-green-text').addClass('white-text');
		$(this).addClass('darg-gray-blue-bg');
	}, function() {
		$(itemPicture).attr('src', picbase);
		$(itemText).removeClass('white-text').addClass('gray-green-text');
		$(this).removeClass('darg-gray-blue-bg');
	});
	return itemContainer;
}

function generateMainLogo() {
	mainLogo = document.createElement('div');
	$(mainLogo).addClass('green-bg').addClass('main-logo-area').addClass(
			'white-text').addClass('fl-row').addClass('fl-vcenter').css(
			'cursor', 'pointer').click(function() {
		window.location = 'index.php';
	});
	logoText = document.createElement('div');
	$(logoText).appendTo($(mainLogo)).addClass('fl-col').addClass('fl-vcenter')
			.css('font-family', 'Supermolot').css('width', '100%');
	
	super_text = document.createElement('span');
	$(super_text).appendTo($(logoText)).text("super").addClass('uppercase')
			.css("font-size", "33px").css("line-height", "33px");
	shop_text = document.createElement('span');
	$(shop_text).appendTo($(logoText)).text("shop").addClass('uppercase')
			.addClass('bold').css("font-size", "41px").css("line-height",
					"33px");
	return mainLogo;
}

function buildTableRow() {
	var tableRowContainer = document.createElement('div');
	var purpleLine = document.createElement('div');
	$(purpleLine).addClass('purple-line').appendTo($(tableRowContainer));
	$(tableRowContainer).addClass('fl-row').addClass('fl-vcenter').addClass(
			'table-row').addClass('white-bg').hover(
			function() {
				$(this).children('.purple-line').css('background-color',
						'#8e44ad');
				$(this).css('background-color', '#f6f8fc');
			},
			function() {
				$(this).children('.purple-line').css('background-color',
						'transparent');
				$(this).css('background-color', '#fff');
			});
	return tableRowContainer;
}

function buildOrdersData(orders) {
	var container = getDiv('orders-table');
	var caption = getDiv();
	var captionNum = "<div>номер заказа</div>";
	var captionStat = "<div>статус</div>";
	var captionSum = "<div>сумма</div>";
	var captionTime = "<div>время заказа</div>";
	$(captionNum).width('196px').css('margin-left','22px').appendTo(caption);
	$(captionStat).width('121px').appendTo(caption);
	$(captionSum).width('100px').appendTo(caption);
	$(captionTime).appendTo(caption);
	$(caption).appendTo(container);

	$.each(orders.orders, function(i, item){
		//var orderRow = buildTableRow();
		var orderRow = getDiv('orders');
		$(orderRow).appendTo(container);
		var cell1 = getDiv('cell1');
		var cell2 = getDiv('cell2');
		var cell3 = getDiv('cell3');
		var cell4 = getDiv('cell4');
		var cell5 = getDiv('cell5');
		$(cell1).attr('id',"c"+i+"_1").appendTo(orderRow);
		$(cell2).attr('id',"c"+i+"_2").appendTo(orderRow);
		$(cell3).attr('id',"c"+i+"_3").appendTo(orderRow);
		$(cell4).attr('id',"c"+i+"_4").appendTo(orderRow);
		$(cell5).attr('id',"c"+i+"_5").appendTo(orderRow);

		var num = "<span>№"+item.id+"</span>&nbsp;<span>от</span>&nbsp;<span>"+item.login+"</span>";
		$(num).appendTo(cell1);

		var ordst= generateStatusBlock(item);
		$(ordst).appendTo(cell2);

		var orderSum = getDiv();
		$(orderSum).text(item.summa).appendTo(cell3);
		var parseDate = item.order_date.split(" ");
		var date = parseDate[0].split("-");
		var time = parseDate[1].split(":");

		var orderDate = "<span>" + date[2] + "." + date[1] + "." + date[0] + " в " + time[0] + ":" + time[1] + "</span>";
		$(orderDate).appendTo(cell4);

		var orderView = document.createElement('a');
		$(orderView).attr('href','#').text('просмотр').appendTo(cell5).on('click', function(){

			$('#workspace').empty();
			$('.content-caption').empty();

			var ztx = getDiv();
			$(ztx).html("заказ &nbsp").appendTo($('.content-caption'));;
			var znum = getDiv();
			$(znum).html('№'+item.id + "&nbsp").appendTo($('.content-caption')).css('color','#3498db');
			var zst = getVisibleBlock(item.status);
			$(zst).removeClass('cur-status').appendTo($('.content-caption')).addClass('order-status')
				.text("(" + $(zst).text() + ")");

			content = buildOrderView(item.id);
			$(content).appendTo($('#workspace'));

		});

	});
	var lastRow = getDiv();
	$(lastRow).appendTo(container);
	return container;
}
function prepareData(prData) {
	return encodeURIComponent(JSON.stringify(prData))
}

function buildOrderView(orderId) {
	var container = getDiv();
	var orders = getDiv('orders-table');
	$(orders).appendTo(container);
	var ordersCaption = getDiv();
	$(ordersCaption).text('содержимое заказа').appendTo(orders);
	var prData = {
		id: orderId
	};
	var orderData = $.ajax({
		url: "content.php",
		type: "POST",
		async: false,
		dataType: "json",
		data: "order=" + prepareData(prData)
	}).responseJSON;

	$.each(orderData.products, function(i, item) {
		var orderRow = getDiv('order');
		$(orderRow).appendTo(container);
		var cell1 = getDiv('cell1');
		var cell2 = getDiv('cell2');
		var cell3 = getDiv('cell3');
		var cell4 = getDiv('cell4');
		var cell5 = getDiv('cell5');
		$(cell1).appendTo(orderRow);
		if(item.variant == 'S') {
			$(cell1).text(item.name);
		} else {
			$(cell1).html(item.name + "<div>" + item.variantName + "</div>");
		}
		$(cell2).text(parseInt(item.product_cost).formatMoney(0,","," ") + "руб.").appendTo(orderRow);
		$(cell3).appendTo(orderRow);
		var countBox = getDiv();
		$(countBox).appendTo(cell3).text(item.product_count);
		$(cell4).appendTo(orderRow).text(parseInt(item.summa).formatMoney(0,","," ") + "руб.");
		$(cell5).appendTo(orderRow);
		var deletePoint = document.createElement('a');
		$(deletePoint).text('Удалить из списка').attr('href','#').on('click', function() {
			var prData = {
				target: 'order',
				operation: 'delete_product',
				id: orderId,
				product: item.product_id,
				variant: item.variant
			}
			var result = false;
			$.ajax({
				url: 'crud.php',
				method: 'POST',
				async: false,
				dataType: 'json',
				data: "data=" + prepareData(prData),
				success: function (msg) {
					if(msg.result == "success") {
						result = true;
						$('#orderItogSum').text(parseInt(msg.order.summa).formatMoney(0,",",' '));
					}
				}
			});
			if(result) {
				$(this).closest('.order').fadeOut(100);

			}
		}).appendTo(cell5);
		$(orderRow).appendTo(orders);
	});
	var lastRow = getDiv('fl-row');
	$(lastRow).appendTo(orders).css('justify-content','flex-end').css('align-items','center');
	var itogSumTextBox = getDiv('fl-col');
	var itogSumTextUp = getDiv();
	$(itogSumTextUp).text("итоговая").appendTo(itogSumTextBox);
	var itogSumTextDown = getDiv();
	$(itogSumTextDown).text("сумма").appendTo(itogSumTextBox);
	$(itogSumTextBox).css('align-items','flex-end')
		.css('font-size','16px').css('font-weight','bold')
		.css('color','#3498db').appendTo(lastRow);
	var itogSumBox = getDiv('itog-sum-box');
	var sum = getDiv();
	var rub = getDiv();
	$(sum).attr('id','orderItogSum').text(parseInt(orderData.summa).formatMoney(0,',',' ')).appendTo(itogSumBox);
	$(rub).text('руб.').appendTo(itogSumBox);
	$(itogSumBox).appendTo(lastRow);

	var orderInfo = generateOrderInfo(orderData);
	$(orderInfo).css('margin-top','20px').appendTo(container);




	return container;
}

function getVisibleBlock(status) {
	var visibleBlock = getDiv('cur-status');
	switch (status) {
		case "1": $(visibleBlock).addClass('accept').text("принят");
			break;
		case "2": $(visibleBlock).addClass('sent').text("отгружен");
			break;
		case "3": $(visibleBlock).addClass('courier').text("у курьера");
			break;
		case "4": $(visibleBlock).addClass('delivered').text("доставлен");
			break;
		case "5": $(visibleBlock).addClass('cancel').text("отмена");
			break;
	}

	return visibleBlock;
}

function generateStatusBlock(order) {
	var container = getDiv('set-status-container');
	var visibleBlock = getVisibleBlock(order.status)
	$(visibleBlock).appendTo(container).on('click', function () {
		$(this).siblings('.sel-status').fadeIn(250);
	});;
	var hiddenMenu = getDiv('sel-status');
	var statusList = document.createElement('ul');
	$(statusList).appendTo(hiddenMenu);
	var menuAccept = document.createElement('li');
	$(menuAccept).attr('status','1').addClass('accept').appendTo(statusList);
	var menuSent = document.createElement('li');
	$(menuSent).attr('status','2').addClass('sent').appendTo(statusList);
	var menuCourier = document.createElement('li');
	$(menuCourier).attr('status','3').addClass('courier').appendTo(statusList);
	var menuDelivered = document.createElement('li');
	$(menuDelivered).attr('status','4').addClass('delivered').appendTo(statusList);
	var menuCancel = document.createElement('li');
	$(menuCancel).attr('status','5').addClass('cancel').appendTo(statusList);
	$(menuAccept).text('принят');
	$(menuSent).text('отгружен');
	$(menuCourier).text('у курьера');
	$(menuDelivered).text('доставлен');
	$(menuCancel).text('отмена');
	$(hiddenMenu).on('mouseleave',function() {
		$(this).fadeOut(100);
	}).on('click','li', function () {
		var prData = {
			target: 'order',
			operation: 'update',
			id: order.id,
			field: 'status',
			value: $(this).attr('status')
		}
		var result = false;
		$.ajax({
			type : 'POST',
			url : 'crud.php',
			async: false,
			dataType : 'json',
			data : 'data='+ prepareData(prData),
			success : function(msg) {
				if (msg.result == "success") {
					result = true;
				} else {
					alert("Ошибка!");
				}

			}
		});
		if(result) {
			var newStatus = getVisibleBlock(prData.value);
			$(newStatus).on('click', function () {
				$(this).siblings('.sel-status').fadeIn(250);
			});
			$(this).closest('.set-status-container').children('.cur-status').replaceWith(newStatus);
		}
		$(this).closest('.sel-status').fadeOut(100);
	}).appendTo(container);
	return container;
}

function buildUsersTable(msg) {
	table = document.createElement('div');
	$(table).addClass('fl-col').addClass('white-bg').addClass('table');
	tableCaption = document.createElement('div');
	$(tableCaption).addClass('col-caption').appendTo($(table));
	col1 = document.createElement('div');
	col1text = document.createElement('span');
	$(col1text).text('Имя').css('margin-left', '23px').appendTo($(col1));
	$(col1).css('width', '146px').appendTo($(tableCaption));
	col2 = document.createElement('div');
	$(col2).addClass('fl-row').addClass('fl-hcenter').css('width', '220px')
			.appendTo($(tableCaption));
	col2text = document.createElement('span');
	$(col2text).text('E-mail').appendTo($(col2));
	col3 = document.createElement('div');
	$(col3).addClass('fl-row').addClass('fl-hcenter').css('width', '200px')
			.appendTo($(tableCaption));
	col3text = document.createElement('span');
	$(col3text).text('Телефон').appendTo($(col3));
	if (msg != null) {
		if (msg.content != null) {
			$.each(msg.content, function(i, item) {
				var tableRow = buildTableRow();
				var tableRowUserName = document.createElement('div');
				$(tableRowUserName).css('margin-left', '25px').addClass(
						'row-item-name').css('width', '118px').text(item.userData.name)
						.appendTo($(tableRow));
				var tableRowEmailBox = document.createElement('div');
				$(tableRowEmailBox).addClass('fl-row')
						.addClass('fl-vcenter').addClass('fl-hcenter').css(
								'width', '220px').appendTo($(tableRow));
				var tableEmail = document.createElement('span');
				$(tableEmail).text( item.login ).css(
						'font-size', '16px').css('color', '#636363').appendTo(
						$(tableRowEmailBox));

				var tableRowTelBox = document.createElement('div');
				$(tableRowTelBox).addClass('fl-row').addClass(
						'fl-hcenter').css('width', '200px').appendTo($(tableRow));
				var tableTel = document.createElement('div');
				$(tableTel).css('color','#636363').css('font-size','16px')
							.text(item.userData.tel).appendTo($(tableRowTelBox));

				$(tableRow).appendTo($(table));

				var tableRowProdView = document.createElement('span');
				$(tableRowProdView).addClass('row-item-view').css('margin-left', '60px').text('просмотр')
					.css('cursor','pointer').appendTo($(tableRow))
					.on('click',function() {
						$('#workspace').empty();
						$('.content-caption').empty();
						$('.content-caption').text('просмотр пользователя')
						var viewUser = generateViewUser();
						$(viewUser).appendTo($('#workspace'));
						var userData = $.ajax({
							type: 'POST',
							url: "content.php",
							async: false,
							dataType: "json",
							data: "getUser=" + item.id
						}).responseJSON;
						$("#infoName").text(userData.userData.fio);
						$("#infoTel").text(userData.userData.tel);
						$("#infoEmail").text(userData.login);
						$("#infoCity").text(userData.userData.city);
						$("#infoStreet").text(userData.userData.street);
						$("#infoHome").text(userData.userData.home);
						$("#infoFlat").text(userData.userData.flat);

						var ordersView = generateOrdersView(userData);
						$(ordersView).css('margin-top','16px').appendTo($('#workspace'));
						var delUserLine = getDiv('fl-row');
						$(delUserLine).appendTo($('#workspace')).css('margin-right','20px')
							.css('justify-content','flex-end');
						var delUser = document.createElement('a');
						$(delUser).appendTo(delUserLine).text('Удалить пользователя')
							.css('color','#ad0000').attr('href','#').on('click',function(){
							var prData = {
								target: 'users',
								operation: 'remove',
								id: userData.id
							}
							$.ajax({
								type : 'POST',
								url : 'crud.php',
								async: false,
								dataType : 'json',
								data : 'data='+ prepareData(prData),
								success : function(msg) {
									if (msg.result == "success") {
										$(usersItem).trigger('click');
									} else {
										alert("Ошибка!");
									}
								}
							});
						})

					});

			});
		}
	}

	lastRow = document.createElement('div');
	$(lastRow).css('margin', '1px 1px 1px 1px').css('height', '25px').addClass(
			'white-bg').appendTo($(table));
	
	return table;
}

function generateOrdersView(userData) {
	var container = getDiv('orders-info');
	var caption = getDiv();
	$(caption).text("история заказов").appendTo(container);
	$.each(userData.orders, function (i, item) {
		var orderRow = buildTableRow();
		$(orderRow).appendTo(container);
		var ordNum = document.createElement('span');
		$(ordNum).text('№' + item.id).appendTo(orderRow);
		var ordSum = document.createElement('span');
		$(ordSum).text(parseInt(item.summa).formatMoney(0,","," ")  + "руб.").appendTo(orderRow);


	});
	var finalLine = getDiv('fl-row');
	$(finalLine).appendTo(container);
	var itogoSumText = getDiv('fl-col');
	var itogoSumTextUp = "<span>итоговая</span>";
	var itogoSumTextDown = "<span>сумма заказов</span>";
	$(itogoSumTextUp).appendTo(itogoSumText);
	$(itogoSumTextDown).appendTo(itogoSumText);
	$(itogoSumText).css('margin-right','15px').appendTo(finalLine);
	var itogoSum = getDiv();
	var itogoSumSum = "<span>" + parseInt(userData.itog).formatMoney(0,","," ") + "</span>";
	var itogoSumRub = "<span>руб.</span>";
	$(itogoSum).appendTo(finalLine);
	$(itogoSumSum).appendTo(itogoSum);
	$(itogoSumRub).appendTo(itogoSum);
	return container;
}
function generateOrderInfo(orderInfo) {
	var container = getDiv('fl-col');
	var userInfo = getDiv('user-info');
	var ordersInfo = getDiv('fl-col');
	var deleteUser = getDiv();
	$(userInfo).appendTo(container);
	var userInfoCaption = getDiv();
	$(userInfoCaption).text('информация о зказе').appendTo(userInfo);
	var userInfoDetails = getDiv();
	$(userInfoDetails).appendTo(userInfo);
	var userInfoDetailsCol1 = getDiv();
	$(userInfoDetailsCol1).appendTo(userInfoDetails);
	var userInfoDetailsCol2 = getDiv();
	$(userInfoDetailsCol2).width('211px').appendTo(userInfoDetails);
	var userInfoDetailsCol3 = getDiv();
	$(userInfoDetailsCol3).appendTo(userInfoDetails);

	var userInfoName = generateLabelField("Контактное лицо (ФИО):", "infoName");
	var userInfoTel = generateLabelField("Контактный телефон:","infoTel");
	var userInfoEmail = generateLabelField("E-mail","infoEmail");
	var userInfoCity = generateLabelField("Город:","infoCity");
	var userInfoStreet = generateLabelField("Улица:","infoStreet");
	var userInfoHome = generateLabelField("Дом:", "infoHome");
	var userInfoFlat = generateLabelField("Квартира", "infoFlat");

	var orderInfoMethod = generateLabelField("Способ доставки:", "infoMethod");
	$(orderInfoMethod).appendTo(userInfoDetailsCol3);
	var orderComment = generateLabelField("Комментарий к заказу:","infoComment");
	$(orderComment).attr('id','orderComment').appendTo(userInfo);

	$(userInfoName).children('div:last-child').text(orderInfo.userData.fio);
	$(userInfoTel).children('div:last-child').text(orderInfo.userData.tel);
	$(userInfoEmail).children('div:last-child').text(orderInfo.login);
	$(userInfoCity).children('div:last-child').width('206px').text(orderInfo.details.infoCity);
	$(userInfoStreet).children('div:last-child').width('206px').text(orderInfo.details.infoStreet);
	$(userInfoHome).children('div:last-child').text(orderInfo.details.infoHome);
	$(userInfoFlat).children('div:last-child').text(orderInfo.details.infoFlat);
	$(orderComment).children('div:last-child').text(orderInfo.details.infoComment);
	$(orderInfoMethod).children('div:last-child').html(getMethod(orderInfo.details.infoMethod))
		.css('font-size','16px');

	$(userInfoName).appendTo(userInfoDetailsCol1);
	$(userInfoTel).appendTo(userInfoDetailsCol1);
	$(userInfoEmail).appendTo(userInfoDetailsCol1);
	$(userInfoCity).appendTo(userInfoDetailsCol2);
	$(userInfoStreet).appendTo(userInfoDetailsCol2);
	var homeBox = getDiv('fl-row');
	$(homeBox).appendTo(userInfoDetailsCol2);
	$(userInfoHome).width('75px').appendTo(homeBox);
	$(userInfoFlat).width('100px').appendTo(homeBox);

	var cancelBox = getDiv('fl-row');
	$(cancelBox).css('justify-content','flex-end').appendTo(container);
	var canelBoxText = document.createElement('a');
	$(canelBoxText).css({'color':'#ad0000','font-weight':'lighter','font-size':'17.8px',
		'margin-right':'32px', 'margin-top':'29px'})
		.attr('href','#').text('Отменить заказ').on('click', function() {
		var prData = {
			target: 'order',
			operation: 'remove',
			id: orderInfo.id
		}

		$.ajax({
			type : 'POST',
			url : 'crud.php',
			async: false,
			dataType : 'json',
			data : 'data='+ prepareData(prData),
			success : function() {
				$(ordersItem).trigger('click');
			} })
		}).appendTo(cancelBox);
	return container;
}

function getMethod(method) {
	switch(method) {
		case "courier": return "Курьерская доставка<br> с оплатой при получении";
			break;
		case "rpost": return "Почта России<br> с наложенным платежом";
			break;
		case "qpost": return "Доставка через терминалы<br> QIWI Post";
			break;
	}

}

function generateViewUser() {
	var container = getDiv('fl-col');
	var userInfo = getDiv('user-info');
	var ordersInfo = getDiv('fl-col');
	var deleteUser = getDiv();
	$(userInfo).appendTo(container);
		var userInfoCaption = getDiv();
		$(userInfoCaption).text('информация о пользователе').appendTo(userInfo);
		var userInfoDetails = getDiv();
		$(userInfoDetails).appendTo(userInfo);
		var userInfoDetailsCol1 = getDiv();
		$(userInfoDetailsCol1).appendTo(userInfoDetails);
		var userInfoDetailsCol2 = getDiv();
		$(userInfoDetailsCol2).appendTo(userInfoDetails);

	var userInfoName = generateLabelField("Контактное лицо (ФИО):", "infoName");
	var userInfoTel = generateLabelField("Контактный телефон:","infoTel");
	var userInfoEmail = generateLabelField("E-mail","infoEmail");
	var userInfoCity = generateLabelField("Город:","infoCity");
	var userInfoStreet = generateLabelField("Улица:","infoStreet");
	var userInfoHome = generateLabelField("Дом:", "infoHome");
	var userInfoFlat = generateLabelField("Квартира", "infoFlat");


	$(userInfoName).appendTo(userInfoDetailsCol1);
	$(userInfoTel).appendTo(userInfoDetailsCol1);
	$(userInfoEmail).appendTo(userInfoDetailsCol1);
	$(userInfoCity).appendTo(userInfoDetailsCol2);
	$(userInfoStreet).appendTo(userInfoDetailsCol2);
	var homeBox = getDiv('fl-row');
	$(homeBox).appendTo(userInfoDetailsCol2);
	$(userInfoHome).width('75px').appendTo(homeBox);
	$(userInfoFlat).width('100px').appendTo(homeBox);

	return container;

}

function generateLabelField(text, name) {
	var container = getDiv('fl-col');
	var caption = getDiv('fl-row');
	var content = getDiv('fl-row');
	$(caption).text(text).appendTo(container);
	$(content).attr('id',name).appendTo(container);
	return container;
}

function buildProdTable(msg) {
	table = document.createElement('div');
	$(table).addClass('fl-col').addClass('white-bg').addClass('table').css('order', '2')
		;
	tableCaption = document.createElement('div');
	$(tableCaption).addClass('col-caption').appendTo($(table));
	col1 = document.createElement('div');
	col1text = document.createElement('span');
	$(col1text).text('Название товара').css('margin-left', '25px').appendTo(
			$(col1));
	$(col1).css('width', '269px').appendTo($(tableCaption));
	col2 = document.createElement('div');
	$(col2).addClass('fl-row').addClass('fl-hcenter').css('width', '200px')
			.appendTo($(tableCaption));
	col2text = document.createElement('span');
	$(col2text).text('Стоимость').appendTo($(col2));
	if (msg != null) {
		if (msg.content != null) {
			$.each(msg.content, function(i, item) {
				var tableRow = buildTableRow();
				var tableRowProdName = document.createElement('div');
				$(tableRowProdName).css('margin-left', '25px').addClass(
						'row-item-name').css('width', '240px').text(item.name)
						.appendTo($(tableRow));
				var tableRowProdCostBox = document.createElement('div');
				$(tableRowProdCostBox).addClass('fl-row')
						.addClass('fl-vcenter').addClass('fl-hcenter').css(
								'width', '200px').appendTo($(tableRow));
				var tableRowProdCost = document.createElement('span');
				if(item.details!=null && item.details.currentCost!=null) {
					$(tableRowProdCost).text(item.details.currentCost + "руб.").css(
						'font-size', '16px').css('color', '#636363').appendTo(
						$(tableRowProdCostBox));
				}
				var tableRowProdCountBox = document.createElement('div');
				$(tableRowProdCountBox).addClass('fl-row').addClass(
						'fl-hcenter').css('width', '120px').css('margin-left',
						'50px').appendTo($(tableRow));

				$(tableRow).appendTo($(table));

				var tableRowProdView = document.createElement('span');
				$(tableRowProdView).addClass('row-item-view').css('margin-left', '10px').text('просмотр')
					.css('cursor','pointer')
						.on("click", function() {
							$("#workspace").empty();
							productInfo = buildProductInfo(item.id);
							$(productInfo).appendTo($("#workspace"));
						})
						.appendTo($(tableRow));

			});
		}
	}
	lastRow = document.createElement('div');
	$(lastRow).css('margin', '1px 1px 1px 1px').css('height', '25px').addClass(
			'white-bg').appendTo($(table));
	return table;
}

function generateInputField(caption, name, text) {
	var inputFieldContainer = document.createElement('div');
	var inputFieldCaption = document.createElement('label');
	if(text) {
		var inputField = document.createElement('textarea');
	} else {
		var inputField = document.createElement('input');
	}	
	if(password==true) {
		$(inputField).attr('type','password');
	}
	$(inputFieldCaption).attr('for',name).text(caption).appendTo($(inputFieldContainer));
	$(inputField).attr('id',name).appendTo($(inputFieldContainer));
	$(inputFieldContainer).addClass('layout-input');
	return inputFieldContainer;	
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
		//if(data.checked) $(radioInput).attr('checked','checked');
		var radioLabel = document.createElement('label');
		$(radioLabel).attr('for',item.value).text(item.text).css('color','#0d0b0b')
				.css('font-size','18px').css('font-weight','lighter').appendTo($(radioButton));
		
	});
	return radioBlock;
}

function generateFotoBlock(image, id) {
	var fotoContainer = document.createElement('div');
	$(fotoContainer).addClass('fl-col').addClass('fl-vcenter').css('margin-right','20px');
	
	var fotoDiv = document.createElement('div');
	$(fotoDiv).addClass('foto-div').appendTo($(fotoContainer));
	if(image!=null) {
		$(fotoDiv).css("background-position","center")
			.css('background-image','url("../img/products/'+ id + "/" + image +'")');
		
		var fotoChange = document.createElement('a');
		var fotoDelete = document.createElement('a');
		$(fotoChange).text("Изменить").css('color','#099d48').attr('href','#')
				.css('color','16px').css('font-weight','lighter')
				.appendTo($(fotoContainer));
		$(fotoDelete).text("Удалить").css('color','#ad0000').attr('href','#')
				.css('color','16px').css('font-weight','lighter')
			.on('click', function (e) {
				e.preventDefault();
				var prData = {
					target: 'fotos',
					operation: 'remove',
					id: id,
					image: image
				}
				var result = false;
				$.ajax({
					type : 'POST',
					url : 'crud.php',
					async: false,
					dataType : 'json',
					data : 'data='+ prepareData(prData),
					success : function(msg) {
						if (msg.result == "success") {
							result = true;
						} else {
							alert("Ошибка!");
						}
					}
				});
				if(result) $(this).parent().hide(200);

			})
				.appendTo($(fotoContainer));
	} else {
		$(fotoContainer).css('order',1);
		var notLoad = document.createElement('span');
		$(notLoad).text("не загружено").css('color','#9d9d9d')
				.css('color','16px').css('font-weight','lighter')
				.appendTo($(fotoDiv));
		var fotoLoad = document.createElement('a');
		var fotoInput = document.createElement('input');
		$(fotoInput).css("width","50px").css('visibility','hidden').attr('type','file').attr('id','openfile')
					.attr('accept',".jpg, .png, .jpeg, .gif").attr('multiple','')
					.change(function() {
						var file = this.files;
						var formData = new FormData();
						$.each(file, function(i, item) {
							formData.append('file[]', item);
						});
						formData.append('productId', id);
					    $.ajax({
					    	url : 'upload.php',
					    	type : 'POST',
					    	data : formData,
					    	dataType : 'json',
					    	processData: false,
					    	contentType: false,
					    	success : function(msg) {

					    		if(msg.result == null) {
					    			$.each(msg, function(i, item) {
										var productImage = generateFotoBlock(item.image, id);
										$(productImage).appendTo(prodFotoContent);
									})

					    		} else {
					    			alert("ошибка!" + msg.message);
					    		}
					    		
					    	}
					    })
					})
					.appendTo($(fotoContainer));
		$(fotoLoad).text("Загрузить").css('color','#8e44ad').attr('href','#')
				.css('color','16px').css('font-weight','lighter')
				.on('click', function(e){
					e.preventDefault();
					$("#openfile").trigger('click');
				})
				.appendTo($(fotoContainer));
	}	
	return fotoContainer;			
}

function buildProductInfo(productId) {
	$('.content-caption').empty();
	$('.content-caption').text("просмотр товара");	
	var infoData;
	$.ajax({
		type : 'POST',
		async: false,
		url : 'content.php',
		dataType : 'json',
		data : 'product=' + productId,
		success: function(msg) {
			infoData = msg;			
		}
	});
	
	container = document.createElement('div');
	$(container).addClass('fl-col');
	
	prodInfo = document.createElement('div');
	$(prodInfo).addClass('fl-col').addClass('table').css('margin-bottom','16px').appendTo($(container));
		prodInfoCaption = document.createElement('div');
		$(prodInfoCaption).addClass('fl-vcenter').addClass('col-caption').appendTo($(prodInfo));
		prodInfoCaptionText = document.createElement('div');
		$(prodInfoCaptionText).css('margin-left','22px')
				.text('информация о товаре').appendTo($(prodInfoCaption));
		
		prodInfoContent = document.createElement('div');
		$(prodInfoContent).addClass('col-content').appendTo($(prodInfo));
			infoCol1 = document.createElement('div');
			$(infoCol1).addClass('fl-col').css('width','350px').appendTo($(prodInfoContent));
			infoCol2 = document.createElement('div');
			$(infoCol2).addClass('fl-col').css('width','350px').appendTo($(prodInfoContent));
				productName = generateInputField("Название товара",'productName',false);				
				$(productName).appendTo($(infoCol1));
				$(productName).children("input").val(infoData.name);
				productDesc = generateInputField("Описание товара","productDesc",true);
				$(productDesc).appendTo($(infoCol1));
				if(infoData.details != null && infoData.details.desc != null) {
					$(productDesc).children("textarea").val(infoData.details.desc);
				}
				
				productSpec = document.createElement('div');
				$(productSpec).addClass("fl-col").css('margin-left','70px').appendTo($(infoCol2));
				productBadgeCaption = document.createElement('div');
				$(productBadgeCaption).text("Бэйджик").css('color','#999999').css('font-size','14px')
								.css('font-weight','lighter').appendTo($(productSpec));
				var radioData = {
						name:"badge",
						content: [{
							value: "none",
							text: "Отсутсвует"
						}, {
							value: "new",
							text: "NEW"
						}, {
							value: "hot",
							text: "HOT"
						}, {
							value: "sale",
							text: "SALE"
						}]
				};
				radio = generateRadioInput(radioData);
				$(radio).appendTo($(productSpec));
				if (infoData.details==null || infoData.details.badge==null || infoData.details.badge=="none") {
					$(radio).children("#" + radioData.name + "_none").children("input").attr("checked","checked");					
				} else if(infoData.details.badge=="new" ||
						  infoData.details.badge=="hot" || 
						  infoData.details.badge=="sale") {
					$(radio).children("#" + radioData.name + "_" + infoData.details.badge).children("input").attr("checked","checked");					
				}
					
				
	
	prodFoto = document.createElement('div');
		$(prodFoto).addClass('fl-col').addClass('table').css('margin-bottom','16px').appendTo($(container));
			prodFotoCaption = document.createElement('div');
			$(prodFotoCaption).addClass('col-caption').addClass('fl-vcenter').appendTo($(prodFoto));
			prodFotoCaptionText = document.createElement('div');
			$(prodFotoCaptionText).css('margin-left','22px')
					.addClass('col-caption').text('фотографии товара').appendTo($(prodFotoCaption));
			
			prodFotoContent = document.createElement('div');
			$(prodFotoContent).addClass('col-content').css('justify-content','flex-start').css('flex-flow','row wrap').addClass('fl-space').appendTo($(prodFoto));
			
			var productImage = generateFotoBlock(null,infoData.id);
			$(productImage).css('order','1').appendTo(prodFotoContent);
			
			if(infoData.fotos != null && infoData.fotos.length>0) {
				$.each(infoData.fotos, function(i, item){
					var productImage = generateFotoBlock(item, infoData.id, i);
					$(productImage).appendTo(prodFotoContent);
				}) 
			}
			
	prodVars = document.createElement('div');
		$(prodVars).addClass('fl-col').addClass('table').css('margin-bottom','16px').appendTo($(container));
			prodVarsCaption = document.createElement('div');
			$(prodVarsCaption).addClass('col-caption').addClass('fl-vcenter').appendTo($(prodVars));
			prodVarsCaptionText = document.createElement('div');
			$(prodVarsCaptionText).css('margin-left','22px')
					.addClass('col-caption').text('вариации товара').appendTo($(prodVarsCaption));
				
			prodVarsContent = document.createElement('div');
			$(prodVarsContent).addClass('col-content').css('padding-top','6px').appendTo($(prodVars));
			var prodVarsContentWrap = document.createElement('div');
			$(prodVarsContentWrap).addClass('fl-col').appendTo($(prodVarsContent));
			var addProductVar = document.createElement('div');
			$(addProductVar).addClass('fl-row').css('margin-top','9px').appendTo($(prodVarsContentWrap));
				var addProductVarInput = generateInputField("Добавить вариацию:", "addVars", false);
				var addProductVarSubmit = document.createElement('a');
				$(addProductVarSubmit).css('color','#8e44ad').text("Добавить").attr('href','#').appendTo($(addProductVarInput))
					.on('click', function(e) {
						e.preventDefault();
						var prData = {
							target : "vars",
							operation : "create",
							id: productId,
							name: $('#addVars').val()
						};
						//alert(prData.name);
						$.ajax({
						 	type : 'POST',
							url : 'crud.php',
							dataType : 'json',
							async: false,
							data : 'data='+ prepareData(prData),
							success : function(msg) {
								if (msg.result == "success") {
									//alert("Выполнено!");
									var varBlock = generateVarsBlock(msg.key, prData.name, productId);
									$(varBlock).appendTo($("#productVariants"));
								}
							}
						});
						$('#addVars').val('').focus();
					});
			$(addProductVarInput).css('width','350px').appendTo($(prodVarsContentWrap));

			productVariants = document.createElement('div');
			$(productVariants).addClass('fl-col').attr('id','productVariants').appendTo($(prodVarsContentWrap));
			if(infoData.details != null && infoData.details.vars != null) {
				$.each(infoData.details.vars, function(i, item) {
					var varBlock = generateVarsBlock(i, item, productId);
					$(varBlock).appendTo($(productVariants));
			});
			}

	prodCost = document.createElement('div');
	$(prodCost).addClass('fl-col').addClass('table').css('margin-bottom','16px').appendTo($(container));
		prodCostCaption = document.createElement('div');
		$(prodCostCaption).addClass('col-caption').addClass('fl-vcenter').appendTo($(prodCost));
		prodCostCaptionText = document.createElement('div');
			$(prodCostCaptionText).css('margin-left','22px')
			.addClass('col-caption').text('цена товара').appendTo($(prodCostCaption));
		prodCostContent = document.createElement('div');
		$(prodCostContent).addClass('col-content').css('padding-top','6px').appendTo($(prodCost));

		prodCostCurrent = generateInputField("Текущая цена:","currentCost", false);

		prodCostAction = generateInputField("Цена по акции:","actionCost", false);
		$(prodCostCurrent).appendTo($(prodCostContent));
		$(prodCostAction).appendTo($(prodCostContent));
		if(infoData.details != null && infoData.details.currentCost != null) {
			$(prodCostCurrent).children("input").val(infoData.details.currentCost);
		}
		if(infoData.details != null && infoData.details.actionCost != null) {
			$(prodCostAction).children("input").val(infoData.details.actionCost);
		}

	prodPromo = document.createElement('div');
	$(prodPromo).appendTo($(prodCostContent));
	prodPromoCaption = document.createElement('span');
	$(prodPromoCaption).css('margin-left','22px')
		.addClass('col-caption').text('Промоакция').appendTo($(prodCostCaption));
	var promoRadio = {
		name:"promo",
		content: [{
			value: "no",
			text: "Нет"
		}, {
			value: "yes",
			text: "Да"
		}]
	};
	promoRadioInput = generateRadioInput(promoRadio);
	$(promoRadioInput).appendTo($(prodPromo));
	if (infoData.details==null || infoData.details.promo==null || infoData.details.promo=="no") {
		$(promoRadioInput).children("#" + promoRadio.name + "_no").children("input").attr("checked","checked");
	} else if(infoData.details.promo=="yes") {
		$(promoRadioInput).children("#" + promoRadio.name + "_" + infoData.details.promo).children("input").attr("checked","checked");
	}

	saveDeleteBox = document.createElement('div');
	$(saveDeleteBox).appendTo($(container)).addClass('fl-row').css('align-self','flex-end');
	saveSubmit = document.createElement('a');
	$(saveSubmit).text('Сохранить изменения').css('font-size','18px').css('font-weight','lighter')
		.css('color','#02873a').css('margin-right','30px').attr('href','#')
		.on('click', function(e) {
			e.preventDefault();

			var prData = {
				target : "product",
				operation : "update",
				id : productId,
				name : $("#productName").val(),
				description :  $("#productDesc").val(),
				currentCost : $("#currentCost").val(),
				actionCost : $("#actionCost").val(),
				badge : $("input[name=" + radioData.name + "]:checked").val(),
				promo : $("input[name=" + promoRadio.name + "]:checked").val()
			}
			$.ajax({
				type : 'POST',
				url : 'crud.php',
				dataType : 'json',
				async: false,
				data : 'data='+ prepareData(prData),
				success : function(msg) {
					if (msg.result == "success") {
						//alert("Выполнено!!!");
						gets.getCategoryTable(infoData.category);
					} else {
						alert("Ошибка!!!");
					}
				}
			})
		})
		.appendTo($(saveDeleteBox));
		deleteSubmit = document.createElement('a');
		$(deleteSubmit).text('Удалить').css('font-size','18px').css('font-weight','lighter')
			.css('color','#ad0000').css('align-self','flex-end').css('margin-right','30px').attr('href','#')
			.on('click', function(e) {
				e.preventDefault();
				var prData = {
					target : "product",
					operation : "delete",
					id : productId
				}
				$.ajax({
					type : 'POST',
					url : 'crud.php',
					dataType : 'json',
					async: false,
					data : 'data='+ prepareData(prData),
					success : function(msg) {
						if (msg.result == "success") {
							alert("Выполнено!!!");
							$("#workspace").empty();
						} else {
							alert("Ошибка!!!");
						}
					}
				})
			})
			.appendTo($(saveDeleteBox));
	return container;
}



function generateVarsBlock(key, value, productId) {
	var productVariant = document.createElement('div');
	$(productVariant).addClass('fl-row').addClass('fl-vcenter').css('margin-top','9px').appendTo($(productVariants));
	var productVarName = document.createElement('span');
	$(productVarName).text(value).css('min-width','322px').css('padding-left','5px').css('padding-top','5px').css('height','25px')
		.css('border','1px solid #dee1e2').appendTo($(productVariant));
	productVarDelete = document.createElement('a');
	$(productVarDelete).css('color','#ad0000').css('font-size','14px').attr('href','#')
		.css('font-weight','lighter').css('margin-left','10px').text('Удалить').appendTo($(productVariant))
		.on('click', function (e) {
			e.preventDefault();
			var prData = {
				target : "vars",
				operation : "delete",
				id : productId,
				key : key
			};
			var ok = false;
			$.ajax({
				type : 'POST',
				url : 'crud.php',
				dataType : 'json',
				async : false,
				data : 'data=' + prepareData(prData),
				success : function(msg) {
					if (msg.result == "success") {
						ok = true;
					}
				}
			});
			if(ok) {
				$(this).parent().hide(200);
			}
		});
}

function generateTableHead(headData) {
	var container = getDiv('table-row');
	$.each(headData, function (i, item) {
		var col = getDiv();
		$(col).text(item.text).appendTo(container);
		if(item.size != null) {
			$(col).width(item.size);
		}
	});
	return container;
}

function buildSystemLog(msg) {
	var table = getDiv('syslog');

	var sysLogData = $.ajax({
		async: false,
		url: 'content.php',
		dataType: 'json',
		data: 'systemlog',
		method: 'POST'
	}).responseJSON;

	// var headData = [
	// 	{
	// 		text: "Время события"
	// 	},
	// 	{
	// 		text: "Пользователь"
	// 	},
	// 	{
	// 		text: "Тип операции"
	// 	},
	// 	{
	// 		text: "Детали события"
	// 	}
	// ];
	// var headRow = generateTableHead(headData);
	// $(headRow).appendTo(table);
	$.each(sysLogData, function(i, item) {
		var row = getDiv('fl-col');
		var rowUp = getDiv('fl-row');
		var rowDown = getDiv('fl-row');
		$(rowUp).appendTo(row);
		$(rowDown).appendTo(row);
		var time = getDiv();
		$(time).text(item.time).appendTo(rowUp);
		var user = getDiv();
		$(user).text(item.details.user).appendTo(rowUp);

		var category = getDiv();
		switch (item.category) {
			case 'account': $(category).text('Операция с учетной записью');
				break;
			case 'cart': $(category).text('Операция с корзиной');
				break;
			case 'login': $(category).text('Операция входа/выхода');
				break;
		}
		$(category).appendTo(rowUp);
		var details = getOl('tree');
		var detailsRootNode = getLi();
		var label = getElement('label');
		$(label).attr('for','rootElement'+i).appendTo(detailsRootNode).text("Детали события");
		var input = getElement('input');
		$(input).attr({'type':'checkbox','id':'subElement'+i}).appendTo(detailsRootNode);
		$(detailsRootNode).appendTo(details);
		$(details).appendTo(rowDown);

		var treeView = generateTreeView(item.details);
		$(treeView).appendTo(detailsRootNode);
		$(row).appendTo(table);

	});

	return table;
}

function generateTreeView(jsonData) {
	var container = getOl('tree-view');
	if(Array.isArray(jsonData) || Object.keys(jsonData).length>0 ) {
		$.each(jsonData, function (key, val) {
			var node = generateTreeNode(key, val);
			$(node).appendTo(container);
		});
	} else {
		var string = getDiv();
		$(string).text(jsonData).appendTo(container);
	}
	return container;
}

function generateTreeNode(key, val) {
	var container;
	if(val == null || $.type(val) === "string") {
		var container = getLi('file');
		$(container).text(key + ": "  + (val==null ? "" : val));
	} else if (Array.isArray(val) || Object.keys(val).length>0) {
		var container = getLi('group-node');
		var label = getElement('label');
		$(label).attr('for','subElement'+key).appendTo(container).text(key);
		var input = getElement('input');
		$(input).attr({'type':'checkbox','id':'subElement'+key}).appendTo(container);
	// <label for="subfolder1">Subfolder 1</label>
	// 	<input type="checkbox" id="subfolder1" />
		var childs = getOl();
		$(childs).appendTo(container);
		$.each(val, function (key, val) {
			var node = generateTreeNode(key, val);
			$(node).appendTo(childs);
		});
	}
	return container;
}



function buildCatTable(msg) {

	table = document.createElement('div');
	$(table).addClass('fl-col').addClass('white-bg').addClass('table').css('order', '1');
	tableCaption = document.createElement('div');
	$(tableCaption).addClass('col-caption').appendTo($(table));
	col1 = document.createElement('div');
	col1text = document.createElement('span');
	$(col1text).text('Название категории').css('margin-left', '25px').appendTo(
		$(col1));
	$(col1).css('width', '269px').appendTo($(tableCaption));
	col2 = document.createElement('div');
	$(col2).addClass('fl-row').addClass('fl-hcenter').css('width', '200px')
		.appendTo($(tableCaption));
	col2text = document.createElement('span');
	$(col2text).text('Количество товаров').appendTo($(col2));
	if (msg != null) {
		if (msg.content != null) {
			$.each(msg.content, function (i, item) {
				var tableRow = buildTableRow();
				var tableRowImg = document.createElement('div');
				$(tableRowImg).css('background-image', 'url("../img/catalog.png"')
					.css('width', '21px').css('height', '18px')
					.css('margin-left', '10px').appendTo($(tableRow));
				var tableRowCatName = document.createElement('div');
				$(tableRowCatName).css('margin-left', '8px')
					.addClass('row-item-name').css('width', '234px')
					.text(item.name).appendTo($(tableRow));
				var tableRowCatCountBox = document.createElement('div');
				$(tableRowCatCountBox).addClass('fl-row').addClass('fl-vcenter')
					.addClass('fl-hcenter').css('width', '200px').appendTo($(tableRow));
				var tableRowCatCount = document.createElement('span');

				$(tableRowCatCount).text(item.count).css('font-size', '16px')
					.css('color', '#636363').appendTo($(tableRowCatCountBox));
				var tableRowCatDelBox = document.createElement('div');
				$(tableRowCatDelBox).addClass('fl-row').addClass('fl-hcenter')
					.css('width', '120px').css('margin-left', '50px').appendTo($(tableRow));
				if (item.count == 0) {
					var tableRowCatDel = document.createElement('span');
					$(tableRowCatDel).text('удалить').css('color', '#cb0000')
						.css('font-size', '14px').css('font-weight', 'bolder')
						.css('text-decoration', 'underline').css('cursor', 'pointer')
						.on('click', function () {
							var prData = {
								target: "category",
								operation: "delete",
								id: item.id
							};
							var ok = false;
							$.ajax({
								type: 'POST',
								url: 'crud.php',
								dataType: 'json',
								data: 'data=' + prepareData(prData),
								success: function (msg) {
									if (msg.result == "success") {
										$('#workspace').empty();
										contentBuild = getContent("categories");
										$(contentBuild).appendTo('#workspace');
										// ok=true;
									}
								}
							});
							// if(ok) {
							// $(this).hide(200);
							// }
						}).appendTo($(tableRowCatDelBox));
				}
				var tableRowCatView = document.createElement('span');
				$(tableRowCatView).css('color', '#8e44ad').css('text-decoration', 'underline')
					.css('font-size', '14px').css('font-weight', 'bolder').css('cursor', 'pointer')
					.click(function () {
						gets.getCategoryTable(item.id)
					})
					.css('margin-left', '10px').text('просмотр').appendTo($(tableRow));
				$(tableRow).appendTo($(table));
			});
		}
	}
	lastRow = document.createElement('div');
	$(lastRow).css('margin', '1px 1px 1px 1px').css('height', '25px').addClass(
		'white-bg').appendTo($(table));

	return table;
}

function getCurrentCategoryField(catname, catid) {
	categoryBox = document.createElement('div');
	$(categoryBox).addClass('fl-row').addClass('fl-vcenter').css('height','58px').css('margin-left','18px');
	categoryBoxTextBox = document.createElement('div');
	$(categoryBoxTextBox).addClass('fl-row').addClass('fl-vcenter').appendTo($(categoryBox));
	categoryBoxText = document.createElement('span');
	$(categoryBoxText).text("Текущая категория:").addClass('dark-blue-text')
			.css('font-size', '16px').css('font-weight', 'bolder')
			.appendTo($(categoryBoxTextBox));

	categoryInput =  document.createElement('input');
	categoryRenameSubmit = document.createElement('a');
	$(categoryInput).css('padding-left','9px').css('height','32px').css('border','1px solid #dee1e2')
			.css('color','#0d0b0b').css('font-weight','lighter').css('font-size','16px')
			.change(function() {
				$(this).attr('changed','true');
			})
			.css('width','231px').val(catname).attr('id','catname').css('margin-left','7px')
			.attr('catid',catid).appendTo($(categoryBox));
	$(categoryRenameSubmit).attr('href', '#').text("переименовать")
			.css('color', '#02873a').css('margin-left','10px')
			.on('click',function() {
				//alert($("#catname").attr('changed')); //TODO проверка на пустое поле
				if($("#catname").attr('changed')=='true') {
					var prData = {
							target : "category",
							operation : "update",
							id : catid,
							newname: $(categoryInput).val()
							};
					var ok = false;
					$.ajax({
								type : 'POST',
								url : 'crud.php',
								dataType : 'json',
								data : 'data='+ prepareData(prData),
								success : function(msg) {
										if (msg.result == "success") {										
											alert("Выполнено!");
										}
									}
					});
					
				}
			} )
			.appendTo($(categoryBox));
	return categoryBox;
}

function addField(caption, inputId, submitText, doSomething) {
	addContainer = document.createElement('div');
	addRow1 = document.createElement('div');
	addRow2 = document.createElement('div');
	addCaption = document.createElement('span');
	addInput = document.createElement('input');
	addSubmit = document.createElement('a');
	$(addRow1).addClass('fl-row').addClass('fl-vcenter').appendTo($(addContainer));
	$(addRow2).addClass('fl-row').css('justify-content','flex-end')
			.css('margin-top','8px').appendTo($(addContainer));
	$(addCaption).text(caption).addClass('dark-blue-text').css('font-size','16px')
			.css('font-weight','bolder').appendTo($(addRow1));
	$(addInput).css('width', '232px').css('padding-left', '7px')
			.css('height', '32px').css('border', '1px solid #ecf0f1')
			.css('margin-left', '8px').css('color', '#0d0b0b').css('font-size','16px')
			.css('font-weight', 'lighter').attr('id', inputId)
			.appendTo($(addRow1));
	$(addSubmit).attr('href', '#').text(submitText)
			.css('color', '#02873a').appendTo($(addRow2));
	$(addContainer).addClass('fl-col').css('margin-top', '29px')
			.css('align-self', 'flex-end').css('margin-right', '24px');
	$(addSubmit).on('click', doSomething);
	return addContainer;
	
}



var gets = {
	getCategoryTable : function(catId) {
			$.ajax({
				type : 'POST',
				url : 'content.php',
				dataType : 'json',
				data : 'products&category=' + catId,
				success: function(msg) {
					$('#workspace').empty();
					$('.content-caption').empty();
					$('.content-caption').text('ТОВАРЫ');
					categoryField = getCurrentCategoryField(msg.catname,catId);
					containerTable = buildProdTable(msg);
					addProductField = getAddProductField();
					$(categoryField).appendTo($('#workspace'));
					$(containerTable).appendTo($("#workspace"));
					$(addProductField).css('order','2').appendTo($("#workspace"));
				}
			})
	}
}



var submits = {
		addProductSubmit : function() {
			var prData = {
					target : "product",
					operation : "create",
					name : $("#addProductName").val(),
					category : $("#catname").attr('catid')
			};
			$.ajax({
				type : 'POST',
				url : 'crud.php',
				dataType : 'json',
				data : 'data=' + prepareData(prData),
				success : function(msg) {
					if (msg.result == "success") {
						$('#workspace').empty();
						contentBuild = buildProductInfo(msg.productId);
						$(contentBuild).appendTo('#workspace');
					}
				}
			})			
		} ,
		
		addCategorySubmit : function() {
			var prData = {
					target : "category",
					operation : "create",
					name : $("#addCategoryName").val()
				};
				$.ajax({
					type : 'POST',
					url : 'crud.php',
					dataType : 'json',
					data : 'data=' + prepareData(prData),
					success : function(msg) {
						if (msg.result == "success") {
							$('#workspace').empty();
							contentBuild = getContent("categories");
							$(contentBuild).appendTo('#workspace');

						}
					}
				});
		}
}
function getAddProductField() {
	addProductContainer = addField("Добавить товар:", "addProductName", "Добавить товар", submits.addProductSubmit );
	$(addProductContainer).css('order','2');
	return addProductContainer;
}
function getAddCategoryField() {
	addCategoryContainer = addField("Добавить категорию:", "addCategoryName", "Добавить категорию", submits.addCategorySubmit );
	$(addCategoryContainer).css('order','2');
	return addCategoryContainer;
}

function getContent(choise) {
	container = document.createElement('div');
	$(container).addClass('fl-col');	
	$.ajax({
		type : 'POST',
		url : 'content.php',
		dataType : 'json',
		data : choise,
		success : function(msg) {
			switch (choise) {
				case 'orders':
					//TODO buildOrdersData - after orders
					containerTable = buildOrdersData(msg);
					$(containerTable).appendTo($(container));
					break;
				case 'users':
					containerTable = buildUsersTable(msg);
					$(containerTable).appendTo($(container));
					break;
				case 'products':
					containerTable = buildProdTable(msg);
					$(containerTable).appendTo($(container));
					break;
				case 'categories':
					containerTable = buildCatTable(msg);
					addCategory = getAddCategoryField();
					$(containerTable).appendTo($(container));
					$(addCategory).appendTo($(container));
					break;
				case 'systemlog':
					containerTable = buildSystemLog(msg);
					$(containerTable).appendTo(container);
					break;
			}
		}
	});	
	return container;
}





