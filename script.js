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
let submitButton = document.getElementById("submit-button")
let deleteAll = document.getElementById("delete-all-button")

onValue(referenceInDb, function(snapshot){
    if(snapshot.exists()){
        const snapshotValues = snapshot.val()
        const restaurants = Object.entries(snapshotValues)
        render(restaurants)
    }
})

function deleteItem(event){
    const key = event.target.id;
    const itemRef = ref(database, `restaurants/${key}`);
    if(list.children.length==1){
        list.innerHTML = ""
    }

    remove(itemRef).then(() => {
        console.log(`Item with key ${key} removed`);
    }).catch((error) => {
        console.error("Error removing item:", error);
    });
    console.log(Object.values(itemRef))
}

function render(restaurants) {
    let listOfRestaurants = ""

    for(let i = 0; i < restaurants.length; i++){ //traverses through the snapshot values aka all the values in the database
        const [key, value] = restaurants[i]
        listOfRestaurants += `
        <div class="list-item item-${i}">
            <p>
                ${value} 
            </p>
            <button class="singleRemove ${i} hidden" id = "${key}">Remove</button>
        </div>
        `
        }
    list.innerHTML = listOfRestaurants

    let buttons = document.getElementsByClassName("singleRemove")
    let buttonList = []
    let i = 0
    const itemList = document.getElementsByClassName("list-item")

    for(let button of buttons) {
        button.addEventListener("click", deleteItem)
        console.log(button)
        buttonList.push("button " + i)
        i++
        console.log(i)
    }
    console.log(buttonList)
    for(let item of itemList) {
        item.addEventListener("mouseover", function(event){
            let classNumber = event.target.classList[1].substring(5)
            let buttons = document.getElementsByClassName(classNumber)
            buttons[0].classList.add("visible")
        })
        item.addEventListener("mouseout", function(event){
            let classNumber = event.target.classList[1].substring(5)
            let buttons = document.getElementsByClassName(classNumber)
            buttons[0].classList.remove("visible")
        })
    }
}

// function unhide(event){
//     event.target.classList.add("visible")
//     console.log(a)
//     console.log("unhidden!")
// }

submitButton.addEventListener("click", function(){
    if(restaurantInput.value !== ""){
    push(referenceInDb, restaurantInput.value)
    console.log("test #1")
    restaurantInput.value = ""
    }
})

deleteAll.addEventListener("click", function(){
    remove(referenceInDb)
    list.innerHTML = "Submit a new restuarant!"
})


