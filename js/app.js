const URL_BASE = "http://localhost:3000";

const destinationsGrid = document.getElementById("destinations-grid");
const searchInput = document.getElementById("searchInput");
const itineraryList = document.getElementById("itinerary-list");
const totalPrice = document.getElementById("total-price");
const form = document.getElementById("booking-form");

const inputNombre = document.getElementById("nombre");
const inputDni = document.getElementById("dni");
const inputFecha = document.getElementById("fecha");
const feedback = document.getElementById("feedback-msg");

const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]+\s[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/;
const regexDni = /^[0-9]{8}[A-Za-z]$/;

let destinations = [];
let cart = [];

//Funcion para juardar el carrito
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//Funcion para cargar carrito
function loadCart() {
    const data = localStorage.getItem("cart");
    if (data) {
        cart = JSON.parse(data);
        renderCart();
    }
}

//Funcion para mostrar destinos
function loadDestinations() {
    fetch(`${URL_BASE}/destinations`)
        .then(res => res.json())
        .then(data => {
            destinations = data.map(d => {
                let parts = d.cod.split("_");

                return {
                    id: d.id,
                    title: `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} (${parts[1]})`,
                    region: parts[2].charAt(0).toUpperCase() + parts[2].slice(1),
                    price: parseInt(d.price_raw.replace("€", "")),
                    spots: d.spots
                };
            });
            renderDestinations(destinations);
        })
        .catch(err => console.log(err));
}

//Funcion para renderizar destinos
function renderDestinations(data) {
    destinationsGrid.innerHTML = "";

    data.forEach(dest => {
        const article = document.createElement("article");

        const cardImg = document.createElement("div");
        cardImg.classList.add("card-img");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTop = document.createElement("div");
        cardTop.classList.add("card-top");

        const badge = document.createElement("span");
        badge.classList.add("badge");
        badge.textContent = dest.region;

        const spots = document.createElement("span");
        spots.classList.add("spots-badge");
        spots.textContent = dest.spots;

        cardTop.appendChild(badge);
        cardTop.appendChild(spots);

        const title = document.createElement("h3");
        title.textContent = dest.title;

        const price = document.createElement("div");
        price.classList.add("card-price");
        price.textContent = dest.price + "€";

        const button = document.createElement("button");
        button.classList.add("btn-add");
        button.textContent = "Añadir al Itinerario";

        button.addEventListener("click", () => {
            addToCart(dest.id);
        });

        cardBody.appendChild(cardTop);
        cardBody.appendChild(title);
        cardBody.appendChild(price);
        cardBody.appendChild(button);

        article.appendChild(cardImg);
        article.appendChild(cardBody);

        destinationsGrid.appendChild(article);
    });
}

//Funcion para añadir al carrito
function addToCart(id) {
    const dest = destinations.find(d => d.id == id);

    if (!cart.some(item => item.id == id)) {
        cart.push(dest);
    }

    saveCart();
    renderCart();
}

//Funcion para renderizar carrito
function renderCart() {
    itineraryList.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("itinerary-item");

        const title = document.createElement("p");
        title.textContent = item.title;

        const price = document.createElement("span");
        price.textContent = item.price + "€";

        div.appendChild(title);
        div.appendChild(price);

        itineraryList.appendChild(div);
    });

    updateTotal();
}

//Funcion para calcular el total
function updateTotal() {
    let total = cart.reduce((acc, item) => acc + item.price, 0);
    totalPrice.textContent = total + "€";
}

//Evento del buscador
searchInput.addEventListener("input", () => {
    let value = searchInput.value.toLowerCase();

    let filtered = destinations.filter(d =>
        d.title.toLowerCase().includes(value) ||
        d.region.toLowerCase().includes(value)
    );

    renderDestinations(filtered);
});

//Variables para validaciones en tiempo real
const showError = (input, message) => {
    const formField = input.parentElement;
    formField.classList.add("error");
    const error = formField.querySelector("small");
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    formField.classList.remove("error");
    const error = formField.querySelector("small");
    error.textContent = "";
};

//Comprobar valores de los imputs
const checkNombre = () => {
    const value = inputNombre.value.trim();
    if (value === "") {
        showError(inputNombre, "Campo obligatorio");
        return false;
    } else if (!regexNombre.test(value)) {
        showError(inputNombre, "Nombre y apellido con espacio");
        return false;
    }
    showSuccess(inputNombre);
    return true;
};

const checkDni = () => {
    const value = inputDni.value.trim();
    if (value === "") {
        showError(inputDni, "Campo obligatorio");
        return false;
    } else if (!regexDni.test(value)) {
        showError(inputDni, "8 números y 1 letra");
        return false;
    }
    showSuccess(inputDni);
    return true;
};

const checkFecha = () => {
    const value = inputFecha.value;
    if (value === "") {
        showError(inputFecha, "Selecciona fecha");
        return false;
    }
    showSuccess(inputFecha);
    return true;
};

form.addEventListener("input", (e) => {
    switch (e.target.id) {
        case "nombre":
            checkNombre();
            break;
        case "dni":
            checkDni();
            break;
        case "fecha":
            checkFecha();
            break;
    }
});

//POST
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valid = checkNombre() && checkDni() && checkFecha();
    if (!valid) return;

    if (cart.length === 0) {
        feedback.textContent = "Añade destinos";
        feedback.classList.remove("hidden");
        return;
    }

    const booking = {
        nombre: inputNombre.value.trim(),
        dni: inputDni.value.trim(),
        fecha: inputFecha.value,
        destinos: cart,
        total: cart.reduce((acc, d) => acc + d.price, 0),
        createdAt: new Date().toISOString()
    };

    fetch(`${URL_BASE}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    });

    feedback.textContent = "Reserva realizada ✅";
    feedback.classList.remove("hidden");

    cart = [];
    saveCart();
    renderCart();
    form.reset();
});

loadDestinations();
loadCart();