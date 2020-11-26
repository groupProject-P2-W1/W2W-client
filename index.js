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
}

function logout() {
    localStorage.removeItem("access_token")
    $("#login-page").show()
    $("#register-page").hide()
    $("#movie-page").hide()
    $("#home-page").hide()
    console.log("tombol terclick")
}

function getPopularMovie() {
    // insert code to enter popular movie here
    // put response in section home-page
}