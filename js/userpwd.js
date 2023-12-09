// Función para verificar si el usuario y la contraseña coinciden
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Leer el contenido del archivo usuarios.json
    fetch('usuarios.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                alert('¡Ingreso exitoso!');
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        })
        .catch(error => console.error('Error al leer usuarios.json:', error));
}

// Función para registrar un nuevo usuario
function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Leer el contenido del archivo usuarios.json
    fetch('usuarios.json')
        .then(response => response.json())
        .then(users => {
            // Verificar si el usuario ya existe
            const existingUser = users.find(u => u.email === email);

            if (existingUser) {
                alert('El usuario ya existe. Por favor, inicie sesión.');
            } else {
                // Agregar nuevo usuario al JSON y guardar en el archivo usuarios.json
                users.push({ email, password });

                // Actualizar el archivo usuarios.json
                fetch('usuarios.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(users),
                })
                .then(() => alert('¡Registro exitoso! Ahora puede iniciar sesión.'))
                .catch(error => console.error('Error al actualizar usuarios.json:', error));
            }
        })
        .catch(error => console.error('Error al leer usuarios.json:', error));
}

// Función para agregar productos al carrito
function addToCart(productName, price) {
    const cartItems = document.getElementById('cartItems');
    const existingItem = findCartItem(productName);

    if (existingItem) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        existingItem.quantity++;
        updateCartItem(existingItem);
    } else {
        // Si el producto no está en el carrito, agregar un nuevo elemento
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            ${productName} - $${price.toFixed(2)}
            <div class="input-group input-group-sm" style="width: 100px;">
                <div class="input-group-prepend">
                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${productName}', -1)">-</button>
                </div>
                <input type="text" class="form-control" value="1" id="quantity-${productName}" readonly>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${productName}', 1)">+</button>
                    <button class="btn btn-outline-danger" type="button" onclick="removeFromCart('${productName}')">Eliminar</button>
                </div>
            </div>
        `;
        cartItems.appendChild(listItem);
    }

    // Calcular y actualizar el total
    updateTotal();
}

// Función para encontrar un elemento en el carrito por nombre
function findCartItem(productName) {
    const cartItems = document.getElementById('cartItems').children;
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        if (item.textContent.includes(productName)) {
            return {
                element: item,
                quantity: parseInt(item.querySelector('input').value)
            };
        }
    }
    return null;
}

// Función para actualizar la cantidad de un elemento en el carrito
function updateCartItem(cartItem) {
    const quantityInput = cartItem.element.querySelector('input');
    quantityInput.value = cartItem.quantity;
}

// Función para actualizar la cantidad de un elemento en el carrito
function updateQuantity(productName, delta) {
    const cartItem = findCartItem(productName);
    if (cartItem) {
        cartItem.quantity += delta;
        if (cartItem.quantity < 1) {
            removeFromCart(productName);
        } else {
            updateCartItem(cartItem);
        }
    }

    // Calcular y actualizar el total
    updateTotal();
}

// Función para eliminar un elemento del carrito
function removeFromCart(productName) {
    const cartItem = findCartItem(productName);
    if (cartItem) {
        cartItem.element.remove();
    }

    // Calcular y actualizar el total
    updateTotal();
}

// Función para calcular y actualizar el total del carrito
function updateTotal() {
    const cartItems = document.getElementById('cartItems').children;
    let total = 0;

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const price = parseFloat(item.textContent.match(/\$([\d,]+(\.\d{1,2})?)/)[1].replace(',', ''));
        const quantity = parseInt(item.querySelector('input').value);
        total += price * quantity;
    }

    document.getElementById('total').textContent = total.toFixed(2);
}
