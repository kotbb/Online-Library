let changeDataBtn = document.getElementById('changeDataBtn');
let changePassBtn = document.getElementById('changePasswordBtn');

let saveDataBtn = document.getElementById('saveDataBtn');
let cancelDataBtn = document.getElementById('cancelDataBtn');
let savePasswordBtn = document.getElementById('savePasswordBtn');
let cancelPasswordBtn = document.getElementById('cancelPasswordBtn');

let DataModal = document.getElementById('DataModal');
let PasswordModal = document.getElementById('PasswordModal');

let dataBox = document.querySelectorAll('.user-box p')

//----------------------------------------------------------------------------
// Retrive the data from the array users
let userName = document.getElementById('userName');
let email = document.getElementById('email');
let accountType = document.getElementById('accountType');
let oldPassword = document.getElementById('oldPassword');
let newPassword = document.getElementById('newPassword');
let confirmPassword = document.getElementById('confirmPassword');
let userData = document.getElementById('userData');

//----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    changeDataBtn.addEventListener('click',()=> {
        DataModal.classList.remove('hidden');

    })
    changePassBtn.addEventListener('click',()=>{
        PasswordModal.classList.remove('hidden');

    })
   
    savePasswordBtn.addEventListener('click',()=>{
        
        if (!validatePassword()) {
            PasswordModal.classList.remove('hidden'); 
            return;
        }
        PasswordModal.classList.add('hidden');
        clearPasswordFields();
        window.location.reload();
    })
    cancelDataBtn.addEventListener('click',()=>{
    
        DataModal.classList.add('hidden');

    })
    cancelPasswordBtn.addEventListener('click',()=>{
        PasswordModal.classList.add('hidden');
        clearPasswordFields();
        window.location.reload();
    })
})
//-------------------------------------------------- Functions
//----------------------------------------------------------------------------
function clearPasswordFields(){
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    document.querySelectorAll('.password-container input').forEach(input => {
        input.type = 'password';
    });
}




