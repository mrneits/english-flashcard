// =========================================
// SAMPLE FLASHCARD DATA
// =========================================

const flashcards = [

    {
        id: 1,
        word: "pet",
        pronunciation: "/pet/",
        meaning: "vuốt ve, cưng nựng; thú cưng",

        explanation:
            "Pet can be used as a verb meaning to touch or stroke an animal gently. It can also be used as a noun meaning an animal kept for companionship.",

        wordFamily: [

            {
                word: "pet",
                pronunciation: "/pet/",
                type: "verb / noun",
                meaning: "vuốt ve; thú cưng",
                exampleEnglish: "Can I pet your dog?",
                exampleVietnamese: "Tôi có thể vuốt ve con chó của bạn không?"
            },

            {
                word: "petting",
                pronunciation: "/ˈpetɪŋ/",
                type: "noun",
                meaning: "sự vuốt ve",
                exampleEnglish: "The dog enjoys petting.",
                exampleVietnamese: "Con chó thích được vuốt ve."
            }

        ],

        examples: [

            {
                english: "Can I pet your dog?",
                vietnamese: "Tôi có thể vuốt ve con chó của bạn không?"
            },

            {
                english: "She loves to pet her cat.",
                vietnamese: "Cô ấy thích vuốt ve con mèo của mình."
            }

        ]
    },

    {
        id: 2,
        word: "compare",
        pronunciation: "/kəmˈpeər/",
        meaning: "so sánh",

        explanation:
            "Compare means to examine two or more things in order to discover their similarities and differences.",

        wordFamily: [

            {
                word: "compare",
                pronunciation: "/kəmˈpeər/",
                type: "verb",
                meaning: "so sánh",
                exampleEnglish: "We need to compare these two products.",
                exampleVietnamese: "Chúng ta cần so sánh hai sản phẩm này."
            },

            {
                word: "comparison",
                pronunciation: "/kəmˈpærɪsən/",
                type: "noun",
                meaning: "sự so sánh",
                exampleEnglish: "This comparison is useful.",
                exampleVietnamese: "Sự so sánh này rất hữu ích."
            },

            {
                word: "comparative",
                pronunciation: "/kəmˈpærətɪv/",
                type: "adjective / noun",
                meaning: "mang tính so sánh; dạng so sánh",
                exampleEnglish: "The comparative form is used here.",
                exampleVietnamese: "Dạng so sánh được sử dụng ở đây."
            },

            {
                word: "comparatively",
                pronunciation: "/kəmˈpærətɪvli/",
                type: "adverb",
                meaning: "tương đối, xét một cách so sánh",
                exampleEnglish: "The new model is comparatively cheaper.",
                exampleVietnamese: "Mẫu mới tương đối rẻ hơn."
            }

        ],

        examples: [

            {
                english: "Let's compare these two products.",
                vietnamese: "Hãy so sánh hai sản phẩm này."
            },

            {
                english: "It is difficult to compare the two companies.",
                vietnamese: "Rất khó để so sánh hai công ty."
            }

        ]
    },

    {
        id: 3,
        word: "accurate",
        pronunciation: "/ˈækjərət/",
        meaning: "chính xác",

        explanation:
            "Accurate describes information, measurements, or results that are correct and free from mistakes.",

        wordFamily: [

            {
                word: "accurate",
                pronunciation: "/ˈækjərət/",
                type: "adjective",
                meaning: "chính xác",
                exampleEnglish: "The information is accurate.",
                exampleVietnamese: "Thông tin này chính xác."
            },

            {
                word: "accurately",
                pronunciation: "/ˈækjərətli/",
                type: "adverb",
                meaning: "một cách chính xác",
                exampleEnglish: "The system accurately records the data.",
                exampleVietnamese: "Hệ thống ghi nhận dữ liệu một cách chính xác."
            },

            {
                word: "accuracy",
                pronunciation: "/ˈækjərəsi/",
                type: "noun",
                meaning: "độ chính xác",
                exampleEnglish: "We need to improve the accuracy of the data.",
                exampleVietnamese: "Chúng ta cần cải thiện độ chính xác của dữ liệu."
            }

        ],

        examples: [

            {
                english: "Please make sure the information is accurate.",
                vietnamese: "Vui lòng đảm bảo thông tin là chính xác."
            },

            {
                english: "The report contains accurate information.",
                vietnamese: "Báo cáo chứa thông tin chính xác."
            }

        ]
    },

    {
        id: 4,
        word: "sensitive",
        pronunciation: "/ˈsensətɪv/",
        meaning: "nhạy cảm",

        explanation:
            "Sensitive can describe something that needs careful handling or a person who reacts strongly to things.",

        wordFamily: [

            {
                word: "sensitive",
                pronunciation: "/ˈsensətɪv/",
                type: "adjective",
                meaning: "nhạy cảm",
                exampleEnglish: "This information is sensitive.",
                exampleVietnamese: "Thông tin này nhạy cảm."
            },

            {
                word: "sensitivity",
                pronunciation: "/ˌsensəˈtɪvəti/",
                type: "noun",
                meaning: "sự nhạy cảm",
                exampleEnglish: "The system has high sensitivity.",
                exampleVietnamese: "Hệ thống có độ nhạy cao."
            },

            {
                word: "sensitively",
                pronunciation: "/ˈsensətɪvli/",
                type: "adverb",
                meaning: "một cách nhạy cảm",
                exampleEnglish: "The issue was handled sensitively.",
                exampleVietnamese: "Vấn đề đã được xử lý một cách nhạy cảm."
            }

        ],

        examples: [

            {
                english: "The User ID and password are case sensitive.",
                vietnamese: "User ID và mật khẩu phân biệt chữ hoa và chữ thường."
            },

            {
                english: "This is sensitive information.",
                vietnamese: "Đây là thông tin nhạy cảm."
            }

        ]
    }

];


