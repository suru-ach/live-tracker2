const form = document.querySelector('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const passwordCheck = document.getElementById('password-check');
const phonenumber = document.getElementById('phone-number');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const captchaRespones = grecaptcha.getResponse();
    if (!captchaRespones.length > 0)
        throw new Error('Captcha not complete');


    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd);

    // testing 
    await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: params
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))

    const headerAttributes = {
        'Content-Type': 'application/json'
    };
    const header = new Headers(headerAttributes);

    if (password.value !== passwordCheck.value)
        // password not equal
        console.log();

    await fetch('/signup', {
        method: 'POST',
        credentials: 'include',
        headers: header,
        body: JSON.stringify({
            username: username.value,
            password: password.value,
            phonenumber: phonenumber.value
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))

    await fetch('/getfriends', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => console.log(res.json()))
        .then(data => console.log(data))
        .catch(err => console.log(err))
})
