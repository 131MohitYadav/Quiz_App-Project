// Get logged-in student's ID
// Priority 1: localStorage (set this at login, e.g. localStorage.setItem('studentId', student.id))
// Priority 2: URL query param, e.g. profile.html?id=67cd
function getStudentId() {
    const stored = localStorage.getItem('studentId');
    if (stored) return stored;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('id');
    if (fromUrl) return fromUrl;

    return null;
}

// Fetch and display the logged-in student's profile
async function loadProfile() {
    const id = getStudentId();

    if (!id) {
        Swal.fire('Not Logged In', 'No student ID found. Please login again.', 'warning')
            .then(() => window.location.href = "login.html");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/student/${id}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');

        const student = await response.json();
        renderProfile(student);
    } catch (error) {
        console.error('Error fetching profile:', error);
        Swal.fire('Error', 'Could not load profile data', 'error');
    }
}

// Fill the page with the student's data
function renderProfile(student) {
    document.getElementById('studentName').textContent = student.name;

    // Result badge (e.g. Pass/Fail) shown as the "rank" pill
    const rankEl = document.getElementById('rank');
    rankEl.textContent = student.result;
    rankEl.style.background = student.result?.toLowerCase().includes('pass') ? '#c8f7c5' : '#ffe082';

    // Stats boxes
    const [scored, total] = String(student.marks).split('/');
    document.getElementById('totalScore').textContent = student.marks || '--';
    document.getElementById('quizName').textContent = student.test || '--';

    let percent = 0;
    if (scored && total && !isNaN(scored) && !isNaN(total) && Number(total) > 0) {
        percent = Math.round((Number(scored) / Number(total)) * 100);
    }
    document.getElementById('percentage').textContent = percent + '%';

    // User details table
    document.getElementById('userAge').textContent = student.age || '--';
    document.getElementById('userMobile').textContent = student.contact || '--';
    document.getElementById('userCity').textContent = student.city || '--';
    document.getElementById('userResult').textContent = student.result || '--';

    // Progress bar
    const bar = document.getElementById('bar');
    setTimeout(() => { bar.style.width = percent + '%'; }, 100);
}

// Edit Profile -> reuse existing edit flow, redirect to the update page
document.getElementById('editBtn')?.addEventListener('click', () => {
    const id = getStudentId();
    window.location.href = `Home.html?edit=${id}`;
});

// Logout -> clear stored id and go back to login/home
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    Swal.fire({
        title: 'Logout?',
        text: 'You will need to login again.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('studentId');
            window.location.href = "login.html";
        }
    });
});

document.addEventListener('DOMContentLoaded', loadProfile);