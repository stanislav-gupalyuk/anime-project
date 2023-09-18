let Footer = require('./modules/footer');

document.addEventListener('DOMContentLoaded', () => {
    new Footer(".licence").addLicence();

    fetch('/data').then(data => console.log(data));
})