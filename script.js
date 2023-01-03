// create an empty array that will hold the books entered by user
let books = [];

// on body load check if it is the first time visiting the web page
// if yes, set the books key to the strigified books array, and the coreRanBefore key to true
// otherwise get the books array value from the session storage
function myLoad(){
   if (sessionStorage.getItem("codeRanBefore") === null) {
    sessionStorage.setItem("books", JSON.stringify(books));
    sessionStorage.setItem("codeRanBefore", true);
   } else {
    books = JSON.parse(sessionStorage.getItem("books"));
   }
};

// create a constructor function for the book items that will be added
function NewBook(title, author, genre, review) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.review = review;
};

// create a function that will add the books to session storage and will display the items on screen
function addBook() {
    // get the updated values of the books array from session storage
    books = JSON.parse(sessionStorage.getItem("books"));
    // set the new item to be equal to the following object
    // the arguments passed in are the values retireved from the input fields
    let newItem = new NewBook(
        document.getElementById("title").value,
        document.getElementById("author").value,
        document.getElementById("genre").value,
        document.getElementById("review").value
    );
    // push this new item to the book array
    books.push(newItem);

    // once it has been added to the array, set the input fields value to ""
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";   
    document.getElementById("genre").value = "";
    document.getElementById("review").value = "";

    // update the session storage array 
    sessionStorage.setItem("books", JSON.stringify(books));
  
    // call the function that will display the new item on screen
    displayItem(newItem);
};

// create a function that will display the new item on screen
function displayItem(item) {
    // get the updated books array from session storage
    books = JSON.parse(sessionStorage.getItem("books"));
    // create a html div that will contain the information about the added book
    let htmlTag = document.createElement("div");
    // set the inner html of this div to input fields that contain the correct value, and add two buttons for each instance
    htmlTag.innerHTML = `
    <label for="book-title">Book Title: </label>
    <input class="disabled-functionality" type="text" name="title" id="book-title" value="${item.title}">
    <label for="book-author">Author: </label>
    <input class="disabled-functionality" type="text" name="author" id="book-author" value="${item.author}">
    <label for="book-genre">Genre: </label>
    <input class="disabled-functionality" type="text" name="genre" id="book-genre" value="${item.genre}">
    <label for="review">Review: </label>
        <select id="review" class="disabled-functionality">
            <option value="${item.review}">${item.review}</option>
            <option value="1star">1 star</option>
            <option value="2star">2 star</option>
            <option value="3star">3 star</option>
            <option value="4star">4 star</option>
            <option value="5star">5 star</option>
        </select>
    <button class="edit-btn">edit</button>
    <button class="delete-btn">delete</button>`;

    // get hold of the main list container and add the book instances to it
    let bookList = document.getElementById("list");
    bookList.appendChild(htmlTag);
   
    // add an event listener to each of the instances created
    htmlTag.addEventListener("click", function(e) {
        // if the target that was clicked has the class edit button call the edit function
        if (e.target.className === "edit-btn") {
            edit(e);
        };
        // if the target that was clicked has the class delete button call the deleteItem function
        if (e.target.className === "delete-btn") {
            deleteItem(e);
        };
    });
}

// create a function that will delete book instances
function deleteItem(e) {
    // get hold of the main list container and the container for the book instance
    let bookDiv = e.target.parentNode;
    let bookContainer = bookDiv.parentNode;
    // remove the book from the list
    bookContainer.removeChild(bookDiv);

    // retrieve the information and tags that are inside the individual book containers
    let valueCollection = e.target.parentNode.children;
    // create an array from these values
    let arrayFromCollection = Array.from(valueCollection);
    
    // create a new array where the values of the input and select field will be sent over
    // the values are in order meaning title, author, genre, review, and have a fixed length
    let arr = [];
    arrayFromCollection.forEach(function(item) {
        // if the tagname is either input or select push the value of these to the array
        if (item.tagName === "INPUT" || item.tagName === "SELECT") {
            arr.push(item.value);
        };
    });

    // create an object and set the key value pairs. the object has the same keys as the constructor function for book items
    let toBeDeletedObject = {
        title: arr[0],
        author: arr[1],
        genre: arr[2],
        review: arr[3]
    };

    // now we can compare this object that will be deleted to the sessionstorage array that we have
    // checking if there is any object that matches the one created now, by looping through the session storage array
    books = JSON.parse(sessionStorage.getItem("books"));
    for (let i = 0; i < books.length; i++) {
        // if there is an exact match remove that book item from the books array
        if (JSON.stringify(toBeDeletedObject) === JSON.stringify(books[i])) {
            books.splice(i, 1);
        };
    };
    // update the books session storage array
    sessionStorage.setItem("books", JSON.stringify(books));
};

// create an index varibale
let index;
// create a function that will edit the book instance that was clicked. the event will be sent over as argument
function edit(e) {
    // get the updated books array from the session storage
    books = JSON.parse(sessionStorage.getItem("books"));
    // get hold of the div of the delete button and the children of that div
    let parentEl = e.target.parentNode.children;
    // create an array from those html tag elements
    let tagElementsArray = Array.from(parentEl);
    // create two new empty arrays for later use
    let initialValues = [];
    let finalValues = [];
    // for each item in the newly created array execute some if checks
    tagElementsArray.forEach(function(item) {
        // if the classname is disabled functionality remove it so it can be edited (this happens when the edit button was clicked)
        if(item.className === "disabled-functionality") {
            item.classList.remove("disabled-functionality");
        };

        // if the button has the edit text
        if(item.textContent === "edit"){
            // change the text to save
            item.innerHTML = "Save";
            // loop through the tagElements array again
            tagElementsArray.forEach(function(item) {
                // for each input or select tag, retrieve the value and add it to an array
                if(item.tagName === "INPUT" || item.tagName === "SELECT") {
                    initialValues.push(item.value);
                };
            });

            // create an object that is the one being edited, and set the values of this object to the initial values, before any editing
            let toBeEditedObject = {
                title: initialValues[0],
                author: initialValues[1],
                genre: initialValues[2],
                review: initialValues[3]
            };

            // loop through the books array from the session storage
            for(let i = 0; i < books.length; i++) {
                // check if any of the session storage items match with the toBeEditedObject object
                if(JSON.stringify(toBeEditedObject) === JSON.stringify(books[i])) {
                    // if yes, set the index variable to the index of that object that matches
                    index = i;
                };
            };
        // if the button´s text is save
        } else if (item.textContent === "Save") {
            // check for input and select tags from the tag elements array
            tagElementsArray.forEach(function(item) {
                if(item.tagName === "INPUT" || item.tagName === "SELECT") {
                    // retrieve for each input or select tag the value and add it to the final values array
                    finalValues.push(item.value);
                    // and add the disabled functionality class back
                    item.classList.add("disabled-functionality");
                };
            });

            // change the books session storage object with the new values from the final Values array
            books[index] = {
                title: finalValues[0],
                author: finalValues[1],
                genre: finalValues[2],
                review: finalValues[3]
            };
            // change the buttons text back to edit
            item.innerHTML = "edit";
        };
    });

    // update the session storage books array
    sessionStorage.setItem("books", JSON.stringify(books));
};


// add an event listener to the page, whenever it is reloaded display all 
// items from the books array
window.addEventListener("load", function(){
    books.forEach(function(item) {
        displayItem(item);
    });
});