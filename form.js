const sign = () => {
    let userdata = {
        name: document.querySelector('#name').value.trim(),
        email: document.querySelector('#email').value.trim(),
        password: document.querySelector('#password').value.trim()
    };

    if (!userdata.name || !userdata.email || !userdata.password) {
        alert("Please fill all fields!");
        return;
    }

    localStorage.setItem("userdata", JSON.stringify(userdata));
    alert("Account Created Successfully! You can now log in.");
};

function log() {
    let logindata = {
        loginemail: document.querySelector('#loginemail').value.trim(),
        loginpassword: document.querySelector('#loginpass').value.trim()
    };

    let data = JSON.parse(localStorage.getItem('userdata'));

    if (!data) {
        alert("No user found! Please sign up first.");
        return false;
    }

    // **Check if email OR username matches, and password matches**
    if ((data.email === logindata.loginemail || data.name === logindata.loginemail) && data.password === logindata.loginpassword) {
        alert(`Login Successful! Welcome back, ${data.name}`);
        
        // Redirect to another page after successful login
        window.location.href = "home.html"; // Change this to your home page
        return true;
    }else {
        Swal.fire({
            icon: "error",
            title: "Invalid Credentials!",
            text: "Incorrect email/username or password.",
        });
        return false;
    }
}
