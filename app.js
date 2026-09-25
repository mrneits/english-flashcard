// ==========================================
// ENGLISH FLASHCARDS
// APP.JS - VERSION 2
// ==========================================


// ==========================================
// SAMPLE DATA
// ==========================================

const flashcards = [

    {
        id: 1,

        word: "pet",

        pronunciation: "/pet/",

        meaning: "vuốt ve, xoa, âu yếm",

        explanation:
            "Pet có thể là danh từ, động từ hoặc tính từ. Khi là động từ, pet có nghĩa là vuốt ve hoặc xoa một con vật.",

        wordFamily: [

            {
                word: "pet",
                type: "Noun",
                meaning: "thú cưng",
                exampleEnglish: "I have two pets.",
                exampleVietnamese: "Tôi có hai con thú cưng."
            },

            {
                word: "pet",
                type: "Verb",
                meaning: "vuốt ve, xoa",
                exampleEnglish: "Can I pet your dog?",
                exampleVietnamese: "Tôi có thể vuốt ve chó của bạn không?"
            },

            {
                word: "pet",
                type: "Adjective",
                meaning: "được yêu thích",
                exampleEnglish: "This is my pet project.",
                exampleVietnamese: "Đây là dự án tâm huyết của tôi."
            }

        ],

        examples: [

            {
                english: "Can I pet your dog?",
                vietnamese:
                    "Tôi có thể vuốt ve chó của bạn không?"
            },

            {
                english: "She is petting her cat.",
                vietnamese:
                    "Cô ấy đang vuốt ve con mèo của mình."
            }

        ]

    },


    {
        id: 2,

        word: "compare",

        pronunciation: "/kəmˈpeə(r)/",

        meaning: "so sánh",

        explanation:
            "Compare được dùng khi đặt hai hoặc nhiều người, vật hoặc sự việc cạnh nhau để xem điểm giống và khác nhau.",

        wordFamily: [

            {
                word: "compare",
                type: "Verb",
                meaning: "so sánh",
                exampleEnglish:
                    "Let's compare these two products.",
                exampleVietnamese:
                    "Hãy so sánh hai sản phẩm này."
            },

            {
                word: "comparison",
                type: "Noun",
                meaning: "sự so sánh",
                exampleEnglish:
                    "The comparison shows a clear difference.",
                exampleVietnamese:
                    "Sự so sánh cho thấy một sự khác biệt rõ ràng."
            },

            {
                word: "comparative",
                type: "Adjective",
                meaning: "mang tính so sánh",
                exampleEnglish:
                    "This study provides a comparative analysis.",
                exampleVietnamese:
                    "Nghiên cứu này cung cấp một phân tích mang tính so sánh."
            },

            {
                word: "comparatively",
                type: "Adverb",
                meaning: "một cách tương đối",
                exampleEnglish:
                    "The new model is comparatively cheap.",
                exampleVietnamese:
                    "Mẫu mới có giá tương đối rẻ."
            }

        ],

        examples: [

            {
                english:
                    "We need to compare the two options.",
                vietnamese:
                    "Chúng ta cần so sánh hai lựa chọn."
            },

            {
                english:
                    "Don't compare yourself with others.",
                vietnamese:
                    "Đừng so sánh bản thân với người khác."
            }

        ]

    },


    {
        id: 3,

        word: "accurate",

        pronunciation: "/ˈækjərət/",

        meaning: "chính xác",

        explanation:
            "Accurate dùng để mô tả thông tin, số liệu hoặc mô tả đúng với thực tế.",

        wordFamily: [

            {
                word: "accurate",
                type: "Adjective",
                meaning: "chính xác",
                exampleEnglish:
                    "The information is accurate.",
                exampleVietnamese:
                    "Thông tin là chính xác."
            },

            {
                word: "accuracy",
                type: "Noun",
                meaning: "độ chính xác",
                exampleEnglish:
                    "We need to improve the accuracy of the data.",
                exampleVietnamese:
                    "Chúng ta cần cải thiện độ chính xác của dữ liệu."
            },

            {
                word: "accurately",
                type: "Adverb",
                meaning: "một cách chính xác",
                exampleEnglish:
                    "The system accurately records the transaction.",
                exampleVietnamese:
                    "Hệ thống ghi nhận giao dịch một cách chính xác."
            }

        ],

        examples: [

            {
                english:
                    "Please provide accurate information.",
                vietnamese:
                    "Vui lòng cung cấp thông tin chính xác."
            }

        ]

    },


    {
        id: 4,

        word: "sensitive",

        pronunciation: "/ˈsensətɪv/",

        meaning: "nhạy cảm",

        explanation:
            "Sensitive thường được dùng để mô tả người, thông tin hoặc vấn đề cần được xử lý cẩn thận.",

        wordFamily: [

            {
                word: "sensitive",
                type: "Adjective",
                meaning: "nhạy cảm",
                exampleEnglish:
                    "This is sensitive information.",
                exampleVietnamese:
                    "Đây là thông tin nhạy cảm."
            },

            {
                word: "sensitivity",
                type: "Noun",
                meaning: "sự nhạy cảm",
                exampleEnglish:
                    "The system has high sensitivity.",
                exampleVietnamese:
                    "Hệ thống có độ nhạy cao."
            }

        ],

        examples: [

            {
                english:
                    "The User ID and password are case sensitive.",
                vietnamese:
                    "User ID và mật khẩu có phân biệt chữ hoa và chữ thường."
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
// DOM
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
// RENDER LIST
// ==========================================

function renderFlashcards() {

    tableBody.innerHTML = "";

    const start =
        (currentPage - 1) * ITEMS_PER_PAGE;

    const end =
        start + ITEMS_PER_PAGE;

    const pageData =
        currentData.slice(start, end);


    if (pageData.length === 0) {

        tableContainer.style.display = "none";

        emptyState.style.display = "block";

        pagination.innerHTML = "";

        return;

    }


    tableContainer.style.display = "block";

    emptyState.style.display = "none";


    pageData.forEach((card, index) => {

        const row =
            document.createElement("tr");


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


        row.addEventListener(
            "click",
            () => showFlashcardDetail(card)
        );


        tableBody.appendChild(row);

    });


    renderPagination();

}


// ==========================================
// PAGINATION
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
                        card.word.toLowerCase();

                    const meaning =
                        card.meaning.toLowerCase();

                    const family =
                        card.wordFamily
                            .map(item =>
                                `
                                ${item.word}
                                ${item.type}
                                ${item.meaning}
                                ${item.exampleEnglish}
                                ${item.exampleVietnamese}
                                `
                            )
                            .join(" ")
                            .toLowerCase();

                    const examples =
                        card.examples
                            .map(example =>
                                `
                                ${example.english}
                                ${example.vietnamese}
                                `
                            )
                            .join(" ")
                            .toLowerCase();


                    return (

                        word.includes(keyword) ||

                        meaning.includes(keyword) ||

                        family.includes(keyword) ||

                        examples.includes(keyword)

                    );

                });

        }


        currentPage = 1;

        renderFlashcards();

    }
);


