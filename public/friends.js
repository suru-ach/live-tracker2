const pendingRequestsList = document.getElementById('pending-friends');
const friendsList = document.getElementById('friends');

function populateFriendsList(data) {
    const pendingRequests = data
        .filter(user => user.isfriend === false)
        .map(({ username, phonenumber }) => {
            return `<li class="contact row-flex">
                    <div class="contact-img"></div>
                    <div>
                        <h2>${username}</h2>
                        <p>${phonenumber}</p>
                    </div>
                    <div class="flex-row">
                        <div class="button accept-button">
                            accept
                        </div>
                        <div class="button delete-button">
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
                    <div class="button delete-button">
                        remove
                    </div>
                </li>
            `;
        })
        .join('');

    friendsList.innerHTML = friendsHtmlList ? friendsHtmlList : '<h4>no friends ;( </h4>' ;
}

(async function getFriends() {
    pendingRequestsList.innerHTML = '<h4>loading...</h4>';
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
})()
