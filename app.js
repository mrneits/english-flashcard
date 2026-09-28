// ============================================================
// ENGLISH FLASHCARDS
// APP.JS - VERSION 11
// ============================================================


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let flashcards = [];

let filteredFlashcards = [];

let currentPage = 1;

const rowsPerPage = 20;

let pendingFlashcard = null;


// ============================================================
// GET HTML ELEMENTS
// ============================================================

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


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// LOAD ALL FLASHCARDS FROM SUPABASE
// ============================================================

async function loadFlashcards() {

    try {

        console.log(
            "Loading Flashcards from Supabase..."
        );


        // ----------------------------------------------------
        // 1. LOAD MAIN FLASHCARDS
        // ----------------------------------------------------

        const {
            data: flashcardRows,
            error: flashcardError
        } = await supabaseClient
            .from("flashcards")
            .select("*")
            .order("created_at", {
                ascending: false
            });


        if (flashcardError) {

            throw flashcardError;

        }


        // ----------------------------------------------------
        // Nếu chưa có Flashcard
        // ----------------------------------------------------

        if (
            !flashcardRows ||
            flashcardRows.length === 0
        ) {

            flashcards = [];

            filteredFlashcards = [];

            renderFlashcards();

            console.log(
                "No Flashcards found."
            );

            return;

        }


        // ----------------------------------------------------
        // Lấy ID của tất cả Flashcard
        // ----------------------------------------------------

        const flashcardIds =
            flashcardRows.map(
                item => item.id
            );


        // ----------------------------------------------------
        // 2. LOAD EXAMPLES
        // ----------------------------------------------------

        const {
            data: exampleRows,
            error: exampleError
        } = await supabaseClient
            .from("examples")
            .select("*")
            .in(
                "flashcard_id",
                flashcardIds
            );


        if (exampleError) {

            throw exampleError;

        }


        // ----------------------------------------------------
        // 3. LOAD WORD FAMILY
        // ----------------------------------------------------

        const {
            data: wordFamilyRows,
            error: wordFamilyError
        } = await supabaseClient
            .from("word_family")
            .select("*")
            .in(
                "flashcard_id",
                flashcardIds
            );


        if (wordFamilyError) {

            throw wordFamilyError;

        }


        // ----------------------------------------------------
        // 4. GHÉP DỮ LIỆU
        // ----------------------------------------------------

        flashcards =
            flashcardRows.map(
                card => {

                    const examples =
                        (exampleRows || [])
                            .filter(
                                example =>
                                    example.flashcard_id ===
                                    card.id
                            )
                            .map(
                                example => ({
                                    english:
                                        example.english || "",

                                    vietnamese:
                                        example.vietnamese || ""
                                })
                            );


                    const wordFamily =
                        (wordFamilyRows || [])
                            .filter(
                                item =>
                                    item.flashcard_id ===
                                    card.id
                            )
                            .map(
                                item => ({

                                    word:
                                        item.word || "",

                                    pronunciation:
                                        item.pronunciation || "",

                                    partOfSpeech:
                                        item.part_of_speech || "",

                                    meaning:
                                        item.meaning || "",

                                    exampleEnglish:
                                        item.example_english || "",

                                    exampleVietnamese:
                                        item.example_vietnamese || ""

                                })
                            );


                    return {

                        id:
                            card.id,

                        word:
                            card.word || "",

                        pronunciation:
                            card.pronunciation || "",

                        meaning:
                            card.meaning || "",

                        explanation:
                            card.explanation || "",

                        notes:
                            card.notes || "",

                        tags:
                            card.tags || [],

                        examples,

                        wordFamily

                    };

                }
            );


        filteredFlashcards =
            [...flashcards];


        currentPage = 1;


        console.log(
            "Flashcards loaded:",
            flashcards
        );


        renderFlashcards();


    } catch (error) {

        console.error(
            "Failed to load Flashcards:",
            error
        );


        showLoadError(
            error
        );

    }

}


// ============================================================
// SHOW LOAD ERROR
// ============================================================

function showLoadError(error) {

    if (!tableBody) {
        return;
    }


    const tableContainer =
        document.querySelector(
            ".table-container"
        );


    if (tableContainer) {

        tableContainer.style.display =
            "none";

    }


    if (emptyState) {

        emptyState.style.display =
            "block";


        emptyState.innerHTML = `

            <div class="empty-icon">
                ⚠️
            </div>

            <h2>
                Failed to load Flashcards
            </h2>

            <p>
                ${escapeHtml(
                    error?.message ||
                    "Unable to connect to Supabase."
                )}
            </p>

            <button
                class="primary-button"
                onclick="location.reload()"
            >
                ↻ Try Again
            </button>

        `;

    }

}


