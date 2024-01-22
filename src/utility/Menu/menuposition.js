function setMenuPosition(){

const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu');
const sidemenu = document.querySelector('.side-menu');
// console.log('height', header.value.clientHeight)
// menu.style.marginTop = header.value.clientHeight + 'px'
// sidemenu.style.marginTop = fixedHeaderRef.value.clientHeight + 'px'
if (window.innerWidth <= 600) {
    menuIcon.style.display = 'block';
    menu.style.display = 'none';
    sidemenu.style.display = 'none'
    
}
else {
    menuIcon.style.display = 'none';
    sidemenu.style.display = 'block'
}

menuIcon.addEventListener('click', () => {
    if (menu.style.display == 'none') {
        menu.style.display = 'block';
        // document.querySelector('#contest-content').style.overflow = 'hidden'
    }
    else {
        menu.style.display = 'none';
        // document.querySelector('#contest-content').style.overflow = 'auto'
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth <= 600) {
        menuIcon.style.display = 'block';
        menu.style.display = 'none';
        sidemenu.style.display = 'none'
    }
    else {
        menuIcon.style.display = 'none';
        sidemenu.style.display = 'block'
    }
});
}
export { setMenuPosition }