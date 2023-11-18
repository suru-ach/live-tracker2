console.log('coords works');



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

updateCoords();
