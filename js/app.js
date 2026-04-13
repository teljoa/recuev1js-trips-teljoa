const URL_BASE = "http://localhost:3000";

const destinationsGrid = document.getElementById("destinations-grid");
const searchInput = document.getElementById("searchInput");
const itineraryList = document.getElementById("itinerary-list");
const totalPrice = document.getElementById("total-price");
const form = document.getElementById("booking-form");

let destinations = [];
let cart = [];

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

loadDestinations()