// =========================================
// VARIABLES
// =========================================

let currentPage = 1;

const rowsPerPage = 20;

let filteredFlashcards = [...flashcards];


// =========================================
// ELEMENTS
// =========================================

const tableBody =
    document.getElementById("flashcardTable");

const searchInput =
    document.getElementById("searchInput");

const pagination =
    document.getElementById("pagination");

const emptyState =
    document.getElementById("emptyState");

const addButton =
    document.getElementById("addButton");

const emptyAddButton =
    document.getElementById("emptyAddButton");

const themeToggle =
    document.getElementById("themeToggle");


// =========================================
// DISPLAY LIST
// =========================================

function renderFlashcards() {

    tableBody.innerHTML = "";

    const start =
        (currentPage - 1) * rowsPerPage;

    const end =
        start + rowsPerPage;

    const currentItems =
        filteredFlashcards.slice(start, end);


    if (currentItems.length === 0) {

        emptyState.style.display = "block";

        document.querySelector(".table-container").style.display =
            "none";

        pagination.style.display = "none";

        return;

    }


    emptyState.style.display = "none";

    document.querySelector(".table-container").style.display =
        "block";

    pagination.style.display = "flex";


    currentItems.forEach((card, index) => {

        const row =
            document.createElement("tr");

        const number =
            start + index + 1;

        const familyCount =
            card.wordFamily
                ? card.wordFamily.length
                : 0;


        row.innerHTML = `

            <td>${number}</td>

            <td>
                <strong>${card.word}</strong>

                <div class="list-pronunciation">
                    ${card.pronunciation}
                </div>
            </td>

            <td>
                ${card.meaning}
            </td>

            <td>
                ${familyCount} word${familyCount !== 1 ? "s" : ""}
            </td>

        `;


        row.addEventListener("click", () => {

            showFlashcardDetail(card);

        });


        tableBody.appendChild(row);

    });


    renderPagination();

}


// =========================================
// PAGINATION
// =========================================

function renderPagination() {

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(
            filteredFlashcards.length / rowsPerPage
        );


    if (totalPages <= 1) {
        return;
    }


    for (let page = 1; page <= totalPages; page++) {

        const button =
            document.createElement("button");

        button.textContent = page;

        if (page === currentPage) {

            button.classList.add("active");

        }


        button.addEventListener("click", () => {

            currentPage = page;

            renderFlashcards();

        });


        pagination.appendChild(button);

    }

}


// =========================================
// SEARCH
// =========================================

