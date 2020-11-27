const server = "http://localhost:3000"

$(document).ready(function () {
    const token = localStorage.getItem("token")
    // console.log(token)
    if(token){
        $("#login-page").hide()
        $("#register-page").hide()
        $("#movie-page").hide()
        $("#home-page").show()
    }
    else{
        $("#login-page").show()
        $("#register-page").hide()
        $("#movie-page").hide()
        $("#home-page").hide()
    }
})

function signIn(e){
    e.preventDefault()
    // console.log("button terclick")
    const email = $("#email").val()
    const password = $("#password").val()
    console.log(email)
    $.ajax({
        method: "POST",
        url: server + "/users/sign-in",
        data: {
            email,
            password
        }
    }).done(response =>{
        console.log(response)
        const token = response.acces_token
        localStorage.setItem("token", token)
        $("#login-page").hide()
        $("#register-page").hide()
        $("#movie-page").hide()
        $("#home-page").show()
        // console.log(response)
    }).fail(xhr => {
        console.log(xhr)
    }).always(_ => {
        $("#email").val("")
        $("#password").val("")
    })
}

function signUp(e){
    e.preventDefault()
    const email = $("#sign-up-email").val()
    const password = $("#sign-up-password").val()
    $.ajax({
        method: "POST",
        url: server + "/users/sign-up",
        data: {
            email,
            password,
        }
    }).done(response =>{
        // console.log(response)
        $("#login-page").show()
        $("#register-page").hide()
    }).fail(err => {
        console.log(err)
    })
}

function showSignUp(e){
    e.preventDefault()
    $("#login-page").hide()
    $("#register-page").show()
    $("#movie-page").hide()
    $("#home-page").hide()
}

function showSignIn(e){
    e.preventDefault()
    $("#login-page").show()
    $("#register-page").hide()
    $("#movie-page").hide()
    $("#home-page").hide()
}

function showMoviePage(e){
    e.preventDefault
    $("#login-page").hide()
    $("#register-page").hide()
    $("#movie-page").show()
    $("#home-page").hide()
}

function showMainPage(e){
    e.preventDefault
    $("#login-page").hide()
    $("#register-page").hide()
    $("#movie-page").hide()
    $("#home-page").show()
    getPopularMovie()
}

function logout() {
    localStorage.removeItem("token")
    $("#login-page").show()
    $("#register-page").hide()
    $("#movie-page").hide()
    $("#home-page").hide()
    console.log("tombol terclick")
}

function getPopularMovie() {
    // insert code to enter popular movie here
    // put response in section home-page
    $("#popular-movie-card").empty()
    $.ajax({
        url: "http://localhost:3000/movies/popular",
        method: "GET",
        headers: {
            acces_token: localStorage.getItem("token")
        }
    })
    .done(response => {
        response.forEach(data => {
            $("#popular-movie-card").append(`
            <div class="col-3">
              <div class="card-custom uk-card uk-card-default uk-card-hover uk-card-body ml-5 mt-4">
                <i class="bookmark far fa-plus-square"></i>
                <img src="${data.moviePoster}" alt="image-${data.movieTitle}" onclick="showMoviePage(event)">
                <p class="text-center">${data.movieTitle}</p>
              </div>
            </div>    
            `)
        })
    })
    .fail((xhr, status) => {
        console.log(xhr, status);
    })
}

function onSignIn(googleUser) {
    var google_access_token = googleUser.getAuthResponse().id_token;
    console.log(google_access_token)
    $.ajax({
        method:"POST",
        url: server + "/users/googleSignIn",
        data: {
            google_access_token
        }
    })
    .done(response => {
        console.log(response)
        localStorage.setItem("token", response )
        $("#login-page").hide()
        $("#register-page").hide()
        $("#movie-page").hide()
        $("#home-page").show()
    })  
    .fail(err => {
        console.log(err)
    })
}