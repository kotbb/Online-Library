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

//------------------------------------------------------
let deleteAll_btn = document.getElementById('deleteAll-btn');
let countNonAvailable = 0;
let confirmText = document.getElementById('modal-message');
let confirmBtn = document.getElementById('confirmDelete');
let cancelBtn = document.getElementById('cancelDelete');
let editBtn = document.getElementById('btn-edit');
let modal = document.getElementById('deleteModal');
let deleteBtn = document.getElementById('btn-delete');
let deleteIndex = null;
let showData = function()
{
    countNonAvailable = 0;
    let tbody = document.getElementById('booksTbody')
    let table = '';
    for(let i = 0; i < dataBooks.length;i++)
    {
        if(dataBooks[i].status === false)
        {
            countNonAvailable++;
            continue;
        }
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

// show/hide deleteAll button
let showDeleteAll = function()
{
    
    if((dataBooks.length-countNonAvailable) > 0)
    {
        deleteAll_btn.innerHTML = `Delete All (${(dataBooks.length-countNonAvailable)})`;
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
        showDeleteAll();    

    }
    else{
        dataBooks = dataBooks.filter(book => book.status !== true);
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
        `Are you sure you want to delete <strong>all the available (${dataBooks.length-countNonAvailable}) books</strong> ?`;
        modal.classList.add('active');
    }
});
