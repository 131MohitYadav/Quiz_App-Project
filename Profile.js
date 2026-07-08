const user = JSON.parse(localStorage.getItem("profile"));

if(user){

document.getElementById("name").innerHTML=user.name;

document.getElementById("email").innerHTML=user.name.toLowerCase().replace(/\s/g,'')+"@gmail.com";

document.getElementById("age").innerHTML=user.age;

document.getElementById("mobile").innerHTML=user.mobile;

document.getElementById("city").innerHTML=user.city;

document.getElementById("quiz").innerHTML=user.quiz;

document.getElementById("score").innerHTML=user.score;

document.getElementById("result").innerHTML=user.result;

document.getElementById("percentage").innerHTML=user.score+"%";

document.getElementById("progressText").innerHTML=user.score+"%";

document.getElementById("bar").style.width=user.score+"%";

let marks=parseInt(user.score);

if(marks>=90){

document.getElementById("rank").innerHTML="👑 Gold Member";

}
else if(marks>=70){

document.getElementById("rank").innerHTML="🥈 Silver Member";

}
else{

document.getElementById("rank").innerHTML="🥉 Bronze Member";

}

}

function logout(){

window.location="index.html";

}

function editProfile(){

window.location="form.html";

}