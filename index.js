var map;

var readFrancigena = function () {
    $.ajax({
        url: "http://localhost/prove/infoFrancigena_3.json",
        dataType: "json",

        success: function (data) {
            console.log("getJSON wit AJAX method has been activated");
            francigena = data;
        }
    });
};

function hide2() {
    $("#errorLog").hide();
    $("#tbody").empty();
    $("#tbody2").empty();
    $('.theadAll').hide();
    $("#thead2").hide();
    $("#leaflet").hide();
}

function hideTutto() {
    $('#tabella').hide();
    $('#tabella2').hide();
    $('#leaflet').hide();
    $('#hotel').hide();
    $('#ristoranti').hide();
    $('#mappe').hide();
    $('#inlineFormInputCitta').val('').empty();
    $('#inlineFormInputRegione').val('').empty();
    $('#myModal').hide();
};

function hide2AndHideTutto() {
    hide2();
    hideTutto();
}

function validateCitta() {
    $("#cercaCitta").prop("disabled", false);
    console.log('function validateCitta has been activated');
    let text = $('#inlineFormInputCitta').val();

    if (text === "") {
        hide2AndHideTutto();
        $("#errorLog").show();
    }   //condition 1: no strings, no problem

    else {
        hide2();
        //$("#cercaCitta").prop("disabled", true);
        $.ajax({
            url: "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent($("#inlineFormInputCitta").val()) + "&format=geocodejson",
            dataType: "json",

            beforeSend: function () {
                //I disable the button here
                $("#cercaCitta").prop("disabled", true);
            },

            success: function (data) {

                var check = false;     //I set the flag variable outside the cycle

                for (let i = 0; i < data.features.length; i++) {
                    let typeCity = data.features[i].properties.geocoding.type;
                    if (typeCity === "city" || typeCity === "village"){ //|| typeCity === "hamlet" || typeCity === "locality") {
                        let nameCity = data.features[i].properties.geocoding.name;
                        for (let i = 0; i < francigena.tappe.length; i++) {
                            let tappa = francigena.tappe[i];
                            let city = francigena.tappe[i].city;
                            let fs = francigena.tappe[i].fs;

                            if (city === nameCity && fs === "true") {
                                check = true;
                                //debugger;
                                //if (fs === "true")
                                console.log(" 'fs' === 'true' has been activated");
                                $('#tabellaEconteuti').show();
                                $("#tbody").append("<tr><td>" + tappa.name + "</td><td>" + tappa.state + "</td><td>" + tappa.region + "</td><td>" + tappa.city + "</td><td>" + "<button id='TrenitaliaButton' type='button' class='btn btn-secondary' data-toggle='tooltip' data-placement='top' title='Train service at favourable rates available.'><img id='fs' class='rounded' src='images/Logo_Ferrovie_dello_Stato_Italiane_2.png'/></button>" + "</td></tr>");

                                $("#tabella").show();
                                $('.theadAll').show();
                                $("#hotel").show();
                                $("#ristoranti").show();
                                $("#mappe").show();

                                $('#TrenitaliaButton').on('click', showTrenitaliaInfo);

                            }
                            else if (city === nameCity) {
                                check = true;
                                console.log("JSON file has been activated");
                                //check = true;                       //conditon 3 is fullfilled: strings matches
                                $('#tabellaEconteuti').show();

                                $("#tbody").append("<tr><td>" + tappa.name + "</td><td>" + tappa.state + "</td><td>" + tappa.region + "</td><td>" + tappa.city + "</td></tr>");

                                $("#tabella").show();
                                $('.theadAll').show();
                                $("#hotel").show();
                                $("#ristoranti").show();
                                $("#mappe").show();
                            }
                        }
                        ;
                    }
                    ;
                }


            if(
        !check
    )
        {
            $('#tabellaEconteuti').hide();
            $('#myModal').modal('show');  //THIS is the correct method to show the Modal! :)
            //$('#myModal').show();  with this method the buttons of the Bootstrap Modal don't work! :(
        }
    },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            alert("Sorry, page not found!");
        }
    ,

        complete: function () {
            $("#cercaCitta").prop("disabled", false);
        }
    }
)

//$("#cercaCitta").prop("disabled", false);
}
};

