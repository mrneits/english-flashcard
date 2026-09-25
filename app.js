// =========================================
// ENGLISH FLASHCARDS
// Main Application
// =========================================


// =========================================
// CONFIGURATION
// =========================================

let currentPage = 1;

const rowsPerPage = 20;

let flashcards = [];

let filteredFlashcards = [];


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
// LOAD FLASHCARDS FROM SUPABASE
// =========================================

async function loadFlashcards() {

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("flashcards")

            .select(`
                id,
                word,
                pronunciation,
                meaning,
                explanation,
                notes,
                tags,
                created_at,
                updated_at,
                examples (
                    id,
                    english,
                    vietnamese
                ),
                word_family (
                    id,
                    word,
                    pronunciation,
                    part_of_speech,
                    meaning,
                    example_english,
                    example_vietnamese
                )
            `)

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Load Flashcards Error:",
                error
            );

            alert(
                "Không thể tải Flashcard từ Supabase.\n\n" +
                error.message
            );

            return;

        }


        flashcards =
            (data || []).map(card => ({

                ...card,

                examples:
                    card.examples || [],

                wordFamily:
                    card.word_family || []

            }));


        filteredFlashcards =
            [...flashcards];


        currentPage = 1;

        renderFlashcards();


    } catch (loadError) {

        console.error(
            "Unexpected Load Error:",
            loadError
        );

    }

}


// =========================================
// DISPLAY FLASHCARD LIST
// =========================================

function renderFlashcards() {

    tableBody.innerHTML = "";


    const start =
        (currentPage - 1) *
        rowsPerPage;


    const end =
        start +
        rowsPerPage;


    const currentItems =
        filteredFlashcards.slice(
            start,
            end
        );


    // =========================================
    // EMPTY STATE
    // =========================================

    if (
        currentItems.length === 0
    ) {

        emptyState.style.display =
            "block";


        document
            .querySelector(".table-container")
            .style.display =
            "none";


        pagination.style.display =
            "none";


        return;

    }


    emptyState.style.display =
        "none";


    document
        .querySelector(".table-container")
        .style.display =
        "block";


    pagination.style.display =
        "flex";


    // =========================================
    // RENDER ROWS
    // =========================================

    currentItems.forEach(
        (card, index) => {

            const row =
                document.createElement("tr");


            const number =
                start +
                index +
                1;


            const familyCount =
                card.wordFamily
                    ? card.wordFamily.length
                    : 0;


            row.innerHTML = `

                <td>
                    ${number}
                </td>


                <td>

                    <strong>
                        ${escapeHtml(card.word)}
                    </strong>

                    <div class="list-pronunciation">
                        ${escapeHtml(
                            card.pronunciation || ""
                        )}
                    </div>

                </td>


                <td>
                    ${escapeHtml(
                        card.meaning || ""
                    )}
                </td>


                <td>

                    ${familyCount}

                    ${familyCount === 1
                        ? "word"
                        : "words"
                    }

                </td>

            `;


            row.addEventListener(
                "click",
                () => {

                    showFlashcardDetail(
                        card
                    );

                }
            );


            tableBody.appendChild(
                row
            );

        }
    );


    renderPagination();

}


// =========================================
// PAGINATION
// =========================================

function renderPagination() {

    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredFlashcards.length /
            rowsPerPage
        );


    if (totalPages <= 1) {

        return;

    }


    // Previous button

    const previousButton =
        document.createElement(
            "button"
        );


    previousButton.textContent =
        "‹";


    previousButton.disabled =
        currentPage === 1;


    previousButton.addEventListener(
        "click",
        () => {

            if (
                currentPage > 1
            ) {

                currentPage--;

                renderFlashcards();

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    // Page buttons

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            page;


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            () => {

                currentPage =
                    page;

                renderFlashcards();

            }
        );


        pagination.appendChild(
            button
        );

    }


    // Next button

    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.textContent =
        "›";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderFlashcards();

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}


