/* =====================================================
   UniManage AI - Functional JavaScript
===================================================== */


/* ================= DATA ================= */

let profile = JSON.parse(
    localStorage.getItem("uniProfile")
) || {
    name: "Godhavari",
    email: "godhavari@example.com",
    course: "BCA"
};


let borrowedBooks = JSON.parse(
    localStorage.getItem("borrowedBooks")
) || [];


let completedWeeks = JSON.parse(
    localStorage.getItem("completedWeeks")
) || [1, 2];


let historyBooks = JSON.parse(
    localStorage.getItem("historyBooks")
) || [];


/* ================= PAGE NAVIGATION ================= */

const pageNames = {
    dashboard: "Dashboard",
    student: "Student Profile",
    library: "Library",
    mybooks: "My Books",
    ai: "AI Recommendation",
    learning: "Learning Plan",
    settings: "Settings"
};


document.querySelectorAll(".menu").forEach(button => {

    button.addEventListener("click", () => {

        const page = button.dataset.page;

        showPage(page);

    });

});


function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });


    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    document.querySelectorAll(".menu").forEach(menu => {
        menu.classList.remove("active");
    });


    const activeMenu = document.querySelector(
        `.menu[data-page="${pageId}"]`
    );

    if (activeMenu) {
        activeMenu.classList.add("active");
    }


    document.getElementById("pageTitle").textContent =
        pageNames[pageId] || "UniManage AI";


    history.replaceState(null, "", "#" + pageId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================= QUICK NAVIGATION ================= */

function openLibrary() {
    showPage("library");
}

function openAI() {
    showPage("ai");
}


/* ================= PROFILE ================= */

function updateProfileUI() {

    const name = profile.name;
    const email = profile.email;
    const course = profile.course;


    document.getElementById("sideName").textContent = name;

    document.getElementById("topName").textContent = name;

    document.getElementById("dashName").textContent = name;

    document.getElementById("profileName").textContent = name;

    document.getElementById("profileCourse").textContent =
        course + " Student";

    document.getElementById("infoName").textContent = name;

    document.getElementById("infoEmail").textContent = email;

    document.getElementById("infoCourse").textContent = course;


    const firstLetter =
        name.charAt(0).toUpperCase() || "G";

    document.getElementById("profileAvatar").textContent =
        firstLetter;

    document.getElementById("topAvatar").textContent =
        firstLetter;

    document.querySelector(".avatar").textContent =
        firstLetter;


    document.getElementById("settingsName").value = name;

    document.getElementById("settingsEmail").value = email;

    document.getElementById("settingsCourse").value = course;
}


/* ================= STUDENT MODAL ================= */

function openStudentModal() {

    document.getElementById("editName").value =
        profile.name;

    document.getElementById("editEmail").value =
        profile.email;

    document.getElementById("editCourse").value =
        profile.course;

    document
        .getElementById("studentModal")
        .classList.add("show");
}


function closeStudentModal() {

    document
        .getElementById("studentModal")
        .classList.remove("show");
}


function saveStudentProfile() {

    const name =
        document.getElementById("editName").value.trim();

    const email =
        document.getElementById("editEmail").value.trim();

    const course =
        document.getElementById("editCourse").value.trim();


    if (!name || !email || !course) {

        showToast(
            "Please fill all fields",
            "⚠️"
        );

        return;
    }


    profile = {
        name,
        email,
        course
    };


    localStorage.setItem(
        "uniProfile",
        JSON.stringify(profile)
    );


    updateProfileUI();

    closeStudentModal();

    showToast(
        "Profile updated successfully",
        "✅"
    );
}


/* ================= LIBRARY SEARCH ================= */

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


searchInput.addEventListener(
    "input",
    filterBooks
);

categoryFilter.addEventListener(
    "change",
    filterBooks
);


function filterBooks() {

    const search =
        searchInput.value.toLowerCase().trim();

    const category =
        categoryFilter.value;


    const cards =
        document.querySelectorAll(".library-card");


    cards.forEach(card => {

        const title =
            card.dataset.title.toLowerCase();

        const author =
            card.dataset.author.toLowerCase();

        const cardCategory =
            card.dataset.category;


        const matchesSearch =
            title.includes(search) ||
            author.includes(search);


        const matchesCategory =
            category === "all" ||
            cardCategory === category;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


/* ================= BORROW BOOK ================= */

document.querySelectorAll(".borrow-btn").forEach(button => {

    button.addEventListener("click", function () {

        const card =
            this.closest(".library-card");

        const title =
            card.dataset.title;

        const author =
            card.dataset.author;

        const category =
            card.dataset.category;


        borrowBook(
            title,
            author,
            category,
            this
        );

    });

});


function borrowBook(
    title,
    author,
    category,
    button
) {

    const alreadyBorrowed =
        borrowedBooks.some(
            book => book.title === title
        );


    if (alreadyBorrowed) {

        showToast(
            "You already borrowed this book",
            "⚠️"
        );

        return;
    }


    const today =
        new Date();

    const dueDate =
        new Date(today);

    dueDate.setDate(
        dueDate.getDate() + 14
    );


    const book = {

        id: Date.now(),

        title,

        author,

        category,

        borrowedDate:
            today.toLocaleDateString(),

        dueDate:
            dueDate.toLocaleDateString(),

        progress: 0

    };


    borrowedBooks.push(book);


    saveBorrowedBooks();

    renderBorrowedBooks();

    updateLibraryButtons();

    updateStats();


    showToast(
        `"${title}" borrowed successfully`,
        "📚"
    );
}


/* ================= MY BOOKS ================= */

function renderBorrowedBooks() {

    const container =
        document.getElementById(
            "borrowedBooksList"
        );


    if (borrowedBooks.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div>📚</div>
                <h3>No books borrowed</h3>
                <p>Go to Library and borrow a book.</p>

                <button class="primary-btn"
                        onclick="openLibrary()">
                    Explore Library
                </button>
            </div>
        `;

        return;
    }


    container.innerHTML =
        borrowedBooks.map(book => `

            <div class="borrowed-book">

                <div class="book-cover">
                    📖
                </div>

                <div class="borrowed-book-info">

                    <h3>${book.title}</h3>

                    <p>
                        ${book.author} • ${book.category}
                    </p>

                    <p>
                        Due: ${book.dueDate}
                    </p>

                </div>


                <div class="book-progress">

                    <small>
                        ${book.progress}% completed
                    </small>

                    <div class="progress-line">
                        <div style="width:${book.progress}%"></div>
                    </div>

                </div>


                <div class="book-actions">

                    <button
                        class="small-btn continue-btn"
                        onclick="continueReading(${book.id})">

                        +10%

                    </button>


                    <button
                        class="small-btn return-btn"
                        onclick="returnBook(${book.id})">

                        Return

                    </button>

                </div>

            </div>

        `).join("");
}


/* ================= CONTINUE READING ================= */

function continueReading(id) {

    const book =
        borrowedBooks.find(
            item => item.id === id
        );


    if (!book) return;


    if (book.progress < 100) {

        book.progress += 10;

    }


    if (book.progress >= 100) {

        book.progress = 100;

        showToast(
            `"${book.title}" completed!`,
            "🏆"
        );

    } else {

        showToast(
            `Reading progress: ${book.progress}%`,
            "📖"
        );

    }


    saveBorrowedBooks();

    renderBorrowedBooks();

    updateStats();
}


/* ================= RETURN BOOK ================= */

function returnBook(id) {

    const index =
        borrowedBooks.findIndex(
            book => book.id === id
        );


    if (index === -1) return;


    const book =
        borrowedBooks[index];


    borrowedBooks.splice(index, 1);


    historyBooks.push({

        title: book.title,

        returnedDate:
            new Date().toLocaleDateString()

    });


    localStorage.setItem(
        "historyBooks",
        JSON.stringify(historyBooks)
    );


    saveBorrowedBooks();

    renderBorrowedBooks();

    updateLibraryButtons();

    updateStats();


    showToast(
        `"${book.title}" returned successfully`,
        "✅"
    );
}


/* ================= LIBRARY BUTTON STATUS ================= */

function updateLibraryButtons() {

    document.querySelectorAll(
        ".library-card"
    ).forEach(card => {

        const title =
            card.dataset.title;

        const button =
            card.querySelector(
                ".borrow-btn"
            );


        const borrowed =
            borrowedBooks.some(
                book => book.title === title
            );


        if (borrowed) {

            button.textContent =
                "✓ Borrowed";

            button.disabled = true;

            button.style.opacity = ".6";

        } else {

            button.textContent =
                "Borrow Book";

            button.disabled = false;

            button.style.opacity = "1";

        }

    });
}


/* ================= SAVE BOOKS ================= */

function saveBorrowedBooks() {

    localStorage.setItem(
        "borrowedBooks",
        JSON.stringify(borrowedBooks)
    );
}


/* ================= STATISTICS ================= */

function updateStats() {

    const count =
        borrowedBooks.length;


    document.getElementById(
        "borrowedCount"
    ).textContent = count;


    document.getElementById(
        "myBooksCount"
    ).textContent = count;


    const completed =
        borrowedBooks.filter(
            book => book.progress === 100
        ).length;


    document.getElementById(
        "completedBooks"
    ).textContent = completed;


    document.getElementById(
        "booksRead"
    ).textContent =
        historyBooks.length + completed;


    const available =
        6 - borrowedBooks.length;


    document.getElementById(
        "availableCount"
    ).textContent =
        Math.max(0, available);


    const dueSoon =
        borrowedBooks.filter(book => {

            const due =
                new Date(book.dueDate);

            const today =
                new Date();

            const diff =
                (due - today) /
                (1000 * 60 * 60 * 24);

            return diff <= 3;

        }).length;


    document.getElementById(
        "dueSoon"
    ).textContent = dueSoon;
}


/* ================= AI ================= */

function generateAI() {

    const skills =
        document.getElementById(
            "skills"
        ).value.toLowerCase();

    const interests =
        document.getElementById(
            "interests"
        ).value.toLowerCase();

    const level =
        document.getElementById(
            "level"
        ).value;


    let recommendations = [];


    if (
        skills.includes("html") ||
        skills.includes("css") ||
        interests.includes("web")
    ) {

        recommendations.push({
            icon: "🌐",
            title: "Web Development",
            text:
                "Improve your HTML, CSS and JavaScript skills."
        });

    }


    if (
        skills.includes("java") ||
        interests.includes("java")
    ) {

        recommendations.push({
            icon: "☕",
            title: "Java Programming",
            text:
                "Strengthen Java and backend programming."
        });

    }


    if (
        interests.includes("ai") ||
        interests.includes("artificial")
    ) {

        recommendations.push({
            icon: "🤖",
            title: "Artificial Intelligence",
            text:
                "Learn AI concepts and intelligent systems."
        });

    }


    if (
        interests.includes("machine") ||
        interests.includes("ml")
    ) {

        recommendations.push({
            icon: "🧠",
            title: "Machine Learning",
            text:
                "Learn prediction and machine learning algorithms."
        });

    }


    if (recommendations.length === 0) {

        recommendations = [

            {
                icon: "🤖",
                title: "Artificial Intelligence",
                text:
                    "A great starting point for AI learning."
            },

            {
                icon: "🌐",
                title: "Web Development",
                text:
                    "Build modern and responsive websites."
            },

            {
                icon: "☕",
                title: "Java Programming",
                text:
                    "Learn object-oriented programming."
            }

        ];

    }


    const results =
        document.getElementById(
            "aiResults"
        );


    results.innerHTML =
        recommendations.map(book => `

            <div class="recommend-card">

                <div class="recommend-icon">
                    ${book.icon}
                </div>

                <span>
                    AI Recommended
                </span>

                <h3>
                    ${book.title}
                </h3>

                <p>
                    ${book.text}
                </p>

                <button
                    onclick="viewRecommendation('${book.title}')">

                    View Details

                </button>

            </div>

        `).join("");


    document.getElementById(
        "aiCount"
    ).textContent =
        recommendations.length;


    showToast(
        `AI generated ${recommendations.length} recommendations for ${level} level`,
        "🤖"
    );
}


/* ================= AI DETAILS ================= */

function viewRecommendation(title) {

    document.getElementById(
        "bookModalTitle"
    ).textContent = title;


    document.getElementById(
        "bookModalText"
    ).textContent =
        `${title} is recommended based on your skills and learning interests. Start learning this topic to improve your knowledge.`;


    document
        .getElementById("bookModal")
        .classList.add("show");
}


function closeBookModal() {

    document
        .getElementById("bookModal")
        .classList.remove("show");
}


/* ================= LEARNING PLAN ================= */

document.querySelectorAll(
    ".complete-btn"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const week =
                Number(
                    button.dataset.week
                );


            if (
                completedWeeks.includes(week)
            ) {

                completedWeeks =
                    completedWeeks.filter(
                        item => item !== week
                    );

                button.textContent =
                    "Mark Complete";

                button.closest(
                    ".week-card"
                ).classList.remove(
                    "completed"
                );

            } else {

                completedWeeks.push(week);

                button.textContent =
                    "✓ Completed";

                button.closest(
                    ".week-card"
                ).classList.add(
                    "completed"
                );

            }


            localStorage.setItem(
                "completedWeeks",
                JSON.stringify(
                    completedWeeks
                )
            );


            updateLearningProgress();


            showToast(
                `Week ${week} updated`,
                "📊"
            );

        }
    );

});


function updateLearningProgress() {

    const progress =
        Math.round(
            (completedWeeks.length / 4) * 100
        );


    document.getElementById(
        "learningProgress"
    ).style.width =
        progress + "%";


    document.getElementById(
        "learningText"
    ).textContent =
        progress + "% completed";


    document.getElementById(
        "dashProgress"
    ).textContent =
        progress + "%";
}


/* ================= SETTINGS ================= */

function saveSettings() {

    const name =
        document.getElementById(
            "settingsName"
        ).value.trim();

    const email =
        document.getElementById(
            "settingsEmail"
        ).value.trim();

    const course =
        document.getElementById(
            "settingsCourse"
        ).value.trim();


    if (!name || !email || !course) {

        showToast(
            "Please fill all profile fields",
            "⚠️"
        );

        return;
    }


    profile = {
        name,
        email,
        course
    };


    localStorage.setItem(
        "uniProfile",
        JSON.stringify(profile)
    );


    updateProfileUI();


    showToast(
        "Settings saved successfully",
        "💾"
    );
}


/* ================= DARK MODE ================= */

const darkMode =
    document.getElementById(
        "darkMode"
    );


darkMode.addEventListener(
    "change",
    () => {

        if (darkMode.checked) {

            document.body.classList.add(
                "dark"
            );

            localStorage.setItem(
                "darkMode",
                "true"
            );

            showToast(
                "Dark mode enabled",
                "🌙"
            );

        } else {

            document.body.classList.remove(
                "dark"
            );

            localStorage.setItem(
                "darkMode",
                "false"
            );

            showToast(
                "Light mode enabled",
                "☀️"
            );
        }

    }
);


/* ================= SECURITY ================= */

function securityCheck() {

    showToast(
        "Security check completed successfully",
        "🔐"
    );
}


/* ================= NOTIFICATION ================= */

function showNotification() {

    showToast(
        "No new notifications",
        "🔔"
    );
}


/* ================= TOAST ================= */

let toastTimer;


function showToast(message, icon = "✓") {

    const toast =
        document.getElementById(
            "toast"
        );

    document.getElementById(
        "toastText"
    ).textContent = message;

    document.getElementById(
        "toastIcon"
    ).textContent = icon;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);
}


/* ================= CLOSE MODAL ================= */

window.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "studentModal"
        ) {

            closeStudentModal();

        }

        if (
            event.target.id ===
            "bookModal"
        ) {

            closeBookModal();

        }

    }
);


/* ================= INITIAL LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateProfileUI();

        renderBorrowedBooks();

        updateLibraryButtons();

        updateStats();

        updateLearningProgress();


        /* Dark mode restore */

        const savedDark =
            localStorage.getItem(
                "darkMode"
            );

        if (savedDark === "true") {

            document.body.classList.add(
                "dark"
            );

            darkMode.checked = true;

        }


        /* Restore page */

        const hash =
            window.location.hash
                .replace("#", "");


        if (
            hash &&
            document.getElementById(hash)
        ) {

            showPage(hash);

        } else {

            showPage("dashboard");

        }

    }
);