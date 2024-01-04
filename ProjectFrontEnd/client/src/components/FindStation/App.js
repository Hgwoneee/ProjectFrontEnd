/*global kakao*/
import React, { Component } from 'react';
import jsonData from "./map_info.json";
import $ from 'jquery';
import './App.css';
const { kakao1 } = window;

class App extends Component { 
  componentDidMount() {
    var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new kakao.maps.LatLng(37.505496, 127.005116),
        level: 9
    }
    var map = new kakao.maps.Map(mapContainer, mapOption)

    var clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 5
    });

    var markers = $(jsonData.positions).map(function(i, position) {

      var imageSrc = require("./img/hop0"+(i+1)+".png")
      if(position.finish == '완치'){
          imageSrc = require("./img/clearp0"+(i+1)+".png")
      }

      var imageSize = new kakao.maps.Size(60, 70)
      var imageOption = {offset: new kakao.maps.Point(27, 69)}

      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      var marker = new kakao.maps.Marker({
          map: map,
          position : new kakao.maps.LatLng(position.lat, position.lng),
          image: markerImage
      });

      var content = '<div class="overlaybox">' +
          '    <div class="boxtitle">'+position.num+'번째 확진자</div>' +
          '    <div class="boxtitle2" style="margin-left: 150px;"><font color="white"">닫기 버튼 [X]</font></div>'+
          '    <div class="first first_'+position.num+'">' +
          '        <div class="triangle text">'+position.num+'</div>' +
          '        <div class="movietitle text">'+position.comment+'</div>' +
          '    </div>' +
          '    <ul style = "overflow:scroll">' +
          '        <li class="up">' +
          '            <span class="number">격리:</span>' +
          '            <span class="title" style="font-weight:bold;color:white">'+position.date+'</span>' +
          '            <span class="number">완치:</span>' +
          '            <span class="title" style="font-weight:bold;color:white">'+position.finish_date+'</span>' +
          '        </li>' +
          '        <li class="up">' +
          '            <span class="number">성별:</span>' +
          '            <span class="title" style="font-weight:bold;color:white">'+position.gender+'</span>' +
          '            <span class="number">생년:</span>' +
          '            <span class="title" style="font-weight:bold;color:white">'+position.birth+'</span>' +
          '            <span class="number">국적:</span>' +
          '            <span class="title" style="font-weight:bold;color:white">'+position.nation+'</span>' +
          '        </li>' +
          '        <li class="up">' +
          '            <span class="number">접속자수:</span>' +
          '            <span class="title" style="font-weight:bold;color:white">'+position.contact+'</span>' +
          '            <span class="number">격리조치중:</span>' +
          '            <span class="title" style="font-weight:bold;color:white">'+position.Isolation+'</span>' +
          '        </li>' +
          '    </ul>' +
          '</div>';
      
      var lat = Number(position.lat)
      var lng = Number(position.lng)
      var lat_string = lat.toString()
      var lng_string = lng.toString()
      
      var customOverlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(lat_string, lng_string), 
          content: content,
          xAnchor: 0.25,
          yAnchor: 0.95
      });

      var clickHandler1 = function(event) {
          customOverlay.setMap(map);

          $(".boxtitle2").click(function(){
            customOverlay.setMap(null);
          });

          $(".first_"+position.num).css({"background":"url("+position.hospi_img+")",
          "background-size" :"247px 247px"}); 	
      }; 

      kakao.maps.event.addListener(marker, 'click', clickHandler1)
      return marker;
    })
    clusterer.addMarkers(markers);
  }

  render() {
    return (
      <div id="map" style={{"width":"100%","height":"700px"}}></div>
    )
  }
}
export default App;