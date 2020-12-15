/* Load menu data (only once) */
async function loadMenu() {
    var foodHtml = "";
    var drinksHtml = "";
    await $.getJSON("menu.json", function(menu) {
        menu.food.forEach(item => {
            var id = item.id.trim();
            var priceString = item.price;
            var priceWithDots = numberToMoney(priceString);
            var priceHightlight = priceWithDots.split('.')[0];
            var priceLeft = priceWithDots.substring(priceHightlight.length, priceWithDots.length);
            foodHtml += 
                '<div class="col-xs-12 col-lg-6 fnd-item">' +
                    '<div class="spacer-20"></div>' +
                    '<div class="col-xs-3 col-sm-4 no-padding">' +
                        '<img src="assets/'+item.image_url+'"/>' +
                    '</div>' +
                    '<div class="col-xs-9 col-sm-8">' +
                        '<h3 class="fs-36 fs-sm-24" id="food_name_'+id+'"><strong>'+item.name+'</strong></h3>' +
                        '<p class="fs-sm-12">' +
                            item.description +
                        '</p>' +
                        '<div id="food_price_'+id+'"><span class="fs-40 fs-sm-24">'+priceHightlight+'</span>'+priceLeft+'</div>' +
                        '<button id="addButton" class="btn btn-primary btn-small" onclick="addOrder(\''+id+'\');">' +
                            '<span class="dis-sm-hide">Add to Order List</span>' +
                            '<span class="dis-hide dis-sm-block">+</span>' +
                        '</button>' +
                        '<div class="spacer-20"></div>' +
                        '<div class="spacer-20 dis-sm-hide"></div>' +
                    '</div>' +
                '</div>';
        });
        menu.drinks.forEach(item => {
            var id = item.id.trim();
            var priceString = item.price;
            var priceWithDots = numberToMoney(priceString);
            var priceHightlight = priceWithDots.split('.')[0];
            var priceLeft = priceWithDots.substring(priceHightlight.length, priceWithDots.length);
            drinksHtml += 
                '<div class="col-xs-12 col-lg-6 fnd-item">' +
                    '<div class="spacer-20"></div>' +
                    '<div class="col-xs-3 col-sm-4 no-padding">' +
                        '<img src="assets/'+item.image_url+'"/>' +
                    '</div>' +
                    '<div class="col-xs-9 col-sm-8">' +
                        '<h3 class="fs-36 fs-sm-24" id="food_name_'+id+'"><strong>'+item.name+'</strong></h3>' +
                        '<p class="fs-sm-12">' +
                            item.description +
                        '</p>' +
                        '<div id="food_price_'+id+'"><span class="fs-40 fs-sm-24">'+priceHightlight+'</span>'+priceLeft+'</div>' +
                        '<button id="addButton" class="btn btn-primary btn-small" onclick="addOrder(\''+id+'\');">' +
                            '<span class="dis-sm-hide">Add to Order List</span>' +
                            '<span class="dis-hide dis-sm-block">+</span>' +
                        '</button>' +
                        '<div class="spacer-20"></div>' +
                        '<div class="spacer-20 dis-sm-hide"></div>' +
                    '</div>' +
                '</div>';
        });
    }).catch(e => {
        showErrorAlert();
    });

    $("#food").html(foodHtml);
    $("#drinks").html(drinksHtml);
    adjustTotalQuantity();
}
 
function changeMenuCategory(category) {
    if (category == "food") {
        $('#food').fadeIn();
        $('#drinks').hide();
    }
    if (category == "drinks") {
        $('#food').hide();
        $('#drinks').fadeIn();
    }
}


/* Handle Order - Start */
function addOrder(foodId) {
    try {
        var foodName = $('#food_name_'+foodId).text();
        var foodPrice = "";
        var foodPriceSplit = $('#food_price_'+foodId).text().split('.');
        foodPriceSplit.forEach(price => {
            foodPrice += price;
        });
        foodPrice = parseInt(foodPrice);
    
        showSuccessAlert("Success to add <strong>" + foodName + "</strong> to Order List");
    
        if (localStorage.order_list) {
            orderList = JSON.parse(localStorage.getItem('order_list'));
        }
        else {
            orderList = [];
        }
     
        var isFoodExist = 0;
        orderList.forEach(item => {
            if(item.id == foodId) {
                item.quantity += 1;
                isFoodExist = 1;
                return;
            }
        });
    
        if(isFoodExist === 0) {
            orderList.push({ 'id': foodId, 'name': foodName, 'price': foodPrice, 'quantity': 1 });
        }
        localStorage.setItem('order_list', JSON.stringify(orderList));
        adjustTotalQuantity();
    } catch (error) {
        showErrorAlert();
    }
    
    return false;
}