// =========================================
// SEARCH
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            filteredFlashcards =
                flashcards.filter(
                    card => {

                        const mainText = [

                            card.word,

                            card.pronunciation,

                            card.meaning,

                            card.explanation,

                            card.notes,


                            ...(card.wordFamily || [])
                                .flatMap(
                                    item => [

                                        item.word,

                                        item.pronunciation,

                                        item.part_of_speech,

                                        item.meaning,

                                        item.example_english,

                                        item.example_vietnamese

                                    ]
                                ),


                            ...(card.examples || [])
                                .flatMap(
                                    example => [

                                        example.english,

                                        example.vietnamese

                                    ]
                                )

                        ]

                            .filter(Boolean)

                            .join(" ")

                            .toLowerCase();


                        return mainText.includes(
                            keyword
                        );

                    }
                );


            currentPage = 1;

            renderFlashcards();

        }
    );

}


// =========================================
// SHOW FLASHCARD DETAIL
// =========================================

function showFlashcardDetail(card) {

    const app =
        document.querySelector(
            ".app"
        );


    app.innerHTML = `

        <div class="flashcard-detail-card">

            <button
                id="backButton"
                class="back-button"
            >
                ← Back to Flashcards
            </button>


            <!-- HEADER -->

            <div class="flashcard-header">

                <h1>
                    ${escapeHtml(
                        card.word
                    )}
                </h1>


                <div class="main-pronunciation">

                    ${escapeHtml(
                        card.pronunciation || ""
                    )}

                </div>

            </div>


            <!-- MEANING -->

            <section class="detail-section">

                <h2>
                    Meaning
                </h2>


                <p class="main-meaning">

                    ${escapeHtml(
                        card.meaning || ""
                    )}

                </p>


                ${
                    card.explanation
                        ? `
                            <p class="explanation">
                                ${escapeHtml(
                                    card.explanation
                                )}
                            </p>
                          `
                        : ""
                }

            </section>


            <!-- EXAMPLES -->

            <section class="detail-section">

                <h2>
                    Examples
                </h2>


                <div class="examples-list">

                    ${
                        (card.examples || [])
                            .length > 0

                            ?

                            card.examples
                                .map(
                                    example => `

                                        <div class="example-card">

                                            <div class="example-english">

                                                ${escapeHtml(
                                                    example.english
                                                )}

                                            </div>


                                            <div class="example-vietnamese">

                                                ${escapeHtml(
                                                    example.vietnamese || ""
                                                )}

                                            </div>

                                        </div>

                                    `
                                )
                                .join("")

                            :

                            `
                                <p>
                                    No examples available.
                                </p>
                            `
                    }

                </div>

            </section>


            <!-- WORD FAMILY -->

            <section class="detail-section">

                <h2>
                    Word Family
                </h2>


                <div class="word-family-table-wrapper">

                    <table
                        class="word-family-table"
                    >

                        <thead>

                            <tr>

                                <th>
                                    Word
                                </th>


                                <th>
                                    IPA / Cách đọc
                                </th>


                                <th>
                                    Part of Speech
                                </th>


                                <th>
                                    Meaning
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                (card.wordFamily || [])
                                    .map(
                                        item => `

                                            <tr>

                                                <td>

                                                    <strong>
                                                        ${escapeHtml(
                                                            item.word
                                                        )}
                                                    </strong>


                                                    ${
                                                        item.example_english
                                                            ? `

                                                                <div class="family-example">

                                                                    <span class="example-label">
                                                                        Example:
                                                                    </span>


                                                                    ${escapeHtml(
                                                                        item.example_english
                                                                    )}


                                                                    ${
                                                                        item.example_vietnamese
                                                                            ? `

                                                                                <div class="family-example-vietnamese">

                                                                                    → ${escapeHtml(
                                                                                        item.example_vietnamese
                                                                                    )}

                                                                                </div>

                                                                            `
                                                                            : ""
                                                                    }

                                                                </div>

                                                            `
                                                            : ""
                                                    }

                                                </td>


                                                <td class="family-pronunciation">

                                                    ${escapeHtml(
                                                        item.pronunciation || "-"
                                                    )}

                                                </td>


                                                <td>

                                                    ${escapeHtml(
                                                        item.part_of_speech || "-"
                                                    )}

                                                </td>


                                                <td>

                                                    ${escapeHtml(
                                                        item.meaning || "-"
                                                    )}

                                                </td>

                                            </tr>

                                        `
                                    )
                                    .join("")
                            }

                        </tbody>

                    </table>

                </div>

            </section>


            ${
                card.notes
                    ? `

                        <section class="detail-section">

                            <h2>
                                Notes
                            </h2>


                            <p>
                                ${escapeHtml(
                                    card.notes
                                )}
                            </p>

                        </section>

                      `
                    : ""
            }

        </div>

    `;


    document
        .getElementById(
            "backButton"
        )
        .addEventListener(
            "click",
            () => {

                location.reload();

            }
        );

}


