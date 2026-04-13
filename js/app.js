const URL_BASE = "http://localhost:3000";

const destinations = document.getElementById("destinations-grid");
const search = document.getElementById("searchInput");
const itinerary = document.getElementById("itinerary-list");
const total = document.getElementById("total-price");
const form = document.getElementById("booking-form");

const destinatarions=[];
const cart=[];

function rendertinatarions() {
    fetch(`${URL_BASE}/destinations`)
        .then(response=>response.json())
        .then(destinationss =>
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
                article.innerHTML=`
                    <div class="card-img"></div> <div class="card-body">
                        <div class="card-top">
                            <span class="badge">${destin.region}</span>
                            <span class="spots-badge">${destin.spots}</span>
                        </div>
                        
                        <h3>${destin.title}</h3>
                        
                        <div class="card-price">${destin.price}€</div>
                        
                        <button class="btn-add" data-id=${destin.id}>Añadir al Itinerario</button>
                    </div>
                `
                destinations.appendChild(article);
                
            })
        );
}
function addCart(id){
    const destin = destinatarions.find(d => d.id == id);
    const item = destinatarions.find(i=>id ==id);

    if(!item){
        cart.push(item);
    } 
    updateCart();
}


rendertinatarions()