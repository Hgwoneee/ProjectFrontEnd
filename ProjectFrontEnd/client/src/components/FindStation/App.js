/*global kakao*/
import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import axios from "axios";
const { kakao } = window;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseFPList: '',
      append_FPList: '',
    }
  }
  componentDidMount() {
    this.callFloatPopulListApi()
  }
  callFloatPopulListApi = async () => {
    axios.get('http://localhost:8000/api/charging-stations/', {
    })
      .then(response => {
        //alert( JSON.stringify(response) );
        try {
          this.setState({ responseFPList: response });
          this.setState({ append_FPList: this.FloatPopulListAppend() });
        } catch (error) {
          alert(error)
        }
      })
      .catch(error => { alert(error); return false; });
  }
  FloatPopulListAppend = () => {
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
    let result = []
    var FPList = this.state.responseFPList.data
    var markers = $(FPList).map(function (i, position) {
      //alert(position.lat);
      //alert(position.lng);
      var imageSrc = require("./img/carlogo001.png")
      var imageSize = new kakao.maps.Size(60, 70)
      var imageOption = { offset: new kakao.maps.Point(27, 69) }
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(position.lat, position.lng),
        image: markerImage
      });
      var content = '<div class="overlaybox">' +
/*         '    <div class="boxtitle">' + position.statNm + '</div>' + */
       
        '    <div class="boxtitle3" style="text-align: right; margin-right: 65px; display: inline-block;"><font color="white" style="font-size: 16px">새로 고침 @</font></div>'+    
        '    <div class="boxtitle2" style="text-align: right; margin-right: 7px; display: inline-block;"><font color="purple" style="font-size: 16px">닫기 버튼 [X]</font></div>' +

        '    <div class="first first_' + position.id + '">' +
        '        <div class="triangle text">' + position.statId + '</div>' +
        '        <div class="movietitle text">' + position.statNm + '</div>' +
        '    </div>' +
        '    <ul style = "overflow:scroll">' +
/*         '        <li class="up">' +
        '            <span class="number">충전소Nm:</span>' +
        '            <span class="title" style="font-weight:light;color:white">' + position.statNm + '</span>' +
        '        </li>' + */
        '        <li class="up"  style="border-bottom: 1px solid #ccc;">' +
        '            <span class="number">주소:</span>' +
        '            <span class="title" style="font-weight:light;color:#CCFFFF">' + position.addr + '</span><br>' +
        '        </li>' +

        '        <li class="up"  style="border-bottom: 1px solid #ccc;">' +
                    '<span class="title" style="font-weight:light;color:white">' +
                      '<span style="margin-right:10px;">충전기Id</span>' +
                      '<span class="vertical-line"></span>' +
                      '<span style="margin-right:10px;">충전기방식</span>' +
                      '<span class="vertical-line"></span>' +
                      '<span style="margin-right:10px;">충전기상태</span>' +
                    '</span>' +
                      '<li class="up" style="border-bottom: 1px solid #ccc;">' +
                      '<span class="number" style="color:#CCFFFF">${position.chgerId}</span>' +
                      '<span class="vertical-line"></span>' +
                      '<span class="number" style="color:#CCFFFF">${position.chgerType}</span>' +
                      '<span class="vertical-line"></span>' +
                      '<span class="number" style="color:#CCFFFF">${position.chgerStatus}</span>' +
                    '</li>'+
        '        <li class="up" style="border-bottom: 1px solid #ccc;">' +
        '            <span class="number" >상태 갱신일시:</span>' + 
        '            <span class="title" style="font-weight:light;color:#CCFFFF">' + position.statUpdateDatetime + '</span>' +
        '        </li>' +
        '        <li class="up">' +
        '            <span class="number">이용가능시간:</span>' + 
        '            <span class="title" style="font-weight:light;color:#CCFFFF">' + position.statUpdateDatetime + '</span>' +
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
      var clickHandler1 = function (event) {
        customOverlay.setMap(map);

        $(".boxtitle2").click(function () {
          customOverlay.setMap(null);
        });

        $(".first_" + position.num).css({
          "background": "url(" + position.hospi_img + ")",
          "background-size": "247px 247px"
        });
      };

      var clickHandler2 = function (event) {
        customOverlay.setMap(map);

        $(".boxtitle3").click(function () {
          var currentDate = new Date();
          var formattedDate = currentDate.toLocaleString();

    //      position.statUpdateDatetime = formattedDate;
          $(".current-time").text('갱신 시각: ' + formattedDate);
        });

        $(".first_" + position.num).css({
          "background": "url(" + position.hospi_img + ")",
          "background-size": "247px 247px"
        });
      };

      kakao.maps.event.addListener(marker, 'click', clickHandler1)
      kakao.maps.event.addListener(marker, 'click', clickHandler2)
      return marker;
    })
    clusterer.addMarkers(markers);
  }
  render() {
    return (
      <div id="map" style={{ "width": "100%", "height": "700px" }}></div>
    )
  }
}
export default App;