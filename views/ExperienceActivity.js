var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var TextInputView = require("../components/Sunbird/core/TextInputView");
var Spinner = require("../components/Sunbird/core/Spinner");
var RadioButton = require("../components/Sunbird/core/RadioButton");
var CheckBox = require("@juspay/mystique-backend/src/android_views/CheckBox");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var FeatureButton = require("../components/Sunbird/FeatureButton");
var PageOption = require("../components/Sunbird/core/PageOption")
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Styles = require("../res/Styles");
var MultiSelectSpinner = require('../components/Sunbird/MultiSelectSpinner');
var SimplePopup = require("../components/Sunbird/core/SimplePopup");
let IconStyle = Styles.Params.IconStyle;


var _this;

class ExperienceActivity extends View{
  constructor(props, children, state) {
    super(props, children, state);
    this.setIds([
      "experiencePopUpParent",
      "joiningDateText",
      "joiningDateLayout",
      "closingDateText",
      "closingDateLayout",
      "scrollView",
      "saveButton",
      "saveButtonParent",
      "jobText",
      "positionText",
      "organizationText",
      "subjectContainer",
      "spinnerContainer",
      "delButton",
      "delButtonParent",
      "subjectSpinner",
      "subjectSpinnerContainer",
      "jobTypeRadioContainer",
      "deleteConf"
    ]);
    this.shouldCacheScreen = false;
    this.state=state;
    this.screenName="AddressActivity"
    try{
      this.data = JSON.parse(this.state.data.value0.profile);
      }catch(e){
        this.data="";
      }
    this.spinnerArray = ["Select","Bengali","English","Gujarati","Hindi","Kannada","Marathi","Punjabi","Tamil"];
    this.subjectArray = ["Select","Assamese","Bengali","English","Gujarati","Hindi","Kannada","Malayalam","Marathi","Maths","Nepali","Oriya","Punjabi","Tamil","Telugu","Urdu"];
    this.selecteSubject = [];
    this.array="Select,Bengali,English,Gujarati,Hindi,Kannada,Marathi,Punjabi,Tamil";
    _this=this;
    this.props=props;
    this.subjects=[];
    this.jobName="";
    this.Organization="";
    this.Position="";
    this.joiningDate="";
    this.endDate="";
    this.isCurrentJob=false;
    this.singleClick =true;
    this.canSave = false;
    this.isVisible = true;
    window.__patchCallback = this.getPatchCallback ;

    this.jobProfile=[];

    this.prevData={};
    this.delete = false;

    this.delBtnState = {
      text : window.__S.DELETE,
      id : this.idSet.delButton,
      isClickable : "true",
      onClick : this.del,
      visibility : this.data ? "visible" : "gone"
    };

    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "false",
      onClick : this.sendJSONBody,
      alpha : "0.5"
    }
    this.initializeData();
 }

 initializeData = () =>{
   if(this.data!=undefined&& this.data!="")
   {
     this.prevData.jobName = this.data.jobName;
     this.prevData.Organization = this.data.orgName;
     this.prevData.Position = this.data.role;
     this.prevData.joiningDate=this.data.joiningDate;
     this.prevData.endDate=this.data.endDate;
     this.prevData.subjects = this.data.subject;
     this.prevData.isCurrentJob=this.data.isCurrentJob;
   }
   else{
       this.prevData.subjects=[];
       this.prevData.jobName="";
       this.prevData.Organization="";
       this.prevData.Position="";
       this.prevData.joiningDate=null;
       this.prevData.endDate=null;
       this.prevData.isCurrentJob=false;
       this.jobProfile = [];
    }

    this.subjects = this.prevData.subjects.slice();
    this.prevData.subjects = this.subjects.slice();
    this.jobName=this.prevData.jobName;
    this.Organization=this.prevData.Organization;
    this.Position=this.prevData.Position;
    this.joiningDate=this.prevData.joiningDate;
    this.endDate=this.prevData.endDate;
    this.isCurrentJob=this.prevData.isCurrentJob;

 }

 populateData = () =>{

  
   var jobTypeValue = [
     {name:window.__S.YES,select:"0",icon:"ic_action_radio"},
     {name:window.__S.NO,select:"0",icon:"ic_action_radio"}
   ];

   var index=-1;

   if (this.isCurrentJob) {
     jobTypeValue[0].select = "1";
     jobTypeValue[1].select = "0";
     index = 0;
     var cmd = this.set({
       id: this.idSet.closingDateLayout,
       visibility: "gone"
     });
     cmd += this.set({
       id: this.idSet.closingDateText,
       text : "Select Date"
     });
     Android.runInUI(cmd, 0);

   } else  if (this.data != undefined&&this.data!=""){
     jobTypeValue[0].select = "0";
     jobTypeValue[1].select = "1";
     index = 1;
   }

   this.replaceChild(this.idSet.jobTypeRadioContainer,
     this.getRadioButtionLayout(jobTypeValue, index).render(), 0);
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
 handleBackPressed = () =>{
  var whatToSend = []
  var event = { tag: "BACK_ExperienceActivity", contents: whatToSend};
  window.__runDuiCallback(event);
}

 getBack = () => {
   return (
     <ImageView
     margin="0,0,10,0"
     style={IconStyle}
     height="48"
     width="48"
     onClick={this.handleBackPressed}
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
                 text={window.__S.TITLE_EXPERIENCE}
                 style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
         </LinearLayout>);
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

      {this.getEditTextView(this.idSet.jobText,this.jobName, window.__S.JOB_NAME, false, this.setJobName)}
      {this.getEditTextView(this.idSet.organizationText, this.Organization,window.__S.ORGANIZATION, false, this.setOrganization)}
      {this.getEditTextView(this.idSet.positionText,this.Position,window.__S.POSITION, true, this.setPosition)}

      {this.getSpinner()}
      <LinearLayout
      height="wrap_content"
      width="wrap_content"
      id={this.idSet.jobTypeRadioContainer}>
      {this.getJobStatus()}
      </LinearLayout>
      {this.getDatePickers()}
    </LinearLayout>
   );
 }

 getDatePickers = () => {
   return (
     <LinearLayout
       height="wrap_content"
       width="match_parent"
       orientation="horizontal"
       padding = "4,0,0,0"
       margin = "0,16,0,12">

             <LinearLayout
             height="wrap_content"
             width="0"
             weight="1"
             orientation="vertical"
             id={this.idSet.joiningDateLayout}>

               <TextView
                height="wrap_content"
                width="wrap_content"
                textAllCaps="true"
                text={window.__S.FROM}
                textStyle={window.__TextStyle.textStyle.HINT.SEMI}
                margin="0,0,0,10"/>

                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  padding="4,0,12,12">

                    <ImageView
                      height="16"
                      width="16"
                      gravity="center"
                      margin="4,3,7,0"
                      imageUrl="ic_action_calendar_grey"
                      onClick={this.startCalendar}/>

                    <TextView
                      width="match_parent"
                      height="wrap_content"
                      id= {this.idSet.joiningDateText}
                      style={window.__TextStyle.textStyle.CARD.BODY.DARK.FADED}
                      text={window.__S.SELECT_DATE}
                      onClick={this.startCalendar}/>

                </LinearLayout>
             </LinearLayout>
             <LinearLayout
               height="wrap_content"
               width="0"
               weight="1"
               orientation="vertical"
               id={this.idSet.closingDateLayout}>

               <TextView
                height="wrap_content"
                width="wrap_content"
                textAllCaps="true"
                text={window.__S.TO}
                textStyle={window.__TextStyle.textStyle.HINT.SEMI}
                margin="0,0,0,10"/>

                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  padding="4,0,12,12">

                    <ImageView
                      height="16"
                      width="16"
                      gravity="center"
                      margin="4,3,7,0"
                      imageUrl="ic_action_calendar_grey"
                      onClick={this.endCalendar} />

                    <TextView
                      width="match_parent"
                      height="wrap_content"
                      id= {this.idSet.closingDateText}
                      onClick={this.endCalendar}
                      text={window.__S.SELECT_DATE}
                      style={window.__TextStyle.textStyle.CARD.BODY.DARK.FADED}/>

                </LinearLayout>
              </LinearLayout>
      </LinearLayout>
   );
 }

 getJobStatus = () => {
   return (
     <LinearLayout
     height="wrap_content"
     width="match_parent"
     padding = "4,0,0,0"
     margin = "0,0,0,12"
     orientation="vertical">
         <TextView
           height="wrap_content"
           width="wrap_content"
           margin="0,0,16,2"
           textStyle={window.__TextStyle.textStyle.HINT.SEMI}
           text={window.__S.IS_THIS_YOUR_CURRENT_JOB
           }/>

         <RadioButton
          height="wrap_content"
          width="wrap_content"
          gravity="center_vertical"
          items={[{name:window.__S.YES,select:"0",icon:"ic_action_radio"},{name:window.__S.NO,select:"0",icon:"ic_action_radio"}]}
          onClick={this.handleRadioButtonClick}/>
     </LinearLayout>
   );
 }

 getRadioButtionLayout = (item, index) => {
   return (
     <LinearLayout
     height="wrap_content"
     width="match_parent"
     padding = "4,0,0,0"
     margin = "0,0,0,12"
     orientation="vertical">
         <TextView
           height="wrap_content"
           width="wrap_content"
           margin="0,0,16,2"
           textStyle={window.__TextStyle.textStyle.HINT.SEMI}
           text={window.__S.IS_THIS_YOUR_CURRENT_JOB}/>

         <RadioButton
          height="wrap_content"
          width="wrap_content"
          gravity="center_vertical"
          items={item}
          defaultIndex={index}
          onClick={this.handleRadioButtonClick}/>
     </LinearLayout>
   );
 }

 getSpinner = () => {
   return(
     <LinearLayout
       id={this.idSet.subjectSpinnerContainer}
       height="wrap_content"
       width="match_parent"
       orientation="vertical"
       margin = "0,0,0,12">

       <TextView
        height="wrap_content"
        width="wrap_content"
        textAllCaps="true"
        text={window.__S.SUBJECTS}
        textStyle={window.__TextStyle.textStyle.HINT.SEMI}
        margin="0,0,0,8"
        padding="4,0,0,0"/>

        <MultiSelectSpinner
          id={this.idSet.subjectSpinner}
          width="match_parent"
          height="wrap_content"
          data={this.subjectArray}
          selectedData={this.subjects}
          onItemChange={this.onMultiSelectItemChange}
         />
     </LinearLayout>
   );
 }


 onMultiSelectItemChange = (data) => {
   this.subjects = data;
   if (this.checkCompleteStatus()) {
     this.enableSaveButton();
   } else {
     this.disableSaveButton();
   }
 }

 getBody = () => {
   return (
     <LinearLayout
       width = "match_parent"
       height = "match_parent"
       orientation = "vertical"
       margin = "0,0,0,24"
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

 getUi = () => {
   return (
     <RelativeLayout
       width="match_parent"
       height="match_parent"
       id = {this.idSet.experiencePopUpBody}
       gravity="center">
           {this.getBody()}
           {this.getButtons()}
     </RelativeLayout>
   );
 }


  getEditTextView = (id, text,label, optional,onChange, inputType) => {
    return (

      <TextInputView
        id = {id}
        height="wrap_content"
        width="match_parent"
        hintText={optional ?window.__S.OPTIONAL : label}
        labelText={label.toUpperCase(label)}
        mandatory = {optional ? "false" : "true"}
        margin = "0,0,0,18"
        _onChange={onChange}
        text={text}
        textStyle = {window.__TextStyle.textStyle.HINT.SEMI}
        editTextStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
        inputType = {inputType ? inputType : "text"}/>
    );
  }

  getButtons = () => {
      var buttonList = [this.delBtnState, this.saveBtnState];

    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical"
        background = "#ffffff"
        alignParentBottom = "true, -1">
        <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}/>
      </LinearLayout>
    );
  }
  del = () => {
    window.__SimplePopup.show(this.idSet.deleteConf);
    console.log("window.__SimplePopup.show()");
  }
  afterRender=()=>{
    this.populateData();
  }


 render(){
   var popUpdata = {
     title : window.__S.CONFIRM_DEL,
     content : "",
     negButtonText : window.__S.CANCEL,
     posButtonText : window.__S.DELETE
   }
   this.layout=(
     <RelativeLayout
       width = "match_parent"
       height = "match_parent"
       root = "true"
       background = "#ffffff"
       id={this.idSet.experiencePopUpParent}>
       <RelativeLayout
         width="match_parent"
         height="match_parent"
         id = {this.idSet.experiencePopUpBody}
         gravity="center">
             {this.getBody()}
             {this.getButtons()}
       </RelativeLayout>

       <LinearLayout
        width = "match_parent"
        height = "match_parent">

         <SimplePopup
            id = {this.idSet.deleteConf}
            data = {popUpdata}
            buttonClick = {this.handleConfirmDialog} />
        </LinearLayout>
     </RelativeLayout>
     );
        return this.layout.render();
     }

     handleConfirmDialog = (type) => {
       if (type == "positive") {
         this.delete = true;
         this.sendJSONBody();
       }
       window.__SimplePopup.hide(this.idSet.deleteConf);
     }

     loadSpinner = () => {
       return(<Spinner
               width="match_parent"
               height="34"
               style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
               margin="0,0,5,6"
               onItemClick = {this.handleSpinnerItemClick}
               values={this.array}/>);
     }

     handleSpinnerItemClick = (...params) => {

       if(parseInt(params[2])>0){
       this.addSubject(this.spinnerArray[parseInt(params[2])]);
       }
       if(this.checkCompleteStatus()){
          this.enableSaveButton();
       }else {
         this.disableSaveButton();
       }
     }

     getLineSeperator = () => {
       return (<LinearLayout
               width="match_parent"
               height="2"
               margin="0,0,0,0"
               background={window.__Colors.PRIMARY_BLACK_22}/>)
     }

     startCalendar =() =>{
       this.showCalendar(1);
     }

     endCalendar =() =>{
       this.showCalendar(2);
     }

     showCalendar = (index) =>{
       var _this = this;
       var temp;
       var callback = callbackMapper.map(
         function (data){

               data[0]=_this.formatDate(data[0]);
              if(index==1){
                _this.joiningDate=data[0];
                temp=_this.idSet.joiningDateText;
            }
            else{
              _this.endDate=data[0];
              temp=_this.idSet.closingDateText;
            }
            var cmd = _this.set({
              id: temp,
              text: data[0],
              style: window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK
            });


            Android.runInUI(cmd, 0);



            if(_this.checkCompleteStatus()){
              _this.enableSaveButton();
            }else {
              _this.disableSaveButton();
            }
       });

       try{
        if (index==1){
          JBridge.showCalender(callback,"",this.endDate,"");
        }
        else
        {
          JBridge.showCalender(callback,this.joiningDate,"","");
        }
       }
       catch(err){
         console.log(err , "date err");
       }
     }

     handleRadioButtonClick = () =>{
       if(window.__RadioButton!=undefined && window.__RadioButton.currentIndex==0)
       {
         if(window.__currentJobSelected != undefined && (window.__currentJobSelected == false || (window.__currentJobSelected && this.prevData.endDate == null && this.data != undefined)))
          {
               var cmd = this.set({
               id: this.idSet.closingDateLayout,
               visibility: "gone"
             });
             cmd += this.set({
               id: this.idSet.closingDateText,
               text : "Select Date"
             });
             Android.runInUI(cmd, 0);
             this.endDate=null;

             this.isCurrentJob=true;

             if(this.checkCompleteStatus())
             {
               this.enableSaveButton();
             }
             else {
               this.disableSaveButton();
             }
          }
          else {
            console.log(window.__ExperiencePopUp , " gh ");
            window.__Snackbar.show(window.__S.ERROR_MULTIPLE_CURRENT_JOB);

            var jobTypeValue = [
               {name:window.__S.YES,select:"0",icon:"ic_action_radio"},
               {name:window.__S.NO,select:"1",icon:"ic_action_radio"}
                ];


             this.replaceChild(this.idSet.jobTypeRadioContainer,
               this.getRadioButtionLayout(jobTypeValue, 1).render(), 0);

          }
       }
       else {
         var cmd = this.set({
           id: this.idSet.closingDateLayout,
           visibility: "visible"
         });
         Android.runInUI(cmd, 0);
         this.isCurrentJob=false;

         if(this.checkCompleteStatus())
         {
           this.enableSaveButton();
         }
         else {
           this.disableSaveButton();
         }
       }
     }

     getPatchCallback = (data) =>{
       data=JSON.parse(data);
       if(this.responseCame){
         return;
       }

      window.__LoaderDialog.hide();
      this.responseCame=true;
      console.log(data)
      if(data.result.response=="SUCCESS"){
        window.__LoaderDialog.show();
        window.__BNavFlowRestart();
      }else{
        this.singleClick =true;
        window.__Snackbar.show(data.params.errmsg);
      }
  }
  sendJSONBody = () => {
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return ;
    }
      console.log("inside sendJSON", this.jobProfile);
      if (this.singleClick && !this.canSave && !this.delete) {
        if (this.data)
          window.__Snackbar.show(window.__S.WARNING_PLEASE_MAKE_SOME_CHANGES);
        else
          window.__Snackbar.show(window.__S.WARNING_PLEASE_ADD_MANDATORY_DETAILS);
        return;
      }

       this.jobProfile = []
       console.log();
       if(this.data==undefined||this.data==""){
          this.json ={
            "jobName":this.jobName,
            "orgName":this.Organization,
            "role":this.Position,
            "joiningDate":this.joiningDate,
            "endDate":this.endDate,
            "subject":this.subjects,
            }
          if(window.__RadioButton.currentIndex==0){
            this.json.isCurrentJob = true;
            }
          this.jobProfile.push(this.json);
        }
        else{
          var json=  this.data;

          json.jobName=this.jobName;
          json.orgName=this.Organization;
          json.role=this.Position;
          json.joiningDate=this.joiningDate;
          json.endDate=this.endDate;
          json.subject=this.subjects;
          json.userId= window.__userToken;
          json.isDeleted = this.delete ? this.delete : null;
          json.isCurrentJob = this.isCurrentJob;
          if(json.address!=undefined)
          json.address.userId= window.__userToken;
          this.jobProfile.push(json);
          this.delete =false;
        }

        var url=window.__apiUrl + "/api/user/v1/update"

        var body = {
                  "id":"unique API ID",
                  "ts":"response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
                    "params": {},
                  "request":{
                    "userId":window.__userToken,
                    "jobProfile": this.jobProfile
                   }
                  }

      if(this.singleClick){
        this.singleClick=false;
        _this.responseCame=false;
        console.log("patchApi", body);
        JBridge.patchApi(url,JSON.stringify(body),window.__user_accessToken,window.__apiToken);
        window.__LoaderDialog.show();

       setTimeout(() => {
           if(_this.responseCame){
             return;
           }
           window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION);
           window.__LoaderDialog.hide();
           _this.responseCame=false;
       },window.__API_TIMEOUT);
     }
   }

     formatDate = (date) =>{
         date = date.substr(0,4)+"-"+date.substr(5);
         if(date.charAt(7)!='/'){
            date = date.substr(0,5)+"0"+date.substr(5);
          }
         date = date.substr(0,7)+"-"+date.substr(8);
         if(date.length<10)
           date = date.substr(0,8)+"0"+date.substr(8);
           return date;
         }

     checkCompleteStatus = () =>{
       if(this.data != undefined  && this.data!=""
          && this.jobName == this.prevData.jobName
          && this.Organization == this.prevData.Organization
          && this.Position== this.prevData.Position
          && JSON.stringify(this.subjects)==JSON.stringify(this.prevData.subjects)
          && this.joiningDate == this.prevData.joiningDate
          && this.endDate == this.prevData.endDate ){
           return false;
         }
      else if((this.data == undefined || this.data == "")
        &&(this.jobName==""|| this.Organization==""|| this.jobName == this.prevData.jobName || this.Organization == this.prevData.Organization))
        {
          return false;
        }
        return true;
     }

     enableSaveButton = () =>{
       console.log("enableSaveButton");
      var cmd = this.set({
        id: this.idSet.saveButton,
        clickable: "true",
        alpha: "1"
      });
      Android.runInUI(cmd, 0);
      this.canSave = true;
     }

     disableSaveButton = () =>{
       var cmd = this.set({
         id: this.idSet.saveButton,
         clickable: "false",
         alpha: "0.5"
       });
       Android.runInUI(cmd, 0);
       this.canSave = false;
     }

     setJobName = (data) => {
        this.jobName=data;
        if(this.checkCompleteStatus())
        {
          this.enableSaveButton();
        }
        else {
          this.disableSaveButton();
        }

     }

     setOrganization = (data) => {
       this.Organization=data;
       if(this.checkCompleteStatus())
       {
         this.enableSaveButton();
       }else {
         this.disableSaveButton();
       }
     }

     setPosition = (data) => {
       this.Position=data;
       if(this.checkCompleteStatus())
       {
         this.enableSaveButton();
       }
       else {
         this.disableSaveButton();
       }
     }
  }

module.exports = Connector(ExperienceActivity);
