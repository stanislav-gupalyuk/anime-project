class Footer {
    constructor(element) {
        this.footer = document.querySelector(element);
    }

    addLicence() {
        let date = new Date();
        let year = date.toLocaleDateString().slice(6);
        this.footer.append(`© Made by Gup@lyuk 2022-${year}`);
    }
}

module.exports = Footer;