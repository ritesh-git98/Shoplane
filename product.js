$(document).ready(function() {
    var productId = window.location.search.split('=')[1];
    var currentObj = null;
    //html structure
    var productWrapper = document.getElementById('product-wrapper');
    var previewImage = document.createElement('div');
    previewImage.id = "product-image";
    var imageWrapper = document.createElement('div');
    imageWrapper.id = "image-wrapper";
    var img = document.createElement('img');
    img.id = "product-preview";
    imageWrapper.appendChild(img);
    previewImage.appendChild(imageWrapper);
    productWrapper.appendChild(previewImage);
    var productDetails = document.createElement('div');
    productDetails.id = "product-details";
    var productTitle = document.createElement('h1');
    productTitle.id = "product-title";
    productDetails.appendChild(productTitle);
    var productBrand = document.createElement('h1');
    productBrand.id = "product-brand";
    productDetails.appendChild(productBrand);
    var priceWrapper = document.createElement('h4');
    priceWrapper.className = "section-heading";
    priceWrapper.innerHTML = "Price: Rs ";
    var productPrice = document.createElement('p');
    productPrice.id = "product-price";
    priceWrapper.appendChild(productPrice);
    productDetails.appendChild(priceWrapper);
    var descriptionHeading = document.createElement('h4');
    descriptionHeading.className = "section-heading";
    descriptionHeading.innerHTML = "Description";
    productDetails.appendChild(descriptionHeading);
    var description = document.createElement('p');
    description.id = "description";
    productDetails.appendChild(description);
    var imagesHeading = document.createElement('h4');
    imagesHeading.className = "section-heading";
    imagesHeading.innerHTML = "Product Preview"
    productDetails.appendChild(imagesHeading);
    var productImages = document.createElement('div');
    productImages.id = "product-images";
    productDetails.appendChild(productImages);
    productWrapper.appendChild(productDetails);
    var addToCart = document.createElement('button');
    addToCart.id = "btn-add-to-cart";
    addToCart.innerHTML = "Add to Cart";
    productDetails.appendChild(addToCart);
    // html structure end
    function createProductImages(url, pos) {
        var image = document.createElement('img');
        image.src = url

        if (pos === 0) {
            image.classList.add("active-image");
        }

        image.onclick = function() {
            $('#product-images img').removeClass("active-image")
            image.classList.add("active-image");
            $('#product-preview').attr('src', url);
        }

        return image;
    }

    $.get('https://5d76bf96515d1a0014085cf9.mockapi.io/product/' + productId, function(data, status) {
        $('#overlay').fadeOut();
        currentObj = data;
        $('#product-preview').attr('src', data.preview)
        $('#product-title').html(data.name);
        $('#product-brand').html(data.brand);
        $('#description').html(data.description);
        $('#product-price').html(data.price);

        for (var i = 0; i < data.photos.length; i++) {
            $('#product-images').append(createProductImages(data.photos[i], i));
        }
    })

    $("#btn-add-to-cart").click(function() {
        $('#btn-add-to-cart').addClass('bigger');
        setTimeout(function() {
            $('#btn-add-to-cart').removeClass('bigger');
        }, 200)

        var productList = window.localStorage.getItem('product-list');
        productList = productList === null || productList === '' ? [] : productList;
        productList = productList.length > 0 ? JSON.parse(productList) : [];



        var foundAtPos = -1;
        for (var i = 0; i < productList.length; i++) {
            if (parseInt(productList[i].id) == parseInt(currentObj.id)) {
                foundAtPos = i;
            }
        }

        if (foundAtPos > -1) {
            productList[foundAtPos].count = productList[foundAtPos].count + 1;
            console.log(productList[foundAtPos].count);
            window.localStorage.setItem('product-list', JSON.stringify(productList));
        } else {
            currentObj.count = 1;
            productList.push(currentObj);
            window.localStorage.setItem('product-list', JSON.stringify(productList));
        }

        var totalCount = 0;
        for (var i = 0; i < productList.length; i++) {
            totalCount = totalCount + productList[i].count;
        }

        $('#cart-count').html(totalCount);
    })
});