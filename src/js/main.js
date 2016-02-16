// initial data
var model = {

    center: {
        lat: 41.904652,
        lng: 12.4933303
    },
    zoom: 14,
    site: [{
        position: {
            lat: 41.890169,
            lng: 12.492269
        },
        title: 'Colosseum',
        wikiInfo: 'The Colosseum or Coliseum (/kɒləˈsiːəm/ kol-ə-see-əm), also known as the Flavian Amphitheatre (Latin: Amphitheatrum Flavium; Italian: Anfiteatro Flavio [amfiteˈaːtro ˈflaːvjo] or Colosseo [kolosˈsɛːo]), is an oval amphitheatre in the centre of the city of Rome, Italy.'

    }, {
        position: {
            lat: 41.898587,
            lng: 12.476884
        },
        title: 'Pantheon',
        wikiInfo: "The Pantheon (/ˈpænθiən/ or US /ˈpænθiɒn/;[1] Latin: Pantheon,[nb 1] from Greek Πάνθεον meaning 'every god') is a building in Rome, Italy, on the site of an earlier building commissioned by Marcus Agrippa during the reign of Augustus (27 BC – 14 AD). The present building was completed by the emperor Hadrian and probably dedicated about 126 AD. He retained Agrippa\'s original inscription, which has confused its date of construction"
    }, {
        position: {
            lat: 41.902459,
            lng: 12.456777
        },
        title: 'Piazza San Pietro',
        wikiInfo: "St. Peter's Square (Italian: Piazza San Pietro [ˈpjattsa sam ˈpjɛːtro], Latin: Forum Sancti Petri) is a large plaza located directly in front of St. Peter's Basilica in the Vatican City, the papal enclave inside Rome, directly west of the neighbourhood or rione of Borgo."
    }, {
        position: {
            lat: 41.900917,
            lng: 12.483324
        },
        title: 'Fontana di Trevi',
        wikiInfo: 'The Trevi Fountain (Italian: Fontana di Trevi) is a fountain in the Trevi district in Rome, Italy, designed by Italian architect Nicola Salvi and completed by Pietro Bracci. Standing 26.3 metres (86 ft) high and 49.15 metres (161.3 ft) wide,[1] it is the largest Baroque fountain in the city and one of the most famous fountains in the world.'
    }, {
        position: {
            lat: 41.8925007,
            lng: 12.485326
        },
        title: 'Foro Romano',
        wikiInfo: 'The Roman Forum (Latin: Forum Romanum, Italian: Foro Romano) is a rectangular forum (plaza) surrounded by the ruins of several important ancient government buildings at the center of the city of Rome. Citizens of the ancient city referred to this space, originally a marketplace, as the Forum Magnum, or simply the Forum.'
    }],
    content: [],
    foursquareClientID: 'TFZMI4DY5F5T1BJMCYXJFSU3VOYOGFZVS0JPLLQK4RRCANBV',
    foursquareClientSecret: 'AAJHNTZD1ZZ32IOPGLUVPSI4GUR1ZPQIRY45TMQRDUKGXKSV',
    foursquareUrl: 'https://api.foursquare.com/v2/venues/explore?'
};


function googleError() {

    alert("Could not load Google Map");

}

var map,
    infowindow,
    bounds;

// class contenent marker 
var Point = function(data) {
    'use strict';
    var self = this;

    this.position = ko.observable(data.position); //set position observable
    this.title = ko.observable(data.title); //set name observable
    this.wikiInfo = ko.observable(data.wikiInfo); //set information observable



    var goldStar = {
        path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        fillColor: 'yellow',
        fillOpacity: 0.8,
        scale: 0.1,
        strokeColor: 'gold',
        strokeWeight: 2
    };

    //create marker
    var marker = new google.maps.Marker({
        position: self.position(),
        map: map,
        icon: goldStar,
        title: self.title(),
        animation: google.maps.Animation.DROP
    });
    //set bounds for each marker and fit bounds on map
    bounds.extend(new google.maps.LatLng(this.position()));
    map.fitBounds(bounds);


    this.marker = ko.observable(marker); //set marker observable


    this.marker().addListener('click', function() {
        infowindow.open(self.marker().get('map'), self.marker());
        self.marker().setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker().setAnimation(null);
        }, 700);
        callFoursquare(data);

        map.panTo(marker.getPosition());

    });

};

//store ajax call in a variable
var callFoursquare = function(dataModel) {
    console.log((localStorage.getItem(dataModel.title + '-content')));
    if ((localStorage.getItem(dataModel.title + '-content')) === null) {
        $.ajax({
          
            url: model.foursquareUrl,
            data: 'intent=match&ll=' + dataModel.position.lat + ',' + dataModel.position.lng + '&categoryId=4deefb944765f83613cdba6e' + '&query=Creed&client_id=' + model.foursquareClientID +
                '&client_secret=' + model.foursquareClientSecret + '&v=20160205&venuePhotos=1',
            dataType: 'json',

            success: function(data) {
                var content = "<h3>" + dataModel.title + "</h3>" + "<img src='" + data.response.groups[0].items[0].venue.photos.groups[0].items[0].prefix +
                    '80x60' + data.response.groups[0].items[0].venue.photos.groups[0].items[0].suffix + "'>" + "<div class='mdl-card__supporting-text'>" + dataModel.wikiInfo + "</div>";
                //set local storage
                localStorage.setItem(dataModel.title + '-content', content);
                infowindow.setContent(content);
            },

            error: function(jqXHR, status, err) {
                var error = "couldn't connect to host " + status + err;
                infowindow.setContent(error);
            }

        });
    } else {
        var content = localStorage.getItem(dataModel.title + '-content');
        infowindow.setContent(content);
        console.log('tt');
    }


};

var viewModel = function() {


    //create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: model.center,
        zoom: model.zoom,
        disableDefaultUI: true
    });
    bounds = new google.maps.LatLngBounds();
    infowindow = new google.maps.InfoWindow();

    var self = this;
    this.searchName = ko.observable();
    this.points = ko.observableArray();

    // create object point foreach site in modeleview
    model.site.forEach(function(pointItem) {

        self.points().push(new Point(pointItem));
    });
    //create live search function
    this.liveSearch = ko.computed(function() {

        infowindow.close();
        if (!self.searchName()) {

            self.points().forEach(function(point) {
                point.marker().setVisible(true);
            });
            return self.points();
        } else {
            return ko.utils.arrayFilter(self.points(), function(item) {
                var string = item.title().toLowerCase().indexOf(self.searchName().toLowerCase()) !== -1;
                if (!string) {
                    item.marker().setVisible(false);
                } else {
                    item.marker().setVisible(true);
                }
                return string;
            });
        }
    });


    // create function for click element name in list
    this.forSquare = function() {
        return function(data) {
            google.maps.event.trigger(data.marker(), 'click'); //open marker when link is clicked

        };

    }

};

function initMap() {
    ko.applyBindings(new viewModel());
}

//
