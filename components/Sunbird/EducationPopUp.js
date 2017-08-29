var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var EditText = require('@juspay/mystique-backend').androidViews.EditText;
var TextInputView = require('./core/TextInputView');
var Spinner = require('../Sunbird/core/Spinner');
var RadioButton = require('../Sunbird/core/RadioButton');
var CheckBox = require("@juspay/mystique-backend").androidViews.CheckBox;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var FeatureButton = require('../../components/Sunbird/FeatureButton');
var Styles = require("../../res/Styles");
let IconStyle = Styles.Params.IconStyle;

var _this;

class EducationPopUp extends View {
  constructor(props, childern) {
    super(props,childern);
    this.setIds([
      "educationPopUpParent",
      "degreeText",
      "yearOfPassingText",
      "percentageText",
      "gradeText",
      "inititutionText",
      "boardOrUniversityText",
      "saveButton",
      "delButton",
      "saveButtonParent",
      "saveButtonContainer"
    ]);
    _this=this;
    this.isVisible=false;
    window.__EducationPopUp = this;
    this.props = props;
    this.responseCame=false;
    this.degree = "";
    this.yearOfPassing = "";
    this.percentage = "";
    this.grade = "";
    this.inititution = "";
    this.boardOrUniversity = "";


    this.prevData = {};
  }

  getUi = () => {
    return (
      <RelativeLayout
        width="match_parent"
        height="match_parent"
        gravity="center">
            {this.getBody()}
            {this.getFooter()}
      </RelativeLayout>
    );
  }


  show = () => {
    this.isVisible=true;;
    window.__patchCallback = this.getPatchCallback ;
    this.responseCame=false;
    this.updateSaveButtonStatus(false);
    this.replaceChild(this.idSet.educationPopUpParent, this.getUi().render(),0);
    this.setVisibility("visible");
    this.initializeData();
    this.populateData();
  }

  hide = () => {
    this.isVisible=false;
    JBridge.hideKeyboard();
    this.setVisibility("gone");
    window.__EducationPopUp.data=undefined;
  }

