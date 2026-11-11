

const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        category: "Fashion",
        price: 499,
        description: "A comfortable T-shirt for everyday wear.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Casual Jacket",
        category: "Fashion",
        price: 1499,
        description: "A stylish jacket for a modern look.",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Classic Watch",
        category: "Accessories",
        price: 999,
        description: "A simple watch for everyday use.",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Travel Backpack",
        category: "Accessories",
        price: 799,
        description: "A practical backpack for work and travel.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Running Shoes",
        category: "Footwear",
        price: 1999,
        description: "Lightweight shoes for everyday activities.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Casual Sneakers",
        category: "Footwear",
        price: 1799,
        description: "Comfortable sneakers for casual outings.",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    }
];

const productList = document.getElementById("productList");
const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const contactForm = document.getElementById("contactForm");
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerMessage = document.getElementById("customerMessage");
const contactFeedback = document.getElementById("contactFeedback");



const cart = [];

function displayProducts(category = "All") {

    const filteredProducts =
        category === "All"
            ? products
            : products.filter(function (product) {
                return product.category === category;
            });

    productList.replaceChildren();

    if (filteredProducts.length === 0) {
        productList.textContent = "No products found.";
        return;
    }

    filteredProducts.forEach(function (product) {

        const column = document.createElement("div");
        column.className = "col-sm-6 col-lg-4";

        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        image.addEventListener("error", function () {
            image.alt = product.name + " image unavailable";
            image.src =
                "https://placehold.co/600x400?text=Product+Image";
        }, { once: true });

        const details = document.createElement("div");
        details.className = "product-details";

        const categoryLabel = document.createElement("span");
        categoryLabel.className = "product-category";
        categoryLabel.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = "₹" + product.price.toLocaleString("en-IN");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "add-cart-btn";
        button.textContent = "Add to Cart";

        button.addEventListener("click", function () {
            addToCart(product);
        });

        details.append(
            categoryLabel,
            name,
            description,
            price,
            button
        );

        card.append(image, details);
        column.appendChild(card);

        productList.appendChild(column);
    });
}

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selectedCategory = button.dataset.category;

        categoryButtons.forEach(function (item) {
            const isActive = item === button;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        displayProducts(selectedCategory);
    });
});

function addToCart(product) {

    cart.push(product);

    cartCount.textContent = cart.length;

    const buttons = productList.querySelectorAll(".add-cart-btn");

    buttons.forEach(function (button) {
        if (button.textContent === "Added!") {
            button.textContent = "Add to Cart";
        }
    });

    const clickedButton = Array.from(buttons).find(function (button) {
        const card = button.closest(".product-card");
        return card &&
            card.querySelector(".product-name").textContent === product.name;
    });

    if (clickedButton) {
        clickedButton.textContent = "Added!";
    }
}

cartButton.addEventListener("click", function () {

    if (cart.length === 0) {
        alert("Your cart is empty. Add a product first.");
        return;
    }

    const cartDetails = cart.map(function (product) {
        return product.name + " - ₹" +
            product.price.toLocaleString("en-IN");
    });

    const total = cart.reduce(function (sum, product) {
        return sum + product.price;
    }, 0);

    alert(
        "YOUR SHOPPING CART\n\n" +
        cartDetails.join("\n") +
        "\n\nTotal: ₹" + total.toLocaleString("en-IN")
    );
});

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    contactFeedback.textContent = "";
    contactFeedback.className = "mt-3";

    const name = customerName.value.trim();
    const email = customerEmail.value.trim();
    const message = customerMessage.value.trim();

    const validName =
        name.length >= 2 && name.length <= 80;

    const validEmail =
        email.length <= 254 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validMessage =
        message.length >= 10 && message.length <= 1000;

    customerName.setCustomValidity(
        validName ? "" : "Enter a name between 2 and 80 characters."
    );

    customerEmail.setCustomValidity(
        validEmail ? "" : "Enter a valid email address."
    );

    customerMessage.setCustomValidity(
        validMessage ? "" : "Enter a message between 10 and 1000 characters."
    );

    customerName.classList.toggle("is-invalid", !validName);
    customerName.classList.toggle("is-valid", validName);

    customerEmail.classList.toggle("is-invalid", !validEmail);
    customerEmail.classList.toggle("is-valid", validEmail);

    customerMessage.classList.toggle("is-invalid", !validMessage);
    customerMessage.classList.toggle("is-valid", validMessage);

    if (!validName || !validEmail || !validMessage) {

        const firstInvalid = contactForm.querySelector(".is-invalid");

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    contactFeedback.textContent =
        "Thank you, " + name +
        "! Your form passed validation.";

    contactFeedback.classList.add("text-success");

    contactForm.reset();

    [customerName, customerEmail, customerMessage].forEach(
        function (input) {
            input.classList.remove("is-valid", "is-invalid");
            input.setCustomValidity("");
        }
    );
});

[customerName, customerEmail, customerMessage].forEach(
    function (input) {

        input.addEventListener("input", function () {

            input.classList.remove("is-valid", "is-invalid");
            input.setCustomValidity("");

            contactFeedback.textContent = "";
            contactFeedback.className = "mt-3";
        });
    }
);

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

displayProducts();