/**
 * Created by Anton on 18.09.2016.
 */
function fetchCatProdsData(catId) {
    catProdsData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'samecategory=' + catId,
        async: false
    }).responseJSON;
    catProdsData.offset = 0;
}

function initialFetch() {
    categoriesData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'filledcategories',
        async: false
    }).responseJSON;

    newProdsData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'newprods',
        async: false
    }).responseJSON;
    newProdsData.offset = 0;

    popProdsData = $.ajax({
        type: 'POST',
        url: 'content.php',
        dataType: 'json',
        data: 'popprods',
        async: false
    }).responseJSON;
    popProdsData.offset = 0;
}