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
    showData(user);
    changeDataBtn.addEventListener('click',()=> {
        DataModal.classList.remove('hidden');
        

    })
    changePassBtn.addEventListener('click',()=>{
        PasswordModal.classList.remove('hidden');

    })
    // Save data and close the modal 
    saveDataBtn.addEventListener('click',()=>{
    
        if (!validateForm()) {
            DataModal.classList.remove('hidden');
            return;
        }
        
        const updatedUser = {
            ...user,
            username: userName.value.trim(),
            email: email.value.trim(),
            accountType: accountType.value
        };
        
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === updatedUser.email) {
                users[i] = updatedUser;
            }
        }
        localStorage.setItem('users', JSON.stringify(users));

        showData(updatedUser);
        alert("Changes saved successfully ✅");
        DataModal.classList.add('hidden');
        window.location.reload();
    })
    savePasswordBtn.addEventListener('click',()=>{
        
        if (!validatePassword()) {
            PasswordModal.classList.remove('hidden'); 
            return;
        }
        const updatedUser ={
            ...user,
            password: newPassword.value
        }

        localStorage.setItem('users', JSON.stringify(users));

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === updatedUser.email) {
                users[i] = updatedUser;
            }
        }
        showData(updatedUser);
        alert("Changes saved successfully ✅");
        PasswordModal.classList.add('hidden');
        clearPasswordFields();
        window.location.reload();
    })
    cancelDataBtn.addEventListener('click',()=>{
    
        DataModal.classList.add('hidden');
        showData(user);

    })
    cancelPasswordBtn.addEventListener('click',()=>{
        PasswordModal.classList.add('hidden');
        showData(user);
        clearPasswordFields();
        window.location.reload();
    })
})
//-------------------------------------------------- Functions
// Show user data
function showData(user){
    // Show data in the box
    userData.innerHTML = `
        <p id="userName"><strong>Username: </strong> ${user.username}</p>
        <p id="email"><strong>Email: </strong>${user.email}</p>
        <p id="accountType"><strong>Account Type: </strong>${user.accountType}</p>
    `
    // Show data in the modal when press change data
    userName.value = user.username;
    email.value = user.email;
    accountType.value = user.accountType;

    // Clear any error fields in the modal when opens
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    document.querySelectorAll('.hideImage').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.src = 'img/show.png';
            } else {
                input.type = 'password';
                this.src = 'img/hide.png';
            }
        });
    });
}

//----------------------------------------------------------------------------
function clearPasswordFields(){
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    document.querySelectorAll('.password-container input').forEach(input => {
        input.type = 'password';
    });
    document.querySelectorAll('.hideImage').forEach(icon => {
        icon.src = 'img/hide.png';
    });
}
// Show the error in the field
function showFieldError(field, message) {
    let errorElement = document.createElement('div');
    errorElement.className = 'field-error';              // add for the div to display the error message
    errorElement.innerHTML = `${message}`;
    
    field.classList.add('error');                        // add for the field itself to make the border be red
    field.after(errorElement);                           // add the div after the field to display the text
  }

function validateForm() {
    let isValid = true;
    
    if (!userName.value) {
        showFieldError(userName, 'Please fill the username field');
        isValid = false;
    }
    
    if (!email.value) {
        showFieldError(email, 'Please fill the email field');
        isValid = false;
    } 
    else if (!email.value.includes('@')) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    else {
        const existingUser = users.find(u => u.email === email.value && u.email !== user.email);
        if (existingUser) {
            showFieldError(email, 'This email is already registered');
            isValid = false;
        }
    }
    
    return isValid;
}
function validatePassword()
{
    let isValid = true;


    // Validate old password
    if (!oldPassword.value) {
        showFieldError(oldPassword, 'Please enter your current password');
        isValid = false;
    } else if (oldPassword.value !== user.password) {
        showFieldError(oldPassword, 'Old password is incorrect');
        isValid = false;
    }

    // Validate length of password
    if(newPassword.value.length < 6)
    {
        showFieldError(newPassword, 'Password must be at least 6 characters long.');
        isValid = false;
    }

    // Validate password confirmation
    if (!confirmPassword.value) {
        showFieldError(confirmPassword, 'Please confirm your new password');
        isValid = false;
    } else if (newPassword.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    return isValid;
}



