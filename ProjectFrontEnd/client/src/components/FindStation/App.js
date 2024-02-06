/*global kakao*/
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import './App.css';
import axios from "axios";
const { kakao } = window;

const App = () => {

  const [responseStationList, setresponseStationList] = useState('');

  useEffect(() => {
    callStationListApi()
  }, []);

  const callStationListApi = () => {
    axios.get('http://localhost:8000/api/charging-stations/', {
    })
      .then(response => {
        try {
          setresponseStationList(response.data);
          StationListAppend(response.data);
        } catch (error) {
          alert(error)
        }
      })
      .catch(error => { alert(error); return false; });
  }

  const StationListAppend = (STList) => {
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


    var markers = $(STList).map(function (i, position) {
      var imageSrc = require("./img/마킹123.gif")
      var imageSize = new kakao.maps.Size(60, 70)
      var imageOption = { offset: new kakao.maps.Point(27, 69) }
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(position.lat, position.lng),
        image: markerImage
      });

      var str = '';
      $.each(position.charger, function (index, value) {

        var chargeType;

        switch (value.chgerType) {
          case '01':
            chargeType = 'DC차데모';
            break;
          case '02':
            chargeType = 'AC완속';
            break;
          case '03':
            chargeType = 'DC차데모+AC3상';
            break;
          case '04':
            chargeType = 'DC콤보';
            break;
          case '05':
            chargeType = 'DC차데모+DC콤보';
            break;
          case '06':
            chargeType = 'DC차데모+AC3상+DC콤보';
            break;
          case '07':
            chargeType = 'AC3상';
            break;
          case '08':
            chargeType = 'DC콤보';
            break;
          default:
            chargeType = '???';
        }

        var chargeStat;

        switch (value.stat) {
          case '1':
            chargeStat = '통신이상';
            break;
          case '2':
            chargeStat = '충전대기';
            break;
          case '3':
            chargeStat = '충전중';
            break;
          case '4':
            chargeStat = '운영중지';
            break;
          case '5':
            chargeStat = '점검중';
            break;
          case '9':
            chargeStat = '상태미확인';
            break;
          default:
            chargeStat = '???';
        }

        str +=
          `<tr> 
          <td colspan="2" style="background-color: #a4d1ae">충전기[No.${value.chgerId}]</td>
          </tr>
          <tr> 
          <td>충전타입</td>
          <td>${chargeType}</td>
          </tr>
          <td>충전기상태</td>
          <td>${chargeStat}</td>
          </tr>`
      })

      var parkingStatus;

      if (position.parkingFree === 'Y') {
        parkingStatus = '주차장 - 무료';
      } else if (position.parkingFree === 'N') {
        parkingStatus = '주차장 - 유료';
      }

      // 각 충전소에 대한 오버레이 컨텐츠 생성
      var content = 
        `<div class="overlaybox">
          <table border="1">
        <tr> 
          <td colspan="2" class="boxtitle2" style="background-color: #103f05; color: white; text-align: center;">[X]</td>
        </tr>
        <tr>
          <td colspan="2" class="boxtitle" style="text-align: center;">${position.statNm}</td>
        </tr>
        <tr>
          <td colspan="2">${position.addr}</td>
        </tr>
        <tr>
          <td colspan="2">충전소 ID -${position.statId}</td>
        </tr>
          ${str}
        <tr>
          <td colspan="2">${parkingStatus}</td>
        </tr>
        </table>
        </div>`;


      // 위도와 경도를 문자열로 변환
      var lat = Number(position.lat)
      var lng = Number(position.lng)
      var lat_string = lat.toString()
      var lng_string = lng.toString()

      // 각 충전소에 대한 사용자 정의 오버레이 생성
      var customOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(lat_string, lng_string),
        content: content,
        xAnchor: 0,
        yAnchor: 0,
      });

      // 마커에 대한 클릭 이벤트 핸들러
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

      kakao.maps.event.addListener(marker, 'click', clickHandler1)
      return marker;
    })
    // 마커를 마커 클러스터러에 추가
    clusterer.addMarkers(markers);

  }

  // 지도 컨테이너 렌더링
    return (
      <div id="map" style={{ "width": "100%", "height": "700px" }}></div>
    )
  }

  export default App;