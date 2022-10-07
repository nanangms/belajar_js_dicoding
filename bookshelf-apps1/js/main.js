document.addEventListener("DOMContentLoaded", function () {
  //footer();

  const inputBook = document.getElementById("inputBook");
  const inputSearchBook = document.getElementById("searchBook");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  inputSearchBook.addEventListener("keyup", function (event) {
    event.preventDefault();
    searchBook();
  });

  inputSearchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  inputBookIsComplete.addEventListener("input", function (event) {
    event.preventDefault();
    checkButton();
  });

  // if (isStorageExist()) {
  //   loadDataFromStorage();
  // }
});

document.addEventListener("ondatasaved", () => {
  console.log("Buku berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
});

function checkButton() {
    const span = document.querySelector("span");
    if (inputBookIsComplete.checked) {
        span.innerText = "Selesai dibaca";
    } else {
        span.innerText = "Belum selesai dibaca";
    }
}

function addBook() {
    //const incompleteBookshelfList = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
    //const completeBookshelfList = document.getElementById(COMPLETED_READ_BOOK_ID);
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const book = makeBook(bookTitle, `Penulis: ${bookAuthor}`, `Tahun: ${bookYear}`, isComplete);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isComplete);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isComplete) {
        completeBookshelfList.append(book);
    } else {
        incompleteBookshelfList.append(book);
    }
    //updateDataToStorage();
}

function makeBook(title, author, year, isComplete) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = author;

    const bookYear = document.createElement("p");
    bookYear.innerText = year;

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
    if (isComplete) {
        bookAction.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        bookAction.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(bookTitle, bookAuthor, bookYear, bookAction);

    return container;
}

function createUndoButton() {
    return createButton("green", "Belum selesai dibaca", function (event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("red", "Hapus buku", function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("green", "Selesai dibaca", function (event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass, buttonText, eventListener) {
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}

function addBookToCompleted(bookElement) {
    const completeBookshelfList = document.getElementById(COMPLETED_READ_BOOK_ID);
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;

    completeBookshelfList.append(newBook);
    bookElement.remove();

    //updateDataToStorage();
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}