//* Cms -> Content Management System
(function () {
  // بررسی اینکه آیا کاربر قبلاً خوش‌آمدگویی را دیده یا نه
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

  if (!hasSeenWelcome) {
    // اگر ندیده، خوش‌آمدگویی را نمایش بده
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="welcome">
        <p style="display: flex; flex-direction: column; align-items: center; justify-content: center">
          <span>
            این پروژه از تمرینات سطح متوسط دوره جامع جاوااسکریپت سایت سبزلرن است.
            کدهای HTML و CSS توسط استاد ارائه شده و پیاده‌سازی کامل بخش‌های جاوااسکریپت، منطق برنامه و مدیریت داده‌ها به عهده دانشجو بوده است.
            تمامی داده‌ها به‌جای استفاده از پایگاه‌داده، در LocalStorage مرورگر ذخیره و مدیریت می‌شوند.
          </span>
          <a style="margin-top: 10px" href="https://sabzlearn.ir/lesson/4-31630/" target="_blank">(لینک این قسمت از دوره آموزشی)</a>
        </p>
        <button id="welcome-btn">مشاهده پروژه</button>
      </div>
    `);

    const welcome = document.querySelector('.welcome');
    const welcomeBtn = document.querySelector('#welcome-btn');

    welcomeBtn.addEventListener('click', () => {
      welcome.classList.add('hide-welcome');
      // ثبت در localStorage تا دفعه بعد خوش‌آمدگویی نیاد
      localStorage.setItem('hasSeenWelcome', 'true');
    });
  }
})();


const tableBodySection = document.querySelector('.table-body')
const pagination = document.querySelector('.pagination')
const modalScreen = document.querySelector('.modal-screen')
const modal = modalScreen.querySelector('.modal')
const toast = document.querySelector('.toast')
const modalCancelButton = modalScreen.querySelector('.cancel')
const modalSubmitButton = modalScreen.querySelector('.submit')
const productsData = document.querySelectorAll('.products-data')
const usersData = document.querySelectorAll('.users-data')
const toggleMenu = document.querySelector(".toggle-sidebar");
let sectionHeader = document.querySelector('.section-header')
let captionText = sectionHeader.querySelector('.caption-text')
const captionTextProduct = document.querySelector('.table-component .products-count-text.caption-text')
const themeButton = document.querySelector('.theme-button')






function hideModalScreen(){
  modalScreen.classList.add('hidden')
}
toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});
modalScreen.addEventListener('click', event => {
  const cancelButton = event.target.closest('.cancel')
  const cancelXButton = event.target.closest('.close-modal')
  if (cancelButton){
    hideModalScreen()
  }else if (cancelXButton){
    hideModalScreen()
  }
})
function setThemeLocalStorage(theme){
  localStorage.setItem('theme', theme)
}
function setLight(btn){
  document.documentElement.className = 'light'
  btn.innerHTML = '<i class="fas fa-sun"></i>'
}
function setDark(btn){
  document.documentElement.className = 'dark'
  btn.innerHTML = '<i class="fas fa-moon"></i>'
}
themeButton.addEventListener('click', event=> {
  const targetBtn = event.target.closest('.theme-button')
  if (targetBtn){
    let currentTheme = document.documentElement.className
    if (currentTheme === 'dark'){
      setLight(targetBtn)
      setThemeLocalStorage('light')
    }else {
      setDark(targetBtn)
      setThemeLocalStorage('dark')
    }
  }
})






