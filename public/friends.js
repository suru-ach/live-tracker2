const pendingRequestsList = document.getElementById('pending-friends');
const friendsList = document.getElementById('friends');
const friendRequestForm = document.getElementById('friendrequest');
const friendRequestButton = friendRequestForm.querySelector('.accept-button');


async function makeFriends(e) {
    e.preventDefault();
    const phonenumber = e.target.querySelector('#friendphonenumber');
    await fetch('/makefriend', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phonenumber: phonenumber.value })
    })
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

async function friendRequest(e) {
    const phonenumber = e.target.dataset.phonenumber;
    if(e.target.classList.value.includes('delete-button'))
        removeFriend(phonenumber);
    else if(e.target.classList.value.includes('accept-button'))
        acceptFriend(phonenumber);
}

async function acceptFriend(phonenumber) {
    await fetch('/friendrequest', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phonenumber })
    })
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => getFriends())
}

async function removeFriend(phonenumber) {
    await fetch('/removefriend', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phonenumber })
    })
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => getFriends())
}

function populateFriendsList(data) {
    const pendingRequests = data
        .filter(user => user.isfriend === false)
        .map(({ username, phonenumber }) => {
            return `<li class="contact row-flex">
                    <div class="contact-img"></div>
                    <div data-phonenumber=${phonenumber}>
                        <h2>${username}</h2>
                        <p>${phonenumber}</p>
                    </div>
                    <div class="flex-row">
                        <div class="button accept-button" data-phonenumber=${phonenumber}>
                            accept
                        </div>
                        <div class="button delete-button" data-phonenumber=${phonenumber}>
                            reject
                        </div>
                    </div>
            </li>`
        })
        .join('');

    pendingRequestsList.innerHTML = pendingRequests ? pendingRequests : '<h4>no requests</h4>';

    const friendsHtmlList = data
        .filter(user => user.isfriend === true)
        .map(({ username, phonenumber }) => {
            return `
                <li class="contact">
                    <div class="contact-img"></div>
                    <div>
                        <h2>${username}</h2>
                        <p>${phonenumber}</p>
                    </div>
                    <div class="button delete-button" data-phonenumber=${phonenumber}>
                        remove
                    </div>
                </li>
            `;
        })
        .join('');

    friendsList.innerHTML = friendsHtmlList ? friendsHtmlList : '<h4>no friends ;( </h4>' ;
}

friendRequestForm.addEventListener('submit', (e) => makeFriends(e));
friendsList.addEventListener('click', e => friendRequest(e));
pendingRequestsList.addEventListener('click', e => friendRequest(e));

async function getFriends() {
    pendingRequestsList.innerHTML = '<h4>loading...</h4>';
    friendsList.innerHTML = '<h4>loading...</h4>' ;
    await fetch('/getfriends', {
        method: 'GET',
        credentials: 'include',
    })
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((data) => populateFriendsList(data.data))
        .then(err => console.log(err))
}

getFriends();
