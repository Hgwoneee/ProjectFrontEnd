/*global kakao*/

import React, { Component } from 'react';

class MapForm extends Component {
  componentDidMount() {
      var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
      mapOption = { 
          center: new kakao.maps.LatLng(36.2683, 127.6358), // 지도의 중심좌표
          level: 13 // 지도의 확대 레벨
      };
  
    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption); 
  }

  render() {
    return (
      <div id="map" style={{"width":"100%","height":"700px"}}></div>
    )
  }
}
export default MapForm;