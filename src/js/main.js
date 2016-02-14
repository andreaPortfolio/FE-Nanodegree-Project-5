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
        wikiInfo: 'The Colosseum or Coliseum (/kɒləˈsiːəm/ kol-ə-see-əm), also known as the Flavian Amphitheatre (Latin: Amphitheatrum Flavium; Italian: Anfiteatro Flavio [amfiteˈaːtro ˈflaːvjo] or Colosseo [kolosˈsɛːo]), is an oval amphitheatre in the centre of the city of Rome, Italy.',
        show:'true'

    }, {
        position: {
            lat: 41.898587,
            lng: 12.476884
        },
        title: 'Pantheon',
        wikiInfo: "The Pantheon (/ˈpænθiən/ or US /ˈpænθiɒn/;[1] Latin: Pantheon,[nb 1] from Greek Πάνθεον meaning 'every god') is a building in Rome, Italy, on the site of an earlier building commissioned by Marcus Agrippa during the reign of Augustus (27 BC – 14 AD). The present building was completed by the emperor Hadrian and probably dedicated about 126 AD. He retained Agrippa\'s original inscription, which has confused its date of construction",
        show:'true'
    }, {
        position: {
            lat: 41.902459,
            lng: 12.456777
        },
        title: 'Piazza San Pietro',
        wikiInfo: "St. Peter's Square (Italian: Piazza San Pietro [ˈpjattsa sam ˈpjɛːtro], Latin: Forum Sancti Petri) is a large plaza located directly in front of St. Peter's Basilica in the Vatican City, the papal enclave inside Rome, directly west of the neighbourhood or rione of Borgo.",
        show:'true'
    }, {
        position: {
            lat: 41.900917,
            lng: 12.483324
        },
        title: 'Fontana di Trevi',
        wikiInfo: 'The Trevi Fountain (Italian: Fontana di Trevi) is a fountain in the Trevi district in Rome, Italy, designed by Italian architect Nicola Salvi and completed by Pietro Bracci. Standing 26.3 metres (86 ft) high and 49.15 metres (161.3 ft) wide,[1] it is the largest Baroque fountain in the city and one of the most famous fountains in the world.',
        show:'true'
    }, {
        position: {
            lat: 41.8925007,
            lng: 12.485326
        },
        title: 'Foro Romano',
        wikiInfo: 'The Roman Forum (Latin: Forum Romanum, Italian: Foro Romano) is a rectangular forum (plaza) surrounded by the ruins of several important ancient government buildings at the center of the city of Rome. Citizens of the ancient city referred to this space, originally a marketplace, as the Forum Magnum, or simply the Forum.',
        show:'true'
    }],
    content: [],
    foursquareClientID: 'TFZMI4DY5F5T1BJMCYXJFSU3VOYOGFZVS0JPLLQK4RRCANBV',
    foursquareClientSecret: 'AAJHNTZD1ZZ32IOPGLUVPSI4GUR1ZPQIRY45TMQRDUKGXKSV',
    foursquareUrl: 'https://api.foursquare.com/v2/venues/explore?'
};



var point = function (data) {


this.position = ko.observable(data.position.position);
this.title = ko.observable(data.title);
this.wikiInfo = ko.observable(data.wikiInfo);
this.show = ko.observable(data.show);

var marker = new google.maps.Marker({
                position: this.position ,
                map: map,
                show: ko.observable(data.show),
                title: data.title
            });


var row = '<div class="mdl-grid">';
var grid2 = '<div class="mdl-cell mdl-cell--2-col mdl-card__media">';
var grid8 = '<div class="mdl-cell mdl-cell--8-col mdl-card__supporting-text">';
var titleClass = '<div class="mdl-card__title">';



var infowindow = new google.maps.InfoWindow({
        content: titleClass + "<h4>" + this.title + "</h4></div>" + row + grid2 + "<img src='" + image + "'></div>" + grid8 + "<p>" + this.wikiInfo + "</p></div></div>"
     });

marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);

     });



}


var viewMap = {
    init: function() {
viewMap.getMarker(model.site);


    },

    //create initial map
    getMap: function() {
        return new google.maps.Map(document.getElementById('map'), {
            center: model.center,
            zoom: model.zoom,
            disableDefaultUI: true
        });

    },
    //create marker function
    getMarker: function(modelData) {
        self = this;
        var map = viewMap.getMap();
        self.markerArray = ko.observableArray();
    


        for (var i = 0; i < modelData.length; i++) {
            var marker = new google.maps.Marker({
                position: modelData[i].position,
                map: map,
                title: modelData[i].title
            });
            self.markerArray().push(marker);
            console.log(this.markerArray()[i].title);
          
            (function(i) {
                $.ajax({
                    url: model.foursquareUrl,
                    data: 'intent=match&ll=' + modelData[i].position.lat + ',' + modelData[i].position.lng + '&query=Creed&client_id=' + model.foursquareClientID +
                        '&client_secret=' + model.foursquareClientSecret + '&v=20160205&venuePhotos=1',
                    dataType: 'json',

                    success: function(data) {
                        

                        var photo = data.response.groups[0].items[0].venue.photos.groups[0].items[0].prefix +
                            '100x200' + data.response.groups[0].items[0].venue.photos.groups[0].items[0].suffix;

                    
                        
                        viewMap.addInfoMarker(self.markerArray()[i], model.site[i].title, photo, model.site[i].wikiInfo);

                    }
                })
            }(i));



        }
        //console.log(marker);
        //return marker
    },
    //create window box and click event for marker function
    addInfoMarker: function(marker, title, image, wikiInfo) {
        var row = '<div class="mdl-grid">';
        var grid2 = '<div class="mdl-cell mdl-cell--2-col mdl-card__media">';
        var grid8 = '<div class="mdl-cell mdl-cell--8-col mdl-card__supporting-text">';
        var titleClass = '<div class="mdl-card__title">';

        var infowindow = new google.maps.InfoWindow({
            content: titleClass + "<h4>" + title + "</h4></div>" + row  + grid8 + "<p>" + wikiInfo + "</p></div></div>"
        });

        marker.addListener('click', function() {
            infowindow.open(marker.get('map'), marker);

        });
    },

    
    searchName:  ko.observable()

};

viewMap.init();

ko.applyBindings(viewMap);
