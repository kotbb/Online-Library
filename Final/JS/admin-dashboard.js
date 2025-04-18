// when press on Add button, go to AddBook page
let addBtn = document.getElementById('addBookBtn');
addBtn.addEventListener('click',function()
{
    window.location.href = 'AddBook.html';
})

//          *************** Show Books ***************
// Initilize the books array and check if it is empty
let dataBooks;
let checkEmptyArray = function()
{
    if(localStorage.book != null)
    {
        return JSON.parse(localStorage.book);
    }
    else{
        return [];
    }
}
dataBooks = checkEmptyArray();

let showData = function()
{
    let tbody = document.getElementById('booksTbody')
    let table = '';
    for(let i = 0; i < dataBooks.length;i++)
    {
        table += `
        <tr>
        <td>${i}</td>
        <td>${dataBooks[i].name} </td>
        <td>${dataBooks[i].author} </td>
        <td>${dataBooks[i].ISBN} </td>
        <td>${dataBooks[i].category} </td>
        <td>${dataBooks[i].status ? 'Available' : 'Not available'}</td>
        <td>${dataBooks[i].papers}</td>
        <div class = "action-buttons">
            <td> 
                <button class ="action-buttons" id="btn-edit" onclick = "window.location.href = 'Edit Book.html'"    >Edit</button>
                <button class ="action-buttons" id="btn-delete" onclick = "deleteData(${i})">Delete</button>  </td>
            </td>
        </div>
        </tr>
        `
    }
    tbody.innerHTML = table;
}
showData();
//          *************** Delete Books ***************

let deleteAll_btn = document.getElementById('deleteAll-btn');
let countNonAvailable = dataBooks.length;
let confirmText = document.getElementById('modal-message');
let confirmBtn = document.getElementById('confirmDelete');
let cancelBtn = document.getElementById('cancelDelete');
let editBtn = document.getElementById('btn-edit');
let modal = document.getElementById('deleteModal');
let deleteBtn = document.getElementById('btn-delete');
let deleteIndex = null;
//------------------------------------------------------------

// show/hide deleteAll button
let showDeleteAll = function()
{
    if(dataBooks.length !== 0)
    {
        deleteAll_btn.innerHTML = `Delete All (${dataBooks.length})`;
        deleteAll_btn.style.display = 'block';
    }
    else{
        deleteAll_btn.style.display = 'none';

    }
}
showDeleteAll();
// Delete single book
let deleteData = function(i)
{
    deleteIndex = i;    
    modal.classList.add('active');
    // update the confirmation message
    confirmText.innerHTML = 
    `Are you sure you want to delete <strong>"${dataBooks[i].name}"</strong> book ?`;
}
// Cancel delete
cancelBtn.addEventListener('click',function()
{
    modal.classList.remove('active');
    deleteIndex = null;
})

// Confirm delete
confirmBtn.addEventListener('click',function()
{
    if(deleteIndex !== null)
    {
        dataBooks.splice(deleteIndex,1);
    }
    else{
        dataBooks = [];
    }
    localStorage.book = JSON.stringify(dataBooks);
    showData();
    showDeleteAll();
    deleteIndex = null;
    modal.classList.remove('active');
})
//----------------------------------------------------------
// Delete All books function
deleteAll_btn.addEventListener('click',function()
{
    if(dataBooks.length !== 0)
    {
        // update the confirmation message
        confirmText.innerHTML = 
        `Are you sure you want to delete <strong>all the (${countNonAvailable}) books</strong> ?`;

        modal.classList.add('active');
    }
});


