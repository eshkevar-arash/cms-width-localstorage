import {
    createPaginationButtons,
    data,
    setActivePaginationButton,
    setId,
    setLabels,
    showToast,
    isExistValue,
    showMessage,
    resetPagination,
    removeItemFromData,

    setUsersLocalstorage,

    findIndexItem,
} from "./Func.js";
const createUser = document.querySelector('#create-user')

let start
let countUsersShow = 3
let targetBtn = null
let countUsers
let targetId = null

function addUsersToData(users){
    users.forEach(user => {
        data.users.push(user)
    })
}
function createNewUserTableRow(id,name,username,email,password){
    const newDiv = document.createElement('div')
    newDiv.className = 'tableRow'
    newDiv.innerHTML = `
        <p class="user-fullName">${name}</p>
        <p class="user-username">${username}</p>
        <p class="user-email">${email}</p>
        <p class="user-password">${password}</p>
        <div class="product-manage">
            <button class="edit-btn" data-id="${id.toLocaleString()}">
              <!-- Edit icon -->
              <i class="fas fa-edit"></i>
            </button>
            <button class="remove-btn" data-id="${id.toLocaleString()}">
              <!-- Ban icon -->
              <i class="fas fa-ban"></i>
            </button>
        </div>
    `
    return newDiv
}
function addUsersToDom(users,start,countUsersShow){
    let end = start + countUsersShow
    const fragmentElem = document.createDocumentFragment()
    let id,name,username,email,password
    for (let i = start; i < end; i++) {
        if (users[i]){
            id =users[i].id
            name = users[i].name
            username = users[i].username
            email = users[i].email
            password = users[i].password
            fragmentElem.appendChild(createNewUserTableRow(id,name,username,email,password))
        }

    }
    return fragmentElem
}
function showModalScreenCreateUser(){
    modal.innerHTML = `
        <header class="modal-header">
          <h3>ایجاد کاربر جدید</h3>
          <button class="close-modal">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <main class="modal-content">
          <input
            type="text"
            class="modal-input"
            placeholder="نام و نام خانوادگی را وارد نمائید ..."
            id="user-fullName"
          />
          <input
            type="text"
            class="modal-input"
            id="user-username"
            placeholder="نام کاربری را وارد نمائید ..."
          />
          <input
            type="text"
            class="modal-input"
            id="user-email"
            placeholder="ایمیل را وارد نمائید ..."
          />
          <input
          type="text"
          class="modal-input"
          id="user-password"
          placeholder="رمز عبور را وارد نمائید ..."
        />
        </main>
        <footer class="modal-footer">
          <button class="cancel">انصراف</button>
          <button class="submit">تائید</button>
        </footer>
    `
    modalScreen.classList.remove('hidden')
    const submit = modal.querySelector('.submit')
    submit.addEventListener('click',() => {
        const process = toast.querySelector('.process')
        const fullName = modal.querySelector('#user-fullName')
        const username = modal.querySelector('#user-username')
        const email = modal.querySelector('#user-email')
        const password = modal.querySelector('#user-password')
        const newFullName = fullName.value.trim()
        const newUsername = username.value.trim()
        const newEmail = email.value.trim()
        const newPassword = password.value.trim()
        const newId = setId(data.users);
        if (isValidUserRow(newFullName,newUsername,newEmail,newPassword)){
            hideModalScreen()
            showToast('کاربر جدید با موفقیت ایجاد شد','success')
            process.addEventListener('transitionend', function (){
                toast.classList.add('hidden')
                process.style.width = '0'
                tableBodySection.appendChild(createNewUserTableRow(newId,newFullName,newUsername,newEmail,newPassword))
                addNewUserToData(newId,newFullName,newUsername,newEmail,newPassword)
                start = resetPagination(pagination,data.users,countUsersShow,tableBodySection)
                tableBodySection.appendChild(addUsersToDom(data.users, start, countUsersShow))
                setUsersLocalstorage()
                setLabels(data.users.length,usersData)
            },{once: true})
        }
    })
}
function addNewUserToData(id,name,username,email,password){
    const newUser = {
        id,
        name,
        username,
        email,
        password
    }
    data.users.push(newUser)
}
function isValidUsername(username) {
    const re = /^[A-Za-z](?:[A-Za-z0-9]|[._-](?=[A-Za-z0-9]))*$/;
    return re.test(username);
}
function isValidEmail(email) {
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return re.test(email);
}
function isValidPassword(password) {
    // حداقل یک حرف کوچک، یک حرف بزرگ، یک عدد و یک کاراکتر خاص
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
    return re.test(password);
}
function isExistNewUsernameInData(username){
    return data.users.some(user => {
        return (user.username === username)
    })
}
function isExistNewPasswordInData(email){
    return data.users.some(user => {
        return (user.email === email)
    })
}
function isValidUserRow(fullName,username,email,password){
    let flag = false
    if(isExistValue(fullName,'نام') && isExistValue(username,'نام کاربری') && isExistValue(email, 'ایمیل') && isExistValue(password, 'پسورد')){
        if (username.length < 3){
            showMessage(`نام کاربری باید حداقل 3 کاراکتر باشد`, 'error')
        }else if (!isValidUsername(username)){
            showMessage(`نام کاربری نا معتبر`, 'error')
        }else if (!isValidEmail(email)){
            showMessage(`ایمیل نا معتبر`, 'error')
        }else if (password.length < 8){
            showMessage(`رمز عبور باید حداقل 8 کاراکتر باشد`, 'error')
        }else if (!isValidPassword(password)){
            showMessage(`پسورد باید حدااقل 8 کاراکتر شمامل حرف کوچک و حرف بزرگ و عدد و کاراکتر خاص باشد`, 'error')
        }else if (isExistNewUsernameInData(username)){
            showMessage(`کاربری با این نام کاربری قبلا ثبت نام کرده`, 'error')
        }else if (isExistNewPasswordInData(email)){
            showMessage(`کاربری با این ایمیل قبلا ثبت نام کرده`, 'error')
        }else {
            flag = true
        }
    }
    return flag
}
function isValidUserForEdit(id,fullName,username,email,password){
    let flag = false
    if(isExistValue(fullName,'نام') && isExistValue(username,'نام کاربری') && isExistValue(email, 'ایمیل') && isExistValue(password, 'پسورد')){
        if (username.length < 3){
            showMessage(`نام کاربری باید حداقل 3 کاراکتر باشد`, 'error')
        }else if (!isValidUsername(username)){
            showMessage(`نام کاربری نا معتبر`, 'error')
        }else if (!isValidEmail(email)){
            showMessage(`ایمیل نا معتبر`, 'error')
        }else if (password.length < 8){
            showMessage(`رمز عبور باید حداقل 8 کاراکتر باشد`, 'error')
        }else if (!isValidPassword(password)){
            showMessage(`پسورد باید حدااقل 8 کاراکتر شمامل حرف کوچک و حرف بزرگ و عدد و کاراکتر خاص باشد`, 'error')
        }else if (isExistEditUserInData(id, username, email)){
            showMessage(`کاربری با این نام کاربری قبلا ثبت نام کرده`, 'error')
        }else {
            flag = true
        }
    }
    return flag
}
function showModalScreenDeleteUser(modalScreen,arr,parentElem,id,pagination='',countShow,wrapper){
    const modal = modalScreen.querySelector('.modal')
    modal.innerHTML = `
        <i class="ui-border top red"></i>
          <i class="ui-border bottom red"></i>
          <header class="modal-header">
            <h3>حذف کاربر</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <p class="remove-text">آیا از حذف این کاربر اطمینان دارید؟</p>
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit">تائید</button>
          </footer>
    `
    modalScreen.classList.remove('hidden')
    const submit = modal.querySelector('.submit')
    const process = toast.querySelector('.process')
    submit.addEventListener('click', ()=> {
        hideModalScreen()
        showToast(`کاربر با موفقیت حذف شد`,'success')
        process.addEventListener('transitionend', function (){
            toast.classList.add('hidden')
            process.style.width = '0'
            removeItemFromData(arr,id)
            setUsersLocalstorage()
            setLabels(data.users.length,usersData)
            let start = resetPagination(pagination,arr,countShow,wrapper)
            tableBodySection.appendChild(addUsersToDom(arr, start, countShow))

        },{once: true})

    })
}
function isExistEditUserInData(id, username, email){
    let flag = false
    flag =  data.users.some(user => {
        if (user.id !== id){
            return (user.username === username) || (user.email === email)
        }
    })
    return flag
}
function showModalScreenEditUser(modalScreen,wrapper,id){
    const modal = modalScreen.querySelector('.modal')
    modal.innerHTML = `
        <header class="modal-header">
          <h3>ویرایش اطلاعات کاربر</h3>
          <button class="close-modal">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <main class="modal-content">
          <input
            type="text"
            class="modal-input"
            placeholder="نام و نام خانوادگی را وارد نمائید ..."
            id="user-fullName"
          />
          <input
            type="text"
            class="modal-input"
            id="user-username"
            placeholder="نام کاربری را وارد نمائید ..."
          />
          <input
            type="text"
            class="modal-input"
            id="user-email"
            placeholder="ایمیل را وارد نمائید ..."
          />
          <input
          type="text"
          class="modal-input"
          id="user-password"
          placeholder="رمز عبور را وارد نمائید ..."
        />
        </main>
        <footer class="modal-footer">
          <button class="cancel">انصراف</button>
          <button class="submit">تائید</button>
        </footer>
    `
    modalScreen.classList.remove('hidden')
    const submit = modal.querySelector('.submit')
    submit.addEventListener('click', ()=> {
        const fullName = modal.querySelector('#user-fullName')
        const username = modal.querySelector('#user-username')
        const email = modal.querySelector('#user-email')
        const password = modal.querySelector('#user-password')
        const newFullName = fullName.value.trim()
        const newUsername = username.value.trim()
        const newEmail = email.value.trim()
        const newPassword = password.value.trim()
        editUser(id,newFullName,newUsername,newEmail,newPassword,wrapper)
    })
}
function editUser(id, fullName, username, email, password, wrapper){
    if (isValidUserForEdit(id, fullName,username,email, password)){
        hideModalScreen()
        showToast('کاربر با موفقیت ویرایش شد', 'success')
        const process = toast.querySelector('.process')
        process.addEventListener('transitionend', function () {
            toast.classList.add('hidden')
            process.style.width = '0'
            let index = findIndexItem(data.users, id)
            data.users[index].name = fullName
            data.users[index].username = username
            data.users[index].email = email
            data.users[index].password = password
            wrapper.querySelector('.user-fullName').textContent = fullName
            wrapper.querySelector('.user-username').textContent = username
            wrapper.querySelector('.user-email').textContent = email
            wrapper.querySelector('.user-password').textContent = password
            setUsersLocalstorage()
        },{once: true})
    }
}
createUser.addEventListener('click', ()=> {
    showModalScreenCreateUser()
})
pagination.addEventListener('click', event => {
    targetBtn = event.target.closest('.page')
    if (targetBtn){
        setActivePaginationButton(pagination,targetBtn)
        start = (+targetBtn.textContent - 1) * countUsersShow
        tableBodySection.innerHTML = ''
        tableBodySection.appendChild(addUsersToDom(data.users, start, countUsersShow))
    }
})
tableBodySection.addEventListener('click', event => {
    let targetRemoveBtn = event.target.closest('.remove-btn')
    let targetEditBtn = event.target.closest('.edit-btn')
    if (targetRemoveBtn){
        targetId = +targetRemoveBtn.dataset.id
        let parentTargetRemoveBtn = targetRemoveBtn.closest('.tableRow')
        console.log(parentTargetRemoveBtn)
        showModalScreenDeleteUser(modalScreen, data.users,parentTargetRemoveBtn,targetId,pagination,countUsersShow,tableBodySection)
    }else if (targetEditBtn){
        targetId = +targetEditBtn.dataset.id
        let parentTargetEditBtn = targetEditBtn.closest('.tableRow')
        console.log(parentTargetEditBtn)
        showModalScreenEditUser(modalScreen,parentTargetEditBtn,targetId)
        /*


        /!*showModalScreenEdit(modalScreen, data.products,parentTargetEditBtn,targetId,pagination,countProductsShow,tableBodySection,'ویرایش')*!/*/
    }
})
window.onload = function (){
    /*================Theme====================*/
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme !== null){
        if (savedTheme === 'light'){
            setLight(themeButton)
        }else {
            setDark(themeButton)
        }
    }
    /*localStorage.clear()*/
    start = 0
    countUsersShow = 3
    const savedUsers = JSON.parse(localStorage.getItem('localUsers')) || []
    tableBodySection.innerHTML = ''
    if (savedUsers.length > 0 ){
        /*================Users====================*/
        addUsersToData(savedUsers)
        tableBodySection.appendChild(addUsersToDom(data.users, start, countUsersShow))
        countUsers = savedUsers.length
        /*================Pagination====================*/
        pagination.appendChild(createPaginationButtons(data.users.length,countUsersShow))
        targetBtn = pagination.querySelectorAll('.page')[0]
        if (targetBtn){
            setActivePaginationButton(pagination,targetBtn)
        }

    }else {
        countUsers= 0
    }
    setLabels(countUsers,usersData,captionText,'کاربری')
}
