document.addEventListener('DOMContentLoaded', () => {
    getAllCardsFromApi()
    cumulativeTotal()
});
const BaseUrl = "http://127.0.0.1:3000"

////////////////////////////////////////////////////////////////create
function addToCart(){
    event.preventDefault();
    let cardFromApiId = event.target.parentElement.id
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardFromApiId}`)//collecting from online api
    .then(response => response.json())
    .then(card => {
        let cardData = card.data[0]

        //let cardId = cardData.id;
        let cardName = cardData.name;
        let cardDesc = cardData.desc;
        let cardImgSm = cardData.card_images[0].image_url_small;
        let cardPrice = parseFloat(cardData.card_prices[0].amazon_price).toFixed(2);

        let cardWeCreate =  {
            name: cardName,
            desc: cardDesc,
            img_sm: cardImgSm,
            price: cardPrice,
            cart_id: 1
        }

        let config = {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardWeCreate)
        }

        fetch(`${BaseUrl}/cards`, config)//adding card to DB
            .then(response => cumulativeTotal())
    })
    
}

//////////////////////////////////////////////////////////////read
function getAllCardsFromApi(){
    event.preventDefault()
    let cardCollection = document.getElementById("card-collection")
    cardCollection.innerHTML = ''
    fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?level=12')
        .then(response => response.json())
        .then(cards => {
            let cards_array = cards.data;
            cards_array.forEach(card => {
                let cardId = card.id;
                let cardName = card.name;
                let cardDesc = card.desc;
                let cardImgSm = card.card_images[0].image_url_small
                let cardPrice = parseFloat(card.card_prices[0].amazon_price).toFixed(2)   
                c = new Card(cardId, cardName, cardDesc, cardImgSm, cardPrice)
                c.displayCardsFromApi()
            })
        });
}

function getAllCardsFromCart(){
    let cardCollection = document.getElementById("card-collection")
    cardCollection.innerHTML = ''
    fetch(`${BaseUrl}/cards`)
        .then(response => response.json()) // then allows for async (parallel execution) promise obj a promis = tray at burgerking (you will get the food you ordered) pending|fulfilled|rejected
        .then(cards =>{ //then processing 
            cards.forEach(card => {
                let cardId = card.id;
                let cardName = card.name;
                let cardDesc = card.desc;
                let cardImgSm = card.img_sm
                let cardPrice = card.price
                c = new Card(cardId, cardName, cardDesc, cardImgSm, cardPrice)
                
                c.displayCardsFromCart()
            })
            
        })  
}


////////////////////////////////////////////////////////////////update

function editCardForm(){
    event.preventDefault()
    let editForm =  document.getElementById("card-edit")
    let cardId = parseInt(event.target.parentElement.id)
   
    editForm.innerHTML = 
    `
    <form action="/action_page.php">
        <label>Name:</label><br>
        <input type="text" id="edit-name" value=""><br>
        <label>Description:</label><br>
        <input type="text" id="edit-desc" value=""><br>
        <input type='hidden' id = 'edit_card_id' value="${cardId}">
        <input type="submit" value="Edit Card">
        <button type="button" onclick = "cancelEdit()" >Cancel</button>
    </form>
    `

    document.addEventListener('submit', editCard)
}

function editCard(){
    event.preventDefault()
    let editName = document.getElementById("edit-name").value;
    let editDesc = document.getElementById("edit-desc").value
    let cardId = parseInt(document.getElementById("edit_card_id").value)

    let card = {
        name: editName,
        desc: editDesc
    }

    let config = {
        method: 'PATCH',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(card)
    }

    fetch(`${BaseUrl}/cards/${cardId}`, config)
        .then(response => response.json())
        .then(card => {
            let cardId = card.id;
            let cardName = card.name;
            let cardDesc = card.desc;
            let cardImgSm = card.img_sm
            c = new Card(cardId, cardName, cardDesc, cardImgSm)
            c.replaceCardAfterEdit(cardId)
        })

    let editForm =  document.getElementById("card-edit")
    editForm.innerHTML = ""
}


////////////////////////////////////////////////////////////////delete
function deleteCard(){
    event.preventDefault()
    let cardId = parseInt(event.target.parentElement.id)

    let config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    
    fetch(`${BaseUrl}/cards/${cardId}`, config)
        .then(response => cumulativeTotal())
        
    event.target.parentElement.remove()
}


//////////////////////////////////////additional methods

function cancelEdit(){
    let editForm =  document.getElementById("card-edit")
    editForm.innerHTML = ""
}

function cumulativeTotal(){
    //event.preventDefault()
    let total_location = document.getElementById("card-total")
    total_location.innerHTML = ""
    fetch(`${BaseUrl}/carts`)
        .then(response => response.json())
        .then(data => {
            let total_price = parseFloat(data[0].cumulative_price.toFixed(2))
            //debugger
            if (total_price <= 0.00){
                total_price = "0.00"
            }
            total_location.innerHTML = `<h1>Total Price: $${total_price}</h1>`
        })
}
