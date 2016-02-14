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




// class contenent marker and infowindow

var Point = function(data) {
    'use strict';
    var self = this;

    this.position = ko.observable(data.position); //set position observable
    this.title = ko.observable(data.title); //set name observable
    this.wikiInfo = ko.observable(data.wikiInfo); //set information observable


    //create marker
    var marker = new google.maps.Marker({
        position: self.position(),
        map: map,
        title: self.title(),
        animation: google.maps.Animation.DROP
    });


    this.marker = ko.observable(marker); //set marker observable

    //create html for infowindow
    var row = '<div class="mdl-grid">';
    var grid2 = '<div class="mdl-cell mdl-cell--2-col mdl-card__media">';
    var grid8 = '<div class="mdl-cell mdl-cell--8-col mdl-card__supporting-text">';
    var titleClass = '<div class="mdl-card__title">';


    //create infowindow
    var infowindow = new google.maps.InfoWindow({

        content: titleClass + "<h4>" + this.title() + "</h4></div>" + row + grid8 + "<p>" + this.wikiInfo() + "</p></div></div>"
    });
    this.infowindow = ko.observable(infowindow); // set infowindow observable
    // set infowindow when marker is clikked
    this.marker().addListener('click', function() {
        self.infowindow().open(self.marker().get('map'), self.marker());

    });



};


var viewModel = function() {
        
        var self = this;
        this.searchName = ko.observable();
        this.points = ko.observableArray();

        // create object point foreach site in modeleview
        model.site.forEach(function(pointItem) {

            self.points().push(new Point(pointItem));
        });
        //create live search function
        this.liveSearch = ko.computed(function() {

                    //var search = self.searchName().toLowerCase();

                    if (!self.searchName()) {

                        self.points().forEach(function(point) {
                            point.marker().setVisible(true);
                        });
                        return self.points();
                    } 
                    else 
                    {
                        return ko.utils.arrayFilter(self.points(), function(item) {
                            var string = item.title().toLowerCase().indexOf(self.searchName().toLowerCase()) !== -1;
                            if (!string) {
                                item.marker().setVisible(false);
                            } 
                            else {
                                item.marker().setVisible(true);
                            }
                            return string;
                            });
                    }
                });

                    

                    this.forSquareImage = ko.observable(); //set image from forsquare observable
                    this.forSquareTitle = ko.observable(); //set observable true o false for box
                    this.forSquareName = ko.observable(); // set variable observable for assign title in the box
                    this.info = ko.observable(); // set variable observable for assign inforbation in the  box

                    // create function for click element name in list
                    this.forSquare = function(data) {
                        self.forSquareName(data.title());
                        self.info(data.wikiInfo());

                        data.marker().setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(function() {
                            data.marker().setAnimation(null);
                        }, 1000);
                        //create ajax for retrive photo from foursquare
                        $.ajax({
                            url: model.foursquareUrl,
                            data: 'intent=match&ll=' + data.position().lat + ',' + data.position().lng + '&query=Creed&client_id=' + model.foursquareClientID +
                                '&client_secret=' + model.foursquareClientSecret + '&v=20160205&venuePhotos=1',
                            dataType: 'json',

                            success: function(data) {
                                self.forSquareTitle(true);
                                self.forSquareImage(data.response.groups[0].items[0].venue.photos.groups[0].items[0].prefix +
                                    '80x60' + data.response.groups[0].items[0].venue.photos.groups[0].items[0].suffix);


                            },

                            error: function(jqXHR, status, err) {
                                console.log("couldn't connect to host ", status, err);
                            }

                        });

                    };

                    //function for set not visible box when x is clicked
                    this.close = function() {

                        self.forSquareTitle(false);

                    }

                };


                ko.applyBindings(viewModel());