// ============================================================
// RENDER FLASHCARD LIST
// ============================================================

function renderFlashcards() {

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    const tableContainer =
        document.querySelector(
            ".table-container"
        );


    // ----------------------------------------------------
    // EMPTY
    // ----------------------------------------------------

    if (
        filteredFlashcards.length === 0
    ) {

        if (tableContainer) {

            tableContainer.style.display =
                "none";

        }


        if (emptyState) {

            emptyState.style.display =
                "block";

            emptyState.innerHTML = `

                <div class="empty-icon">
                    📚
                </div>

                <h2>
                    ${
                        flashcards.length === 0
                            ? "No Flashcards Yet"
                            : "No Results Found"
                    }
                </h2>

                <p>
                    ${
                        flashcards.length === 0
                            ? "Your English vocabulary collection will appear here."
                            : "Try another search keyword."
                    }
                </p>

                ${
                    flashcards.length === 0
                        ? `
                            <button
                                id="dynamicEmptyAddButton"
                                class="primary-button"
                            >
                                ＋ Add Your First Flashcard
                            </button>
                        `
                        : ""
                }

            `;


            const dynamicButton =
                document.getElementById(
                    "dynamicEmptyAddButton"
                );


            if (dynamicButton) {

                dynamicButton.addEventListener(
                    "click",
                    showAddFlashcard
                );

            }

        }


        if (pagination) {

            pagination.style.display =
                "none";

        }


        return;

    }


    // ----------------------------------------------------
    // SHOW TABLE
    // ----------------------------------------------------

    if (tableContainer) {

        tableContainer.style.display =
            "block";

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    if (pagination) {

        pagination.style.display =
            "flex";

    }


    // ----------------------------------------------------
    // PAGINATION
    // ----------------------------------------------------

    const start =
        (currentPage - 1) *
        rowsPerPage;


    const end =
        start + rowsPerPage;


    const currentItems =
        filteredFlashcards.slice(
            start,
            end
        );


    // ----------------------------------------------------
    // RENDER ROWS
    // ----------------------------------------------------

    currentItems.forEach(
        (card, index) => {

            const row =
                document.createElement("tr");


            const number =
                start + index + 1;


            const familyCount =
                Array.isArray(
                    card.wordFamily
                )
                    ? card.wordFamily.length
                    : 0;


            row.innerHTML = `

                <td>
                    ${number}
                </td>

                <td>

                    <strong>
                        ${escapeHtml(
                            card.word
                        )}
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
                    word${familyCount !== 1 ? "s" : ""}
                </td>

            `;


            row.style.cursor =
                "pointer";


            row.addEventListener(
                "click",
                () =>
                    showFlashcardDetail(card)
            );


            tableBody.appendChild(row);

        }
    );


    renderPagination();

}


// ============================================================
// PAGINATION
// ============================================================

function renderPagination() {

    if (!pagination) {
        return;
    }


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredFlashcards.length /
            rowsPerPage
        );


    if (totalPages <= 1) {

        return;

    }


    // ----------------------------------------------------
    // PREVIOUS
    // ----------------------------------------------------

    const previous =
        document.createElement(
            "button"
        );


    previous.textContent =
        "‹";


    previous.disabled =
        currentPage === 1;


    previous.addEventListener(
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
        previous
    );


    // ----------------------------------------------------
    // PAGE BUTTONS
    // ----------------------------------------------------

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


    // ----------------------------------------------------
    // NEXT
    // ----------------------------------------------------

    const next =
        document.createElement(
            "button"
        );


    next.textContent =
        "›";


    next.disabled =
        currentPage ===
        totalPages;


    next.addEventListener(
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
        next
    );

}


