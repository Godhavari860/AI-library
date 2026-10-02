const books = [

    {
        title: "Java Complete Reference",
        author: "Herbert Schildt",
        category: "Java",
        keywords: "java programming oop"
    },

    {
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        keywords: "software coding programming"
    },

    {
        title: "Web Development with HTML CSS JavaScript",
        author: "Jon Duckett",
        category: "Web Development",
        keywords: "html css javascript web"
    },

    {
        title: "Data Structures and Algorithms",
        author: "Michael T. Goodrich",
        category: "Computer Science",
        keywords: "data structures algorithms dsa"
    },

    {
        title: "Spring Boot in Action",
        author: "Craig Walls",
        category: "Java",
        keywords: "spring boot java backend"
    },

    {
        title: "Database System Concepts",
        author: "Abraham Silberschatz",
        category: "Database",
        keywords: "database sql mysql"
    },

    {
        title: "Artificial Intelligence",
        author: "Stuart Russell",
        category: "AI",
        keywords: "ai artificial intelligence machine learning"
    },

    {
        title: "Machine Learning with Java",
        author: "Various Authors",
        category: "AI",
        keywords: "machine learning java ai"
    }

];


// ================= PAGE NAVIGATION =================

function showPage(pageName, clickedElement) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });


    document
        .getElementById(pageName)
        .classList.add("active");


    const menuItems =
        document.querySelectorAll(".menu li");

    menuItems.forEach(item => {
        item.classList.remove("active");
    });


    if (clickedElement) {

        clickedElement.classList.add("active");

    }


    const titles = {

        dashboard:
            "Welcome Back, Keerthana! 👋",

        student:
            "Student Dashboard",

        library:
            "Library Dashboard",

        mybooks:
            "My Books",

        ai:
            "AI Book Recommendation",

        learning:
            "AI Learning Plan",

        settings:
            "Settings"

    };


    document
        .getElementById("pageTitle")
        .innerText = titles[pageName];

}


function displayBooks(bookArray) {

    const bookList =
        document.getElementById("bookList");


    bookList.innerHTML = "";


    bookArray.forEach(book => {

        const card =
            document.createElement("div");

        card.className = "book";


        card.innerHTML = `

            <div class="book-cover">
                📘
            </div>

            <span class="tag">
                ${book.category}
            </span>

            <h3>
                ${book.title}
            </h3>

            <p>
                By ${book.author}
            </p>

            <p>
                ${book.keywords}
            </p>

            <button
                class="secondary"
                onclick="viewBook('${book.title}')">

                View Book

            </button>

        `;


        bookList.appendChild(card);

    });

}

function searchBooks() {

    const searchText =
        document
        .getElementById("searchBox")
        .value
        .toLowerCase()
        .trim();


    const filteredBooks =
        books.filter(book => {

            return (

                book.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.author
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.keywords
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayBooks(filteredBooks);

}


function viewBook(title) {

    alert(
        "📚 Book Selected\n\n" +
        title +
        "\n\nYou can connect this button to MySQL/Spring Boot later."
    );

}

function recommendBooks() {

    const skills =
        document
        .getElementById("skills")
        .value
        .toLowerCase();


    const interests =
        document
        .getElementById("interests")
        .value
        .toLowerCase();


    const profile =
        skills + " " + interests;


    let results = [];


    books.forEach(book => {

        const text =
            (
                book.title +
                " " +
                book.category +
                " " +
                book.keywords
            ).toLowerCase();


        let score = 0;


        const words =
            profile.split(/[,\s]+/);


        words.forEach(word => {

            if (
                word.length > 1 &&
                text.includes(word)
            ) {

                score += 20;

            }

        });


        if (score === 0) {

            score = 50;

        }


        if (score > 98) {

            score = 98;

        }


        results.push({

            book: book,

            score: score

        });

    });


    results.sort(
        (a, b) =>
            b.score - a.score
    );


    results =
        results.slice(0, 3);


    displayRecommendations(results);

}


// ================= DISPLAY AI RESULTS =================

function displayRecommendations(results) {

    const box =
        document
        .getElementById("recommendations");


    box.innerHTML = "";


    results.forEach(result => {

        const card =
            document.createElement("div");


        card.className =
            "recommend-card";


        card.innerHTML = `

            <div class="book-cover">
                🤖
            </div>

            <h3>
                ${result.book.title}
            </h3>

            <p>
                By ${result.book.author}
            </p>

            <p>
                Recommended because it matches
                your skills and interests.
            </p>

            <div class="score">

                AI Match:
                ${result.score}%

            </div>

        `;


        box.appendChild(card);

    });

}

function generatePlan() {

    const topic =
        document
        .getElementById("topic")
        .value
        .trim();


    const selectedTopic =
        topic || "Java";


    const plan =
        document.createElement("div");


    plan.className =
        "plan-card";


    plan.innerHTML = `

        <h2>
            🧠 ${selectedTopic} Learning Plan
        </h2>

        <br>

        <p>
            Level:
            <b>Beginner</b>
        </p>

        <br>

        <p>
            Estimated Duration:
            <b>4 Weeks</b>
        </p>

        <br>

        <h3>
            Study Roadmap
        </h3>

        <ol>

            <li>
                Learn ${selectedTopic} basics
            </li>

            <li>
                Read recommended books
            </li>

            <li>
                Practice coding exercises
            </li>

            <li>
                Build a mini project
            </li>

            <li>
                Review and improve weak areas
            </li>

        </ol>

    `;


    const container =
        document.getElementById("plan");


    container.innerHTML = "";

    container.appendChild(plan);

}

document.getElementById("bookCount")
    .innerText = books.length;


displayBooks(books);