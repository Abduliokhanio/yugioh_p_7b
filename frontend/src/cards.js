class Card {
    constructor(id, name, desc, img_sm, cardPrice) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.img_sm = img_sm;
        this.cardPrice = cardPrice;
    }

    displayCardsFromApi(){
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

    displayCardsFromCart(){
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

    replaceCardAfterEdit(cardID){
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