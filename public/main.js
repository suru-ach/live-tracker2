const form = document.querySelector('form');
const phonenumber = document.getElementById('phonenumber');
const password = document.getElementById('password');
const message_alerts = document.getElementById('alert');

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
        .catch(err => {
            console.error(err);
            message_alerts.innerHTML = "looks like the captcha aint workin";
            setTimeout(() => {
                message_alerts.innerHTML = "";
            },3000);
        })

    const headerAttributes = {
        'Content-Type': 'application/json',
    };
    const header = new Headers(headerAttributes);
    await fetch('/signin', {
        method: 'POST',
        credentials: 'include',
        headers: header,
        body: JSON.stringify({ phonenumber: phonenumber.value, password: password.value })
    })
        .then(res => res.json())
        .then(data => {
            message_alerts.innerHTML = data ? data : 'error in signin';
            message_alerts.classList.add('mes-success');
            setTimeout(() => {
                message_alerts.innerHTML = "";
            },3000);
        })
        .catch(err => {
            message_alerts.innerHTML = err.data ? err.data : 'error in signin';
            message_alerts.classList.add('mes-error');
            setTimeout(() => {
                message_alerts.innerHTML = "";
            },3000);
        })

    await fetch('/getfriends', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            message_alerts.innerHTML = data ? data : 'error in signin';
            message_alerts.classList.add('mes-success');
            setTimeout(() => {
                message_alerts.innerHTML = "";
            },3000);
        })
        .catch(err => {
            message_alerts.innerHTML = err.data ? err.data : 'error in getfriends';
            message_alerts.classList.add('mes-error');
            setTimeout(() => {
                message_alerts.innerHTML = "";
            },3000);
        })
})

