class AlertContainer {
    constructor(elementId) {
        this.alertContainer = document.getElementById(elementId)
    }
    showErrorAlertContainer(message) {
        this.alertContainer.classList.remove('alert-success');
        this.makeAlertContainerVisible();
        this.alertContainer.classList.add('alert-danger');
        this.alertContainer.innerText = message;
        let _this = this;
        setTimeout(function () {
            _this.makeAlertContainerInvisible();
        }, 10000);
    }
    showSuccessAlertContainer(message) {
        this.alertContainer.classList.remove('alert-danger');
        this.makeAlertContainerVisible();
        this.alertContainer.classList.add('alert-success');
        this.alertContainer.innerText = message;
        let _this = this;
        setTimeout(function () {
            _this.makeAlertContainerInvisible();
        }, 10000);
    }
    makeAlertContainerVisible() {
        this.alertContainer.style.display = 'block';
    }
    makeAlertContainerInvisible() {
        this.alertContainer.style.display = 'none';
    }
}
