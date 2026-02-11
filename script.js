// --- CONFIGURATION ---
const gradePoints = {
    "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0, "Ab": 0
};
// ---------------------

const courseWrapper = document.getElementById('course-wrapper');
const prevGpaWrapper = document.getElementById('prev-gpa-wrapper');
const addCourseBtn = document.getElementById('add-course-btn');
const addPrevGpaBtn = document.getElementById('add-prev-gpa-btn');
// New buttons
const calcGpaBtn = document.getElementById('calc-gpa-btn');
const calcCgpaBtn = document.getElementById('calc-cgpa-btn');
const resetBtn = document.getElementById('reset-btn');

const resultsContainer = document.getElementById('results-container');
const gpaResultBox = document.getElementById('gpa-result-box');
const cgpaResultBox = document.getElementById('cgpa-result-box');
const currentGpaScore = document.getElementById('current-gpa-score');
const finalCgpaScore = document.getElementById('final-cgpa-score');

// --- 1. Functions to Add Input Rows ---
function addCourseRow() {
    const div = document.createElement('div');
    div.classList.add('input-row', 'course-row');
    div.innerHTML = `
        <input type="number" placeholder="Credits" min="1" class="credit-input">
        <select class="grade-select">
            <option value="" disabled selected>Grade</option>
            ${Object.entries(gradePoints).map(([grade, point]) => `<option value="${point}">${grade} (${point})</option>`).join('')}
        </select>
        <button class="remove-btn"><i class="fa-solid fa-xmark"></i></button>
    `;
    div.querySelector('.remove-btn').onclick = () => {
        div.remove();
        if(courseWrapper.children.length === 0) addCourseRow();
    };
    courseWrapper.appendChild(div);
}

function addPrevGpaRow() {
    const semesterCount = prevGpaWrapper.children.length + 1;
    const div = document.createElement('div');
    div.classList.add('input-row', 'prev-gpa-row');
    div.innerHTML = `
        <input type="number" placeholder="Semester ${semesterCount} GPA (e.g., 8.5)" step="0.01" min="0" max="10" class="prev-gpa-input">
        <button class="remove-btn"><i class="fa-solid fa-xmark"></i></button>
    `;
    div.querySelector('.remove-btn').onclick = () => div.remove();
    prevGpaWrapper.appendChild(div);
}

// --- 2. Helper function to calculate Current GPA internaly ---
function getCurrentGPAValue() {
    const credits = document.querySelectorAll('.credit-input');
    const grades = document.querySelectorAll('.grade-select');
    let semTotalCredits = 0;
    let semTotalPoints = 0;
    let validCurrentRows = 0;

    for (let i = 0; i < credits.length; i++) {
        const credit = parseFloat(credits[i].value);
        const gradePoint = parseFloat(grades[i].value);
        if (!isNaN(credit) && credit > 0 && !isNaN(gradePoint)) {
            semTotalCredits += credit;
            semTotalPoints += (credit * gradePoint);
            validCurrentRows++;
        }
    }

    if (validCurrentRows === 0 || semTotalCredits === 0) {
         return null; // Indicate invalid input
    }

    return semTotalPoints / semTotalCredits;
}


// --- 3. Main Calculation Event Handlers ---

// Handler for "Calculate Current GPA" Button
function calculateCurrentGPA() {
    const currentGPA = getCurrentGPAValue();

    if (currentGPA === null) {
        alert("Please enter valid credits and grades for at least one current subject.");
        return;
    }

    // Update UI
    currentGpaScore.textContent = currentGPA.toFixed(2);
    resultsContainer.style.display = 'grid';
    gpaResultBox.style.display = 'block';
    // Hide CGPA box if it was previously shown
    cgpaResultBox.style.display = 'none'; 
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handler for "Calculate Final CGPA" Button
function calculateFinalCGPA() {
    // 1. Get Current GPA first
    const currentGPA = getCurrentGPAValue();

    if (currentGPA === null) {
        alert("Please ensure your current semester subjects are entered correctly to calculate final CGPA.");
        return;
    }

    // 2. Gather Past GPAs
    const prevGpaInputs = document.querySelectorAll('.prev-gpa-input');
    let sumOfPastGPAs = 0;
    let countOfPastSemesters = 0;

    prevGpaInputs.forEach(input => {
        const gpa = parseFloat(input.value);
        if (!isNaN(gpa)) {
            sumOfPastGPAs += gpa;
            countOfPastSemesters++;
        }
    });

    // 3. Calculate Average: (Sum of all GPAs) / (Total number of semesters)
    const totalSumOfGPAs = sumOfPastGPAs + currentGPA;
    const totalSemestersCount = countOfPastSemesters + 1; // +1 for current semester
    const finalCGPA = totalSumOfGPAs / totalSemestersCount;

    // 4. Update UI
    currentGpaScore.textContent = currentGPA.toFixed(2);
    finalCgpaScore.textContent = finalCGPA.toFixed(2);
    
    resultsContainer.style.display = 'grid';
    gpaResultBox.style.display = 'block';
    cgpaResultBox.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// --- 4. Reset Function ---
function resetCalculator() {
    courseWrapper.innerHTML = '';
    prevGpaWrapper.innerHTML = '';
    resultsContainer.style.display = 'none';
    gpaResultBox.style.display = 'none';
    cgpaResultBox.style.display = 'none';
    addCourseRow();
    addCourseRow();
    addPrevGpaRow();
}

// --- 5. Event Listeners ---
addCourseBtn.addEventListener('click', addCourseRow);
addPrevGpaBtn.addEventListener('click', addPrevGpaRow);
// Attach separate handlers to the new buttons
calcGpaBtn.addEventListener('click', calculateCurrentGPA);
calcCgpaBtn.addEventListener('click', calculateFinalCGPA);
resetBtn.addEventListener('click', resetCalculator);

window.onload = () => {
    resetCalculator(); // Initialize on load
};