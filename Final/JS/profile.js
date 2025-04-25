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
changeDataBtn.addEventListener('click',()=> {
    DataModal.classList.remove('hidden');
})
changePassBtn.addEventListener('click',()=>{
    PasswordModal.classList.remove('hidden');

})
saveDataBtn.addEventListener('click',()=>{
    DataModal.classList.add('hidden');
})
savePasswordBtn.addEventListener('click',()=>{
    PasswordModal.classList.add('hidden');
})
cancelDataBtn.addEventListener('click',()=>{
    DataModal.classList.add('hidden');
})
cancelPasswordBtn.addEventListener('click',()=>{
    PasswordModal.classList.add('hidden');
})
