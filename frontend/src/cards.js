class Card {

    constructor(id, name, desc, img_sm, cardPrice) {  //similar to ruby setters they allow us to use poperties with instances using "this" as a means of reffering tot he instance of the object.
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.img_sm = img_sm;
        this.cardPrice = cardPrice;
    }

    displayCardsFromApi(){ //displays cards from the External API includes the add to cart function
        let cardCollection = document.getElementById("card-collection")
        cardCollection.innerHTML +=
        `
        <div id =${this.id}>
            <h1>${this.name}</h1>
            <div id ="imgs" >
            <img src=${this.img_sm} >
            </div>
            <p>$${this.cardPrice}</p>
            <p>${this.desc}</p>
            <button onclick ="addToCart()">Add to cart</button>
            <hr>
        <div>
        `
    }

    displayCardsFromCart(){//displays cards from the internal API includes the edit and delete functions
        let cardCollection = document.getElementById("card-collection")
        cardCollection.innerHTML +=
        `
        <div id =${this.id}>
            <h1>${this.name}</h1>
            <img src=${this.img_sm} >
            <p>$${this.cardPrice}</p>
            <p>${this.desc}</p>
            <button onclick ="editCardForm()">Edit</button>
            <button onclick ="deleteCard()">Delete</button>
            <hr>
        <div>
        `
    }

    replaceCardAfterEdit(cardID){//After we are done editing in the DB we use this function to do a live replace of the card we edited
        let cardCollection = document.getElementById(cardID)
        cardCollection.innerHTML =
        `
        <div id =${this.id}>
            <h1>${this.name}</h1>
            <img src=${this.img_sm} >
            <p>${this.desc}</p>
            <button onclick ="editCardForm()">Edit</button>
            <button onclick ="deleteCard()">Delete</button>
            <hr>
        <div>
        `
    }

  }