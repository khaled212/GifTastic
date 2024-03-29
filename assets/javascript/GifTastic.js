$(document).ready(function () {

    var topics = ["Iron Man", "Deadpool", "Aquaman", "Spiderman", "Hellboy", "Superman"]
    var alreadyUsed = -1;
    var comicHero = "";
    var moreBtn = "";
    var offset = 0;

    displayButtons();

    $("#buttons").on("click", ".comicHeros", function () {
        $("#gifs-appear-here").empty();
        comicHero = $(this).attr("data-hero");
        getGifs(comicHero, offset);
        $("#moreButton").empty();
        moreBtn = $("<button class='btn-outline-danger'>");
        moreBtn.addClass("moreHeroes");
        moreBtn.text("Want to See More?");
        $("#moreButton").append(moreBtn);
    });

    $("#moreButton").submit(function (e) {
        event.preventDefault();
        comicHero = e.currentTarget[0].value;
        console.log("comic hero in submit button", comicHero)
        offset += 0;
        getGifs(comicHero, offset);
    });

    $(document).on("click", ".gif", function () {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

    $("#addHero").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#newHeroes").click();
        }
    });

    $("#newHeroes").on("click", function () {
        event.preventDefault();
        var newHero = $("#addHero").val().trim();
        if (newHero !== "") {
            alreadyUsed = topics.indexOf(newHero);
            if (alreadyUsed == -1) {
                topics.push(newHero);
            } else {
                $("#dupModal").modal()
            }
            displayButtons();
            $("#addHero").val("");
        }
    });

    function getGifs(comicHero, offset) {
        var queryURL = "https://api.giphy.com/v1/stickers/search?api_key=" +
            "uvYCpzXJli4IxRmah1bl8rHE93j6mtxg&q=" + comicHero + "&limit=25&" + offset + "=0&rating=R&lang=en";
        $.ajax({
            url: queryURL,
            method: "GET"
        })

            .then(function (response) {
                var results = response.data;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].rating !== "R" && results[i].rating !== "R") {
                        var gifDiv = $("<div class='gifsDisplay'>");
                        var rating = results[i].rating;
                        var title = results[i].title;
                        var p = $("<p id='gifCaption'>").text("Rating: " + rating + "  Title: " + title);
                        var originalImage = results[i].images.original.url;
                        var p2 = $("<p><a href='" + originalImage + "' target='_blank'>See on Giphy</a></p>");
                        var heroImage = $("<img>");
                        heroImage.attr("class", "gif");
                        heroImage.attr("src", results[i].images.fixed_height_still.url);
                        heroImage.attr("data-still", results[i].images.fixed_height_still.url);
                        heroImage.attr("data-animate", results[i].images.fixed_height.url);
                        heroImage.attr("data-state", "still");
                        gifDiv.append(p);
                        gifDiv.append(p2);
                        gifDiv.append(heroImage);
                        $("#gifs-appear-here").prepend(gifDiv);
                    }
                }
            });
    }

    function displayButtons() {
        $("#buttons").empty();
        for (var i = 0; i < topics.length; i++) {
            var heroBtn = $("<button class='btn-outline-danger'>");
            heroBtn.addClass("comicHeros");
            heroBtn.attr("data-hero", topics[i]);
            heroBtn.text(topics[i]);
            $("#buttons").append(heroBtn);
        }
    }
});