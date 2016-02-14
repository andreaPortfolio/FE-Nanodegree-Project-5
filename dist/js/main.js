var model={center:{lat:41.904652,lng:12.4933303},zoom:14,site:[{position:{lat:41.890169,lng:12.492269},title:"Colosseum",wikiInfo:"The Colosseum or Coliseum (/kɒləˈsiːəm/ kol-ə-see-əm), also known as the Flavian Amphitheatre (Latin: Amphitheatrum Flavium; Italian: Anfiteatro Flavio [amfiteˈaːtro ˈflaːvjo] or Colosseo [kolosˈsɛːo]), is an oval amphitheatre in the centre of the city of Rome, Italy."},{position:{lat:41.898587,lng:12.476884},title:"Pantheon",wikiInfo:"The Pantheon (/ˈpænθiən/ or US /ˈpænθiɒn/;[1] Latin: Pantheon,[nb 1] from Greek Πάνθεον meaning 'every god') is a building in Rome, Italy, on the site of an earlier building commissioned by Marcus Agrippa during the reign of Augustus (27 BC – 14 AD). The present building was completed by the emperor Hadrian and probably dedicated about 126 AD. He retained Agrippa's original inscription, which has confused its date of construction"},{position:{lat:41.902459,lng:12.456777},title:"Piazza San Pietro",wikiInfo:"St. Peter's Square (Italian: Piazza San Pietro [ˈpjattsa sam ˈpjɛːtro], Latin: Forum Sancti Petri) is a large plaza located directly in front of St. Peter's Basilica in the Vatican City, the papal enclave inside Rome, directly west of the neighbourhood or rione of Borgo."},{position:{lat:41.900917,lng:12.483324},title:"Fontana di Trevi",wikiInfo:"The Trevi Fountain (Italian: Fontana di Trevi) is a fountain in the Trevi district in Rome, Italy, designed by Italian architect Nicola Salvi and completed by Pietro Bracci. Standing 26.3 metres (86 ft) high and 49.15 metres (161.3 ft) wide,[1] it is the largest Baroque fountain in the city and one of the most famous fountains in the world."},{position:{lat:41.8925007,lng:12.485326},title:"Foro Romano",wikiInfo:"The Roman Forum (Latin: Forum Romanum, Italian: Foro Romano) is a rectangular forum (plaza) surrounded by the ruins of several important ancient government buildings at the center of the city of Rome. Citizens of the ancient city referred to this space, originally a marketplace, as the Forum Magnum, or simply the Forum."}],content:[],foursquareClientID:"TFZMI4DY5F5T1BJMCYXJFSU3VOYOGFZVS0JPLLQK4RRCANBV",foursquareClientSecret:"AAJHNTZD1ZZ32IOPGLUVPSI4GUR1ZPQIRY45TMQRDUKGXKSV",foursquareUrl:"https://api.foursquare.com/v2/venues/explore?"},Point=function(e){"use strict";var i=this;this.position=ko.observable(e.position),this.title=ko.observable(e.title),this.wikiInfo=ko.observable(e.wikiInfo);var o=new google.maps.Marker({position:i.position(),map:map,title:i.title(),animation:google.maps.Animation.DROP});this.marker=ko.observable(o);var t='<div class="mdl-grid">',a='<div class="mdl-cell mdl-cell--8-col mdl-card__supporting-text">',n='<div class="mdl-card__title">',r=new google.maps.InfoWindow({content:n+"<h4>"+this.title()+"</h4></div>"+t+a+"<p>"+this.wikiInfo()+"</p></div></div>"});this.infowindow=ko.observable(r),this.marker().addListener("click",function(){i.infowindow().open(i.marker().get("map"),i.marker())})},viewModel=function(){var e=this;this.searchName=ko.observable(),this.points=ko.observableArray(),model.site.forEach(function(i){e.points().push(new Point(i))}),this.liveSearch=ko.computed(function(){return e.searchName()?ko.utils.arrayFilter(e.points(),function(i){var o=-1!==i.title().toLowerCase().indexOf(e.searchName().toLowerCase());return o?i.marker().setVisible(!0):i.marker().setVisible(!1),o}):(e.points().forEach(function(e){e.marker().setVisible(!0)}),e.points())}),this.forSquareImage=ko.observable(),this.forSquareTitle=ko.observable(),this.forSquareName=ko.observable(),this.info=ko.observable(),this.forSquare=function(i){e.forSquareName(i.title()),e.info(i.wikiInfo()),i.marker().setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){i.marker().setAnimation(null)},1e3),$.ajax({url:model.foursquareUrl,data:"intent=match&ll="+i.position().lat+","+i.position().lng+"&query=Creed&client_id="+model.foursquareClientID+"&client_secret="+model.foursquareClientSecret+"&v=20160205&venuePhotos=1",dataType:"json",success:function(i){e.forSquareTitle(!0),e.forSquareImage(i.response.groups[0].items[0].venue.photos.groups[0].items[0].prefix+"80x60"+i.response.groups[0].items[0].venue.photos.groups[0].items[0].suffix)},error:function(e,i,o){console.log("couldn't connect to host ",i,o)}})},this.close=function(){e.forSquareTitle(!1)}};ko.applyBindings(viewModel());