function getOrderList() {
    if (localStorage.order_list) {
        var orderList = JSON.parse(localStorage.getItem('order_list'));
        var listHtml = "";
        var grandTotal = 0;
        var totalQuantity = 0;
        if (orderList.length > 0) {
            listHtml = '<table class="table table-striped table-dark">';
            listHtml += '<thead>' +
                '<th>No</th>' +
                '<th>Item</th>' +
                '<th>Price</th>' +
                '<th>Quantity</th>' +
                '<th>Total</th>' +
                '<th>Action</th>' +
                '</thead> <tbody>';
    
            orderList.forEach((item, idx) => {
                var totalPrice = item.price * item.quantity;
                listHtml += '<tr>';
                listHtml +=
                    '<td>' + (idx+1) + ' </td>' +
                    '<td>' + item.name + ' </td>' +
                    '<td>' + numberToMoney(item.price) + ' </td>' +
                    '<td>' + item.quantity + ' </td>' +
                    '<td>' + numberToMoney(totalPrice) + '</td>' +
                    '<td>' +
                        '<button class="btn btn-warning btn-small" data-toggle="modal" data-target="#confirm_modal" onclick="openModal(\'edit\',\''+item.id+'\');">Edit</button>' +
                        '<button class="btn btn-danger btn-small" data-toggle="modal" data-target="#confirm_modal" onclick="openModal(\'delete\',\''+item.id+'\');">Remove</button>' +
                    '</td>';
                listHtml += '</tr>';
                totalQuantity += item.quantity;
                grandTotal += totalPrice;
            });

            listHtml += '<tr>';
            listHtml +=
                '<td colspan="3"><strong>Grand Total</strong></td>' +
                '<td><strong>' + totalQuantity + " item(s)" + '</strong></td>' +
                '<td><strong>' + numberToMoney(grandTotal) + '</strong></td>' +
                '<td></td>';
            listHtml += '</tr>';

            listHtml += '<tr class="bg-white">';
            listHtml +=
                '<td colspan="5"></td>' +
                '<td class="text-right"><button class="btn btn-danger btn-small" data-toggle="modal" data-target="#confirm_modal" onclick="openModal(\'clear\');">Clear List</button></td>';
            listHtml += '</tr>';
    
            listHtml += '</tbody></table>';
    
        }else {
            listHtml = "<span>You haven't order anything.</span>";
        }

        $("#order_list").html(listHtml);
    }
}
 
function editQuantity(id) {
    if(localStorage.order_list) {
        var foodName = "";
        var quantity = $('#input_quantity').val();

        try {
            orderList = JSON.parse(localStorage.getItem('order_list'));
     
            orderList.forEach((item) => {
                if (item.id == id) {
                    foodName = item.name;
                    item.quantity = parseInt(quantity);
                }
            });
     
            localStorage.setItem('order_list', JSON.stringify(orderList));
            adjustTotalQuantity();
    
            showSuccessAlert("<strong>" + foodName + "</strong>'s quantity has been changed to <strong>"+quantity+"</strong>.");
        } catch (error) {
            showErrorAlert();
        }
        getOrderList();
    }
 
    return false;
}

function removeItem(id) {
    if (localStorage.order_list) {
        var foodName = "";
        try {
            orderList = JSON.parse(localStorage.getItem('order_list'));
     
            orderList.forEach((item, idx) => {
                if (item.id == id) {
                    foodName = item.name;
                    orderList.splice(idx, 1);
                }
            });
     
            localStorage.setItem('order_list', JSON.stringify(orderList));
            adjustTotalQuantity();
        
            showSuccessAlert("<strong>" + foodName + "</strong> has been removed from Order List.");
        } catch (error) {
            showErrorAlert();
        }
        getOrderList();
    }
 
    return false;
}

