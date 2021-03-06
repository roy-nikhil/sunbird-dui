const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var CheckBox = require("@juspay/mystique-backend/src/android_views/CheckBox");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var Styles = require("../../../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var _this;

class SimplePopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "contentContainer",
      "spinnerContainer",
      "linkShareIntents",
      "fileShareIntents"
    ]);
    this.parentId = this.props.id || this.idSet.parentContainer;
    this.chosenItem;
    this.selectedList = [];
    _this=this;
    window.__SimplePopup = this;
    console.log("SIMPLE POPUP CME")
    this.isVisible=false;
  }


  show = (id) => {
    this.setVisibility("visible", id);
    this.isVisible=true;
  }

  hide = (id) => {
    this.setVisibility("gone", id);
    this.isVisible=false;
  }

  getVisible = () => {
    return this.isVisible;
  }

  setVisibility = (data, id) => {
    var cmd = this.set({
      id: id || this.parentId,
      visibility: data
    })

    Android.runInUI(cmd, 0)
  }



  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  getContent = () =>{

    return (

        <LinearLayout
          orientation="vertical"
          margin="2,8,0,8"
          width="match_parent"
          height="wrap_content">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.props.data.content}/>

       </LinearLayout>


     );

  }


  handleButtonClick = (type) =>{
    this.props.buttonClick(type);
  }


  getFooter = () =>{
     return (

        <LinearLayout
          width="match_parent"
          height="wrap_content"
          margin = "0,8,0,0">

          <LinearLayout
          stroke = {"2," + window.__Colors.PRIMARY_DARK}
          width="0"
          margin="0,0,10,0"
          cornerRadius="4"
          weight="1">
            <LinearLayout
            onClick={()=>{this.handleButtonClick("negative")}}
            width="match_parent"
            height="match_parent">

                 <TextView
                   gravity="center"
                   height="48"
                   width="match_parent"
                   style={window.__TextStyle.textStyle.CARD.ACTION.DARK}
                   text={this.props.data.negButtonText}/>

               </LinearLayout>

         </LinearLayout>

         <LinearLayout
           background = {window.__Colors.PRIMARY_DARK}
           cornerRadius="4"
           margin="10,0,0,0"
           width="0"
           weight="1">

           <LinearLayout
            onClick={()=>{this.handleButtonClick("positive")}}
            width="match_parent"
            height="match_parent">

                  <TextView
                   gravity="center"
                   height="48"
                   width="match_parent"
                   style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                   text={this.props.data.posButtonText}/>

             </LinearLayout>

         </LinearLayout>

       </LinearLayout>


     );
  }


  getHeader = () => {
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        gravity="center_vertical"
        margin="0,0,0,8">

          <TextView
            width = "wrap_content"
            height = "wrap_content"
            gravity="center_vertical"
            text = {this.props.data.title}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

          <ViewWidget
            width="0"
            weight="1"
            height="0"/>

          <ImageView
            width="18"
            height="18"
            onClick={this.handleDismissClick}
            gravity="center_vertical"
            imageUrl="ic_action_close"/>

      </LinearLayout>
    )
  }



  getBody = () => {
    return (<LinearLayout
              cornerRadius = "2"
              width = "match_parent"
              height = "wrap_content"
              root="true"
              visibility="visible"
              orientation= "vertical"
              clickable = "true"
              padding="16,18,16,16"
              background="#ffffff">

               {this.getHeader()}

               {this.getContent()}

               {this.getFooter()}


            </LinearLayout>)
  }


  handleDismissClick = () => {
    this.hide();
  }



  afterRender = () => {
  }



  render() {

    this.layout = (
      <LinearLayout
        height = "match_parent"
        width = "match_parent"
        id={this.parentId}
        visibility="gone"
        afterRender={this.afterRender}
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical">
          <LinearLayout
            height="0"
            width="match_parent"
            onClick={this.handleDismissClick}
            weight="1"/>

          {this.getBody()}


      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = SimplePopup;
