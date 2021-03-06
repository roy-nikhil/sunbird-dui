const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var FeatureButton = require("../../components/Sunbird/FeatureButton");
var RadioListItem = require('../Sunbird/RadioListItem');

var Styles = require("../../res/Styles");

let IconStyle = Styles.Params.IconStyle;

class ChooseItem extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer"
    ]);
    this.chosenItem;
    this.selectedList = [];
  }



  getFeatureButton = (isClickable) => {
    var color = isClickable == "true" ? window.__Colors.PRIMARY_ACCENT : window.__Colors.PRIMARY_BLACK_22;
    return (<LinearLayout
              id={this.idSet.featureContainer}
              height="0"
              width = "match_parent"
              weight="20"
              orientation="vertical"
              alignParentBottom="true,-1"
              padding = "3,3,3,3"
              gravity = "center">

                  <FeatureButton
                    typeface = "bold"
                    clickable={isClickable}
                    width = "match_parent"
                    height = "64"
                    stroke = {"3," + window.__Colors.WHITE}
                    background = {color}
                    text = {this.props.data.confirmText || "Confirm"}
                    buttonClick = {this.onConfirm}
                    textColor = {window.__Colors.WHITE}
                    textSize = "18"/>

                </LinearLayout>)


  }


  getList = () => {
    var lengthOfMenu = Object.keys(this.props.data.items).length;
    this.totalItems = this.props.data.items.splice(0, lengthOfMenu / 2)
    this.rightItems = this.props.data.items.splice(0, lengthOfMenu / 2);
    this.leftItems = this.totalItems.splice(0, lengthOfMenu / 2);


    var leftBar = "";
    var rightBar = "";
    leftBar = this.leftItems.map((item, index) => {
      return (<RadioListItem
                onItemClick={this.handleItemClick}
                title={item}
                index={index}/>)
    });

    rightBar = this.rightItems.map((item, index) => {
      return (<RadioListItem
                onItemClick={this.handleItemClick}
                title={item}
                index={index}/>)
    });

    this.totalBar = (
      <LinearLayout
        orientation = "horizontal"
        width = "wrap_content"
        height = "wrap_content">

          <LinearLayout
            orientation = "vertical"
            width = "wrap_content"
            height = "wrap_content">

            {leftBar}

          </LinearLayout>

          <LinearLayout
            orientation = "vertical"
            width = "wrap_content"
            height = "wrap_content"
            margin = "86,0,0,0">
            
              {rightBar}
          
          </LinearLayout>
          
        </LinearLayout>
    )

    return this.totalBar;
  }



  getRadioList() {
    return (<LinearLayout
            width = "match_parent"
            height = "0"
            weight="70"
            margin = "0,0,0,0"
            padding = "0,0,10,10"
            orientation = "vertical">

             <ScrollView
              height="wrap_content"
              width="match_parent">

              {this.getList()}
            
              </ScrollView>

            </LinearLayout>)
  }

  getHeader() {
    return (
      <LinearLayout
      width="wrap_content"
      height="0"
      weight="10">

          <TextView
           width = "wrap_content"
           height = "wrap_content"
           text = {window.__S.CHOOSE_FROM_FOLLOWING}
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

      </LinearLayout>
    )
  }


  handleItemClick = (title, checked) => {

    if (checked)
      this.selectedList.push(title)
    else {
      var position = this.selectedList.indexOf(title);
      this.selectedList.splice(position, 1);
    }

    if (this.selectedList.length > 0) {
      this.replaceChild(this.idSet.featureContainer, this.getFeatureButton("true").render(), 0);
    } else {
      this.replaceChild(this.idSet.featureContainer, this.getFeatureButton("false").render(), 0);
    }

  }


  onConfirm = () => {
    window.__RootScreen.hideFilterDialog();
    this.props.onSelect(this.selectedList);
  }

  handleSelection = (index) => {
    this.chosenItem = index;
  }

  afterRender = () => {}

  render() {

    this.layout = (
      <LinearLayout
        afterRender={this.afterRender}
        height = "450"
        width = "match_parent"
        orientation= "vertical"
        clickable = "true"
        padding="16,18,16,16"
        alignParentBottom = "true,-1"
        cornerRadius = "2"
        background="#ffffff">
          
         {this.getHeader()}

         {this.getRadioList()}

         {this.getFeatureButton("false")}

        </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = ChooseItem;
