require('normalize.css/normalize.css');
require('styles/App.css');

var imageData = require('../imageData.json');

import React from 'react';

// 获取图片数据
function genImageURL(imageArr) {
  for (var i = 0, j = imageArr.length; i < j; i++) {
    let singleImage = imageArr[i];
    singleImage.imageURL = require('../images/' + singleImage.filename);
    imageArr[i] = singleImage;
  }
  return imageArr;
}
imageData = genImageURL(imageData);

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
