// Start linkes Active

const linkes = Array.from(document.querySelectorAll(".navbar-collapse ul li a"));


linkes.forEach((link) => {
    link.addEventListener("click", () => {
        linkes.forEach((link) => {
            link.classList.remove("active")
        })
        link.classList.add("active")
    })
})

// End linkes Active


const countOfNumberProduct = document.getElementById("numOfProductsInCart");

function updateCountUI() {
    countOfNumberProduct.textContent = localStorage.getItem("countOfNumberProduct");
}
updateCountUI();
// Add To Cart Start

function renderAddToCartsBtn() {
    const AddtoCarts = document.querySelectorAll(".addCart");
    AddtoCarts.forEach((btn) => {
        btn.addEventListener("click", () => {
            let currentCount = Number(localStorage.getItem("countOfNumberProduct"));
            currentCount += 1;
            localStorage.setItem("countOfNumberProduct", currentCount);
            updateCountUI();
        })
    })
}

// Add To Cart End

let productInCart = document.getElementById("productInCart");
productInCart.addEventListener("click", () => {
    location.href = "cart.html";
})

