function isValidURL(str) {
    var urlRegex = /^([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(str);
}
function validateAndRedirect() {
    let inputUrl = document.getElementById('websiteUrl').value;
    let btn = document.getElementById('analyzeBtn');

    if (!isValidURL(inputUrl)) {
        // Change the button text temporarily
        btn.innerHTML = 'Invalid';

        // Add the invalid class to the button
        btn.classList.add('invalid-btn');

        // Revert back after 2 seconds
        setTimeout(() => {
            btn.innerHTML = 'Analyze';
            btn.classList.remove('invalid-btn');
        }, 2000);
    } else {
        // Redirect to the analyze page using query parameter
        window.location.href = '/analyze?url=' + encodeURIComponent(inputUrl);
    }
}
3