  getVisibility = (data) => {
    return this.isVisible;
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.educationPopUpParent,
      visibility: data
    })
    Android.runInUI(cmd, 0)
  }


  initializeData = () => {
    this.prevData.degree = "";
    this.prevData.yearOfPassing = "";
    this.prevData.percentage = "";
    this.prevData.inititution = "";
    this.prevData.boardOrUniversity = "";
    this.prevData.grade = "";

    if (window.__EducationPopUp.data != undefined) {
      this.prevData.degree = window.__EducationPopUp.data.degree;
      this.prevData.yearOfPassing = window.__EducationPopUp.data.yearOfPassing ? window.__EducationPopUp.data.yearOfPassing : "";
      this.prevData.percentage = window.__EducationPopUp.data.percentage ? window.__EducationPopUp.data.percentage : "";
      this.prevData.inititution = window.__EducationPopUp.data.name;
      this.prevData.boardOrUniversity = window.__EducationPopUp.data.boardOrUniversity;
      this.prevData.grade = window.__EducationPopUp.data.grade;
    }
  }


  populateData = () => {
    this.degree = this.prevData.degree;
    this.yearOfPassing = this.prevData.yearOfPassing;
    this.percentage = this.prevData.percentage;
    this.inititution = this.prevData.inititution;
    this.boardOrUniversity = this.prevData.boardOrUniversity;
    this.grade = this.prevData.grade;

    var cmd = this.set({
      id: this.idSet.degreeText,
      text: this.prevData.degree
    })

    cmd += this.set({
      id: this.idSet.yearOfPassingText,
      text: this.prevData.yearOfPassing
    })

    cmd += this.set({
      id: this.idSet.percentageText,
      text: this.prevData.percentage
    })

    cmd += this.set({
      id: this.idSet.inititutionText,
      text: this.prevData.inititution
    })

    cmd += this.set({
      id: this.idSet.boardOrUniversityText,
      text: this.prevData.boardOrUniversity
    })

    cmd += this.set({
      id: this.idSet.gradeText,
      text: this.prevData.grade
    })

    Android.runInUI(cmd, 0);
  }

  setDegree = (data) => {
    this.degree = data;
    this.checkDataChanged();
  }

  setYearOfPassingText = (data) => {
    this.yearOfPassing = data;
    this.checkDataChanged();
  }

  setPercentage = (data) => {
    this.percentage = data;
    this.checkDataChanged();
  }

  setGrade = (data) => {
    this.grade = data;
    this.checkDataChanged();
  }

  setInitution = (data) => {
    this.inititution = data;
    this.checkDataChanged();
  }

  setBoardOrUniversity = (data) => {
    this.boardOrUniversity = data;
    this.checkDataChanged();
  }

  checkDataChanged = () => {
    var isChanged = true;
    console.log("this.prevData", this.prevData);
    console.log("this", this);
    if (this.degree == this.prevData.degree
      && this.yearOfPassing == this.prevData.yearOfPassing
      && this.percentage == this.prevData.percentage
      && this.grade == this.prevData.grade
      && this.inititution == this.prevData.inititution
      && this.boardOrUniversity == this.prevData.boardOrUniversity) {
        console.log("isChanged is false");
         isChanged = false;
      }

    this.updateSaveButtonStatus((this.isValid() && isChanged));
  }

  isValid = () => {
    if (this.degree == undefined || this.degree.length == 0 ) {
      return false;
    }
    if (this.inititution == undefined || this.inititution.length == 0 ) {
      return false;
    }
    return true;
  }

  updateSaveButtonStatus = (enabled) => {
    var backgroundColor;
    var isClickable;

    if (enabled) {
      backgroundColor = window.__Colors.LIGHT_BLUE;
      isClickable = "true"
    } else {
      backgroundColor = window.__Colors.FADE_BLUE;
      isClickable = "false"
    }

    var cmd = this.set({
      id: this.idSet.saveButton,
      background: backgroundColor,
      clickable: isClickable
    })

    Android.runInUI(cmd, 0);
  }

  handleSaveClick = () => {


    this.education = [];
    var json;

    if (window.__EducationPopUp.data == undefined) {
      json = {
        "degree": this.degree,
        "yearOfPassing": parseInt(this.yearOfPassing),
        "name": this.inititution,
        "percentage": parseFloat(this.percentage),
        "grade": this.grade,
        "boardOrUniversity" : this.boardOrUniversity
      }
    } else {
      json = window.__EducationPopUp.data;
      json.degree = this.degree;
      json.yearOfPassing = parseInt(this.yearOfPassing);
      json.name = this.inititution;
      json.percentage = parseFloat(this.percentage);
      json.grade = this.grade;
      json.boardOrUniversity = this.boardOrUniversity;
      json.isDeleted = this.delete ? this.delete : null;
      this.delete = false;
    }

    this.education.push(json);

    var url = window.__apiUrl + "/api/user/v1/update";
    var body = {
      "id" : "unique API ID",
      "ts" : "response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
      "params" : {

      },
      "request" : {
        "userId" : window.__userToken,
        "education" : this.education
      }
    }

    _this.responseCame=false;
    JBridge.patchApi(url, JSON.stringify(body), window.__userToken, window.__apiToken);
    window.__LoaderDialog.show();
     setTimeout(() => {
         if(_this.responseCame){
           console.log("Response Already Came")
           return;
         }
         console.log("TIMEOUT")
         JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION);
         window.__LoaderDialog.hide();
         _this.responseCame=false;
     },window.__API_TIMEOUT);
  }

  getPatchCallback = (data) =>{
    data=JSON.parse(data);
    if(this.responseCame){
      console.log("TIMEOUT")
      return;
    }

   window.__LoaderDialog.hide();
   this.responseCame=true;
   console.log(data)
   if(data.result.response=="SUCCESS"){
     this.hide();
     window.__BNavFlowRestart();
   }else{
     JBridge.showSnackBar(data.params.errmsg);
   }

 }

  getToolbar  = () =>{
    return( <LinearLayout
            height="56"
            padding="0,0,0,2"
            gravity="center_vertical"
            background={window.__Colors.PRIMARY_BLACK_22}
            width="match_parent" >
                <LinearLayout
                  height="56"
                  padding="0,0,0,0"
                  gravity="center_vertical"
                  background={window.__Colors.WHITE}
                  width="match_parent" >

                    {this.getBack()}

                    {this.getTitle()}

                </LinearLayout>
            </LinearLayout>

      );
  }

  getBack = () => {
    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      height="48"
      width="48"
      onClick={this.hide}
      imageUrl = {"ic_action_arrow_left"}/>);
  }

  getTitle = () => {
    return (<LinearLayout
            height="match_parent"
            width="wrap_content"
            gravity="center_vertical">

              <TextView
                  height="match_parent"
                  width="match_parent"
                  gravity="center_vertical"
                  background="#ffffff"
                  text="Education"
                  style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>


          </LinearLayout>);

  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,0,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getScrollView(){
    return(
      <LinearLayout
        height = "match_parent"
        width = "match_parent"
        orientation="vertical"
        background="#ffffff"
        id={this.idSet.scrollView}
        padding="15,15,15,15">

        {this.getEditTextView(this.idSet.degreeText, "Degree", false, this.setDegree)}
        {this.getEditTextView(this.idSet.inititutionText, "Institution Name", false, this.setInitution)}
        {this.getEditTextView(this.idSet.yearOfPassingText, "Year of Passing", true, this.setYearOfPassingText)}
        {this.getEditTextView(this.idSet.percentageText, "Percentage", true, this.setPercentage)}
        {this.getEditTextView(this.idSet.gradeText, "Grade", true, this.setGrade)}
        {this.getEditTextView(this.idSet.boardOrUniversityText, "Board//University", true, this.setBoardOrUniversity)}

      </LinearLayout>
    );
  }

  getEditTextView = (id, label, optional,onChange) => {
    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        margin = "0,0,0,12">
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="horizontal"
          margin = "0,0,0,-5"
          padding = "4,0,0,0">
          <TextView
            height="wrap_content"
            width="wrap_content"
            text={label}
            textAllCaps="true"
            textStyle={window.__TextStyle.textStyle.HINT.SEMI}/>
          <TextView
            height="wrap_content"
            width="wrap_content"
            text=" *"
            color="#FF0000"
            visibility = {optional ? "gone" : "visible"}/>
        </LinearLayout>
        <EditText
          width="match_parent"
          height="wrap_content"
          id = {id}
          onChange={onChange}
          singleLine="true"
          maxLine="1"
          hint = {optional ? "(Optional)" : ""}
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
    </LinearLayout>
    );
  }

  getBody = () => {
    return (
      <LinearLayout
        width = "match_parent"
        height = "match_parent"
        orientation = "vertical"
        backgroundColor = "#ffffff">

        {this.getToolbar()}
        <LinearLayout
          width="match_parent"
          height="match_parent"
          orientation="vertical"
          padding = "0,0,0,60">
            <ScrollView
            height="match_parent"
            width="match_parent"
            weight="1">
                 {this.getScrollView()}
            </ScrollView>
          </LinearLayout>
      </LinearLayout>
    );
  }

  getFooter = () => {
    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical"
        background = "#ffffff"
        alignParentBottom = "true, -1">

        {this.getLineSeperator()}
        <LinearLayout
          width = "match_parent"
          height = "match_parent"
          orientation = "horizontal"
            margin = "16, 8, 0, 8">
          {this.getBtn(this.idSet.delButton, "neg", "DELETE", this.handleDelClick, window.__EducationPopUp.data ? "visible" : "gone")}
          {this.getBtn(this.idSet.saveButton, "pos", "SAVE", this.handleSaveClick, "visible")}
        </LinearLayout>
      </LinearLayout>
    );
  }

  getBtn = (id, type, label, onClick, visibility) => {
    return (
      <LinearLayout
        width = "0"
        weight = "1"
        height = "wrap_content"
        visibility = {visibility}
        margin = "0, 0, 16, 0">

        <FeatureButton
          weight = "1"
          id = {id}
          clickable="false"
          width = "match_parent"
          height = "match_parent"
          stroke = {type == "pos" ? "1," + window.__Colors.WHITE : "3," + window.__Colors.PRIMARY_DARK}
          background = {type == "pos" ? window.__Colors.PRIMARY_DARK : window.__Colors.WHITE}
          text = {label}
          buttonClick = {onClick}
          textColor = {type == "pos" ? window.__Colors.WHITE : window.__Colors.PRIMARY_DARK}
          textStyle = {window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
      </LinearLayout>
    );
  }

  handleDelClick = () => {
    this.delete = true;
    this.handleSaveClick();
  }

  render() {
    this.layout = (
      <LinearLayout
        width = "match_parent"
        height = "match_parent"
        root = "true"
        id={this.idSet.educationPopUpParent}
        background = "#ffffff"
        visibility="gone">
        <RelativeLayout
          width="match_parent"
          height="match_parent"
          gravity="center">
              {this.getBody()}
              {this.getFooter()}
        </RelativeLayout>
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = EducationPopUp;
