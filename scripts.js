let cart = {};
let order = {};

const bannerImages = ["bg1.png", "bg2.png", "bg3.png"];
let currentImageIndex = 0;

function changeBannerImage() {
  const bannerImage = document.querySelector(".banner img");
  const blackOverlay = document.querySelector(".black-overlay");

  blackOverlay.style.opacity = 1;

  setTimeout(() => {
    currentImageIndex = (currentImageIndex + 1) % bannerImages.length;
    bannerImage.src = bannerImages[currentImageIndex];

    bannerImage.onload = () => {
      blackOverlay.style.opacity = 0;
    };
  }, 800); 
}

setInterval(changeBannerImage, 7000); 

function addItemToCart(name, price) {
    if (cart[name]) {
        cart[name].quantity += 1;
    } else {
        cart[name] = { price: price, quantity: 1, description: name };
    }
    updateCartList();
    showCartDropdown();
}

function showCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown');
    cartDropdown.style.display = 'block';
}

function hideCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown');
    cartDropdown.style.display = 'none';
}

function confirmCart() {
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const confirmAddition = confirm("Do you want to add these items to your order?");
    if (confirmAddition) {
        for (const item in cart) {
            if (order[item]) {
                order[item].quantity += cart[item].quantity;
            } else {
                order[item] = { ...cart[item] };
            }
        }
        cart = {};
        updateCartList();
        updateOrderList();
        hideCartDropdown();
        alert('Items added to order!');
    }
}

function updateCartList() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';

    for (const item in cart) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p>${cart[item].description} x${cart[item].quantity}</p>
            <span>₱${(cart[item].price * cart[item].quantity).toFixed(2)}</span>
            <button onclick="removeItemFromCart('${item}')">-</button>
            <button onclick="addItemToCart('${item}', ${cart[item].price})">+</button>
        `;
        cartList.appendChild(itemElement);
    }
}

function removeItemFromCart(name) {
    if (cart[name] && cart[name].quantity > 0) {
        if (cart[name].quantity === 1) {
            const confirmDelete = confirm("Do you want to delete this item?");
            if (confirmDelete) {
                delete cart[name];
            }
        } else {
            cart[name].quantity -= 1;
        }
    }
    updateCartList();
}

function addItem(name, price) {
    if (order[name]) {
        order[name].quantity += 1;
    } else {
        order[name] = { price: price, quantity: 1 };
    }
    updateOrderList();
}

function removeItem(name) {
    if (order[name]) {
        if (order[name].quantity === 1) {
            const confirmDelete = confirm("Do you want to delete this order?");
            if (confirmDelete) {
                delete order[name];
            }
        } else {
            order[name].quantity -= 1;
        }
    }
    updateOrderList();
}

function updateOrderList() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
    let total = 0;
    let discountApplied = false;

    for (const item in order) {
        let itemTotal = order[item].price * order[item].quantity;
        const hasDiscount = order[item].quantity > 2;
        if (hasDiscount) {
            itemTotal *= 0.9;
            discountApplied = true;
        }
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('order-item');
        itemElement.innerHTML = `
            <p>${item} x${order[item].quantity} ${hasDiscount ? "(10% off)" : ""}</p>
            <span>₱${itemTotal.toFixed(2)}</span>
            <button onclick="removeItem('${item}')">-</button>
            <button onclick="addItem('${item}', ${order[item].price})">+</button>
        `;
        orderList.appendChild(itemElement);
    }

    document.getElementById('totalAmount').textContent = `₱${total.toFixed(2)}`;

    const discountMessage = document.getElementById('discountMessage');
    if (discountApplied) {
        discountMessage.innerHTML = '<span class="discount-text">Discount (10%) applied</span>';
    } else {
        discountMessage.innerHTML = '';
    }
}

function confirmOrder() {
    let total = Object.values(order).reduce((acc, item) => {
        let itemTotal = item.price * item.quantity;
        if (item.quantity > 2) itemTotal *= 0.9;
        return acc + itemTotal;
    }, 0);

    if (total > 0) {
        const confirmPurchase = confirm("Do you want to confirm the order?");
        if (confirmPurchase) {
            alert(`Order Confirmed! Total: ₱${total.toFixed(2)}`);
            
            order = {};
            updateOrderList();
            document.getElementById('totalAmount').textContent = '₱0.00'; 
            document.getElementById('discountMessage').innerHTML = '';
        }
    } else {
        alert("Your order is empty!");
    }
}


function addPopUpEffect(productElement) {
    productElement.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
    productElement.style.transform = "scale(1.05)";
    productElement.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.2)";
}

function removePopUpEffect(productElement) {
    productElement.style.transform = "scale(1)";
    productElement.style.boxShadow = "none";
}

document.querySelectorAll(".product").forEach(product => {
    product.addEventListener("mouseenter", () => addPopUpEffect(product));
    product.addEventListener("mouseleave", () => removePopUpEffect(product));
});
