const sign = () => {
    let userdata = {
        name: document.querySelector('#name').ariaValueMax.trim(),
        email: document.querySelector('#email').value.trim(),
        password: document.querySelector('#password').value.trim()

    };
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/
    const digitPattern = /\d/;

    if(!userdata.name || !userdata.email || !userdata.password){
        alert("Please fill all fields");
        return false;
    }

    if (!specialCharPattern.test(userdata.name) || !digitPattern.test(userdata.name)) {
        alert("Please enter a valid username include special character and digits!");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userdata.email)) {
        alert("Please enter a valid email address");
        return false;
    }

    if ( userdata.password.length < 6){
        alert("Password must be at least 6 character!");
        return false;

    }
    localStorage.setItem("userdata".JSON.stringify(userdata));
    alert("Account Created Successfully! You an now log in.");

};

function log() {
    let logindata = {
        loginemail: document.querySelector('#loginemail').value.trim(),
        loginpassword: document.querySelector('#loginpass').value.trim()
    };

    let data = JSON.parse(localStorage.getItem('userdata'));

    if(!data){
        alert("No user found! Please sign up first.");
        return false;
    }

    if ((data.email === logindata.loginemail  || data.name === logindata.loginemail) && data.password === logindata.loginpassword) {


        alert('Login Succesfull! Welcome back, ${data.name}');
        window.location.href = "home.html";
        return true;
    } else {
        Swal.first({
            icon: "error",
            title: "Invalid Credentials",
            text: "Incorrect email/username or password.",
        });
        return false;
    }
}

// Password toggle for sign up page
document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eye");


    if ( passwordInput && eyeIcon) {
        eyeIcon.addEventListener("click", function() {
            if (passwordInput.type === "password"){
                passwordInput.type = "text";
                eyeIcon.classList.remove("fa-eye");
                eyeIcon.classList.add("fa-eye-slash");
            }
            else{
                passwordInput.type = "password";
                eyeIcon.classList.remove("fa-eye-slash");
                eyeIcon.classList.add("fa-eye");
            }
        });
    }
});

// password toggle for login page

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("loginpass");
    const eyeIcon = document.getElementById("eye");

    if (passwordInput && eyeIcon){
        eyeIcon.addEventListener("click", function() {
            if ( passwordInput.type === "password"){
                passwordInput.type = "text";
                eyeIcon.classList.remove("fa-eye");
                eyeIcon.classList.add("fa-eye-slash");
            }
            else{
                passwordInput.type = "password";
                eyeIcon.classList.remove("fa-eye-slash");
                eyeIcon.classList.add("fa-eye");
            }
        });
    }
});