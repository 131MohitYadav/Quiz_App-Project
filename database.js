// Fetch and display data from the API
async function fetdata() {
    let response = await fetch('http://localhost:3000/student');
    let students = await response.json();

    let tableRows = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.contact}</td>
            <td>${student.age}</td>
            <td>${student.city}</td>
            <td>${student.test}</td>
            <td>${student.marks}</td>
            <td>${student.result}</td>
 <td><button style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;" onclick="mydel('${student.id}')">Delete</button></td>
        <td><button style="background-color: green; color: white; border: none; padding: 5px 10px; cursor: pointer;" onclick="myedit('${student.id}')">Edit</button></td>
    </tr>
        </tr>
    `).join("");

    document.querySelector('#display').innerHTML = tableRows;
}

// Call function to load data
fetdata();

// Function to delete data
function mydel(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        allowOutsideClick: false,
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/student/${id}`, { method: 'DELETE' })
                .then(() => {
                    Swal.fire("Deleted!", "The student record has been deleted.", "success");
                    fetdata(); // Refresh data
                });
        }
    });
}

// Function to insert new data
function insertdata() {
    let newStudent = {
        name: document.querySelector('#name').value,
        age: document.querySelector('#age').value,
        contact: document.querySelector('#contact').value,
        city: document.querySelector('#city').value,
        test: document.querySelector('#test').value,
        marks: document.querySelector('#marks').value,
        result: document.querySelector('#result').value
    };

    fetch('http://localhost:3000/student', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(newStudent)
    }).then(() => {
        alert("Student data inserted successfully!"); // Normal alert for insertion success
        fetdata(); // Refresh data
    });
    
}

// Function to edit data
async function myedit(id) {
    let response = await fetch(`http://localhost:3000/student/${id}`);
    let student = await response.json();

    let formHTML = `
        <input type="text" value="${student.name}" id="name1"><br><br>
        <input type="text" value="${student.age}" id="age1"><br><br>
        <input type="text" value="${student.contact}" id="contact1"><br><br>
        <input type="text" value="${student.city}" id="city1"><br><br>
        <input type="text" value="${student.test}" id="test1"><br><br>
        <input type="text" value="${student.marks}" id="marks1"><br><br>
        <input type="text" value="${student.result}" id="result1"><br><br>
        <button onclick="finalupdate('${student.id}')">Update</button>
    `;

    document.querySelector('#showedit').innerHTML = formHTML;
}

// Function to update data
function finalupdate(id) {
    let updatedStudent = {
        name: document.querySelector('#name1').value,
        age: document.querySelector('#age1').value,
        contact: document.querySelector('#contact1').value,
        city: document.querySelector('#city1').value,
        test: document.querySelector('#test1').value,
        marks: document.querySelector('#marks1').value,
        result: document.querySelector('#result1').value
    };

    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
        allowOutsideClick: false,
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/student/${id}`, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(updatedStudent)
            }).then(() => {
                Swal.fire("Saved!", "Your changes have been saved.", "success");
                fetdata(); // Refresh data
            });
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}
