// Start Active Navbar Links
const links = Array.from(document.querySelectorAll(".navbar-collapse ul li a"));
links.forEach((link) => {
    link.addEventListener("click", () => {
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});
// End Active Navbar Links

const rowContainer = document.querySelector(".shop .container .row");

// Load products: First from localStorage, if empty fetch from data.json
let storedProducts = JSON.parse(localStorage.getItem("products")) || [];

if (storedProducts.length === 0) {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            storedProducts = data;
            localStorage.setItem("products", JSON.stringify(storedProducts));
            renderProducts(storedProducts);
            renderAddToCartsBtn();
        })
        .catch(err => console.error("Error loading data.json:", err));
} else {
    renderProducts(storedProducts);
    renderAddToCartsBtn();
}

// Render Products in Shop
function renderProducts(products) {
    rowContainer.innerHTML = ""; // Clear old data
    for (let product of products) {
        const card = `
            <div class="col-lg-4 col-md-6">
                <div class="card" id=${product.id}>
                    <img src="${product.image}" class="card-img-top" alt="image">
                    <div class="card-body">
                        <h5 class="card-title ps-3 pt-3 mb-2">${product.name}</h5>
                        <p class="card-text ps-3 mb-1 text-muted">${product.description}</p>
                        <p class="card-text ps-3 mb-3 fw-bold text-dark">$${product.price}</p>
                        <div class="footer d-flex align-items-center justify-content-between">
                            <h6 class="mb-0">Stock : ${product.stock}</h6>
                            <a href="#" class="btn btn-primary btn-sm addCart">ADD TO CART</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        rowContainer.insertAdjacentHTML("beforeend", card);
    }
}

// Navigate to Cart Page
document.getElementById("productInCart").addEventListener("click", () => {
    location.href = "cart.html";
});

// Update UI Counter
const countOfNumberProduct = document.getElementById("numOfProductsInCart");
function updateCountUI() {
    countOfNumberProduct.textContent = localStorage.getItem("countOfNumberProduct") || 0;
}
updateCountUI();

// Handle Add to Cart
function renderAddToCartsBtn() {
    const AddtoCarts = document.querySelectorAll(".addCart");

    AddtoCarts.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = btn.closest(".card").id;
            const products = JSON.parse(localStorage.getItem("products")) || [];
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            const product = products.find(p => p.id == productId);
            if (!product) return;

            if (product.stock <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Out of Stock',
                    text: 'Sorry, this product is currently out of stock.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const alreadyInCart = cart.find(p => p.id == productId);
            if (alreadyInCart) {
                Swal.fire({
                    icon: 'info',
                    title: 'Already in Cart',
                    text: `${product.name} is already in your cart.`,
                    confirmButtonText: 'OK'
                });
                return;
            }

            const productToCart = {
                ...product,
                numOfItemInCart: 1,
                totalPrice: product.price
            };

            cart.push(productToCart);
            localStorage.setItem("cart", JSON.stringify(cart));

            let currentCount = Number(localStorage.getItem("countOfNumberProduct") || 0);
            localStorage.setItem("countOfNumberProduct", currentCount + 1);

            updateCountUI();

            Swal.fire({
                icon: 'success',
                title: 'Added to Cart',
                text: `${product.name} added to your cart.`,
                timer: 1000,
                showConfirmButton: false
            });
        });
    });
}
