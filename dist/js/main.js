function initMap(){ko.applyBindings(new viewModel)}var model={center:{lat:41.904652,lng:12.4933303},zoom:14,site:[{position:{lat:41.890169,lng:12.492269},title:"Colosseum",wikiInfo:"The Colosseum or Coliseum (/kɒləˈsiːəm/ kol-ə-see-əm), also known as the Flavian Amphitheatre (Latin: Amphitheatrum Flavium; Italian: Anfiteatro Flavio [amfiteˈaːtro ˈflaːvjo] or Colosseo [kolosˈsɛːo]), is an oval amphitheatre in the centre of the city of Rome, Italy."},{position:{lat:41.898587,lng:12.476884},title:"Pantheon",wikiInfo:"The Pantheon (/ˈpænθiən/ or US /ˈpænθiɒn/;[1] Latin: Pantheon,[nb 1] from Greek Πάνθεον meaning 'every god') is a building in Rome, Italy, on the site of an earlier building commissioned by Marcus Agrippa during the reign of Augustus (27 BC – 14 AD). The present building was completed by the emperor Hadrian and probably dedicated about 126 AD. He retained Agrippa's original inscription, which has confused its date of construction"},{position:{lat:41.902459,lng:12.456777},title:"Piazza San Pietro",wikiInfo:"St. Peter's Square (Italian: Piazza San Pietro [ˈpjattsa sam ˈpjɛːtro], Latin: Forum Sancti Petri) is a large plaza located directly in front of St. Peter's Basilica in the Vatican City, the papal enclave inside Rome, directly west of the neighbourhood or rione of Borgo."},{position:{lat:41.900917,lng:12.483324},title:"Fontana di Trevi",wikiInfo:"The Trevi Fountain (Italian: Fontana di Trevi) is a fountain in the Trevi district in Rome, Italy, designed by Italian architect Nicola Salvi and completed by Pietro Bracci. Standing 26.3 metres (86 ft) high and 49.15 metres (161.3 ft) wide,[1] it is the largest Baroque fountain in the city and one of the most famous fountains in the world."},{position:{lat:41.8925007,lng:12.485326},title:"Foro Romano",wikiInfo:"The Roman Forum (Latin: Forum Romanum, Italian: Foro Romano) is a rectangular forum (plaza) surrounded by the ruins of several important ancient government buildings at the center of the city of Rome. Citizens of the ancient city referred to this space, originally a marketplace, as the Forum Magnum, or simply the Forum."}],content:[],foursquareClientID:"TFZMI4DY5F5T1BJMCYXJFSU3VOYOGFZVS0JPLLQK4RRCANBV",foursquareClientSecret:"AAJHNTZD1ZZ32IOPGLUVPSI4GUR1ZPQIRY45TMQRDUKGXKSV",foursquareUrl:"https://api.foursquare.com/v2/venues/explore?"},map,infowindow,bounds,Point=function(e){"use strict";var o=this;this.position=ko.observable(e.position),this.title=ko.observable(e.title),this.wikiInfo=ko.observable(e.wikiInfo);var t={path:"M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",fillColor:"yellow",fillOpacity:.8,scale:.1,strokeColor:"gold",strokeWeight:2},i=new google.maps.Marker({position:o.position(),map:map,icon:t,title:o.title(),animation:google.maps.Animation.DROP});bounds.extend(new google.maps.LatLng(this.position())),this.marker=ko.observable(i),this.marker().addListener("click",function(){infowindow.open(o.marker().get("map"),o.marker()),o.marker().setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){o.marker().setAnimation(null)},700),callFoursquare(e),map.fitBounds(bounds),map.panTo(i.getPosition())})},callFoursquare=function(e){$.ajax({url:model.foursquareUrl,data:"intent=match&ll="+e.position.lat+","+e.position.lng+"&categoryId=4deefb944765f83613cdba6e&query=Creed&client_id="+model.foursquareClientID+"&client_secret="+model.foursquareClientSecret+"&v=20160205&venuePhotos=1",dataType:"json",success:function(o){var t="<h3>"+e.title+"</h3><img src='"+o.response.groups[0].items[0].venue.photos.groups[0].items[0].prefix+"80x60"+o.response.groups[0].items[0].venue.photos.groups[0].items[0].suffix+"'><div class='mdl-card__supporting-text'>"+e.wikiInfo+"</div>";localStorage.setItem("data.image",t),infowindow.setContent(t)},error:function(e,o,t){var i="couldn't connect to host "+o+t;infowindow.setContent(i)}})},viewModel=function(){map=new google.maps.Map(document.getElementById("map"),{center:model.center,zoom:model.zoom,disableDefaultUI:!0}),bounds=new google.maps.LatLngBounds,infowindow=new google.maps.InfoWindow;var e=this;this.searchName=ko.observable(),this.points=ko.observableArray(),model.site.forEach(function(o){e.points().push(new Point(o))}),this.liveSearch=ko.computed(function(){return infowindow.close(),e.searchName()?ko.utils.arrayFilter(e.points(),function(o){var t=-1!==o.title().toLowerCase().indexOf(e.searchName().toLowerCase());return t?o.marker().setVisible(!0):o.marker().setVisible(!1),t}):(e.points().forEach(function(e){e.marker().setVisible(!0)}),e.points())}),this.forSquare=function(){return function(e){console.log(e),google.maps.event.trigger(e.marker(),"click")}}};