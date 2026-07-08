let progress = 75;

document.getElementById("progressBar").style.width = progress + "%";
document.getElementById("progressText").innerHTML = progress + "%";

function editProfile(){

    let neName = prompt("Enter Your Name");
    if ( newName != null && newName != ""){
        document.getElementById("username").innerHTML = newName;
    }

    let newEmail = prompt("Enter Your Email");
    if ( newEmail != null && newEmail != ""){
        document.getElementById("email").innerHTML = newEmail;
    }
    alert("Profile Updated Successfully");
}


function logout(){
    let confirmLogout = confirm("Do you want to Logout?");
    if ( confirmLogout){
        alert("Logged Out Successfully");
        window.location.href = "login.html";
    }
}