// ==========================================
// FLASHCARD DETAIL
// ==========================================

function showFlashcardDetail(card) {

    const familyRows =
        card.wordFamily
            .map(item => {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${item.word}
                            </strong>
                        </td>

                        <td>
                            ${item.type}
                        </td>

                        <td>
                            ${item.meaning}
                        </td>

                        <td>
                            ${item.exampleEnglish}
                            <br>

                            <span class="muted-text">
                                ${item.exampleVietnamese}
                            </span>
                        </td>

                    </tr>

                `;

            })
            .join("");


    const exampleCards =
        card.examples
            .map(example => {

                return `

                    <div
                        class="example-card"
                        style="
                            padding: 16px;
                            margin-bottom: 12px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: #f9fafb;
                        "
                    >

                        <div
                            class="example-english"
                            style="
                                font-weight: 600;
                                margin-bottom: 6px;
                            "
                        >
                            ${example.english}
                        </div>

                        <div
                            class="example-vietnamese"
                            style="
                                color: #6b7280;
                            "
                        >
                            ${example.vietnamese}
                        </div>

                    </div>

                `;

            })
            .join("");


    tableContainer.style.display = "none";

    pagination.style.display = "none";

    emptyState.style.display = "block";


    emptyState.innerHTML = `

        <div
            style="
                max-width: 900px;
                margin: 0 auto;
                text-align: left;
            "
        >

            <button
                id="backButton"
                class="primary-button"
                style="
                    margin-bottom: 24px;
                "
            >
                ← Back to Flashcards
            </button>


            <div
                class="flashcard-detail-card"
                style="
                    background: white;
                    padding: 32px;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                "
            >

                <!-- WORD -->

                <h1
                    style="
                        font-size: 38px;
                        margin-bottom: 8px;
                    "
                >
                    ${card.word}
                </h1>


                <div
                    class="muted-text"
                    style="
                        color: #6b7280;
                        margin-bottom: 24px;
                    "
                >
                    ${card.pronunciation}
                </div>


                <!-- MEANING -->

                <h3 style="margin-bottom: 8px;">
                    Meaning
                </h3>

                <p style="margin-bottom: 20px;">
                    ${card.meaning}
                </p>


                <!-- EXPLANATION -->

                <h3 style="margin-bottom: 8px;">
                    Explanation
                </h3>

                <p
                    style="
                        line-height: 1.7;
                        margin-bottom: 28px;
                    "
                >
                    ${card.explanation}
                </p>


                <!-- WORD FAMILY -->

                <h3 style="margin-bottom: 12px;">
                    Word Family
                </h3>


                <div
                    class="word-family-table"
                    style="
                        overflow-x: auto;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    "
                >

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Word
                                </th>

                                <th>
                                    Part of Speech
                                </th>

                                <th>
                                    Meaning
                                </th>

                                <th>
                                    Example
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            ${familyRows}

                        </tbody>

                    </table>

                </div>


                <!-- EXAMPLES -->

                <h3 style="margin-bottom: 12px;">
                    Examples
                </h3>


                <div>

                    ${exampleCards}

                </div>


                <!-- BACK -->

                <button
                    id="backButton2"
                    class="primary-button"
                    style="
                        margin-top: 12px;
                    "
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

        <h2>
            No Flashcards Yet
        </h2>

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
