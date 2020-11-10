document.addEventListener('DOMContentLoaded', () => {
    getAllCardsFromApi()
    cumulativeTotal()
    addPricyCard()
});
const BaseUrl = "http://127.0.0.1:3000"//Base url to save me some time


//////////////////////////////////////////////////////////////test
function addPricyCard(){
    let buttonLocation = document.getElementById("button")
    buttonLocation.addEventListener('click', testCard)
}

function testCard(){
    fetch(`${BaseUrl}/cards`)
        .then(resp => resp.json())
        .then(cards => {
            cards.sort(function(a, b){return b.price - a.price});
            alert(cards[0].name)
        }) 
}
//notes make use of carts model on backend
//practice more
//do the algo problems again
//organize code better look at cernean and nicky code
//for infor from a db use backend[rails ] AR is quicker
//take a look at A&b js style guide


////////////////////////////////////////////////////////////////create
function addToCart(){
    event.preventDefault();
    let cardFromApiId = event.target.parentElement.id //selects the card id of the card you want to create
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardFromApiId}`)//collecting information about the previously selected card from online api
    .then(response => response.json()) //converting the response to JSON
    .then(card => { //once converted to JSON we organize the data
        let cardData = card.data[0]

        //let cardId = cardData.id; //leaving this here just incase i need it for anything
        let cardName = cardData.name; //card name
        let cardDesc = cardData.desc; //card description
        let cardImgSm = cardData.card_images[0].image_url_small; //small img of card
        let cardPrice = parseFloat(cardData.card_prices[0].amazon_price).toFixed(2); //card price

        let cardWeCreate =  { // here is our card object for the card we are hoping to create
            name: cardName,
            desc: cardDesc,
            img_sm: cardImgSm,
            price: cardPrice,
            cart_id: 1 //setting this as default because we only need one cart and it also fullfills the ORM.
        }

        let config = { //our config obj for our Fetch[POST] Request
            method: 'POST', //Specifies what we are trying to do
            headers:{ // lets us application what kind of data we are sending/ recieving
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardWeCreate) //converts data to json 
        }

        fetch(`${BaseUrl}/cards`, config)//adding card to DB
            .then(response => cumulativeTotal())//once card is added we update the price.
    })
    
}

//////////////////////////////////////////////////////////////read
function getAllCardsFromApi(){//gets all the cards from the external API
    event.preventDefault()
    let cardCollection = document.getElementById("card-collection")
    cardCollection.innerHTML = '' //Put this inside "THEN"
    fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?level=12')//gets all the cards from the external API
        .then(response => response.json()) //converts our response to json
        .then(cards => { //Helps us organize the data we recieve 
            let cards_array = cards.data;
            cards_array.forEach(card => {
                let cardId = card.id;
                let cardName = card.name;
                let cardDesc = card.desc;
                let cardImgSm = card.card_images[0].image_url_small
                let cardPrice = parseFloat(card.card_prices[0].amazon_price).toFixed(2) //weconvert the value from a string to a float and ensure it only takes up 2 decimal points  
                c = new Card(cardId, cardName, cardDesc, cardImgSm, cardPrice) //we create a new card object
                c.displayCardsFromApi() //we display the new card object using our method bc its cleaner that way
            })
        });
}

function getAllCardsFromCart(){
    let cardCollection = document.getElementById("card-collection")
    cardCollection.innerHTML = ''
    fetch(`${BaseUrl}/cards`)
        .then(response => response.json()) // then allows for async (parallel execution) promise obj a promis = tray at burgerking (you will get the food you ordered) pending|fulfilled|rejected
        .then(cards =>{ //further processing
            cards.forEach(card => {
                let cardId = card.id;
                let cardName = card.name;
                let cardDesc = card.desc;
                let cardImgSm = card.img_sm
                let cardPrice = card.price
                c = new Card(cardId, cardName, cardDesc, cardImgSm, cardPrice) //we create a new card object
                
                c.displayCardsFromCart() //we display the new card object using our method bc its cleaner that way
            })
            
        })  
}


////////////////////////////////////////////////////////////////update

function editCardForm(){ //creating a new form
    event.preventDefault()
    let editForm =  document.getElementById("card-edit") //find the location of the div 
    let cardId = parseInt(event.target.parentElement.id) //convert the id from string to integer
   
    editForm.innerHTML =  //we are using "=" here bc we dont want to keep adding edit forms we only want one edit form
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

    document.addEventListener('submit', editCard) //Upon submit we want to trigger the edit function. we dont use parenthases on the function bc we dont want to the function to execute when its read. we want it's referenc. and we want it to exucute under the circumstance that a particualr event happens.
}

function editCard(){ // the part of the edit that actually updates the DB
    
    //listed below are the values we are get from our form. Once we get them from our form we organize them into variables.
    event.preventDefault()
    let editName = document.getElementById("edit-name").value;
    let editDesc = document.getElementById("edit-desc").value
    let cardId = parseInt(document.getElementById("edit_card_id").value)

    //we use the variables above to create our object
    let card = {
        name: editName,
        desc: editDesc
    }

    //we set our config object as well
    let config = {
        method: 'PATCH', //This is going to be a patch request
        headers:{ //Lets our applciation know that we are sending and recieving JSON
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(card)// converts that obeject to a JSON so that it can be sent
    }

    fetch(`${BaseUrl}/cards/${cardId}`, config) //Were the update action happens
        .then(response => response.json()) //converts the response to json
        .then(card => { //we organize our response into variables 
            let cardId = card.id;
            let cardName = card.name;
            let cardDesc = card.desc;
            let cardImgSm = card.img_sm
            c = new Card(cardId, cardName, cardDesc, cardImgSm) //we create a new card object
            c.replaceCardAfterEdit(cardId) //we use this method to locate the particular object we want to replace and do a live replace
        })

    let editForm =  document.getElementById("card-edit") // we make the edit form disappear
    editForm.innerHTML = ""
}


////////////////////////////////////////////////////////////////delete
function deleteCard(){
    event.preventDefault()
    let cardId = parseInt(event.target.parentElement.id)//we locate the card we want to Delete based off the delete button.

    let config = { //we set our object configurations so that our fetch knows what to do
        method: 'DELETE', // we specify that we want to delete
        headers: { // we specify the kind of data we want to send back and forth
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        }
    }

    
    fetch(`${BaseUrl}/cards/${cardId}`, config)//where the actual delete happens
        .then(response => cumulativeTotal()) //Allows us to update the price live
        
    event.target.parentElement.remove()// Allows us to remove the card we want to delete live
}


//////////////////////////////////////additional methods

function cancelEdit(){ //abstracting the logic away for removing a form[I only use this on one occation]
    let editForm =  document.getElementById("card-edit")
    editForm.innerHTML = ""
}

function cumulativeTotal(){
    //event.preventDefault() 
    let total_location = document.getElementById("card-total") //locates where to put the price total on the html 
    total_location.innerHTML = "" //sets it to empty so that we get a live update as we go
    fetch(`${BaseUrl}/carts/1`) // goes into the carts db to read the price value
        .then(response => response.json()) //converts response to json
        .then(data => { 
            let total_price = parseFloat(data.cumulative_price.toFixed(2)) //takes total price from db and converts it to a float with 2 decimal point. might seem kinda redundent but if I dont do this the value in the db looks kinda funky
            
            if (total_price <= 0.00){ // to prevent the value being displayed as "-0.00"
                total_price = "0.00"
            }
            total_location.innerHTML = `<h1>Total Price: $${total_price}</h1>` //displayes our total price
        })
}
