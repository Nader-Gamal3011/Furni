let rowContainer = document.getElementById("container");
let products = JSON.parse(localStorage.getItem("cart")) || [];

if (products.length > 0) {
    renderProducts(products);
}

function renderProducts(products) {
    for (let product of products) {
        const card = `
        <div class="row product align-items-center" id="${product.id}">
            <div class="col-lg-3 imageOfProduct text-center">
                <img src="${product.image}" alt="Product Name">
            </div>
            <div class="col-lg-3 product-details">
                <h5>${product.name}</h5>
                <p class="text-dark fw-bold mb-0">Unit Price: $${product.price}</p>
            </div>
            <div class="col-lg-3 operationToOrderProduct">
                <button class="minus"><i class="fa-solid fa-minus"></i></button>
                <p class="numOfProduct">${product.numOfItemInCart}</p>
                <button class="plus"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div class="col-lg-3 totalPrice">
                <h6>Total:</h6>
                <h5 class="totalprice" data-price="${product.price}">${product.totalPrice}</h5>
            </div>
            <div class="delete-product">
                <i class="fa-solid fa-trash"></i>
            </div>
        </div>
        `;
        rowContainer.insertAdjacentHTML("beforeend", card);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let increaseButton = document.querySelectorAll(".plus");
    let decreaseButton = document.querySelectorAll(".minus");
    let deleteItem = document.querySelectorAll(".delete-product");

    increaseButton.forEach((ele) => {
        ele.addEventListener("click", () => {
            icreaseItem(ele.closest(".product").id);
        });
    });

    decreaseButton.forEach((ele) => {
        ele.addEventListener("click", () => {
            decreaseItem(ele.closest(".product").id);
        });
    });

    deleteItem.forEach((ele) => {
        ele.addEventListener("click", () => {
            deleteProductFromCart(ele.closest(".product").id);
        });
    });
});

function icreaseItem(id) {
    let myProduct = document.getElementById(id);
    let numItem = myProduct.querySelector(".numOfProduct");
    let numItemValue = Number(numItem.textContent);

    let maxStock = getProductStockFromProducts(id);

    if (numItemValue < maxStock) {
        numItemValue += 1;
        numItem.textContent = numItemValue;
        let total = updateTotalPrice(myProduct, numItemValue);
        updateLocalCart(id, numItemValue, total);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Stock Limit Reached',
            text: 'The number of this item exceeds the available stock.',
            confirmButtonText: 'OK'
        });
    }
}

function decreaseItem(id) {
    let myProduct = document.getElementById(id);
    let numItem = myProduct.querySelector(".numOfProduct");
    let numItemValue = Number(numItem.textContent);

    if (numItemValue > 1) {
        numItemValue -= 1;
        numItem.textContent = numItemValue;
        let total = updateTotalPrice(myProduct, numItemValue);
        updateLocalCart(id, numItemValue, total);
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Minimum Quantity Reached',
            text: 'The minimum number for this item is 1.',
            confirmButtonText: 'OK'
        });
    }
}

function updateTotalPrice(myProduct, quantity) {
    let totalPrice = myProduct.querySelector(".totalprice");
    let unitPrice = Number(totalPrice.getAttribute("data-price"));
    let value = unitPrice * quantity;
    totalPrice.textContent = value;
    return value;
}

function updateLocalCart(id, quantity, total) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(p => p.id == id);
    if (product) {
        product.numOfItemInCart = quantity;
        product.totalPrice = total;
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

function getProductStockFromProducts(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products.find(p => p.id == id);
    return product ? product.stock : 0;
}

// عملية الشراء

let buy_now = document.querySelector(".buy-now");

buy_now.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        Swal.fire({
            title: 'Cart is empty!',
            text: 'You need to add items before purchasing.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            title: 'Purchase Confirmed!',
            text: 'Thank you for your order.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            deductStock(cart);  // خصم من localStorage("products")
            localStorage.setItem("cart", JSON.stringify([]));
            localStorage.setItem("countOfNumberProduct", 0);
            location.reload();
        });
    }
});

function deductStock(cart) {
    let products = JSON.parse(localStorage.getItem("products")) || [];

    cart.forEach(cartItem => {
        let product = products.find(p => p.id == cartItem.id);
        if (product) {
            product.stock = Math.max(product.stock - cartItem.numOfItemInCart, 0);
        }
    });

    localStorage.setItem("products", JSON.stringify(products));
}

function deleteProductFromCart(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This product will be removed from your cart.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let newCart = cart.filter(product => product.id != id);

            localStorage.setItem("cart", JSON.stringify(newCart));

            let count = Number(localStorage.getItem("countOfNumberProduct")) || 0;
            localStorage.setItem("countOfNumberProduct", Math.max(count - 1, 0));

            Swal.fire({
                title: 'Deleted!',
                text: 'Product has been removed.',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false
            }).then(() => {
                location.reload();
            });
        }
    });
}
