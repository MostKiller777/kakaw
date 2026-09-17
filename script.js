/* =========================================================
   KAKAW CAFE — MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LOADER
    ===================================================== */

    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            loader?.classList.add("hidden");
        }, 700);
    });


    /* =====================================================
       NAVBAR
    ===================================================== */

    const navbar = document.getElementById("navbar");

    function updateNavbar() {
        if (!navbar) return;

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 35
        );
    }

    updateNavbar();

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenu =
        document.getElementById("mobileMenu");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileClose =
        document.getElementById("mobileClose");


    function openMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.add("open");

        document.body.classList.add("no-scroll");
    }


    function closeMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.remove("open");

        document.body.classList.remove("no-scroll");
    }


    mobileMenuBtn?.addEventListener(
        "click",
        openMobileMenu
    );

    mobileClose?.addEventListener(
        "click",
        closeMobileMenu
    );


    document
        .querySelectorAll(".mobile-menu a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchBtn =
        document.getElementById("searchBtn");

    const searchOverlay =
        document.getElementById("searchOverlay");

    const searchClose =
        document.getElementById("searchClose");

    const searchInput =
        document.getElementById("searchInput");

    const searchResults =
        document.getElementById("searchResults");


    function openSearch() {

        if (!searchOverlay) return;

        searchOverlay.classList.add("open");

        document.body.classList.add("no-scroll");

        setTimeout(() => {
            searchInput?.focus();
        }, 150);
    }


    function closeSearch() {

        if (!searchOverlay) return;

        searchOverlay.classList.remove("open");

        document.body.classList.remove("no-scroll");

        if (searchInput) {
            searchInput.value = "";
        }

        if (searchResults) {
            searchResults.innerHTML = "";
        }
    }


    searchBtn?.addEventListener(
        "click",
        openSearch
    );

    searchClose?.addEventListener(
        "click",
        closeSearch
    );


    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const products =
        Array.from(
            document.querySelectorAll(".product-card")
        );


    /* =====================================================
       SEARCH RESULTS
    ===================================================== */

    if (searchInput && searchResults) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .toLowerCase()
                        .trim();

                searchResults.innerHTML = "";

                if (!query) return;

                const matches =
                    products.filter(card => {

                        const name =
                            (
                                card.dataset.name ||
                                ""
                            ).toLowerCase();

                        return name.includes(query);
                    });


                if (!matches.length) {

                    searchResults.innerHTML = `
                        <p style="
                            padding-top:20px;
                            color:#776e68;
                            font-size:12px;
                        ">
                            No delicious results found 😔
                        </p>
                    `;

                    return;
                }


                matches.forEach(card => {

                    const result =
                        document.createElement("button");

                    result.type = "button";

                    result.style.cssText = `
                        width:100%;
                        padding:15px 0;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        text-align:left;
                        border:0;
                        border-bottom:1px solid #e7e0da;
                        background:transparent;
                        color:#171311;
                        cursor:pointer;
                    `;


                    result.innerHTML = `
                        <strong>
                            ${card.dataset.name}
                        </strong>

                        <span style="
                            color:#552a18;
                            font-size:11px;
                        ">
                            AED ${Number(
                                card.dataset.price || 0
                            ).toFixed(2)}
                        </span>
                    `;


                    result.addEventListener(
                        "click",
                        () => {

                            closeSearch();

                            card.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });


                            card.classList.add(
                                "search-highlight"
                            );


                            setTimeout(() => {

                                card.classList.remove(
                                    "search-highlight"
                                );

                            }, 1800);

                        }
                    );


                    searchResults.appendChild(result);

                });

            }
        );

    }


    /* =====================================================
       MENU FILTERS
    ===================================================== */

    const filters =
        document.querySelectorAll(".filter");


    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(item => {
                    item.classList.remove("active");
                });

                filter.classList.add("active");


                const category =
                    (
                        filter.dataset.category ||
                        "all"
                    ).toLowerCase();


                products.forEach(product => {

                    const productCategories =
                        (
                            product.dataset.category ||
                            ""
                        )
                        .toLowerCase()
                        .split(/\s+/);


                    let show = false;


                    if (category === "all") {

                        show = true;

                    } else {

                        show =
                            productCategories.includes(
                                category
                            );

                    }


                    if (show) {

                        product.classList.remove(
                            "hidden"
                        );

                        requestAnimationFrame(() => {

                            product.classList.add(
                                "filter-show"
                            );

                        });

                    } else {

                        product.classList.remove(
                            "filter-show"
                        );

                        product.classList.add(
                            "hidden"
                        );

                    }

                });

            }
        );

    });


    /* =====================================================
       FAVORITES
    ===================================================== */

    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    button.classList.toggle(
                        "liked"
                    );


                    button.textContent =
                        button.classList.contains("liked")
                            ? "♥"
                            : "♡";


                    showToast(
                        button.classList.contains("liked")
                            ? "Added to favorites ♡"
                            : "Removed from favorites"
                    );

                }
            );

        });


    /* =====================================================
       CART
    ===================================================== */

    const cartBtn =
        document.getElementById("cartBtn");

    const cartClose =
        document.getElementById("cartClose");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const cartSidebar =
        document.getElementById("cartSidebar");

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutBtn =
        document.getElementById("checkoutBtn");


    let cart = [];


    /* =====================================================
       OPEN CART
    ===================================================== */

    function openCart() {

        cartSidebar?.classList.add("open");

        cartOverlay?.classList.add("open");

        document.body.classList.add(
            "no-scroll"
        );
    }


    /* =====================================================
       CLOSE CART
    ===================================================== */

    function closeCart() {

        cartSidebar?.classList.remove("open");

        cartOverlay?.classList.remove("open");

        document.body.classList.remove(
            "no-scroll"
        );
    }


    cartBtn?.addEventListener(
        "click",
        openCart
    );

    cartClose?.addEventListener(
        "click",
        closeCart
    );

    cartOverlay?.addEventListener(
        "click",
        closeCart
    );


    /* =====================================================
       ADD TO CART
    ===================================================== */

    document
        .querySelectorAll(".add-cart")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        button.closest(
                            ".product-card"
                        );


                    if (!card) return;


                    const name =
                        card.dataset.name ||
                        "Menu Item";


                    const price =
                        Number(
                            card.dataset.price || 0
                        );


                    const existing =
                        cart.find(
                            item =>
                                item.name === name
                        );


                    if (existing) {

                        existing.quantity++;

                    } else {

                        cart.push({
                            name: name,
                            price: price,
                            quantity: 1
                        });

                    }


                    updateCart();


                    button.classList.add(
                        "added"
                    );


                    setTimeout(() => {

                        button.classList.remove(
                            "added"
                        );

                    }, 350);


                    showToast(
                        `${name} added to your order 🍫`
                    );

                }
            );

        });


    /* =====================================================
       UPDATE CART
    ===================================================== */

    function updateCart() {

        if (
            !cartItems ||
            !cartCount ||
            !cartTotal
        ) {
            return;
        }


        cartItems.innerHTML = "";


        let total = 0;
        let count = 0;


        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div>🛒</div>

                    <h3>
                        Your basket is empty
                    </h3>

                    <p>
                        Add something delicious.
                    </p>

                </div>

            `;

        }


        cart.forEach(
            (item, index) => {

                total +=
                    item.price *
                    item.quantity;


                count +=
                    item.quantity;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "cart-item";


                row.innerHTML = `

                    <div class="cart-item-image">
                        🍫
                    </div>


                    <div class="cart-item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <span>
                            AED ${item.price.toFixed(2)}
                        </span>


                        <div class="quantity-controls">

                            <button
                                type="button"
                                class="minus"
                                data-index="${index}"
                            >
                                −
                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                type="button"
                                class="plus"
                                data-index="${index}"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="remove-item"
                        data-index="${index}"
                        aria-label="Remove ${item.name}"
                    >
                        ×
                    </button>

                `;


                cartItems.appendChild(row);

            }
        );


        cartCount.textContent =
            count;


        cartTotal.textContent =
            `AED ${total.toFixed(2)}`;


        /* PLUS */

        cartItems
            .querySelectorAll(".plus")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (!cart[index]) return;


                        cart[index].quantity++;


                        updateCart();

                    }
                );

            });


        /* MINUS */

        cartItems
            .querySelectorAll(".minus")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (!cart[index]) return;


                        cart[index].quantity--;


                        if (
                            cart[index].quantity <= 0
                        ) {

                            cart.splice(
                                index,
                                1
                            );

                        }


                        updateCart();

                    }
                );

            });


        /* REMOVE */

        cartItems
            .querySelectorAll(".remove-item")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (!cart[index]) return;


                        const name =
                            cart[index].name;


                        cart.splice(
                            index,
                            1
                        );


                        updateCart();


                        showToast(
                            `${name} removed`
                        );

                    }
                );

            });

    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    checkoutBtn?.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showToast(
                    "Your basket is empty 🛒"
                );

                return;
            }


            window.open(
                "https://www.talabat.com/uae/kakaw-cafe",
                "_blank",
                "noopener"
            );

        }
    );


    /* =====================================================
       NEWSLETTER
    ===================================================== */

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );

    const emailInput =
        document.getElementById(
            "emailInput"
        );


    newsletterForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                emailInput?.value.trim();


            if (!email) {

                showToast(
                    "Please enter your email"
                );

                return;
            }


            showToast(
                "You're on the KAKAW list! ☕"
            );


            if (emailInput) {
                emailInput.value = "";
            }

        }
    );


    /* =====================================================
       TOAST
    ===================================================== */

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    let toastTimer;


    function showToast(message) {

        if (!toast || !toastMessage) {
            return;
        }


        toastMessage.textContent =
            message;


        toast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2600);

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            `
            .product-card,
            .story-content,
            .story-quote,
            .gallery-item,
            .location-content,
            .location-map
            `
        );


    revealElements.forEach(
        element => {

            element.classList.add(
                "reveal"
            );

        }
    );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .12
                }
            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       CHOCOLATE DROPS
    ===================================================== */

    const chocolateRain =
        document.getElementById(
            "chocolateRain"
        );


    const chocolateDrops =
        chocolateRain
            ? Array.from(
                chocolateRain.querySelectorAll(
                    "span"
                )
            )
            : [];


    let lastScroll =
        window.scrollY;


    let dropTimer = null;


    function createChocolateDrops() {

        if (!chocolateDrops.length) {
            return;
        }


        chocolateDrops.forEach(
            (drop, index) => {

                const delay =
                    index * 55 +
                    Math.random() * 180;


                setTimeout(
                    () => {

                        const x =
                            Math.random() * 96 + 2;


                        const distance =
                            window.innerHeight +
                            180 +
                            Math.random() * 280;


                        const duration =
                            750 +
                            Math.random() * 850;


                        const sway =
                            (Math.random() - .5) *
                            160;


                        const rotate =
                            (Math.random() - .5) *
                            40;


                        drop.style.left =
                            `${x}%`;


                        drop.style.opacity =
                            "0.65";


                        drop.style.transform =
                            "translate3d(0,-80px,0) scale(.7)";


                        drop.style.transition =
                            "none";


                        requestAnimationFrame(
                            () => {

                                drop.style.transition =
                                    `
                                    transform
                                    ${duration}ms
                                    cubic-bezier(.18,.72,.3,1),
                                    opacity
                                    200ms ease
                                    `;


                                drop.style.transform =
                                    `
                                    translate3d(
                                        ${sway}px,
                                        ${distance}px,
                                        0
                                    )
                                    rotate(${rotate}deg)
                                    scale(1)
                                    `;

                            }
                        );


                        setTimeout(
                            () => {

                                drop.style.opacity =
                                    "0";

                            },
                            Math.max(
                                duration - 180,
                                100
                            )
                        );


                    },
                    delay
                );

            }
        );

    }


    function handleChocolateScroll() {

        const currentScroll =
            window.scrollY;


        const difference =
            Math.abs(
                currentScroll -
                lastScroll
            );


        lastScroll =
            currentScroll;


        /*
         * Chocolate animation becomes stronger
         * when the user is close to the bottom.
         */

        const documentHeight =
            document.documentElement
                .scrollHeight;


        const viewportHeight =
            window.innerHeight;


        const distanceFromBottom =
            documentHeight -
            (
                currentScroll +
                viewportHeight
            );


        if (
            difference > 10 &&
            distanceFromBottom < 750
        ) {

            if (dropTimer) {
                cancelAnimationFrame(
                    dropTimer
                );
            }


            dropTimer =
                requestAnimationFrame(
                    createChocolateDrops
                );

        }

    }


    window.addEventListener(
        "scroll",
        handleChocolateScroll,
        {
            passive: true
        }
    );


    /* =====================================================
       SMOOTH ANCHOR LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !id ||
                        id === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            id
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeSearch();

                closeCart();

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateCart();


    console.log(
        "%c🍫 KAKAW CAFE",
        `
        font-size:24px;
        font-weight:700;
        color:#552a18;
        `
    );

    console.log(
        "Kakaw Cafe website loaded successfully."
    );

});

// =========================
// CHOCOLATE DROP BUTTON
// =========================

const chocolateButton = document.getElementById("chocolateButton");
const chocolateRain = document.getElementById("chocolateRain");

if (chocolateButton && chocolateRain) {

    chocolateButton.addEventListener("click", () => {

        // Create lots of chocolate drops
        for (let i = 0; i < 90; i++) {

            const drop = document.createElement("div");

            drop.className = "chocolate-drop";

            // Random position
            drop.style.left = Math.random() * 100 + "%";

            // Random size
            const size = 10 + Math.random() * 18;

            drop.style.width = size + "px";
            drop.style.height = size * 1.7 + "px";

            // Random falling speed
            drop.style.animationDuration =
                (1.5 + Math.random() * 2.5) + "s";

            // Random delay
            drop.style.animationDelay =
                Math.random() * 0.8 + "s";

            // Random rotation
            drop.style.transform =
                `rotate(${Math.random() * 360}deg)`;

            chocolateRain.appendChild(drop);

            // Remove after animation
            setTimeout(() => {
                drop.remove();
            }, 5000);
        }

        // Button effect
        chocolateButton.textContent = "🍫 CHOCOLATE RAIN!";

        setTimeout(() => {
            chocolateButton.textContent = "🍫 DROP CHOCOLATE";
        }, 1800);
    });
}