function submitOrder() {
    if (liff.isLoggedIn()) {
        if(validateForm()) {
            try {
                var orderList = JSON.parse(localStorage.getItem('order_list'));
                var orderText = "";
                var totalQuantity = 0, grandTotal = 0;
                const name = $('#input_name').val();
                const tableNo = $('#input_table_no').val();
            
                orderList.forEach((item) => {
                    var totalPrice = 0;
                    totalPrice = item.quantity * item.price;
                    orderText += "• " + item.name + ": " + item.quantity + " x " + item.price + " = " + totalPrice +"\n";
                    totalQuantity += item.quantity;
                    grandTotal += totalPrice;
                });
                
                clearForm();
                clearOrder();

                if(liff.isInClient()) {
                    liff.sendMessages([{
                        'type': 'text',
                        'text': "Hi! I'm " + name + " on table " + tableNo + ".\n" +
                                "My Order:\n" + orderText +
                                "\nTotal item: " + totalQuantity + " item(s)\n" +
                                "Total Price: " + grandTotal + "\n" +
                                "\nPlease process my order! I will be waiting!"
                    }]).then(function() {
                        showSuccessAlert("Your Order has been submitted. Please wait.");
                        liff.closeWindow();
                    }).catch(function(error) {
                        showErrorAlert('Cannot send messages.');
                    });
                }else {
                    showSuccessAlert("Your Order has been submitted. Please wait.");
                    goToPage('menu');
                }
            } catch (error) {
                showErrorAlert();
            }
        }
    }else {
        showErrorAlert("Please Login first to Order!");
    }
}

function clearOrder() {
    localStorage.removeItem('order_list');
    $("#order_list").empty();
    clearTotalQuantity();
}

function getItemById(id) {
    var food = "";
    var orderList = JSON.parse(localStorage.getItem('order_list'));

    orderList.forEach((item, idx) => {
        if (item.id == id) {
            food = item;
            return;
        }
    });
    return food;
}
/* Handle Order - End */

/* Input Validation - Start */
function validateName() {
    var name = $('#input_name').val();
    var errorMessage = "";

    if(name.length <= 3) {
        scrollTo("#input_name");
        errorMessage = "Name must be more than 3 characters"
        $('#error_input_name').text(errorMessage);
        return false;
    }

    $('#error_input_name').text("");
    return true;
}
function validateTableNo() {
    var tableNo = $('#input_table_no').val();
    var errorMessage = "";

    if(tableNo == "") {
        if(liff.isInClient()) {
            scrollTo("#btn_scan_no");
            errorMessage = "Please scan QR on your table"
        }else {
            scrollTo("#input_table_no");
            errorMessage = "Table number must be filled"
        }
        $('#error_input_table_no').text(errorMessage);
        return false;
    }

    $('#error_input_table_no').text("");
    return true;
}
function validateForm() {
    if(validateName() && validateTableNo()) {
        return true;
    }

    return false;
}
function handleNameOnKeypress() {
    clearTimeout(timeout);

    timeout = setTimeout(function () {
        validateName();
    }, 200);
}
function handleTableNoOnKeypress() {
    clearTimeout(timeout);

    timeout = setTimeout(function () {
        validateTableNo();
    }, 200);
}
/* Input Validation - End */

// Clear Form
function clearForm() {
    $('#input_name').val("");
    $('#input_table_no').val("");
}

// Handle Open Modal
function openModal(modalName, id="") {
    var title = modalName;
    var content, footer;

    switch(modalName) {
        case "order":
            if(localStorage.order_list) {
                content = '<p>Are you sure want to order these items?</p>';
                footer = '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="submitOrder();">Confirm</button>' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
            }else {
                content = '<p>You haven\'t order anything. Please go to Menu page and order something.</p>';
                footer = '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="goToPage(\'menu\');">Back to Menu</button>';
            }
            break;
        case "edit":
            var item = getItemById(id);
            content = '<div>Editing <strong>'+item.name+'</strong></div>' +
                        '<button type="button" class="btn btn-default btn-sm" onclick="changeQuantity(\'substract\')">-</button>' +
                        '<input type="number" id="input_quantity" value="'+item.quantity+'" min="1" max="99" oninput="handleQuantityOnKeypress();" />' +
                        '<button type="button" class="btn btn-default btn-sm" onclick="changeQuantity(\'add\')">+</button>' +
                        '<div id="quantity_error_message" class="fs-12 error-text"></div>';
            footer = '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="editQuantity(\'' + item.id + '\');">Confirm</button>' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
            break;
        case "delete":
            var item = getItemById(id);
            content = '<p>Are you sure want to remove <strong>'+item.name+'</strong>?</p>';
            footer = '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="removeItem(\'' + item.id + '\');">Confirm</button>' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
            break;
        case "clear":
            content = '<p>Are you sure want to delete all items in Order List?</p>';
            footer = '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="clearOrder();">Confirm</button>' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
            break;
    }

    $('#modal_title').text(title);
    $('#modal_content').html(content);
    $('#modal_footer').html(footer);
}