// =========================================
// ADD FLASHCARD PAGE
// =========================================

function showAddFlashcard() {

    const app =
        document.querySelector(
            ".app"
        );


    app.innerHTML = `

        <div class="import-card">

            <button
                id="importBackButton"
                class="back-button"
            >
                ← Back to Flashcards
            </button>


            <div class="import-header">

                <h1>
                    ＋ Add Flashcard
                </h1>


                <p>
                    Paste the JSON generated by ChatGPT below.
                </p>

            </div>


            <div class="import-help">

                <strong>
                    How to use:
                </strong>


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


                    <li>
                        Check the information.
                    </li>


                    <li>
                        Click Save Flashcard.
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
                    class="primary-button"
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


    // Back

    document
        .getElementById(
            "importBackButton"
        )
        .addEventListener(
            "click",
            () => {

                location.reload();

            }
        );


    // Preview

    document
        .getElementById(
            "previewButton"
        )
        .addEventListener(
            "click",
            previewImportedFlashcard
        );


    // Save

    document
        .getElementById(
            "saveButton"
        )
        .addEventListener(
            "click",
            saveImportedFlashcard
        );

}


// =========================================
// PREVIEW IMPORTED FLASHCARD
// =========================================

function previewImportedFlashcard() {

    const input =
        document.getElementById(
            "jsonInput"
        );


    const error =
        document.getElementById(
            "importError"
        );


    const preview =
        document.getElementById(
            "previewContainer"
        );


    const saveButton =
        document.getElementById(
            "saveButton"
        );


    // Reset

    error.textContent = "";

    preview.innerHTML = "";

    saveButton.style.display =
        "none";


    saveButton.disabled =
        false;


    saveButton.textContent =
        "💾 Save Flashcard";


    // Get JSON

    const rawText =
        input.value.trim();


    if (!rawText) {

        error.textContent =
            "Please paste the JSON generated by ChatGPT.";

        return;

    }


    // Parse JSON

    let data;


    try {

        data =
            JSON.parse(
                rawText
            );

    } catch (parseError) {

        console.error(
            "JSON Parse Error:",
            parseError
        );


        error.textContent =
            "The pasted content is not valid JSON. Please copy the complete JSON from ChatGPT.";

        return;

    }


    // =========================================
    // VALIDATE MAIN FIELDS
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
            field =>
                !(field in data)
        );


    if (
        missingFields.length > 0
    ) {

        error.textContent =
            "Missing fields: " +
            missingFields.join(
                ", "
            );

        return;

    }


    // =========================================
    // VALIDATE EXAMPLES
    // =========================================

    if (
        !Array.isArray(
            data.examples
        )
    ) {

        error.textContent =
            "The 'examples' field must be an array.";

        return;

    }


    for (
        const example
        of data.examples
    ) {

        if (
            !example.english
        ) {

            error.textContent =
                "Each example must have an English sentence.";

            return;

        }

    }


    // =========================================
    // VALIDATE WORD FAMILY
    // =========================================

    if (
        !Array.isArray(
            data.wordFamily
        )
    ) {

        error.textContent =
            "The 'wordFamily' field must be an array.";

        return;

    }


    for (
        const item
        of data.wordFamily
    ) {

        if (
            !item.word
        ) {

            error.textContent =
                "Each Word Family item must have a word.";

            return;

        }

    }


    // =========================================
    // CREATE PREVIEW
    // =========================================

    preview.innerHTML = `

        <div class="preview-title">

            <span>
                Preview
            </span>


            <span class="preview-valid">

                ✓ Valid Flashcard

            </span>

        </div>


        <div
            class="flashcard-detail-card preview-flashcard"
        >

            <!-- HEADER -->

            <div class="flashcard-header">

                <h1>

                    ${escapeHtml(
                        data.word
                    )}

                </h1>


                <div class="main-pronunciation">

                    ${escapeHtml(
                        data.pronunciation
                    )}

                </div>

            </div>


            <!-- MEANING -->

            <section class="detail-section">

                <h2>
                    Meaning
                </h2>


                <p class="main-meaning">

                    ${escapeHtml(
                        data.meaning
                    )}

                </p>


                <p class="explanation">

                    ${escapeHtml(
                        data.explanation
                    )}

                </p>

            </section>


            <!-- EXAMPLES -->

            <section class="detail-section">

                <h2>
                    Examples
                </h2>


                <div class="examples-list">

                    ${
                        data.examples
                            .map(
                                example => `

                                    <div class="example-card">

                                        <div class="example-english">

                                            ${escapeHtml(
                                                example.english
                                            )}

                                        </div>


                                        <div class="example-vietnamese">

                                            ${escapeHtml(
                                                example.vietnamese || ""
                                            )}

                                        </div>

                                    </div>

                                `
                            )
                            .join("")
                    }

                </div>

            </section>


            <!-- WORD FAMILY -->

            <section class="detail-section">

                <h2>
                    Word Family
                </h2>


                <div class="word-family-table-wrapper">

                    <table
                        class="word-family-table"
                    >

                        <thead>

                            <tr>

                                <th>
                                    Word
                                </th>


                                <th>
                                    IPA / Cách đọc
                                </th>


                                <th>
                                    Part of Speech
                                </th>


                                <th>
                                    Meaning
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                data.wordFamily
                                    .map(
                                        item => `

                                            <tr>

                                                <td>

                                                    <strong>

                                                        ${escapeHtml(
                                                            item.word
                                                        )}

                                                    </strong>


                                                    ${
                                                        item.exampleEnglish
                                                            ? `

                                                                <div class="family-example">

                                                                    <span class="example-label">

                                                                        Example:

                                                                    </span>


                                                                    ${escapeHtml(
                                                                        item.exampleEnglish
                                                                    )}


                                                                    ${
                                                                        item.exampleVietnamese
                                                                            ? `

                                                                                <div class="family-example-vietnamese">

                                                                                    → ${escapeHtml(
                                                                                        item.exampleVietnamese
                                                                                    )}

                                                                                </div>

                                                                            `
                                                                            : ""
                                                                    }

                                                                </div>

                                                            `
                                                            : ""
                                                    }

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

                                        `
                                    )
                                    .join("")
                            }

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    `;


    // =========================================
    // SHOW SAVE BUTTON
    // =========================================

    saveButton.style.display =
        "inline-flex";

}


// =========================================
// SAVE FLASHCARD TO SUPABASE
// =========================================

async function saveImportedFlashcard() {

    const input =
        document.getElementById(
            "jsonInput"
        );


    const error =
        document.getElementById(
            "importError"
        );


    const saveButton =
        document.getElementById(
            "saveButton"
        );


    error.textContent = "";


    const rawText =
        input.value.trim();


    if (!rawText) {

        error.textContent =
            "Please paste the Flashcard JSON first.";

        return;

    }


    // =========================================
    // PARSE JSON
    // =========================================

    let data;


    try {

        data =
            JSON.parse(
                rawText
            );

    } catch (parseError) {

        error.textContent =
            "Invalid JSON.";

        return;

    }


    // =========================================
    // BASIC VALIDATION
    // =========================================

    if (
        !data.word ||
        !data.meaning
    ) {

        error.textContent =
            "The Flashcard must have at least Word and Meaning.";

        return;

    }


    if (
        !Array.isArray(
            data.examples
        )
    ) {

        error.textContent =
            "The 'examples' field must be an array.";

        return;

    }


    if (
        !Array.isArray(
            data.wordFamily
        )
    ) {

        error.textContent =
            "The 'wordFamily' field must be an array.";

        return;

    }


    // =========================================
    // DISABLE BUTTON
    // =========================================

    saveButton.disabled =
        true;


    saveButton.textContent =
        "Saving...";


    let flashcardId =
        null;


    try {

        // =========================================
        // 1. INSERT MAIN FLASHCARD
        // =========================================

        const {
            data: flashcard,
            error: flashcardError
        } = await supabaseClient

            .from("flashcards")

            .insert({

                word:
                    data.word,

                pronunciation:
                    data.pronunciation ||
                    null,

                meaning:
                    data.meaning,

                explanation:
                    data.explanation ||
                    null,

                notes:
                    data.notes ||
                    null,

                tags:
                    Array.isArray(
                        data.tags
                    )
                        ? data.tags
                        : null

            })

            .select(
                "id"
            )

            .single();


        if (
            flashcardError
        ) {

            throw flashcardError;

        }


        flashcardId =
            flashcard.id;


        // =========================================
        // 2. INSERT EXAMPLES
        // =========================================

        if (
            data.examples.length > 0
        ) {

            const exampleRows =
                data.examples
                    .map(
                        example => ({

                            flashcard_id:
                                flashcardId,

                            english:
                                example.english,

                            vietnamese:
                                example.vietnamese ||
                                null

                        })
                    );


            const {
                error: examplesError
            } = await supabaseClient

                .from("examples")

                .insert(
                    exampleRows
                );


            if (
                examplesError
            ) {

                throw examplesError;

            }

        }


        // =========================================
        // 3. INSERT WORD FAMILY
        // =========================================

        if (
            data.wordFamily.length > 0
        ) {

            const wordFamilyRows =
                data.wordFamily
                    .map(
                        item => ({

                            flashcard_id:
                                flashcardId,

                            word:
                                item.word,

                            pronunciation:
                                item.pronunciation ||
                                null,

                            part_of_speech:
                                item.partOfSpeech ||
                                null,

                            meaning:
                                item.meaning ||
                                null,

                            example_english:
                                item.exampleEnglish ||
                                null,

                            example_vietnamese:
                                item.exampleVietnamese ||
                                null

                        })
                    );


            const {
                error: wordFamilyError
            } = await supabaseClient

                .from("word_family")

                .insert(
                    wordFamilyRows
                );


            if (
                wordFamilyError
            ) {

                throw wordFamilyError;

            }

        }


        // =========================================
        // SUCCESS
        // =========================================

        alert(
            "Flashcard saved successfully!"
        );


        // Reload website

        location.reload();


    } catch (saveError) {

        console.error(
            "Save Flashcard Error:",
            saveError
        );


        // =========================================
        // CLEANUP
        // =========================================

        /*
         * If the main Flashcard was already created
         * but Examples or Word Family failed,
         * remove the main Flashcard again.
         *
         * This prevents incomplete records.
         */

        if (
            flashcardId
        ) {

            try {

                await supabaseClient

                    .from("flashcards")

                    .delete()

                    .eq(
                        "id",
                        flashcardId
                    );

            } catch (cleanupError) {

                console.error(
                    "Cleanup Error:",
                    cleanupError
                );

            }

        }


        error.textContent =
            saveError.message ||
            "Failed to save Flashcard.";


        saveButton.disabled =
            false;


        saveButton.textContent =
            "💾 Save Flashcard";

    }

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

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

                themeToggle.textContent =
                    "☀️";

            } else {

                themeToggle.textContent =
                    "🌙";

            }

        }
    );

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHtml(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================
// INITIALIZE APPLICATION
// =========================================

async function initializeApp() {

    await loadFlashcards();

}


// Start

initializeApp();
