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
      this.prevData.yearOfPassing = window.__EducationPopUp.data.yearOfPassing;
      this.prevData.percentage = window.__EducationPopUp.data.percentage;
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

    if (this.degree == this.prevData.degree
      && this.yearOfPassing == this.prevData.yearOfPassing
      && this.percentage == this.prevData.percentage
      && this.grade == this.prevData.grade
      && this.inititution == this.prevData.inititution
      && this.boardOrUniversity == this.prevData.boardOrUniversity) {
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
      background: backgroundColor
    })

    cmd += this.set({
      id: this.idSet.saveButtonContainer,
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


         <LinearLayout
         height="wrap_content"
         width="match_parent"
         orientation="vertical">
           <LinearLayout
           height="wrap_content"
           width="match_parent"
           orientation="horizontal">
              <TextView
              height="wrap_content"
              width="wrap_content"
              text="Degree"
              textAllCaps="true"
              textStyle={window.__TextStyle.textStyle.HINT.SEMI}
              margin="0,0,0,3"/>
              <TextView
              height="wrap_content"
              width="wrap_content"
              text=" *"
              color="#FF0000"
              margin="0,0,0,3"/>
            </LinearLayout>
            <EditText
            width="match_parent"
            height="wrap_content"
            id = {this.idSet.degreeText}
            onChange={this.setDegree}
            singleLine="true"
            maxLine="1"
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
            <LinearLayout
            height="34"
            width="1"/>
         </LinearLayout>

         <LinearLayout
         height="wrap_content"
         width="match_parent"
         orientation="vertical">
           <TextView
            height="wrap_content"
            width="wrap_content"
            text="Year Of Passing"
            textStyle={window.__TextStyle.textStyle.HINT.SEMI}
            margin="0,0,0,3"/>
            <EditText
            width="match_parent"
            height="wrap_content"
            inputType="numeric"
            singleLine="true"
            maxLine="1"
            hint="(Optional)"
            onChange={this.setYearOfPassingText}
            id = {this.idSet.yearOfPassingText}
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
            <LinearLayout
            height="34"
            width="1"/>
         </LinearLayout>

         <LinearLayout
         height="wrap_content"
         width="match_parent"
         orientation="vertical">
           <TextView
            height="wrap_content"
            width="wrap_content"
            text="Percentage"
            textAllCaps="true"
            textStyle={window.__TextStyle.textStyle.HINT.SEMI}
            margin="0,0,0,3"/>
            <EditText
            width="match_parent"
            height="wrap_content"
            inputType="numeric"
            singleLine="true"
            maxLine="1"
            hint="(Optional)"
            onChange={this.setPercentage}
            id = {this.idSet.percentageText}
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
            <LinearLayout
            height="34"
            width="1"/>
         </LinearLayout>

         <LinearLayout
         height="wrap_content"
         width="match_parent"
         orientation="vertical">
           <TextView
            height="wrap_content"
            width="wrap_content"
            text="Grade"
            textAllCaps="true"
            textStyle={window.__TextStyle.textStyle.HINT.SEMI}
            margin="0,0,0,3"/>
            <EditText
            width="match_parent"
            height="wrap_content"
            singleLine="true"
            maxLine="1"
            hint="(Optional)"
            onChange={this.setGrade}
            id = {this.idSet.gradeText}
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
            <LinearLayout
            height="34"
            width="1"/>
         </LinearLayout>

         <LinearLayout
         height="wrap_content"
         width="match_parent"
         orientation="vertical">
         <LinearLayout
         height="wrap_content"
         width="match_parent"
         orientation="horizontal">
            <TextView
            height="wrap_content"
            width="wrap_content"
            text="Instution Name"
            textStyle={window.__TextStyle.textStyle.HINT.SEMI}
            margin="0,0,0,3"/>
            <TextView
            height="wrap_content"
            width="wrap_content"
            text=" *"
            color="#FF0000"
            margin="0,0,0,3"/>
          </LinearLayout>
            <EditText
            width="match_parent"
            height="wrap_content"
            singleLine="true"
            maxLine="1"
            onChange={this.setInitution}
            id = {this.idSet.inititutionText}
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
            <LinearLayout
            height="34"
            width="1"/>
         </LinearLayout>

         <LinearLayout
         height="wrap_content"
         width="match_parent"
         orientation="vertical">
           <TextView
            height="wrap_content"
            width="wrap_content"
            text="Board/University"
            textAllCaps="true"
            textStyle={window.__TextStyle.textStyle.HINT.SEMI}
            margin="0,0,0,3"/>
            <EditText
            width="match_parent"
            height="wrap_content"
            singleLine="true"
            maxLine="1"
            onChange={this.setBoardOrUniversity}
            id = {this.idSet.boardOrUniversityText}
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
            <LinearLayout
            height="34"
            width="1"/>
         </LinearLayout>
       </LinearLayout>
    );
  }

  getUi() {
    return (
      <LinearLayout
        width="match_parent"
        height="match_parent"
        root="true"
        orientation="vertical">
            {this.getToolbar()}

            <RelativeLayout
            height="match_parent"
            width="match_parent"
            orientation="vertical"
            background="#ffffff">
              <LinearLayout
                width="match_parent"
                height="match_parent"
                orientation="vertical">
                  <ScrollView
                  height="match_parent"
                  width="match_parent"
                  weight="1">
                       {this.getScrollView()}
                  </ScrollView>
                  <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  weight="6"/>
              </LinearLayout>
              <LinearLayout
                width="match_parent"
                height="match_parent"
                orientation="vertical">
                <LinearLayout
                  width="match_parent"
                  height="match_parent"
                  weight="1" />
                <LinearLayout
                   height="match_parent"
                   width="match_parent"
                   weight="6"
                   orientation="vertical" >
                    <LinearLayout
                      height="wrap_content"
                      width="match_parent" />
                      {this.getLineSeperator()}

                      <LinearLayout
                       height="match_parent"
                       width="match_parent"
                       padding="6, 6, 6, 6"
                       background="#ffffff"
                       orientation="horizontal"
                       id={this.idSet.saveButtonParent}>
                          <LinearLayout
                          height="match_parent"
                          width="match_parent"
                          id={this.idSet.saveButtonContainer}
                          onClick={ this.handleSaveClick }>
                              <LinearLayout
                              height="match_parent"
                              width="match_parent"
                              gravity="center"
                              cornerRadius="5,5,5,5"
                              background={window.__Colors.FADE_BLUE}
                              id={this.idSet.saveButton}>
                                  <TextView
                                  text="Save"
                                  gravity="center"
                                  style={window.__TextStyle.textStyle.CARD.TITLE.LIGHT}/>
                              </LinearLayout>
                          </LinearLayout>
                      </LinearLayout>
                    </LinearLayout>
              </LinearLayout>


            </RelativeLayout>
      </LinearLayout>
    )
  }

  render() {
    this.layout = (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        id={this.idSet.educationPopUpParent}
        visibility="gone"
        gravity="center">
            {this.getUi()}
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = EducationPopUp;
