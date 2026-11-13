
let currentSlide = 0;

const slider = document.getElementById("slider");

function nextSlide() {

    currentSlide++;

    if (currentSlide > 2) {
        currentSlide = 0;
    }

    slider.style.transform =
        `translateX(-${currentSlide * 100}%)`;
}

function prevSlide() {

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = 2;
    }

    slider.style.transform =
        `translateX(-${currentSlide * 100}%)`;
}
function likeProduct(button) {

    if (button.innerHTML === "♡") {

        button.innerHTML = "♥";
        button.style.color = "red";

    } else {

        button.innerHTML = "♡";
        button.style.color = "black";

    }

}

// Get elements
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");
const productGrid = document.getElementById("productGrid");
const clearFilters = document.getElementById("clearFilters");
const noProducts = document.getElementById("noProducts");

const products = [...document.querySelectorAll(".product")];
const checkboxes = document.querySelectorAll("input[data-filter]");


// MAIN FILTER FUNCTION
function filterProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    // Collect selected filters
    const filters = {};

    checkboxes.forEach(checkbox => {

        if (checkbox.checked) {

            const category = checkbox.dataset.filter;

            if (!filters[category]) {
                filters[category] = [];
            }

            filters[category].push(checkbox.value.toLowerCase());
        }
    });


    // Filter products
    let result = products.filter(product => {

        const name = product.querySelector("h3")
            .textContent.toLowerCase();

        const tagElement = product.querySelector("tags");

        const tags = tagElement
            ? tagElement.textContent.toLowerCase()
                .split(",")
                .map(tag => tag.trim())
            : [];

        // Search
        const searchMatch = name.includes(searchValue);

        // Filters
        const filterMatch = Object.entries(filters).every(
            ([category, values]) => {

                // OR within the same category
                return values.some(value => tags.includes(value));

            }
        );

        return searchMatch && filterMatch;

    });


    // SORT PRODUCTS
    const sortValue = sortSelect.value;

    if (sortValue === "low-high") {

        result.sort((a, b) =>
            Number(a.dataset.price) - Number(b.dataset.price)
        );

    }

    else if (sortValue === "high-low") {

        result.sort((a, b) =>
            Number(b.dataset.price) - Number(a.dataset.price)
        );

    }

    else if (sortValue === "newest") {

        result.sort((a, b) =>
            new Date(b.dataset.date) - new Date(a.dataset.date)
        );

    }

    else if (sortValue === "popular") {

        result.sort((a, b) =>
            Number(b.dataset.popularity) - Number(a.dataset.popularity)
        );

    }


    // DISPLAY PRODUCTS
    products.forEach(product => {
        product.style.display = "none";
    });

    result.forEach(product => {
        product.style.display = "";
        productGrid.appendChild(product);
    });


    // UPDATE COUNT
    productCount.textContent = `Showing ${result.length} products`;


    // NO PRODUCTS MESSAGE
    noProducts.classList.toggle("hidden", result.length !== 0);

}


// SEARCH
searchInput.addEventListener("input", filterProducts);


// SORT
sortSelect.addEventListener("change", filterProducts);


// FILTER CHECKBOXES
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", filterProducts);
});


// CLEAR ALL
clearFilters.addEventListener("click", function () {

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    searchInput.value = "";
    sortSelect.value = "default";

    filterProducts();

});


// WISHLIST
document.querySelectorAll(".wishlist").forEach(heart => {

    heart.addEventListener("click", function (event) {

        event.stopPropagation();

        const active = heart.classList.toggle("text-red-500");

        heart.textContent = active ? "♥" : "♡";

    });

});


// INITIAL DISPLAY
filterProducts();