searchInput.addEventListener(
    "input",
    function () {

        const keyword =
            this.value
                .toLowerCase()
                .trim();


        filteredFlashcards =
            flashcards.filter(card => {

                const mainText = [

                    card.word,

                    card.meaning,

                    card.explanation,

                    ...(card.wordFamily || [])
                        .flatMap(item => [

                            item.word,
                            item.meaning,
                            item.type,
                            item.exampleEnglish,
                            item.exampleVietnamese

                        ]),

                    ...(card.examples || [])
                        .flatMap(example => [

                            example.english,
                            example.vietnamese

                        ])

                ]
                    .join(" ")
                    .toLowerCase();


                return mainText.includes(keyword);

            });


        currentPage = 1;

        renderFlashcards();

    }
);


// =========================================
// SHOW FLASHCARD DETAIL
// =========================================

function showFlashcardDetail(card) {

    const app =
        document.querySelector(".app");


    app.innerHTML = `

        <div class="flashcard-detail-card">

            <button
                id="backButton"
                class="back-button"
            >
                ← Back to Flashcards
            </button>


            <div class="flashcard-header">

                <h1>
                    ${card.word}
                </h1>

                <div class="main-pronunciation">
                    ${card.pronunciation}
                </div>

            </div>


            <section class="detail-section">

                <h2>Meaning</h2>

                <p class="main-meaning">
                    ${card.meaning}
                </p>

                <p class="explanation">
                    ${card.explanation}
                </p>

            </section>


            <section class="detail-section">

                <h2>Examples</h2>

                <div class="examples-list">

                    ${(card.examples || [])
                        .map(example => `

                            <div class="example-card">

                                <div class="example-english">
                                    ${example.english}
                                </div>

                                <div class="example-vietnamese">
                                    ${example.vietnamese}
                                </div>

                            </div>

                        `)
                        .join("")}

                </div>

            </section>


            <section class="detail-section">

                <h2>Word Family</h2>

                <div class="word-family-table-wrapper">

                    <table class="word-family-table">

                        <thead>

                            <tr>

                                <th>Word</th>

                                <th>IPA / Cách đọc</th>

                                <th>Part of Speech</th>

                                <th>Meaning</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${(card.wordFamily || [])
                                .map(item => `

                                    <tr>

                                        <td>

                                            <strong>
                                                ${item.word}
                                            </strong>

                                            <div class="family-example">

                                                <span class="example-label">
                                                    Example:
                                                </span>

                                                ${item.exampleEnglish}

                                                <div class="family-example-vietnamese">

                                                    → ${item.exampleVietnamese}

                                                </div>

                                            </div>

                                        </td>


                                        <td class="family-pronunciation">

                                            ${item.pronunciation || "-"}

                                        </td>


                                        <td>

                                            ${item.type}

                                        </td>


                                        <td>

                                            ${item.meaning}

                                        </td>

                                    </tr>

                                `)
                                .join("")}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    `;


    document
        .getElementById("backButton")
        .addEventListener("click", () => {

            location.reload();

        });

}


// =========================================
// ADD FLASHCARD
// =========================================

function showAddFlashcard() {

    const app =
        document.querySelector(".app");


    app.innerHTML = `

        <div class="import-card">

            <button
                id="importBackButton"
                class="back-button"
            >
                ← Back to Flashcards
            </button>


            <div class="import-header">

                <h1>＋ Add Flashcard</h1>

                <p>
                    Paste the JSON generated by ChatGPT below.
                </p>

            </div>


            <div class="import-help">

                <strong>How to use:</strong>

                <ol>

                    <li>
                        Ask ChatGPT to create the Flashcard.
                    </li>

                    <li>
                        Copy the complete JSON.
                    </li>

                    <li>
                        Paste it into the box below.
                    </li>

                    <li>
                        Click Preview.
                    </li>

                </ol>

            </div>


            <textarea
                id="jsonInput"
                class="json-input"
                placeholder="Paste Flashcard JSON here..."
            ></textarea>


            <div
                id="importError"
                class="import-error"
            ></div>


            <div class="import-actions">

    <button
        id="previewButton"
        class="primary-button"
    >
        Preview
    </button>

    <button
        id="saveButton"
        class="secondary-button"
        style="display: none;"
    >
        💾 Save Flashcard
    </button>

</div>

            <div
                id="previewContainer"
                class="preview-container"
            ></div>

        </div>

    `;


    document
        .getElementById("importBackButton")
        .addEventListener("click", () => {

            location.reload();

        });


    document
        .getElementById("previewButton")
        .addEventListener(
            "click",
            previewImportedFlashcard
        );

}


