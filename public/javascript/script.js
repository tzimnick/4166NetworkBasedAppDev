'use strict';

document.addEventListener('DOMContentLoaded', function() {
    var article = document.querySelector('.header-logo');
    article.addEventListener('click', function() {
        window.location.href = '/';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var article = document.querySelector('.fa-twitter');
    article.addEventListener('click', function() {
        window.location.href = '/';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    var article = document.querySelector('.fa-facebook');
    article.addEventListener('click', function() {
        window.location.href = '/';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    var article = document.querySelector('.fa-pinterest');
    article.addEventListener('click', function() {
        window.location.href = '/';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    var article = document.querySelector('.fa-linkedin');
    article.addEventListener('click', function() {
        window.location.href = '/';
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     var articles = document.querySelectorAll('.item-card');

//     articles.forEach(function(article) {
//         article.addEventListener('click', function() {

//             console.log(this.dataset);
//             var movieID = this.dataset.id;

//             window.location.href = '/movies/' + movieID;
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
    
    var editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(function(button) {

        button.addEventListener('click', function() {

            var movieId = this.getAttribute('data-movie-id');
            window.location.href = '/edit/' + movieId;
        });
    });
});