import React from 'react';
import ReactDOM from 'react-dom';
require('normalize.css');
require('../styles/app.scss');

var imageDatas = require('../imageData.json');

imageDatas.map((item) => {
  item.src = '../images/' + item.fileName;
})

// get a random value
function getRandomRange(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}
// get a random degree between 0 and 30
function getRandomDeg() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    var styleObj = {};
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
            styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
          }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)} >
        <img src={this.props.data.src} alt={this.props.data.title} />
        <figcaption>
          <h2 className='img-title'>{this.props.data.title}</h2>
          <div className='img-back' onClick={this.handleClick.bind(this)}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render() {
    let {arrange} = this.props;

    var controllerUnitClassName = 'controller-unit';
    if (arrange.isCenter) {
      controllerUnitClassName += 'is-center';
      if (arrange.isInverse) {
        controllerUnitClassName += 'is-inverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [{
        pos: {
          left: 0,
          right: 0
        },
        rotate: 0,
        isInverse: false,
        isCenter: false
      }]
    };
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    };
  }
  center(index) {
    return () => {
      this.rearrange(index);
    };
  }
  inverse(index) {
    return () => {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }
  }
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr;
    var Constant = this.Constant;
    var centerPos = Constant.centerPos;
    var hPosRange = Constant.hPosRange;
    var vPosRange = Constant.vPosRange;
    var hPosRangeLeftSecX = hPosRange.leftSecX;
    var hPosRangeRightSecX = hPosRange.rightSecX;
    var hPosRangeY = hPosRange.y;
    var vPosRangeTopY = vPosRange.topY;
    var vPosRangeX = vPosRange.x;

    var imgsArrangeTopArr = [];
    var topImgNum = Math.floor(Math.random() * 2);
    var topImgSpliceIndex = 0;

    var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRandomRange(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRandomRange(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: getRandomDeg(),
        isCenter: false
      };
    });

    // 布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      // 前半部分布局左边， 右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRandomRange(hPosRangeY[0], hPosRangeY[1]),
          left: getRandomRange(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: getRandomDeg(),
        isCenter: false
      };
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }
  componentDidMount() {
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    var stageW = stageDOM.scrollWidth;
    var stageH = stageDOM.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2);
    var halfStageH = Math.ceil(stageH / 2);

    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    var imgW = imgFigureDOM.scrollWidth;
    var imgH = imgFigureDOM.scrollHeight;
    var halfImgW = Math.ceil(imgW / 2);
    var halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }
  render() {
    var imgFigures = [];
    var controllerUnits = [];

    imageDatas.map((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
    });
    return (
      <section className='stage' ref='stage'>
        <section className='img-sec'>
          {imgFigures}
        </section>
        <nav className='controller-nav'>
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

App.defaultProps = {

};

export default App;
