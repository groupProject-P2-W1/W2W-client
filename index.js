const server = "http://localhost:3000";

$(document).ready(function () {
  const token = localStorage.getItem("token");
  // console.log(token)
  if (token) {
    $("#login-page").hide();
    $("#register-page").hide();
    $("#movie-page").hide();
    showMainPage();
    $("#my-watch-list").hide();
  } else {
    $("#login-page").show();
    $("#register-page").hide();
    $("#movie-page").hide();
    $("#home-page").hide();
    $("#my-watch-list").hide();
  }
});

function signIn(e) {
  e.preventDefault();
  // console.log("button terclick")
  const email = $("#email").val();
  const password = $("#password").val();
  console.log(email);
  $.ajax({
    method: "POST",
    url: server + "/users/sign-in",
    data: {
      email,
      password,
    },
  })
    .done((response) => {
      console.log(response);
      const token = response.acces_token;
      localStorage.setItem("token", token);
      $("#login-page").hide();
      $("#register-page").hide();
      $("#movie-page").hide();
      $("#home-page").show();
      // console.log(response)
      $("#my-watch-list").hide();
    })
    .fail((xhr) => {
      console.log(xhr);
    })
    .always((_) => {
      $("#email").val("");
      $("#password").val("");
    });
}

function signUp(e) {
  e.preventDefault();
  const email = $("#sign-up-email").val();
  const password = $("#sign-up-password").val();
  $.ajax({
    method: "POST",
    url: server + "/users/sign-up",
    data: {
      email,
      password,
    },
  })
    .done((response) => {
      // console.log(response)
      $("#login-page").show();
      $("#register-page").hide();
      $("#movie-page").hide();
      $("#my-watch-list").hide();
    })
    .fail((err) => {
      console.log(err);
    });
}

function showSignUp(e) {
  e.preventDefault();
  $("#login-page").hide();
  $("#register-page").show();
  $("#movie-page").hide();
  $("#home-page").hide();
  $("#my-watch-list").hide();
}

function showSignIn(e) {
  e.preventDefault();
  $("#login-page").show();
  $("#register-page").hide();
  $("#movie-page").hide();
  $("#home-page").hide();
  $("#my-watch-list").hide();
}

function showMoviePage(title) {
  console.log(title);
  $("#single-movie").empty()
  $.ajax({
    url: server + "/movies" + `/?t=${title}`,
    method: "GET",
    headers: {
      acces_token: localStorage.getItem("token"),
    },
    // params: {
    //     title: title
    // }
  })
    .done((response) => {
      console.log(response);
      const payload = {
        title: response.Title,
        poster: response.Poster 
      }
      $("#login-page").hide();
      $("#register-page").hide();
      $("#home-page").hide();
      $("#single-movie").append(`
      <div class="row" >
        <div class="column ml-5 mt-5">
          <img src="${response.Poster}">  
        </div>
        <div class="column mx-auto my-5">
            <H1> ${response.Title}</H1>
            <p class="mr-5"> ${response.Plot}</p>
            <br>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Actor</th>
                <th scope="col">Reviewer</th>
                <th scope="col">Ratings</th>
                <th scope="col">Production</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">${response.Actors}</th>
                <td>${response.Ratings[0].Source}</td>
                <td>${response.Ratings[0].Value}</td>
                <td>${response.production}</td>
                </tr>
                <tr>
                <th scope="row"></th>
                <td>Metacritic</td>
                <td>NaN</td>
                <td>${response.Director}</td>
                </tr>
                <tr>
                <th scope="row"></th>
                <td>Rotten Tomatoes</td>
                <td>76/100</td>
                <td></td>
                </tr>
            </tbody>
            </table>
        </div> 
      </div>
      <div class="row">
        <div class="column ml-5 mt-5">
          <button class="btn btn-primary" onclick="addMovie(${payload})">add to watch list</button>
        </div>
      </div>`);
      $("#movie-page").show();
      $("#my-watch-list").hide();
      $.ajax({
        url: server + "/movies" + `/similarmovies/:${title}`,
        method: "GET",
        headers: {
          acces_token: localStorage.getItem("token"),
        },
      })
        .done((response) => {
          $("#single-movie").append(`<h3>Related Movies</h3>`);
          for (let i = 0; i < response.length; i++) {
            $("#single-movie").append(`${response.Name}<br>`);
          }
        })
        .fail((xhr, status) => {
          console.log(xhr, status);
        });
    })
    .fail((xhr, status) => {
      console.log(xhr, status);
    });
}

function showMainPage() {
  $("#login-page").hide();
  $("#register-page").hide();
  $("#movie-page").hide();
  $("#home-page").show();
  getPopularMovie();
  $("#my-watch-list").hide();
}

function logout() {
  localStorage.removeItem("token");
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
  $("#login-page").show();
  $("#register-page").hide();
  $("#movie-page").hide();
  $("#home-page").hide();
  $("#my-watch-list").hide();
  console.log("tombol terclick");
}

function getPopularMovie() {
  // insert code to enter popular movie here
  // put response in section home-page
  $("#popular-movie-card").empty();
  $.ajax({
    url: "http://localhost:3000/movies/popular",
    method: "GET",
    headers: {
      acces_token: localStorage.getItem("token"),
    },
  })
    .done((response) => {
      response.forEach((data) => {
        $("#popular-movie-card").append(`
            <div class="col-3">
              <div class="card-custom uk-card uk-card-default uk-card-hover uk-card-body ml-5 mt-4">
                <i class="bookmark far fa-plus-square"></i>
                <img src="${data.moviePoster}" alt="image-${data.movieTitle}" onclick='showMoviePage("${data.movieTitle}")'>
                <p class="text-center">${data.movieTitle}</p>
              </div>
            </div>    
            `);
        console.log(response);
      });
    })
    .fail((xhr, status) => {
      console.log(xhr, status);
    });
}

function onSignIn(googleUser) {
  var google_access_token = googleUser.getAuthResponse().id_token;
  console.log(google_access_token);
  $.ajax({
    method: "POST",
    url: server + "/users/googleSignIn",
    data: {
      google_access_token,
    },
  })
    .done((response) => {
      console.log(response);
      localStorage.setItem("token", response);
      $("#login-page").hide();
      $("#register-page").hide();
      $("#movie-page").hide();
      $("#home-page").show();
      $("#my-watch-list").hide();
    })
    .fail((err) => {
      console.log(err);
    });
}

function ListMovie() {
  const token = localStorage.getItem("token");
  $.ajax({
    url: server + "/movies/watchlist",
    method: "GET",
    headers: {
      acces_token: localStorage.getItem("token"),
    },
  }).done(response => {
      response.forEach(el =>{
        $("#movie-list").append(`
        <div class="card ml-5 mt-5" style="width: 18rem;">
            <img src="${el.poster}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${el.title}</h5>
            <a href="#" class="btn btn-danger">Delete</a>
        </div>
    </div>`)

      })
  }).fail((xhr, status) => {
    console.log(xhr, status);
  });
}

function showMyMovie() {
  $("#login-page").hide();
  $("#register-page").hide();
  $("#movie-page").hide();
  $("#home-page").hide();
  $("#my-watch-list").show();
  ListMovie()
}

function addMovie({payload}) {
  console.log(payload)
  $.ajax({
    url: server + "/movies/watchlist",
    method: "POST",
    headers: {
      acces_token: localStorage.getItem("token"),
    },
    data: {
      title: payload.title,
      poster: payload.poster
    }
  }).done(response =>{
    console.log(response)
  }).fail(err =>{
    console.log(err)
  })
}