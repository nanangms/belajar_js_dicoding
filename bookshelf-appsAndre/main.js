const books = [];
let keyword = "";
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF-APPS";

const modalToggle = document.getElementById("my-modal-4");

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            console.log("book found");
            console.log(book);
            console.log("book found");
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const i in books) {
        if (books[i].id === bookId) {
            return i;
        }
    }
    return -1;
}

function isStorageExist() /* boolean */ {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(todoObject) {
    const { id, title, author, year, isComplete } = todoObject;
    let markBtn = isComplete ? `<a onClick="undoCompleted(${id})"><i class="w-4 h-4" data-feather="x-circle"></i></a>` : `<a onClick="addCompleted(${id})"><i class="w-4 h-4" data-feather="check-circle"></i></a>`;
    const html = `
        <div class="card bg-base-100 p-4 shadow-xl book">
            <h2 class="book-title text-lg font-semibold">${title}</h2>
            <p class="book-author italic">${author}</p>
            <p class="book-year font-extrabold text-right text-lg mb-4">${year}</p>
            <ul class="menu menu-horizontal bg-base-100 rounded-box ml-auto bg-primary/20">
                <li>
                    ${markBtn}
                </li>
                <li>
                <a onClick="openUpdateForm(${id})"><i class="w-4 h-4" data-feather="edit-2"></i></a>
                </li>
                <li>
                <a onClick="removeBook(${id})"><i class="w-4 h-4" data-feather="trash"></i></a>
                </li>
            </ul>
            <div class="card-actions justify-end">
                
            </div>
        </div>
    `;
    return html;
}

function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBook() {
    const bookId = document.getElementById("bookId").value;
    const title = document.getElementById("inputBookTitleEdit").value;
    const author = document.getElementById("inputBookAuthorEdit").value;
    const year = document.getElementById("inputBookYearEdit").value;
    const isComplete = document.getElementById("inputBookIsCompleteEdit").checked;

    const bookTarget = findBook(parseInt(bookId));
    bookTarget.title = title;
    bookTarget.author = author;
    bookTarget.year = year;
    bookTarget.isComplete = isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    modalToggle.checked = false;
}

function addCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function openUpdateForm(bookId) {
    modalToggle.checked = true;
    const book = findBook(bookId);
    fillUpdateForm(book);
}

function fillUpdateForm(book) {
    const bookId = document.getElementById("bookId");
    bookId.value = book.id;
    const title = document.getElementById("inputBookTitleEdit");
    title.value = book.title;
    const author = document.getElementById("inputBookAuthorEdit");
    author.value = book.author;
    const year = document.getElementById("inputBookYearEdit");
    year.value = book.year;
    const isComplete = document.getElementById("inputBookIsCompleteEdit");
    isComplete.value = book.isComplete;
}

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    const editForm = document.getElementById("editBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
    editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        editBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
    keyword = document.getElementById("inputKeyword").value;
    document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(SAVED_EVENT, () => {
    const toastId = +new Date() 
    const toast = document.querySelector('.toast')
    const alert = `
    <div class="alert alert-success bg-success/40" id="${toastId}">
        <div> Operasi Berhasil Dijalankan. </div>
    </div>
    `;
    toast.innerHTML = toast.innerHTML + alert;
    setTimeout(() => {
        const currentToast = document.getElementById(`${toastId}`)
        currentToast.remove()
    }, 3000);
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    let result = books;
    if (keyword !== "") {
        result = books.filter((book) => book.title.includes(keyword));
    }

    for (const book of result) {
        const bookElement = makeBook(book);
        const html = new DOMParser().parseFromString(bookElement, "text/html");
        const bookHTML = html.querySelector(".book");
        if (book.isComplete) {
            completeBookshelfList.append(bookHTML);
        } else {
            incompleteBookshelfList.append(bookHTML);
        }
    }

    feather.replace();
});
