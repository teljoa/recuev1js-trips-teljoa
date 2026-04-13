const URL_BASE = "http://localhost:3000";

const destinations = document.getElementById("destinations-grid");
const search = document.getElementById("searchInput");
const itinerary = document.getElementById("itinerary-list");
const total = document.getElementById("total-price");
const form = document.getElementById("booking-form");

let destinatarions=[];
let cart=[];

function mostrarDestinos(){
    fetch(`${URL_BASE}/destinations`)
        .then(response=>response.json())
        .then(destinatarionss=>{
            destinatarions=destinatarionss;
            rendertinatarions(destinatarions);
        })
        .catch(error => console.log(error));
}

function rendertinatarions(destinationss) {
    destinationss.map(destination =>{
        
        let properties = destination.cod.split("_");
        let precies = parseInt(destination.price_raw.replace("€",""));
        
        let destin={
            id: destination.id,
            title: `${properties[0].substring(0,1).toUpperCase()}${properties[0].substring(1)} (${properties[1]})`,
            region:`${properties[2].substring(0,1).toUpperCase()}${properties[2].substring(1)}`,
            price:precies,
            spots:destination.spots
        };
        destinatarions.push(destin);

        let article= document.createElement("article");

        let cardImg= document.createElement("div");
        cardImg.classList.add("card-img");

        let cardBody= document.createElement("div");
        cardBody.classList.add("card-body")

        let cardTop= document.createElement("div");
        cardTop.classList.add("card-top");

        let badge= document.createElement("span");
        badge.classList.add("badge");
        badge.textContent=destin.region;

        let spotsBage= document.createElement("span");
        spotsBage.classList.add("spots-badge");
        spotsBage.textContent=destin.spots;

        let title= document.createElement("h3");
        title.textContent=destin.title;

        let cardPrice= document.createElement("div");
        cardPrice.classList.add("card-price");
        cardPrice.textContent=destin.price;

        let btn= document.createElement("button");
        btn.classList.add("btn-add");
        btn.dataset.id=destin.id;
        btn.textContent="Añadir al Itinerario";

        cardTop.append(badge,spotsBage);
        article.append(cardImg,cardBody,cardTop,title,cardPrice,btn);
        destinations.appendChild(article);
    })
}
function addCart(id){
    const destin = destinatarions.find(d => d.id == id);
    const item = destinatarions.find(i=>id ==id);

    if(!item){
        cart.push(item);
    } 
    updateCart();
}


mostrarDestinos()