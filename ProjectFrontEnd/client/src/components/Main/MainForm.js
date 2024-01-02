import React, { Component } from 'react';

// 이미지와 텍스트를 표시하는 컴포넌트
class ImageTextContainer extends Component {
  render() {
    const { imagePath, altText, labelText } = this.props;
    return (
      <div className="image-container">
        <img src={imagePath} alt={altText} className="mainimage" />
        <div className="maintext">
          <p>{labelText}</p>
        </div>
      </div>
    );
  }
}

class MainForm extends Component {
  render() {
    return (
      <div className="maincontainer">
        {/* 첫 번째 이미지와 텍스트 */}
        <ImageTextContainer imagePath={require("../../img/gif/01.gif")} altText="Background" labelText="I'm going in a car." />

        {/* 두 번째 이미지와 텍스트 */}
        <ImageTextContainer imagePath={require("../../img/gif/02.gif")} altText="Background" labelText="I arrived at the charging station." />

        {/* 세 번째 이미지와 텍스트 */}
        <ImageTextContainer imagePath={require("../../img/gif/05.gif")} altText="Background" labelText="I charge my electric car." />

        {/* 하단 이미지 */}
        <div className="bottom-image-container">
          <img src={require(`../../img/gif/002.png`)} alt="Bottom Image" className="bottom-image" />
          <div className="maintext2">
            <p></p>
          </div>
        </div>
      </div>
    );
  }
}

export default MainForm;