function adjustTotalQuantity() {
    try {
        var orderList = [];
        var quantity = 0;

        if(localStorage.order_list) {
            orderList = JSON.parse(localStorage.getItem('order_list'));
 
            orderList.forEach((item) => {
                quantity += item.quantity;
            });
        }
        
        localStorage.setItem('total_quantity', quantity);
        if(quantity > 0) {
            var btnGotoOrderText = "Order List [<strong>"+ quantity + "</strong> item(s)]"
            $('#btn_goto_order').html(btnGotoOrderText);
        }
    } catch (error) {
        showErrorAlert("Error while adjust total quantity");
    }
}

function clearTotalQuantity() {
    localStorage.removeItem('total_quantity');
    $('#btn_goto_order').text("Order List");
}

/* Change item quantity */
function changeQuantity(type) {
    var quantity = $('#input_quantity').val();
    if(type == "add") {
        if(quantity < 99) {
            quantity++;
            $('#quantity_error_message').text("");
        }else {
            $('#quantity_error_message').text("Quantity must be between 1 - 99 !");
        }
    }else {
        if(quantity > 1) {
            quantity--;
            $('#quantity_error_message').text("");
        }else {
            $('#quantity_error_message').text("Quantity must be between 1 - 99 !");
        }
    }
    $('#input_quantity').val(quantity);
}


//Handle quantity when input using keyboard
let timeout = null;
function handleQuantityOnKeypress() {
    clearTimeout(timeout);

    timeout = setTimeout(function () {
        var quantity = $('#input_quantity').val();
        
        if(quantity < 1 || quantity > 99) {
            $('#quantity_error_message').text("Quantity must be between 1 - 99 !");
            $('#input_quantity').val("");
        }else {
            $('#quantity_error_message').text("");
        }
    }, 500);
}

async function goToPage(page) {
    if (page == "order") {
        const profile = await getProfile();
        const name = profile !== null ? profile.displayName : "";
        getOrderList();
        $('#order_section').fadeIn();
        $('#menu_section').hide();
        $('#btn_goto_order').hide();
        // $('#btn_goto_menu').show();
        $('#input_name').val(name);
    }
    if (page == "menu") {
        $('#order_section').hide();
        $('#menu_section').fadeIn();
        $('#btn_goto_order').show();
        // $('#btn_goto_menu').hide();
    }
}

function scrollTo(elementId) {
    $([document.documentElement, document.body]).animate({
        scrollTop: $(elementId).offset().top - $("#header").height() - $(elementId).height()
    }, 500);
}

function showSuccessAlert(htmlText) {
    $('#success_alert').show();
    $('#success_alert').html(htmlText);

    setTimeout(() => {
        $('#success_alert').hide();
        $('#success_alert').html();
    }, 3500);
}

function showErrorAlert(htmlText) {
    htmlText = htmlText ? htmlText : "Something <strong>went wrong</strong>. Please try again later.";
    $('#failed_alert').show();
    $('#failed_alert').html(htmlText);

    setTimeout(() => {
        $('#failed_alert').hide();
        $('#failed_alert').html();
    }, 3500);
}


/* Helper - Start */
const convertToString = (number) => {
    let convertedNumber = number;
    if (typeof (number) === 'number') {
      convertedNumber = number.toString();
    }
    return convertedNumber;
}
  
const numberToMoney = (number = '0') => convertToString(number) && `${parseInt(convertToString(number), 10).toLocaleString().replace(/,/g, '.')}`;
/* Helper - End */