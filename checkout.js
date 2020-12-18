$(document).ready(function() {
    $('#overlay').fadeOut();
    var mainSection = document.getElementById("main-section");
    var mainHeading = document.createElement("h1");
    mainHeading.id = "main-heading";
    mainHeading.innerHTML = "Checkout";
    mainSection.appendChild(mainHeading);
    var contentWrapper = document.createElement("div");
    contentWrapper.id = "content-wrapper";
    var cardList = document.createElement("div");
    cardList.id = "card-list";
    var cardListHeading = document.createElement("h3");
    cardListHeading.className = "section-heading";
    cardListHeading.innerHTML = "Total Items: ";
    var itemCount = document.createElement("span");
    itemCount.id = "item-count";
    cardListHeading.appendChild(itemCount);
    cardList.appendChild(cardListHeading);
    contentWrapper.appendChild(cardList);

    var rightSection = document.createElement("div");
    var rightHeading = document.createElement("h3");
    rightHeading.className = "section-heading";
    rightHeading.innerHTML = "Total Amount";
    rightSection.appendChild(rightHeading);
    var amountWrapper = document.createElement("p");
    amountWrapper.innerHTML = "Amount: Rs";
    var totalAmount = document.createElement("span");
    totalAmount.id = "total-amount";
    amountWrapper.appendChild(totalAmount);
    rightSection.appendChild(amountWrapper);
    var placeOrderBtn = document.createElement("button");
    placeOrderBtn.id = "btn-place-order";
    placeOrderBtn.innerHTML = "Place Order";
    rightSection.appendChild(placeOrderBtn);
    contentWrapper.appendChild(rightSection);

    mainSection.appendChild(contentWrapper);

    function createCheckoutProductCard(obj) {
        var card = document.createElement("div");
        card.classList.add("checkout-card");

        var firstInnerDiv = document.createElement("div");
        var productImg = document.createElement("img");
        productImg.classList.add("checkout-product-img");
        productImg.src = obj.preview;
        firstInnerDiv.appendChild(productImg);

        var secondInnerDiv = document.createElement("div");
        var productName = document.createElement("h4");
        productName.innerHTML = obj.name;
        var productCount = document.createElement("p");
        productCount.innerHTML = "x" + obj.count;
        var amountLabel = document.createElement("span");
        amountLabel.innerHTML = "Amount: Rs ";
        var amountSpan = document.createElement("span");
        amountSpan.innerHTML = parseInt(obj.count) * parseInt(obj.price);
        var productAmount = document.createElement("p");
        productAmount.appendChild(amountLabel);
        productAmount.appendChild(amountSpan);
        secondInnerDiv.appendChild(productName);
        secondInnerDiv.appendChild(productCount);
        secondInnerDiv.appendChild(productAmount);

        card.appendChild(firstInnerDiv);
        card.appendChild(secondInnerDiv);

        return card;
    }

    var productList = window.localStorage.getItem("product-list");
    productList = productList === null || productList === "" ? [] : productList;
    productList = productList.length > 0 ? JSON.parse(productList) : [];

    var grandTotal = 0;
    for (var i = 0; i < productList.length; i++) {
        $("#card-list").append(createCheckoutProductCard(productList[i]));

        var totalForCurrentProduct =
            parseFloat(productList[i].count) * parseFloat(productList[i].price);

        grandTotal = grandTotal + totalForCurrentProduct;
    }

    $("#item-count").html(productList.length);
    $("#total-amount").html(grandTotal);

    $("#btn-place-order").click(function() {
        var orderItemArr = [];
        for (var i = 0; i < productList.length; i++) {
            var prodObj = {
                id: productList[i].id,
                brand: productList[i].brand,
                name: productList[i].name,
                price: productList[i].price,
                preview: productList[i].preview,
                isAccessory: productList[i].isAccessory
            };

            orderItemArr.push(prodObj);
        }

        var dataObj = {
            amount: grandTotal,
            products: orderItemArr
        };
        $.post(
            "https://5d76bf96515d1a0014085cf9.mockapi.io/order",
            dataObj,
            function() {
                alert("Order Placed Successfully");
            }
        );
        localStorage.setItem("product-list", []);

        location.assign("./thankyou.html");
    });
});