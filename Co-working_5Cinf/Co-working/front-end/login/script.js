const container = document.getElementById('container')

const RegisterButton = document.getElementById('register');

const loginButton = document.getElementById('login');

RegisterButton.addEventListener('click' ,()=>{
    container.classList.add("active");
});

loginButton.addEventListener('click' ,()=>{
    container.classList.remove("active");
});