// =========================================
// PREVIEW IMPORTED FLASHCARD
// =========================================

function previewImportedFlashcard() {

    const input =
        document.getElementById("jsonInput");

    const error =
        document.getElementById("importError");

    const preview =
        document.getElementById("previewContainer");


    error.textContent = "";

    preview.innerHTML = "";


    const rawText =
        input.value.trim();


    if (!rawText) {

        error.textContent =
            "Please paste the JSON generated by ChatGPT.";

        return;

    }


    let data;


    try {

        data = JSON.parse(rawText);

    } catch (e) {

        error.textContent =
            "The pasted content is not valid JSON. Please copy the complete JSON from ChatGPT.";

        return;

    }
// =========================================
// SAVE FLASHCARD TO SUPABASE
// =========================================

async function saveImportedFlashcard() {

    const input =
        document.getElementById("jsonInput");

    const error =
        document.getElementById("importError");

    const saveButton =
        document.getElementById("saveButton");


    error.textContent = "";


    const rawText =
        input.value.trim();


    if (!rawText) {

        error.textContent =
            "Please paste the Flashcard JSON first.";

        return;

    }


    let data;


    try {

        data = JSON.parse(rawText);

    } catch (e) {

        error.textContent =
            "Invalid JSON.";

        return;

    }


    // =========================================
    // VALIDATE DATA
    // =========================================

    if (
        !data.word ||
        !data.meaning ||
        !data.examples ||
        !data.wordFamily
    ) {

        error.textContent =
            "The Flashcard data is incomplete.";

        return;

    }


    saveButton.disabled = true;

    saveButton.textContent = "Saving...";


    try {

        // =========================================
        // 1. INSERT FLASHCARD
        // =========================================

        const { data: flashcard, error: flashcardError } =
            await supabaseClient

                .from("flashcards")

                .insert({

                    word: data.word,

                    pronunciation:
                        data.pronunciation || null,

                    meaning:
                        data.meaning,

                    explanation:
                        data.explanation || null

                })

                .select()

                .single();


        if (flashcardError) {

            throw flashcardError;

        }


        const flashcardId =
            flashcard.id;


        // =========================================
        // 2. INSERT EXAMPLES
        // =========================================

        if (
            Array.isArray(data.examples) &&
            data.examples.length > 0
        ) {

            const exampleRows =
                data.examples.map(example => ({

                    flashcard_id:
                        flashcardId,

                    english:
                        example.english,

                    vietnamese:
                        example.vietnamese || null

                }));


            const { error: examplesError } =
                await supabaseClient

                    .from("examples")

                    .insert(exampleRows);


            if (examplesError) {

                throw examplesError;

            }

        }


        // =========================================
        // 3. INSERT WORD FAMILY
        // =========================================

        if (
            Array.isArray(data.wordFamily) &&
            data.wordFamily.length > 0
        ) {

            const wordFamilyRows =
                data.wordFamily.map(item => ({

                    flashcard_id:
                        flashcardId,

                    word:
                        item.word,

                    pronunciation:
                        item.pronunciation || null,

                    part_of_speech:
                        item.partOfSpeech || null,

                    meaning:
                        item.meaning || null,

                    example_english:
                        item.exampleEnglish || null,

                    example_vietnamese:
                        item.exampleVietnamese || null

                }));


            const { error: wordFamilyError } =
                await supabaseClient

                    .from("word_family")

                    .insert(wordFamilyRows);


            if (wordFamilyError) {

                throw wordFamilyError;

            }

        }


        // =========================================
        // SUCCESS
        // =========================================

        alert(
            "Flashcard saved successfully!"
        );


        location.reload();


        } catch (saveError) {

        console.error(
            "Save Flashcard Error:",
            saveError
        );


        error.textContent =
            saveError.message ||
            "Failed to save Flashcard.";


        saveButton.disabled = false;

        saveButton.textContent =
            "💾 Save Flashcard";

    }

}

    // =========================================
    // BASIC VALIDATION
    // =========================================

    const requiredFields = [

        "word",
        "pronunciation",
        "meaning",
        "explanation",
        "examples",
        "wordFamily"

    ];


    const missingFields =
        requiredFields.filter(
            field => !(field in data)
        );


    if (missingFields.length > 0) {

        error.textContent =
            "Missing fields: " +
            missingFields.join(", ");

        return;

    }


    if (!Array.isArray(data.examples)) {

        error.textContent =
            "The 'examples' field must be an array.";

        return;

    }


    if (!Array.isArray(data.wordFamily)) {

        error.textContent =
            "The 'wordFamily' field must be an array.";

        return;

    }


    // =========================================
    // PREVIEW
    // =========================================

    preview.innerHTML = `

        <div class="preview-title">

            <span>Preview</span>

            <span class="preview-valid">
                ✓ Valid Flashcard
            </span>

        </div>


        <div class="flashcard-detail-card preview-flashcard">

            <div class="flashcard-header">

                <h1>
                    ${escapeHtml(data.word)}
                </h1>

                <div class="main-pronunciation">
                    ${escapeHtml(data.pronunciation)}
                </div>

            </div>


            <section class="detail-section">

                <h2>Meaning</h2>

                <p class="main-meaning">
                    ${escapeHtml(data.meaning)}
                </p>

                <p class="explanation">
                    ${escapeHtml(data.explanation)}
                </p>

            </section>


            <section class="detail-section">

                <h2>Examples</h2>

                <div class="examples-list">

                    ${data.examples
                        .map(example => `

                            <div class="example-card">

                                <div class="example-english">
                                    ${escapeHtml(example.english)}
                                </div>

                                <div class="example-vietnamese">
                                    ${escapeHtml(example.vietnamese)}
                                </div>

                            </div>

                        `)
                        .join("")}

                </div>

            </section>


            <section class="detail-section">

                <h2>Word Family</h2>

                <div class="word-family-table-wrapper">

                    <table class="word-family-table">

                        <thead>

                            <tr>

                                <th>Word</th>

                                <th>IPA / Cách đọc</th>

                                <th>Part of Speech</th>

                                <th>Meaning</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${data.wordFamily
                                .map(item => `

                                    <tr>

                                        <td>

                                            <strong>
                                                ${escapeHtml(item.word)}
                                            </strong>

                                            <div class="family-example">

                                                <span class="example-label">
                                                    Example:
                                                </span>

                                                ${escapeHtml(item.exampleEnglish)}

                                                <div class="family-example-vietnamese">

                                                    → ${escapeHtml(item.exampleVietnamese)}

                                                </div>

                                            </div>

                                        </td>


                                        <td class="family-pronunciation">

                                            ${escapeHtml(
                                                item.pronunciation || "-"
                                            )}

                                        </td>


                                        <td>

                                            ${escapeHtml(
                                                item.partOfSpeech || "-"
                                            )}

                                        </td>


                                        <td>

                                            ${escapeHtml(
                                                item.meaning || "-"
                                            )}

                                        </td>

                                    </tr>

                                `)
                                .join("")}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    `;

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHtml(value) {

    if (value === undefined || value === null) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// =========================================
// CONNECT ADD BUTTON
// =========================================

if (addButton) {

    addButton.addEventListener(
        "click",
        showAddFlashcard
    );

}


if (emptyAddButton) {

    emptyAddButton.addEventListener(
        "click",
        showAddFlashcard
    );

}


// =========================================
// DARK MODE
// =========================================

if (themeToggle) {

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

}
// =========================================
// TEST SUPABASE CONNECTION
// =========================================

async function testSupabaseConnection() {

    const { data, error } = await supabaseClient
        .from("flashcards")
        .select("id, word")
        .limit(1);


    if (error) {

        console.error(
            "Supabase connection error:",
            error
        );

        return;

    }


    console.log(
        "Supabase connected successfully:",
        data
    );

}


testSupabaseConnection();

// =========================================
// INITIAL LOAD
// =========================================

renderFlashcards();
