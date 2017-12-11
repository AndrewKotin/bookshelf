/***
 * BOOK 228 Framework v.1.1.228
 * */
//Класс сущности книги
class Book {
    constructor(title, author, year, image) {
        this.id = Math.random() * (9999 - 1000) + 1000;
        this.title = title;
        this.author = author;
        this.year = year;
        this.image = image;
    }
}
//Абстрактный класс страницы приложения
class Page {
    constructor(id, pathToContent, app) {
        this.App = app;
        this.id = id;
        this.pathToContent = pathToContent;
        this.domElement = document.getElementById(this.id);
        this.contentElement = this.pathToContent
            ? this.domElement.querySelector(this.pathToContent)
            : this.domElement;
    }
    /**
     * Показать страницу
     * */
    show(...params) {
        this.domElement.classList.add("show");
        this.render(...params);
    }
    /**
     *Скрыть страницу
     * */
    hide(...params) {
        this.domElement.classList.remove("show");
        this.render(...params);
    }
    /**
     * метод отображающий контент страницы
     * */
    render() {
        this.contentElement.innerHTML = null;
    }
}
//Коллекция книг
const BOOKS_MOCK = [
    new Book("JavaScript. Оптимизация производительности", "Николас Закас", 2012, "https://ozon-st.cdn.ngenix.net/multimedia/1005511392.jpg"),
    new Book("JavaScript. Шаблоны", "Стоян Стефанов", 2011, "https://ozon-st.cdn.ngenix.net/multimedia/1002535209.jpg"),
    new Book("ES6 и не только", "Кайл Симпсон", 2017, "https://ozon-st.cdn.ngenix.net/multimedia/1015269939.jpg"),
    new Book("Изучаем JavaScript. Руководство по созданию современных веб-сайтов", "Этан Браун", 2017, "https://ozon-st.cdn.ngenix.net/multimedia/1019046801.jpg"),
];

// Страница списка книг
class BookList extends Page {
    constructor(id, app) {
        super(id, ".table > tbody", app);
        this.BOOKS_DATA = this.App.BOOKS_DATA;
    }
    /**
    * Отрисовка списка книг
    * */
    render() {
        super.render();
        if(!this.BOOKS_DATA.length) {
            this.contentElement.innerHTML = "На данный момент нет добавленных книг.";
        }
        this.BOOKS_DATA.forEach((book, ix) => {
            const bookDOM = document.createElement('tr');
            bookDOM.innerHTML = `
                        <tr>
							<td>
								<img src="${book.image}" width="150px" alt="js">
							</td>
							<td>
								<h2>${book.title}</h2>
								<h3>${book.author}</h3>
								<span>${book.year} год</span>
							</td>
							<td>
								<button class="btn edit color-edit">Редактировать</button>
								<br>
								<button class="btn del color-del">Удалить</button>
							</td>
						</tr>`;

            bookDOM.querySelector(".edit").addEventListener("click", this.editBook.bind(this, book));

            bookDOM.querySelector(".del").addEventListener("click", this.removeBook.bind(this, ix));

            this.contentElement.appendChild(bookDOM);
        });
    }
    /**
     * Удаление книги из списка
     * */
    removeBook(bookIx) {
        this.BOOKS_DATA.splice(bookIx, 1);
        this.render();
    }
    /**
     * Открытие страницы редактирования конкретной книги
     * */
    editBook(book) {
        this.App.editBook(book);
    }
}
//Страница редактирования книги
class BookEditor extends Page {
    constructor(id, app) {
        super(id, null, app);
        this.book = null;
        this.pageTitleElement = this.domElement.querySelector(".page-title");
        this.titleInput = this.domElement.querySelector("#title");
        this.authorInput = this.domElement.querySelector("#author");
        this.yearInput = this.domElement.querySelector("#year");
        this.imageInput = this.domElement.querySelector("#image");

        this.domElement.querySelector("#save").addEventListener("click", this.saveBook.bind(this));
        this.domElement.querySelector("#cancel").addEventListener("click", () => {
            this.App.showPage("booklist");
        });
    }
    /**
     * Отрисовка редактора книги
     * */
    render(book = null) {
        this.clear();
        this.book = book;
        this.pageTitleElement.innerHTML = this.book
            ? "Редактирование книги"
            : "Новая книга";

        if (this.book) {
            this.titleInput.value = this.book.title;
            this.authorInput.value = this.book.author;
            this.yearInput.value = this.book.year;
            this.imageInput.value = this.book.image;
        }
    }
    /**
     * Сохранение книги
     * */
    saveBook() {
        // если в режиме редактирования
        if (this.book) {
            // обновляем данные книги
            this.book.title = this.titleInput.value;
            this.book.author = this.authorInput.value;
            this.book.year = this.yearInput.value;
            this.book.image = this.imageInput.value;
        } else {
        // иначе добавляем в коллекцию новую книгу
            this.App.BOOKS_DATA.push(
                new Book(
                    this.titleInput.value,
                    this.authorInput.value,
                    this.yearInput.value,
                    this.imageInput.value
                )
            );
        }
        // переходим на страницу списка книг
        this.App.showPage("booklist");
        this.clear();
    }
    /**
     * Отчистка полей формы редактирования
     * */
    clear() {
        this.titleInput.value = null;
        this.authorInput.value = null;
        this.yearInput.value = null;
        this.imageInput.value = null;
    }
}
//Класс приложения
class App {
    constructor() {
        this.BOOKS_DATA = BOOKS_MOCK;
        this.pages = [new BookList("booklist", this), new BookEditor("editbook", this)];
        document.getElementById("create").addEventListener("click", () => {
            this.editBook();
        });
    }
    /**
     * Запуск приложения
     * */
    init() {
        this.showPage("booklist");
    }
    /**
     * Открытие страницы редактирования конкретной книги
     * */
    editBook(book = null) {
        this.showPage("editbook", book);
    }
    /**
     * Перейти конкретную на страницу
     * */
    showPage(pageId, ...params) {
        this.pages.forEach(page => {
            if (pageId === page.id) {
                page.show(...params);
            } else {
                page.hide();
            }
        });
    }
}
//Запуск приложения
window.onload = () => {
    new App().init();
};
