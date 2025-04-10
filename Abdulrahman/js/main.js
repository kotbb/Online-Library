// let books;
// const fetchBooks = async () => {
//   const res = await fetch("https://www.freetestapi.com/api/v1/books");
//   books = await res.json();
//   console.log(books);
// };

const borrowedList = document.getElementById("borrowed-list");
const mobileList = document.getElementById("mobile-list");
const navLinks = document.getElementById("nav-links");

let borrowedBooks = [];

const fetchBooks = async () => {
  const res = await fetch("../borrowedBooks.json");
  borrowedBooks = await res.json();
  displayBooks(borrowedBooks);
};

const displayBooks = (books) => {
  borrowedList.innerHTML = "";
  if (books.length === 0) {
    borrowedList.innerHTML = "<p style='margin:2px auto; font-size:2rem;'>No books borrowed</p>";
    return;
  } else {
    books.forEach((book) => {
      const bookCard = createBookCard(book);
      borrowedList.appendChild(bookCard);
    });
  }
};

const createBookCard = (book) => {
  const card = document.createElement("div");
  card.className = "book-card";
  card.innerHTML = `
        <div class="book-cover">
              <img src="${book.cover_image}" alt="Book Cover" />
            </div>
            <div class="book-info">
              <h3>${book.title}</h3>
              <p class="author">${book.author}</p>
            </div>
            <div class="book-details">
              <p class="">
                <i class="fas fa-calendar"></i> Due Date: 2025-04-08
              </p>
              <p class=""><i class="fas fa-clock"></i> time</p>
            </div>
            <button class="btn return-btn" data-id="${book.id}">Return Book</button>
    `;
  return card;
};

const returnBook = (id) => {
  borrowedBooks = borrowedBooks.filter((book) => book.id != id);
  console.log(borrowedBooks);
  displayBooks(borrowedBooks);
};

const setupEventListeners = () => {

    mobileList.addEventListener("click",(e)=>{
        e.preventDefault();
        mobileList.innerHTML = `<i class='fas fa-${navLinks.classList.contains('active')?'bars' :'times'}'></i>`
        navLinks.classList.toggle("active");
    })


  borrowedList.addEventListener("click", (e) => {
    const returnBtn = e.target.closest(".return-btn");
    if (returnBtn) {
      returnBook(returnBtn.dataset.id);
    }
  });
};

async function init() {
  await fetchBooks();
  setupEventListeners();
}

init();