// ============================================================
// SEARCH
// ============================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            if (!keyword) {

                filteredFlashcards =
                    [...flashcards];

            } else {

                filteredFlashcards =
                    flashcards.filter(
                        card => {

                            const familyText =
                                Array.isArray(
                                    card.wordFamily
                                )
                                    ? card.wordFamily
                                        .flatMap(
                                            item => [

                                                item.word,

                                                item.pronunciation,

                                                item.partOfSpeech,

                                                item.meaning,

                                                item.exampleEnglish,

                                                item.exampleVietnamese

                                            ]
                                        )
                                    : [];


                            const exampleText =
                                Array.isArray(
                                    card.examples
                                )
                                    ? card.examples
                                        .flatMap(
                                            example => [

                                                example.english,

                                                example.vietnamese

                                            ]
                                        )
                                    : [];


                            const searchableText = [

                                card.word,

                                card.pronunciation,

                                card.meaning,

                                card.explanation,

                                card.notes,

                                ...familyText,

                                ...exampleText

                            ]
                                .join(" ")
                                .toLowerCase();


                            return searchableText
                                .includes(
                                    keyword
                                );

                        }
                    );

            }


            currentPage =
                1;


            renderFlashcards();

        }
    );

}


// ============================================================
// SHOW FLASHCARD DETAIL
// ============================================================

function showFlashcardDetail(card) {

    const app =
        document.querySelector(
            ".app"
        );


    if (!app) {
        return;
    }


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
                        Array.isArray(
                            card.examples
                        ) &&
                        card.examples.length > 0

                            ? card.examples
                                .map(
                                    example => `

                                        <div class="example-card">

                                            <div class="example-english">

                                                ${escapeHtml(
                                                    example.english
                                                )}

                                            </div>

                                            ${
                                                example.vietnamese
                                                    ? `

                                                        <div class="example-vietnamese">

                                                            ${escapeHtml(
                                                                example.vietnamese
                                                            )}

                                                        </div>

                                                    `
                                                    : ""
                                            }

                                        </div>

                                    `
                                )
                                .join("")

                            : `

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


                ${
                    Array.isArray(
                        card.wordFamily
                    ) &&
                    card.wordFamily.length > 0

                        ? `

                            <div class="word-family-table-wrapper">

                                <table class="word-family-table">

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

                                        ${card.wordFamily
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

                                                                                            →
                                                                                            ${escapeHtml(
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
                                                                item.pronunciation ||
                                                                "-"
                                                            )}

                                                        </td>


                                                        <td>

                                                            ${escapeHtml(
                                                                item.partOfSpeech ||
                                                                "-"
                                                            )}

                                                        </td>


                                                        <td>

                                                            ${escapeHtml(
                                                                item.meaning ||
                                                                "-"
                                                            )}

                                                        </td>

                                                    </tr>

                                                `
                                            )
                                            .join("")}

                                    </tbody>

                                </table>

                            </div>

                        `

                        : `

                            <p>
                                No Word Family data available.
                            </p>

                        `
                }

            </section>


        </div>

    `;


    const backButton =
        document.getElementById(
            "backButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                location.reload();

            }
        );

    }

}


// ============================================================
// ADD FLASHCARD PAGE
// ============================================================

function showAddFlashcard() {

    const app =
        document.querySelector(
            ".app"
        );


    if (!app) {
        return;
    }


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
                        Paste it below.
                    </li>

                    <li>
                        Click Preview.
                    </li>

                    <li>
                        Check the Flashcard.
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
                    class="secondary-button"
                    style="display:none;"
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
        .getElementById(
            "importBackButton"
        )
        .addEventListener(
            "click",
            () => location.reload()
        );


    document
        .getElementById(
            "previewButton"
        )
        .addEventListener(
            "click",
            previewImportedFlashcard
        );

}


// ============================================================
// ROBUST JSON PARSER
// ============================================================

function parseFlashcardJSON(
    rawText
) {

    if (
        !rawText ||
        !rawText.trim()
    ) {

        throw new Error(
            "Please paste the Flashcard JSON first."
        );

    }


    let text =
        rawText
            .replace(
                /^\uFEFF/,
                ""
            )
            .trim();


    // ----------------------------------------------------
    // TRY DIRECT JSON
    // ----------------------------------------------------

    try {

        return JSON.parse(
            text
        );

    } catch (_) {

        // Continue

    }


    // ----------------------------------------------------
    // REMOVE MARKDOWN CODE FENCE
    // ----------------------------------------------------

    text =
        text
            .replace(
                /^```json\s*/i,
                ""
            )
            .replace(
                /^```\s*/i,
                ""
            )
            .replace(
                /\s*```$/i,
                ""
            )
            .trim();


    try {

        return JSON.parse(
            text
        );

    } catch (_) {

        // Continue

    }


    // ----------------------------------------------------
    // FIND JSON OBJECT
    // ----------------------------------------------------

    const jsonText =
        extractJSONObject(
            text
        );


    if (!jsonText) {

        throw new Error(
            "Could not find a JSON object. Please paste the complete Flashcard JSON."
        );

    }


    try {

        return JSON.parse(
            jsonText
        );

    } catch (error) {

        throw createDetailedJSONError(
            error,
            jsonText
        );

    }

}


