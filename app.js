// Book constructor function to create new book objects
function Book(title, author, pages, hasRead, image) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.hasRead = hasRead;
  this.image = image;
}

let library = []; // Array to hold all book objects

// Adds a new book to the library array and updates UI + storage
function addBookToLibrary(book) {
  library.push(book);
  saveLibrary();
  displayBooks();
}

// Saves the current library array to localStorage
function saveLibrary() {
  localStorage.setItem('myLibrary', JSON.stringify(library));
}

// Loads books from localStorage and repopulates the library array
function loadLibrary() {
  const stored = localStorage.getItem('myLibrary');
  if (stored) {
    const parsed = JSON.parse(stored);
    library = parsed.map(
      (book) =>
        new Book(book.title, book.author, book.pages, book.hasRead, book.image)
    );
    displayBooks();
  }
}

// Displays all books (or filtered ones) on the page
function displayBooks(books = library) {
  const container = document.getElementById('library');
  container.innerHTML = ''; // Clear previous books

  books.forEach((book, index) => {
    const card = document.createElement('div');
    card.className = 'border p-4 rounded shadow bg-white dark:bg-gray-700';

    // Conditionally add the image only if one exists
    card.innerHTML = `
      ${
        book.image
          ? `<img src="${book.image}" alt="${book.title}" class="w-full max-h-60 object-contain mb-2 rounded border">`
          : ''
      }
      <h2 class="text-lg font-bold mb-1 text-gray-900 dark:text-white">${
        book.title
      }</h2>
      <p class="text-gray-700 dark:text-gray-200">Author: ${book.author}</p>
      <p class="text-gray-700 dark:text-gray-200">Pages: ${book.pages}</p>
      <p class="text-gray-700 dark:text-gray-200">Status: <span class="font-semibold">${
        book.hasRead ? 'Read ✅' : 'Not Read ❌'
      }</span></p>
      <div class="flex gap-2 mt-3">
        <button data-index="${index}" class="toggleRead bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Toggle Read</button>
        <button data-index="${index}" class="deleteBook bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Add event listeners for toggle read buttons
  document.querySelectorAll('.toggleRead').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      library[idx].hasRead = !library[idx].hasRead;
      saveLibrary();
      displayBooks();
    });
  });

  // Add event listeners for delete buttons
  document.querySelectorAll('.deleteBook').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      library.splice(idx, 1);
      saveLibrary();
      displayBooks();
    });
  });
}

// Form submit handler to add new book
document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const hasRead = document.getElementById('hasRead').checked;
  let image = document.getElementById('image').value.trim();

  // If user enters an image, check if it's a valid image URL
  if (image && !isValidImageURL(image)) {
    alert('Please enter a valid image URL ending in .jpg, .jpeg, or .png.');
    return;
  }

  const newBook = new Book(title, author, pages, hasRead, image);
  addBookToLibrary(newBook);
  this.reset(); // Clear form after adding
});

// Filter/search input for books by title or author
document.getElementById('searchInput').addEventListener('input', function (e) {
  const term = e.target.value.toLowerCase();
  const filtered = library.filter(
    (book) =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
  );
  displayBooks(filtered);
});

// Clears all books from localStorage and UI
function clearLibrary() {
  localStorage.clear();
  library = [];
  displayBooks();
}

// Toggle between light and dark mode
function toggleTheme() {
  const body = document.getElementById('body');
  const app = document.getElementById('appContainer');
  const toggleText = document.getElementById('titleText');
  const toggleBtn = document.getElementById('toggleBtn');
  body.classList.toggle('dark-mode');
  app.classList.toggle('dark-mode');
  toggleText.classList.toggle('text-white');
  toggleBtn.classList.toggle('text-white');
}

// Optional helper to check if image URL is valid
function isValidImageURL(url) {
  return /\.(jpeg|jpg|png)$/i.test(url);
}

// Load any saved books when page loads
loadLibrary();
