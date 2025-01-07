import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://eastvale-restaurants-default-rtdb.firebaseio.com/"
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDb = ref(database, "restaurants")

let list = document.getElementById("restaurant-list")
let restaurantInput = document.getElementById("restaurant-input")
let inputButton = document.getElementById("submit-button")

onValue(referenceInDb, function(snapshot){
    if(snapshot.exists()){
        const snapshotValues = snapshot.val()
        const restaurants = Object.values(snapshotValues)
        render(restaurants)
    }
})

function render(restaurants) {
    let listOfRestaurants = ""
    for(let i = 0; i < restaurants.length; i++){ //traverses through the snapshot values aka all the values in the database
        listOfRestaurants += `
        <p>
            ${restaurants[i]} 
        </p>
        `
    }
    list.innerHTML = listOfRestaurants
}

inputButton.addEventListener("click", function(){
    push(referenceInDb, restaurantInput.value)
    console.log("test #1")
    restaurantInput.value = ""
})