// ============================================================
// EXTRACT JSON OBJECT
// ============================================================

function extractJSONObject(
    text
) {

    const start =
        text.indexOf(
            "{"
        );


    if (start === -1) {

        return null;

    }


    let depth = 0;

    let insideString = false;

    let escaped = false;


    for (
        let i = start;
        i < text.length;
        i++
    ) {

        const char =
            text[i];


        if (escaped) {

            escaped = false;

            continue;

        }


        if (
            char === "\\" &&
            insideString
        ) {

            escaped = true;

            continue;

        }


        if (
            char === '"'
        ) {

            insideString =
                !insideString;

            continue;

        }


        if (insideString) {

            continue;

        }


        if (
            char === "{"
        ) {

            depth++;

        }


        if (
            char === "}"
        ) {

            depth--;


            if (
                depth === 0
            ) {

                return text.slice(
                    start,
                    i + 1
                );

            }

        }

    }


    return null;

}


// ============================================================
// JSON ERROR
// ============================================================

function createDetailedJSONError(
    error,
    jsonText
) {

    const message =
        error?.message ||
        "Invalid JSON.";


    const match =
        message.match(
            /position\s+(\d+)/i
        );


    if (match) {

        const position =
            Number(
                match[1]
            );


        const before =
            jsonText.slice(
                0,
                position
            );


        const line =
            before.split(
                "\n"
            ).length;


        const lastNewLine =
            before.lastIndexOf(
                "\n"
            );


        const column =
            position -
            lastNewLine;


        return new Error(
            `Invalid JSON near line ${line}, column ${column}. ${message}`
        );

    }


    return new Error(
        `Invalid JSON. ${message}`
    );

}


// ============================================================
// VALIDATE FLASHCARD
// ============================================================

function validateFlashcardData(
    data
) {

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        return (
            "The Flashcard JSON must be a JSON object."
        );

    }


    if (!data.word) {

        return (
            "The 'word' field cannot be empty."
        );

    }


    if (!data.meaning) {

        return (
            "The 'meaning' field cannot be empty."
        );

    }


    if (
        !Array.isArray(
            data.examples
        )
    ) {

        return (
            "The 'examples' field must be an array."
        );

    }


    if (
        !Array.isArray(
            data.wordFamily
        )
    ) {

        return (
            "The 'wordFamily' field must be an array."
        );

    }


    // ----------------------------------------------------
    // EXAMPLES
    // ----------------------------------------------------

    for (
        let i = 0;
        i < data.examples.length;
        i++
    ) {

        const example =
            data.examples[i];


        if (
            !example ||
            !example.english
        ) {

            return (
                `Example ${i + 1} is missing English text.`
            );

        }

    }


    // ----------------------------------------------------
    // WORD FAMILY
    // ----------------------------------------------------

    for (
        let i = 0;
        i < data.wordFamily.length;
        i++
    ) {

        const item =
            data.wordFamily[i];


        if (
            !item ||
            !item.word
        ) {

            return (
                `Word Family item ${i + 1} is missing the word.`
            );

        }

    }


    return null;

}


// ============================================================
// PREVIEW FLASHCARD
// ============================================================

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


    if (
        !input ||
        !error ||
        !preview
    ) {

        return;

    }


    error.textContent =
        "";


    preview.innerHTML =
        "";


    if (saveButton) {

        saveButton.style.display =
            "none";

    }


    try {

        const data =
            parseFlashcardJSON(
                input.value
            );


        const validationError =
            validateFlashcardData(
                data
            );


        if (validationError) {

            throw new Error(
                validationError
            );

        }


        pendingFlashcard =
            data;


        window.pendingFlashcard =
            data;


        renderFlashcardPreview(
            data,
            preview
        );


        if (saveButton) {

            saveButton.style.display =
                "inline-flex";


            saveButton.disabled =
                false;


            saveButton.textContent =
                "💾 Save Flashcard";


            saveButton.onclick =
                saveImportedFlashcard;

        }


    } catch (errorObject) {

        console.error(
            "JSON Parse Error:",
            errorObject
        );


        error.textContent =
            errorObject.message;

    }

}


// ============================================================
// RENDER PREVIEW
// ============================================================

