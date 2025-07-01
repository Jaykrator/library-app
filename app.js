function Book(title, author, pages, hasRead, image) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.hasRead = hasRead;
  this.image = image;
}

let library = [];

// ✅ Validate image URL
function isValidImageURL(url) {
  return url.match(/\.(jpeg|jpg|png)$/i);
}

function addBookToLibrary(book) {
  library.push(book);
  saveLibrary();
  displayBooks();
}

function saveLibrary() {
  localStorage.setItem('myLibrary', JSON.stringify(library));
}

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

function displayBooks(books = library) {
  const container = document.getElementById('library');
  container.innerHTML = '';

  books.forEach((book, index) => {
    const card = document.createElement('div');
    card.className = 'border p-4 rounded shadow bg-white dark:bg-gray-700';

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
      <p class="text-gray-700 dark:text-gray-200">Status: <span class="font-semibold">
        ${book.hasRead ? 'Read ✅' : 'Not Read ❌'}
      </span></p>
      <div class="flex gap-2 mt-3">
        <button data-index="${index}" class="toggleRead bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Toggle Read</button>
        <button data-index="${index}" class="deleteBook bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Toggle Read/Not Read
  document.querySelectorAll('.toggleRead').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      library[idx].hasRead = !library[idx].hasRead;
      saveLibrary();
      displayBooks();
    });
  });

  // Delete Book
  document.querySelectorAll('.deleteBook').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      library.splice(idx, 1);
      saveLibrary();
      displayBooks();
    });
  });
}

// ✅ Handle form submit
document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const hasRead = document.getElementById('hasRead').checked;
  let image = document.getElementById('image').value.trim();

  // Validate and handle image URL
  if (image && !isValidImageURL(image)) {
    alert(
      'Please enter a valid image URL ending in .jpg, .jpeg, or .png. A placeholder will be used.'
    );
    image = 'https://via.placeholder.com/150';
  }

  if (!image) {
    image = 'https://via.placeholder.com/150'; // fallback
  }

  const newBook = new Book(title, author, pages, hasRead, image);
  addBookToLibrary(newBook);
  this.reset();
});

// ✅ Search input
document.getElementById('searchInput').addEventListener('input', function (e) {
  const term = e.target.value.toLowerCase();
  const filtered = library.filter(
    (book) =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
  );
  displayBooks(filtered);
});

// ✅ Clear all books
function clearLibrary() {
  localStorage.clear();
  library = [];
  displayBooks();
}

// ✅ Theme toggle
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

// ✅ Initial load
loadLibrary();
