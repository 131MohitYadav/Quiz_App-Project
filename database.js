// Fetch and display data from the API
async function fetdata() {
    let data = await fetch('http://localhost:3000/student');
    let fdata = await data.json();

    let tdata = fdata.map((e) => `
    <tr> 
        <td> ${e.id}</td>
        <td> ${e.name}</td>
        <td> ${e.contact}</td>
        <td> ${e.age}</td>
        <td> ${e.city}</td>
        <td> ${e.test}</td>
        <td> ${e.marks}</td>
        <td> ${e.result}</td>
        <td><button onclick="mydel('${e.id}')"> Delete </button></td>
        <td><button onclick="myedit('${e.id}')"> EDIT </button></td>
    </tr>
    `).join("");

    document.querySelector('#display').innerHTML = tdata;
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
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/student/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                Swal.fire("Deleted!", "The student record has been deleted.", "success");
                fetdata(); // Refresh data
            });
        }
    });
}

// Function to insert new data
function insertdata() {
    let frmdata = {
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
        body: JSON.stringify(frmdata)
    })
    .then(() => {
        Swal.fire("Success!", "Student data inserted successfully!", "success");
        fetdata(); // Refresh data
    });
}

// Function to edit data
async function myedit(id) {
    let edata = await fetch(`http://localhost:3000/student/${id}`);
    let fdata = await edata.json();

    let frm = `
    <input type="text" value="${fdata.name}" id="name1"><br><br>
    <input type="text" value="${fdata.age}" id="age1"><br><br>
    <input type="text" value="${fdata.contact}" id="contact1"><br><br>
    <input type="text" value="${fdata.city}" id="city1"><br><br>
    <input type="text" value="${fdata.test}" id="test1"><br><br>
    <input type="text" value="${fdata.marks}" id="marks1"><br><br>
    <input type="text" value="${fdata.result}" id="result1"><br><br>
    <button onclick="finalupdate('${fdata.id}')">Update</button>
    `;

    document.querySelector('#showedit').innerHTML = frm;
}

// Function to update data
function finalupdate(id) {
    let final = {
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
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/student/${id}`, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(final)
            })
            .then(() => {
                Swal.fire("Saved!", "Your changes have been saved.", "success");
                fetdata(); // Refresh data
            });
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}