function renderFlashcardPreview(
    data,
    preview
) {

    preview.innerHTML = `

        <div class="preview-title">

            <span>
                Preview
            </span>

            <span class="preview-valid">
                ✓ Valid Flashcard
            </span>

        </div>


        <div class="flashcard-detail-card preview-flashcard">

            <div class="flashcard-header">

                <h1>
                    ${escapeHtml(
                        data.word
                    )}
                </h1>

                <div class="main-pronunciation">
                    ${escapeHtml(
                        data.pronunciation || ""
                    )}
                </div>

            </div>


            <section class="detail-section">

                <h2>
                    Meaning
                </h2>

                <p class="main-meaning">

                    ${escapeHtml(
                        data.meaning
                    )}

                </p>


                ${
                    data.explanation
                        ? `

                            <p class="explanation">

                                ${escapeHtml(
                                    data.explanation
                                )}

                            </p>

                        `
                        : ""
                }

            </section>


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

                                        ${
                                            example.vietnamese
                                                ? `

                                                    <div class="example-vietnamese">

                                                        ${escapeHtml(
                                                            example.vietnamese
                                                        )}

                                                    </div>

                                                `
                                                : ""
                                        }

                                    </div>

                                `
                            )
                            .join("")
                    }

                </div>

            </section>


            <section class="detail-section">

                <h2>
                    Word Family
                </h2>


                <div class="word-family-table-wrapper">

                    <table class="word-family-table">

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

                                                                                    →
                                                                                    ${escapeHtml(
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
                                                        item.pronunciation ||
                                                        "-"
                                                    )}

                                                </td>


                                                <td>

                                                    ${escapeHtml(
                                                        item.partOfSpeech ||
                                                        item.type ||
                                                        "-"
                                                    )}

                                                </td>


                                                <td>

                                                    ${escapeHtml(
                                                        item.meaning ||
                                                        "-"
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

}


// ============================================================
// SAVE FLASHCARD
// ============================================================

async function saveImportedFlashcard() {

    const error =
        document.getElementById(
            "importError"
        );


    const saveButton =
        document.getElementById(
            "saveButton"
        );


    const data =
        pendingFlashcard ||
        window.pendingFlashcard;


    if (
        !data ||
        !saveButton
    ) {

        return;

    }


    const validationError =
        validateFlashcardData(
            data
        );


    if (validationError) {

        error.textContent =
            validationError;

        return;

    }


    saveButton.disabled =
        true;


    saveButton.textContent =
        "Saving...";


    try {

        // ----------------------------------------------------
        // 1. FLASHCARD
        // ----------------------------------------------------

        const {
            data: flashcard,
            error: flashcardError
        } =
            await supabaseClient
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
                        null

                })
                .select()
                .single();


        if (flashcardError) {

            throw flashcardError;

        }


        const flashcardId =
            flashcard.id;


        // ----------------------------------------------------
        // 2. EXAMPLES
        // ----------------------------------------------------

        if (
            data.examples &&
            data.examples.length > 0
        ) {

            const exampleRows =
                data.examples.map(
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
            } =
                await supabaseClient
                    .from("examples")
                    .insert(
                        exampleRows
                    );


            if (examplesError) {

                throw examplesError;

            }

        }


        // ----------------------------------------------------
        // 3. WORD FAMILY
        // ----------------------------------------------------

        if (
            data.wordFamily &&
            data.wordFamily.length > 0
        ) {

            const wordFamilyRows =
                data.wordFamily.map(
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
                            item.type ||
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
            } =
                await supabaseClient
                    .from("word_family")
                    .insert(
                        wordFamilyRows
                    );


            if (wordFamilyError) {

                throw wordFamilyError;

            }

        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        alert(
            "Flashcard saved successfully!"
        );


        location.reload();


    } catch (errorObject) {

        console.error(
            "Save Flashcard Error:",
            errorObject
        );


        error.textContent =
            errorObject.message ||
            "Failed to save Flashcard.";


        saveButton.disabled =
            false;


        saveButton.textContent =
            "💾 Save Flashcard";

    }

}


// ============================================================
// BUTTON EVENTS
// ============================================================

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


// ============================================================
// DARK MODE
// ============================================================

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            themeToggle.textContent =
                isDark
                    ? "☀️"
                    : "🌙";

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

async function initializeApp() {

    console.log(
        "English Flashcards starting..."
    );


    await loadFlashcards();

}


initializeApp();
