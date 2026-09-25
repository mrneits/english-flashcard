// ==========================================
// ENGLISH FLASHCARDS
// APP.JS - VERSION 1
// ==========================================


// ==========================================
// SAMPLE DATA
// Dữ liệu mẫu để kiểm tra giao diện
// ==========================================

const flashcards = [
    {
        id: 1,

        word: "pet",

        pronunciation: "/pet/",

        meaning: "vuốt ve, xoa, âu yếm",

        wordFamily: [
            {
                word: "pet",
                type: "Noun",
                meaning: "thú cưng"
            },
            {
                word: "pet",
                type: "Verb",
                meaning: "vuốt ve, xoa"
            },
            {
                word: "pet",
                type: "Adjective",
                meaning: "được yêu thích"
            }
        ]
    },

    {
        id: 2,

        word: "compare",

        pronunciation: "/kəmˈpeə(r)/",

        meaning: "so sánh",

        wordFamily: [
            {
                word: "compare",
                type: "Verb",
                meaning: "so sánh"
            },
            {
                word: "comparison",
                type: "Noun",
                meaning: "sự so sánh"
            },
            {
                word: "comparative",
                type: "Adjective",
                meaning: "mang tính so sánh"
            },
            {
                word: "comparatively",
                type: "Adverb",
                meaning: "một cách tương đối"
            }
        ]
    },

    {
        id: 3,

        word: "accurate",

        pronunciation: "/ˈækjərət/",

        meaning: "chính xác",

        wordFamily: [
            {
                word: "accurate",
                type: "Adjective",
                meaning: "chính xác"
            },
            {
                word: "accurately",
                type: "Adverb",
                meaning: "một cách chính xác"
            },
            {
                word: "accuracy",
                type: "Noun",
                meaning: "độ chính xác"
            }
        ]
    },

    {
        id: 4,

        word: "sensitive",

        pronunciation: "/ˈsensətɪv/",

        meaning: "nhạy cảm",

        wordFamily: [
            {
                word: "sensitive",
                type: "Adjective",
                meaning: "nhạy cảm"
            },
            {
                word: "sensitivity",
                type: "Noun",
                meaning: "sự nhạy cảm"
            }
        ]
    }
];


// ==========================================
// SETTINGS
// ==========================================

const ITEMS_PER_PAGE = 20;

let currentPage = 1;

let currentData = [...flashcards];


// ==========================================
// DOM ELEMENTS
// Lấy các thành phần trên website
// ==========================================

const tableBody =
    document.getElementById("flashcardTable");

const searchInput =
    document.getElementById("searchInput");

const pagination =
    document.getElementById("pagination");

const emptyState =
    document.getElementById("emptyState");

const tableContainer =
    document.querySelector(".table-container");

const themeToggle =
    document.getElementById("themeToggle");


// ==========================================
// DISPLAY FLASHCARDS
// Hiển thị danh sách Flashcard
// ==========================================

function renderFlashcards() {

    tableBody.innerHTML = "";

    const start =
        (currentPage - 1) * ITEMS_PER_PAGE;

    const end =
        start + ITEMS_PER_PAGE;

    const pageData =
        currentData.slice(start, end);


    // Không có dữ liệu

    if (pageData.length === 0) {

        tableContainer.style.display = "none";

        emptyState.style.display = "block";

        pagination.innerHTML = "";

        return;
    }


    // Có dữ liệu

    tableContainer.style.display = "block";

    emptyState.style.display = "none";


    pageData.forEach((card, index) => {

        const row =
            document.createElement("tr");


        // Word Family

        const familyText =
            card.wordFamily
                .map(item => item.word)
                .filter(
                    (word, index, array) =>
                        array.indexOf(word) === index
                )
                .join(", ");


        row.innerHTML = `

            <td>
                ${start + index + 1}
            </td>

            <td class="word-cell">
                ${card.word}
            </td>

            <td class="meaning-cell">
                ${card.meaning}
            </td>

            <td class="family-cell">
                ${familyText}
            </td>

        `;


        // Click vào dòng

        row.addEventListener("click", () => {

            showFlashcardDetail(card);

        });


        tableBody.appendChild(row);

    });


    renderPagination();

}


// ==========================================
// PAGINATION
// Phân trang
// ==========================================