function validateRegione() {

    let textRegione = $("#inlineFormInputRegione").val();

    console.log("let regione has been read");

    if (textRegione === "") {
        $('#tabella').hide();
        $("#errorLogRegione").show();
    } else {

        $("#tbody").empty();
        $("#errorLogRegione").hide();
        //$("#cercaRegione").prop("disabled", true);
        $('#leaflet').hide();
        $('#mappe').hide();

        $.ajax({
            url: "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent($("#inlineFormInputRegione").val()) + "&format=geocodejson",
            dataType: "json",

            beforeSend: function () {
                $('#cercaRegione').prop('disabled', true)
            },

            success: function (data) {
                console.log("readRegion has been activated");

                $("#cercaRegione").prop("disabled", true);

                let check = false;

                for (let i = 0; i < data.features.length; i++) {
                    console.log("for loop in readRegion has been activated");

                    var typeRegion = data.features[i].properties.geocoding.type;

                    if (typeRegion === "administrative") {

                        var nameRegion = data.features[i].properties.geocoding.name;

                        for (let i = 0; i < francigena.tappe.length; i++) {

                            console.log("funziona tutto!");
                            $('#tabella2').hide();
                            $('#hotel').hide();
                            $('#ristoranti').hide();

                            let tappa = francigena.tappe[i];
                            let region = francigena.tappe[i].region;
                            let fs = francigena.tappe[i].fs;

                            if (region === nameRegion && fs === "true") {

                                $('#tabellaEconteuti').show();
                                $('.theadAll').show();
                                $("#tbody").append("<tr><td>" + tappa.name + "</td><td>" + tappa.state + "</td><td>" + tappa.region + "</td><td>" + tappa.city +  "</td><td>" + "<button id='TrenitaliaButton' type='button' class='btn btn-secondary' data-toggle='tooltip' data-placement='top' title='Train service at favourable rates available.'><img id='fs' src='images/Logo_Ferrovie_dello_Stato_Italiane_2.png'/></button>" + "</td></tr>"
                                );
                                $("#tabella").show();
                                $('#TrenitaliaButton').on('click', showTrenitaliaInfo);

                                check = true;
                            }

                            else if (region === nameRegion){

                                $("#tbody").append("<tr><td>" + tappa.name + "</td><td>" + tappa.state + "</td><td>" + tappa.region + "</td><td>" + tappa.city + "</td></tr>"
                                );
                                $('#tabellaEconteuti').show();
                                $("#tabella").show();
                                check = true;
                            }


                            ;
                        }
                    }
                }
                ;

                if (!check) {
                    $('#tabellaEconteuti').hide();
                    $('#myModal').modal('show');
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                alert("Sorry, page not found");
            },

            complete: function () {
                $('#cercaRegione').prop('disabled', false)
            }

        })

        $("#cercaRegione").prop("disabled", false);
    }
};

var lowCostHotels = [];

var readHotel = function () {
    $.ajax({
        url: "http://localhost/prove/pagine_bianche/searchpb?client=pbbrowsing&version=4.0&device=evo&pagesize=25&output=json&lang=it&typedwhat=hotel&what=hotel&where=" + encodeURIComponent($("#inlineFormInputCitta").val()),
        dataType: "json",

        success: function (data) {
            var inputCity = $("#inlineFormInputCitta").val().toLowerCase();
            $("#tbody2").empty();

            //$("#hotel").prop("disabled", true);

            for (let i = 0; i < lowCostHotels.LOW_COST_Pilgrim_accomodation.length; i++) {
                var entry = lowCostHotels.LOW_COST_Pilgrim_accomodation[i];
                console.log("il file JSON statico con gli hotel low cost è stato chiamato");
                if (entry.city.toLowerCase() == inputCity) {

                    $("#tbody2").append("<tr><td>" + entry.name.toUpperCase() + "  <b id='lowCost'><i>[ LOW COST ] </i></b> " + "</td><td>" + entry.address + "</td><td>" + entry.phone + "</td></tr>");
                }
            }

            for (let i = 0; i < data.results.length; i++) {
                let hotel = data.results[i];

                $("#tbody2").append("<tr><td>" + hotel.lastname + "</td><td>" + hotel.address + "</td><td>" + hotel.phones[0].number + "</td></tr>");
                $("#tabella2").show();
                $("#thead2").show();
                $("#leaflet").hide();
            }


            $("#hotel").prop("disabled", false);
        }


    });
};

var readLowCostAccomodation = function () {

    $.ajax({
        dataType: "json",
        url: "http://localhost/prove/low_cost_hotels.json",
        success: function (data) {
            //debugger;
            console.log("ajax call readLowCostAccomodation() has been activated");
            lowCostHotels = data;
        },
        error: function (e) {
            //debugger;
        }
    })
};

var readRistoranti = function () {
    $.ajax({
        //ora rimpiazzo Siena con  + encodeURIComponent($("#inlineFormInputCitta").val()) +
        url: "http://localhost/prove/pagine_bianche/searchpb?client=pbbrowsing&version=4.0&device=evo&pagesize=25&output=json&lang=it&typedwhat=ristorante&what=ristorante&where=" + encodeURIComponent($("#inlineFormInputCitta").val()),

        dataType: "json",
        success: function (data) {
            $("#tbody2").empty();
            $("#ristoranti").prop("disabled", true);


            for (let i = 0; i < data.results.length; i++) {
                let ristorante = data.results[i];

                $("#tbody2").append("<tr><td>" + ristorante.lastname + "</td><td>" + ristorante.address + "</td><td>" + ristorante.phones[0].number + "</td></tr>");
                $("#thead2").show();
                $("#tabella2").show();
                $("#tabella3").hide();
                $("#leaflet").hide();
            }
            ;
            $("#ristoranti").prop("disabled", false);
        }
    });
};

var readCoordinates = function () {


    $.ajax({
        url: "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent($("#inlineFormInputCitta").val()) + "+Italy&format=geocodejson",
        dataType: "json",
        success: function (data) {

            $("#mappe").prop("disabled", true);


            for (let i = 0; i < data.features.length; i++) {

                let varType = data.features[i].properties.geocoding.type;

                if (varType == "city") {

                    let coordinate = data.features[i].geometry.coordinates;

                    let lng = coordinate[1];

                    let lat = coordinate[0];

                    $("#leaflet").show();

                    map.setView([lng, lat], 13);
                    map.invalidateSize();

                    console.log("ajax and for loop have been activated");
                    console.log(coordinate);
                }
            }
            ;

            $("#ristoranti").prop("disabled", false);

            $("#mappe").prop("disabled", false);

            $("#tabella2").hide();

            $("#tabella3").hide();


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            alert("Indirizzo non trovato");
        }
    });

};

function initMaps() {

    map = L.map('leaflet').setView([0, 0], 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        'attribution': 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

};

//to know when the pack has been loaded pass a callback function ---->
/*
lang.loadPack('en', function (err) {
    if (!err) {
        // The language pack loaded
        console.log("The language pack loaded");
    } else {
        // There was an error loading the pack
        console.log("There was an error loading the pack");
    }
});

 */

/*
function translateLeg() {
    //$("cercaRegione").on('click', function(){
        console.log("translate Leg has been activated");
        //window.lang.translate("Leg");
}

 */

function showTrenitaliaInfo() {
    console.log("showTrenitaliaInfo has been activated");
    //window.location.href ="https://www.viefrancigene.org/en/trenitalia/"
    window.open('https://www.viefrancigene.org/static/uploads/www.viefrancigene.org/trenitalia_istruzioni_eng.pdf')
}

function main() {
    readLowCostAccomodation();
    initMaps();
    readFrancigena();
    $("#cercaCitta").on('click', validateCitta);
    $("#cercaRegione").on('click', validateRegione);
    $('#hotel').on('click', readHotel);
    $('#mappe').on('click', readCoordinates);
    $('#ristoranti').on('click', readRistoranti);
    //$('#buttonTitle').on('click', () => window.location.reload(), console.log("reload has been activated"));

    $('#inlineFormInputCitta').on('keydown', function (e) {

        //activate the same action by clicking on "Enter"
        if (e.which == 13) {
            e.preventDefault();
            validateCitta();
        }
    });

    $('#inlineFormInputRegione').on('keydown', function (e) {

        if (e.which == 13) {
            e.preventDefault();
            validateRegione();
        }
    });


    $('#regione-tab').on('click', hideTutto);
    $('#citta-tab').on('click', hideTutto);
    $('#about-tab').on('click', hideTutto);
    //$(lang.loadPack());
    //translateLeg();

    $('[data-toggle="tooltip"]').tooltip();
    //$('#TrenitaliaButton').on('click', showTrenitaliaInfo);
};

$(main);


/*
function validateTrenitalia(){

    for(let i = 0; i<francigena.tappe; i++){

        alert("validateTrenitalia() has been activated");
        if (francigena.tappe[i].fs === "true") {

            $('tr[3]').append(" + fs");

        }
    }


}

 */

/*
function closeModal(){
    if (e.which == 13) {
        e.preventDefault();
        $('#myModal').hide();
    }
}
 */








