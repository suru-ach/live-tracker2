const createRoomButton = document.getElementById('create-room');
const terminateRoomButton = document.getElementById('terminate-room');
const sendCoords = document.getElementById('tick');

const x_coord_val = document.getElementById('x-coords');
const y_coord_val = document.getElementById('y-coords');

let createRoomStatus = false;
let deleteRoomStatus = false;

/*
'/startroom'
'/tick'
'/joinroom'
'/terminateroom'
'/v1/getcoords'
*/

async function createRoom() {

    await fetch('/startroom', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: "{}"
    })
        .then((res) => { 
            console.log(res);
            return res.text();
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => {
            console.log('end-createroom')
        })
}

async function terminateRoom() {
    await fetch('/terminateroom', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: "{}"
    })
        .then((res) => {
            console.log(res);
            return res.text();
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

async function sendcoords() {
    const coords_val = {
        x: x_coord_val.value,
        y: y_coord_val.value,
        isStalled: false,
        location: ""
    };
    
    await fetch('/tick', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(coords_val)
    })
        .then((res) => {
            console.log(res);
            return res.text();
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

createRoomButton.addEventListener('click', createRoom);
terminateRoomButton.addEventListener('click', terminateRoom);
sendCoords.addEventListener('click', sendcoords);

async function getCoord()
{
    fetch('/getcoords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({rid : 1})
    })
        .then((data) => data.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
}

async function updateCoords()
{
    fetch('/updatecoords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({rid : 1, x: 0.1, y: 0.3, count: 1})
    })
        .then((data) => data.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
}