function renderPagination() {

    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            currentData.length /
            ITEMS_PER_PAGE
        );


    if (totalPages <= 1) {

        return;

    }


    // Previous

    const previousButton =
        createPageButton(
            "‹",
            currentPage === 1
        );


    previousButton.addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                currentPage--;

                renderFlashcards();

            }

        }
    );


    pagination.appendChild(previousButton);


    // Page numbers

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            createPageButton(
                page,
                false
            );


        if (page === currentPage) {

            pageButton.classList.add("active");

        }


        pageButton.addEventListener(
            "click",
            () => {

                currentPage = page;

                renderFlashcards();

            }
        );


        pagination.appendChild(pageButton);

    }


    // Next

    const nextButton =
        createPageButton(
            "›",
            currentPage === totalPages
        );


    nextButton.addEventListener(
        "click",
        () => {

            if (currentPage < totalPages) {

                currentPage++;

                renderFlashcards();

            }

        }
    );


    pagination.appendChild(nextButton);

}


// ==========================================
// CREATE PAGE BUTTON
// ==========================================

function createPageButton(
    text,
    disabled
) {

    const button =
        document.createElement("button");


    button.className =
        "page-button";


    button.textContent =
        text;


    button.disabled =
        disabled;


    return button;

}


// ==========================================
// SEARCH
// Tìm kiếm Flashcard
// ==========================================

searchInput.addEventListener(
    "input",
    () => {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();


        if (!keyword) {

            currentData =
                [...flashcards];

        } else {

            currentData =
                flashcards.filter(card => {

                    const word =
                        card.word
                            .toLowerCase();

                    const meaning =
                        card.meaning
                            .toLowerCase();

                    const family =
                        card.wordFamily
                            .map(item =>
                                `${item.word} ${item.type} ${item.meaning}`
                            )
                            .join(" ")
                            .toLowerCase();


                    return (

                        word.includes(keyword) ||

                        meaning.includes(keyword) ||

                        family.includes(keyword)

                    );

                });

        }


        currentPage = 1;

        renderFlashcards();

    }
);


// ==========================================
// FLASHCARD DETAIL
// Hiển thị chi tiết Flashcard
// ==========================================

function showFlashcardDetail(card) {

    const family =
        card.wordFamily
            .map(item => {

                return `

                    <div style="
                        padding: 12px;
                        border-bottom: 1px solid #e5e7eb;
                    ">

                        <strong>
                            ${item.word}
                        </strong>

                        <span style="
                            margin-left: 8px;
                            color: #6b7280;
                        ">
                            ${item.type}
                        </span>

                        <div style="
                            margin-top: 4px;
                        ">
                            ${item.meaning}
                        </div>

                    </div>

                `;

            })
            .join("");


    tableContainer.style.display = "none";

    pagination.style.display = "none";


    emptyState.style.display = "block";


    emptyState.innerHTML = `

        <div style="
            max-width: 700px;
            margin: 0 auto;
            text-align: left;
        ">

            <button
                id="backButton"
                class="primary-button"
                style="margin-bottom: 24px;"
            >
                ← Back to Flashcards
            </button>


            <div style="
                background: white;
                padding: 32px;
                border-radius: 12px;
                border: 1px solid #e5e7eb;
            ">

                <h1 style="
                    font-size: 36px;
                    margin-bottom: 8px;
                ">
                    ${card.word}
                </h1>


                <div style="
                    color: #6b7280;
                    margin-bottom: 24px;
                ">
                    ${card.pronunciation}
                </div>


                <h3 style="
                    margin-bottom: 8px;
                ">
                    Meaning
                </h3>


                <p style="
                    margin-bottom: 28px;
                ">
                    ${card.meaning}
                </p>


                <h3 style="
                    margin-bottom: 12px;
                ">
                    Word Family
                </h3>


                <div style="
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 28px;
                ">
                    ${family}
                </div>


                <button
                    id="backButton2"
                    class="primary-button"
                >
                    ← Back to List
                </button>

            </div>

        </div>

    `;


    document
        .getElementById("backButton")
        .addEventListener(
            "click",
            backToList
        );


    document
        .getElementById("backButton2")
        .addEventListener(
            "click",
            backToList
        );

}


// ==========================================
// BACK TO LIST
// ==========================================

function backToList() {

    emptyState.innerHTML = `

        <div class="empty-icon">
            📚
        </div>

        <h2>No Flashcards Yet</h2>

        <p>
            Your English vocabulary collection
            will appear here.
        </p>

        <button
            id="emptyAddButton"
            class="primary-button"
        >
            ＋ Add Your First Flashcard
        </button>

    `;


    pagination.style.display = "flex";

    renderFlashcards();

}


// ==========================================
// DARK MODE
// ==========================================

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            themeToggle.textContent = "☀️";

        } else {

            themeToggle.textContent = "🌙";

        }

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

renderFlashcards();
