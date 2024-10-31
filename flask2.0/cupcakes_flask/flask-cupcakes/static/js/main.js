$(document).ready(function() {
    axios.get('/api/cupcakes')
    .then(function (response) {
        for(let cupcake of response.data.cupcakes) {
            $('#cupcakes-list').append(`<li id =${cupcake.id}>
                <div class="cupcake">
                    <span class="flavor">${cupcake.flavor}</span>
                    <button onClick="deleteCupcake(${cupcake.id})">Delete</button>
                    <button onClick="editCupcake(${cupcake.id})">Edit</button>
                </div>
                <form class="edit-form" style="display: none;">
                    <input type="text" name="flavor" value="${cupcake.flavor}" />
                    <input type="text" name="size" value="${cupcake.size}" />
                    <input type="number" name="rating" value="${cupcake.rating}" min="1" max="10" />
                    <input type="text" name="image" value="${cupcake.image}" />
                    <button type="button" onclick="saveEdit(${cupcake.id})">Save</button>
                </form>
            </li>`)
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    $('#new-cupcake-form').submit(function(e) {
        e.preventDefault();

        let flavor = $('#flavor').val();
        let size = $('#size').val();
        let rating = $('#rating').val();
        let image = $('#image').val();

        axios.post('/api/cupcakes', {flavor, size, rating, image})
        .then(function(response) {
            var newCupcake = response.data.cupcake;
            $('#cupcakes-list').append(`<li id="${newCupcake.id}">
                <div class="cupcake">
                    <span class="flavor">${flavor}</span>
                    <button onClick="deleteCupcake(${newCupcake.id})">Delete</button>
                    <button onClick="editCupcake(${newCupcake.id})">Edit</button>
                </div>
                <form class="edit-form" style="display: none;">
                    <input type="text" name="flavor" value="${flavor}"/>
                    <input type="text" name="size" value="${size}" />
                    <input type="number" name="rating"value="${rating}" min="1" max="10" />
                    <input type="text" name="image" value="${image}" />
                    <button type="button" onclick="saveEdit(${newCupcake.id})">Save</button>
                </form>
            </li>`);
        })
        .catch(function(error) {
            console.log(error);
        });
    });
});

function deleteCupcake(id) {
    axios.delete(`/api/cupcakes/${id}`)
    .then(function (response) {
        $(`#${id}`).remove();
    })
    .catch(function (error) {
        console.log(error);
    });
}

function editCupcake(id) {
    // toggles the visibility of the edit form for the cupcake with the given id
    $(`#${id}`).find('.edit-form').toggle();
}

function saveEdit(id) {
    // save changes to the cupcake with the given id
    let cupcakeElement = $(`#${id}`);
    let form = cupcakeElement.find('.edit-form');

    let flavor = form.find('input[name="flavor"]').val();
    let size = form.find('input[name="size"]').val();
    let rating = form.find('input[name="rating"]').val();
    let image = form.find('input[name="image"]').val();

    axios.patch(`/api/cupcakes/${id}`, {
        flavor: flavor,
        size: size,
        rating: rating,
        image: image
    })
    .then(function(response) {
        // update the display on success
        cupcakeElement.find('.flavor').text(flavor);
        form.toggle(); // hide the form after saving
    })
    .catch(function(error) {
        console.log(error);
    });
}