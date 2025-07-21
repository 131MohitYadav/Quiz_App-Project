// Fetch and display data from the API
async function fetdata() {
    try {
        const response = await fetch('http://localhost:3000/student');
        if (!response.ok) throw new Error('Failed to fetch data');
        const students = await response.json();

        if (document.querySelector('#display')) {
            const tableRows = students.map(student => `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.contact}</td>
                    <td>${student.age}</td>
                    <td>${student.city}</td>
                    <td>${student.test}</td>
                    <td>${student.marks}</td>
                    <td>${student.result}</td>
                    <td><button class="delete-btn" style="background-color:red" onclick="mydel('${student.id}')">Delete</button></td>
                    <td><button class="edit-btn" onclick="myedit('${student.id}')">Edit</button></td>
                </tr>
            `).join("");
            document.querySelector('#display').innerHTML = tableRows;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Could not load student data', 'error');
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', fetdata);

// Function to delete data
async function mydel(id) {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            allowOutsideClick: false,
        });

        if (result.isConfirmed) {
            const response = await fetch(`http://localhost:3000/student/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Delete failed');
            
            await Swal.fire("Deleted!", "The student record has been deleted.", "success");
            fetdata(); // Refresh data
        }
    } catch (error) {
        console.error('Delete error:', error);
        Swal.fire("Error!", "Failed to delete record: " + error.message, "error");
    }
}

// Function to insert new data
async function insertdata() {
    const btn = document.getElementById('btn_25');
    try {
        // Disable button during submission
        btn.disabled = true;
        btn.value = 'Submitting...';

        const newStudent = {
            name: document.getElementById('name').value.trim(),
            age: document.getElementById('age').value.trim(),
            contact: document.getElementById('contact').value.trim(),
            city: document.getElementById('city').value.trim(),
            test: document.getElementById('test').value.trim(),
            marks: document.getElementById('marks').value.trim(),
            result: document.getElementById('result').value.trim()
        };

        // Validate all fields
        if (!newStudent.name) throw new Error('Full Name is required');
        if (!newStudent.contact) throw new Error('Mobile Number is required');
        if (!/^\d{10}$/.test(newStudent.contact)) throw new Error('Mobile Number must be 10 digits');
        if (!newStudent.age || isNaN(newStudent.age)) throw new Error('Age must be a number');

        const response = await fetch('http://localhost:3000/student', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newStudent)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Submission failed');
        }

        await Swal.fire({
            title: 'Success!',
            text: 'Data submitted successfully!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true
        });

        // Reset form
        document.getElementById('quizForm').reset();
        
        // Redirect after success
        window.location.href = "Home.html";
        
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error'
        });
    } finally {
        // Re-enable button
        btn.disabled = false;
        btn.value = 'Submit';
    }
}

// Function to edit data
async function myedit(id) {
    try {
        const response = await fetch(`http://localhost:3000/student/${id}`);
        if (!response.ok) throw new Error('Failed to fetch student data');
        
        const student = await response.json();

        const formHTML = `
            <div class="edit-form">
                <input type="text" value="${student.name}" id="name1" class="edit-input"><br><br>
                <input type="text" value="${student.age}" id="age1" class="edit-input"><br><br>
                <input type="text" value="${student.contact}" id="contact1" class="edit-input"><br><br>
                <input type="text" value="${student.city}" id="city1" class="edit-input"><br><br>
                <input type="text" value="${student.test}" id="test1" class="edit-input"><br><br>
                <input type="text" value="${student.marks}" id="marks1" class="edit-input"><br><br>
                <input type="text" value="${student.result}" id="result1" class="edit-input"><br><br>
                <button class="update-btn" onclick="finalupdate('${student.id}')">Update</button>
            </div>
        `;

        if (document.querySelector('#showedit')) {
            document.querySelector('#showedit').innerHTML = formHTML;
        }
    } catch (error) {
        console.error('Edit error:', error);
        Swal.fire("Error!", "Could not load student data: " + error.message, "error");
    }
}

// Function to update data
async function finalupdate(id) {
    try {
        const updatedStudent = {
            name: document.getElementById('name1').value,
            age: document.getElementById('age1').value,
            contact: document.getElementById('contact1').value,
            city: document.getElementById('city1').value,
            test: document.getElementById('test1').value,
            marks: document.getElementById('marks1').value,
            result: document.getElementById('result1').value
        };

        const result = await Swal.fire({
            title: "Confirm Update",
            text: "Do you want to save these changes?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            allowOutsideClick: false
        });

        if (result.isConfirmed) {
            const response = await fetch(`http://localhost:3000/student/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(updatedStudent)
            });

            if (!response.ok) throw new Error('Update failed');

            await Swal.fire("Saved!", "Your changes have been saved.", "success");
            fetdata(); // Refresh data
        }
    } catch (error) {
        console.error('Update error:', error);
        Swal.fire("Error!", "Failed to update: " + error.message, "error");
    }
}