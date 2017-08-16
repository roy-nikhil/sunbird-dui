var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var debounce = require("debounce");
var objectAssign = require('object-assign');


var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextInputView = require('../components/Sunbird/core/TextInputView');
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var utils = require('../utils/GenericFunctions');

var _this;

window.R = require("ramda");

class UserActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.screenName = "UserActivity"

    this.setIds([
      "userForumContainer",
      "tabLayoutContainer",
      "firstNameHolder",
      "languageHolder",
      "alreadyHaveAccHolder",
      "userNameHolder",
      "passwordHolder",
      "needAccHolder",
      "forgotPasswordHolder",
      "signInHolder",
      "signUpHolder",
      "mobileNumberHolder",
      "emailHolder",
      "parentContainer"

    ]);
    this.backPressCount = 0;
    this.shouldCacheScreen=false;
    
    this.isLoginMode = true;
    this.language = "English";
    this.userName = this.userPass = this.firstName = "";
    _this = this;

    this.deepLinkCollectionDetails="";

    window.__loginCallback=this.getLoginCallback;

    window.__onContentImportResponse = this.getImportStatus;
  }

  getImportStatus = (response) => {

    console.log("response for import",response);

    if(response != "ALREADY_EXIST"){
      var jsonResponse = JSON.parse(response);
      var identifier;
      if(jsonResponse.identifier != undefined){
         identifier = jsonResponse.identifier;
         _this.handleDeepLinkAction(identifier);
      }
    }else{
        JBridge.showToast("Imported Successfully","short");
        console.log("Successfully IMPORTED CONTENT")
        var whatToSend = []
        var event = { tag: "OPEN_MainActivity", contents: whatToSend };
        window.__runDuiCallback(event);
    }
  
  }


  handleDeepLinkAction = (identifier) =>{
    var callback = callbackMapper.map(function(data) {
        var item = JSON.parse(data[0]);
        console.log("Callback data in userActivity",item);

        if(item.contentType.toLowerCase() == "course"){

          console.log("Content type is course",item.contentData);

          var whatToSend={course:JSON.stringify(item.contentData)};
          var event={tag:"OPEN_DeepLink_CourseInfo",contents:whatToSend}
          window.__runDuiCallback(event);
        }
        else if(item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook"){

          var itemDetails = JSON.stringify(item.contentData);
          _this.deepLinkCollectionDetails = itemDetails;

          console.log("Content type is collecion or TextBook",_this.deepLinkCollectionDetails);

          var whatToSend={course:_this.deepLinkCollectionDetails};
          var event={tag:"OPEN_Deeplink_CourseEnrolled",contents:whatToSend}
          window.__runDuiCallback(event);

          // var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken} 
          // var event ={ "tag": "API_EnrolledCourses", contents: whatToSend};
          // window.__runDuiCallback(event);

        }
        else
        {
        var resDetails ={};
        var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");

        resDetails['imageUrl'] = item.hasOwnProperty("contentData") ?"file://"+item.basePath+"/"+item.contentData.appIcon : item.appIcon;
        resDetails['title'] = item.name;
        resDetails['description'] = item.description;
        resDetails['headFooterTitle'] = headFooterTitle;
        resDetails['identifier'] = item.identifier;
        resDetails['content'] = item;

        console.log("resourceDetails IN UserActivity",resDetails);

        var whatToSend = {resource:JSON.stringify(resDetails)}
        var event = {tag:"OPEN_Deeplink_ResourceDetail",contents:whatToSend}
        window.__runDuiCallback(event); 
        }


    });

    JBridge.getContentDetails(identifier,callback)
  }

  onPop = () => {
    this.backPressCount = 0;
    this.language = "English";
    this.userName = this.userPass = this.firstName = "";
    Android.runInUI(
      this.animateView(),
      null
    );

  }



  getLoginCallback = (response) => {
    console.log("GOT LOGIN RESPONSE ",response)
    
    window.__LoaderDialog.hide()

    if(!this.enableLoginCallback){
      return;
    }

    try{
    var arr=response.split('.');
    var contentBody=atob(arr[1]);

    contentBody=JSON.parse(contentBody);

    this.userToken=contentBody.sub;
    this.userName=contentBody.given_name;

    window.__userToken=contentBody.sub;
    JBridge.showSnackBar(window.__S.WELCOME_ON_BOARD.format(contentBody.given_name))
    JBridge.setProfile(this.userToken);
    this.setDataInStorage();

    this.performLogin();
    }catch(e){
     //console.log(e.message)
     JBridge.showSnackBar(window.__S.ERROR_INVALID_EMAIL)
   }

  }

  setDataInStorage = () => {
    JBridge.setInSharedPrefs("user_id", this.userToken);
    JBridge.setInSharedPrefs("user_name", this.userName);
    JBridge.setInSharedPrefs("user_token", this.userToken);
  }

  performLogin = () => {
    this.setLoginPreferences();
    var whatToSend = []
    var event = { tag: "OPEN_MainActivity", contents: whatToSend };
    window.__runDuiCallback(event);
  }


  setLoginPreferences = () =>{
    JBridge.setInSharedPrefs("logged_in","YES");
    window.__userToken=JBridge.getFromSharedPrefs("user_token");
    JBridge.setProfile(window.__userToken);
  }




  onBackPressed = () => {
    this.backPressCount++;
    if (this.backPressCount == 1) {
      JBridge.showSnackBar(window.__S.BACK_TO_EXIT)
    }
    if (this.backPressCount > 1) {
      JBridge.closeApp();
    }
    setTimeout(() => {
      this.backPressCount = 0
    }, 1500)
  }


  handleStateChange = (state) => {
    window.__LoaderDialog.hide();
    var status = state.response.status[0];
    var response = JSON.parse(utils.decodeBase64(state.response.status[1]));
    var responseCode = state.response.status[2];
    var responseUrl = state.response.status[3];

    
    if(responseCode == 401){
      var callback  = callbackMapper.map(function(token){
        window.__apiToken = token;
        if(state.responseFor == "API_SignUp"){
          _this.handleSignUpClick();
        }
         
      });
      JBridge.getApiToken();
      return;
        }
    
    
    if (responseCode == 501) {
      JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION)
      return;
    }
    

    if (status === "failure" || status=="f") {
      if (response.params.err) {
        console.log("\n\nEROR  :", response.params)
        JBridge.showSnackBar(response.params.errmsg)
        return;
      }
      JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION)
      return;
    }

   

    var result = response.result;

    

    switch (state.responseFor + "") {
      case "API_SignUp":
        if (result.response == "SUCCESS") {
          JBridge.showSnackBar(window.__S.WELCOME_ON_BOARD.format(this.userName))
          JBridge.setInSharedPrefs("user_name", this.userFirstName);
          JBridge.setInSharedPrefs("user_token", result.userId);
          window.__pressedLoggedOut=true;
          this.userToken=result.userId;
          this.setDataInStorage();
          JBridge.setProfile(this.userToken);
          this.performLogin()

        } else {
          JBridge.showSnackBar(window.__S.RETRY_ACTION)
        }


        break;
      // case "API_EnrolledCourses":
      //   console.log("API_EnrolledCourses in userActivity")
      //   window.__enrolledCourses = response.result.courses;

      //   console.log("DEEPLINK COURSE DETAILS",this.deepLinkCollectionDetails);

      //   if(this.deepLinkCollectionDetails != undefined){
      //     var whatToSend={course:this.deepLinkCollectionDetails};
      //     var event={tag:"OPEN_Deeplink_CourseEnrolled",contents:whatToSend}
      //     window.__runDuiCallback(event);
      //   }
        
      //   break;
      default:
        console.log("default SWITCH")
        break;


    }


  }


  updateFirstName = (data) => {
    this.firstName = data;
  }

  updateLanguage = (data) => {
    this.language = data;
  }

  updateMobileNumber = (data) => {
    this.mobileNumber = data;
  }

  updateEmail = (data) => {
    this.email = data;
  }

  updateUserPassword = (data) => {
    this.userPass = data;
  }
  updateUserName = (data) => {
    this.userName = data;
  }

  updateLanguage = (data) => {
    this.language = data;
  }

  toggleSignUpForm = () => {

    // JBridge.showSnackBar("Logged out")
    // JBridge.setInSharedPrefs("logged_in","NO");
    // JBridge.setInSharedPrefs("user_id", "__failed");
    // JBridge.setInSharedPrefs("user_name",  "__failed");
    // JBridge.setInSharedPrefs("user_token",  "__failed");

    // console.log("IN P1 ",window.__pressedLoggedOut)
    // window.__pressedLoggedOut=true;
    // console.log("IN P2 ",window.__pressedLoggedOut)
    // JBridge.keyCloakLogout(window.__apiUrl + "/auth/realms/sunbird/protocol/openid-connect/logout");
    
    // window.__Logout();

    // return
    this.isLoginMode = !this.isLoginMode;
    var visibilityVal= this.isLoginMode?"gone":"visible"
    var oppVisibilityValue = !this.isLoginMode?"gone":"visible"
    var cmd = this.set({
      id: this.idSet.userForumContainer,
      visibility: visibilityVal
    });
   
    cmd += this.set({
      id: this.idSet.signUpHolder,
      visibility: visibilityVal
    });
    cmd += this.set({
      id: this.idSet.signInHolder,
      visibility: oppVisibilityValue
    });
    cmd += this.set({
      id: this.idSet.needAccHolder,
      visibility: oppVisibilityValue
    });
    cmd += this.set({
      id: this.idSet.alreadyHaveAccHolder,
      visibility: visibilityVal
    });
    Android.runInUI(cmd, 0);

  }

  handleSignUpClick = () => {
     if (!JBridge.isNetworkAvailable()) {
        JBridge.showSnackBar(window.__S.NO_INTERNET)
        return;
      }

    this.firstName=this.firstName.trim();
    this.userName=this.userName.trim();
    this.email=this.email.trim();
    this.userPass=this.userPass.trim();
    this.userPass=this.userPass.trim();
    this.mobileNumber=this.mobileNumber.trim();



    if (this.firstName.length <= 0) {
      JBridge.showSnackBar(window.__S.ERROR_EMPTY_FIRSTNAME);
      return;
    }  else if (this.userName.length <= 0) {
      JBridge.showSnackBar(window.__S.ERROR_EMPTY_USERNAME);
      return;
    } else if (this.email.length <= 0) {
      JBridge.showSnackBar(window.__S.ERROR_EMPTY_EMAIL);
      return;
    } else if (!(this.email.indexOf("@") !== -1) || !(this.email.indexOf(".") !== -1)) {
      JBridge.showSnackBar(window.__S.ERROR_EMAIL_FORMAT);
      return;
    }else if (this.userPass.length <= 0) {
      JBridge.showSnackBar(window.__S.ERROR_EMPTY_PASSWORD);
      return;
    } else if (this.userPass.length < 8) {
      JBridge.showSnackBar(window.__S.ERROR_SHORT_PASSWORD);
      return;
    } else if (this.mobileNumber.length <= 0) {
      JBridge.showSnackBar(window.__S.ERROR_EMPTY_MOBILE);
      return;
    } else if (this.mobileNumber.length < 10 || this.mobileNumber.length > 10) {
      JBridge.showSnackBar(window.__S.ERROR_SHORT_MOBILE);
      return;
    } else if (this.language.length <= 0) {
      JBridge.showSnackBar(window.__S.ERROR_EMPTY_LANGUAGE);
      return;
    }

    if (this.userName.length > 0 && this.userPass.length > 0 && this.firstName.length > 0 && this.language.length > 0 && this.email.length > 0 && this.mobileNumber.length > 0) {
      window.__LoaderDialog.show() 
      var requestBody = {
        "userName": this.userName,
        "firstName": this.firstName,
        "password": this.userPass,
        "language": ["English"],
        "phone": this.mobileNumber,
        "email": this.email
        
      };
      requestBody=JSON.stringify(requestBody);
      var whatToSend = {
        "request" : requestBody,
        "api_token": window.__apiToken
      }
      var event = { "tag": "API_SignUp", "contents": whatToSend };
      window.__runDuiCallback(event);

    } else {
      JBridge.showSnackBar(window.__S.ERROR_INPUT_FORM);
    }

  }

  handleLoginClick = () => {
    
    console.log(window.__loginUrl , "/auth/realms/sunbird/protocol/openid-connect/auth","\nandroid");

    JBridge.keyCloakLogin(window.__loginUrl + "/auth/realms/sunbird/protocol/openid-connect/auth","android");
  }

  handleForgotPasscode = ()=>{
      JBridge.showSnackBar(window.__S.COMING_SOON);
  }






  getTopLayout = () => {
    return (<LinearLayout
      height="wrap_content"
      width="match_parent"
      padding="12,20,12,20"
      gravity="center"
      orientation="vertical">

        <ImageView
        height="60"
        width="60"
        imageUrl={"ic_launcher"}/>

        <TextView
          width="match_parent"
          text={window.__S.WELCOME_M1}
          gravity="center"
          margin="0,12,0,6"
          style={window.__TextStyle.textStyle.HEADING.DARK}/>

        <TextView
          width="match_parent"
          gravity="center"
          text={window.__S.WELCOME_M2}
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

      </LinearLayout>)
  }

  getOptions = () => {
    return (
      <LinearLayout
            height="wrap_content"
            width="match_parent"
            gravity="center"
            margin="24,0,24,0"
            >
            
                
              <LinearLayout
                height="wrap_content"
                width="wrap_content"
                background={window.__Colors.THICK_BLUE}
                stroke={"5,"+window.__Colors.THICK_BLUE}
                cornerRadius="5">
                  <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  padding="15,8,15,8"
                  gravity="center"
                  id={this.idSet.signInHolder}
                  visibility={this.isLoginMode?"visible":"gone"}
                  onClick={this.handleLoginClick}>

                    <TextView
                      style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                      text={window.__S.SIGN_IN}/>
                  </LinearLayout>
                  <LinearLayout
                      height="match_parent"
                      width="match_parent"
                      padding="15,8,15,8"
                      gravity="center"
                      id={this.idSet.signUpHolder}
                      visibility={this.isLoginMode?"gone":"visible"}
                      onClick={this.handleSignUpClick}>

                    <TextView
                      text={window.__S.SIGN_UP}
                      style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
                  </LinearLayout>

               </LinearLayout>



           </LinearLayout>)
  }


  getForum = () => {
    //TextInputView be carefull with the margin, internal EditText position might break

    return (
      <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical"
          id={this.idSet.userForumContainer}
          gravity="center"
          visibility={this.isLoginMode?"gone":"visible"}
          root="true">
      <ScrollView
        height="match_parent"
        width="match_parent"
        fillViewPort="true"
        
        gravity="center"
        >
        <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical"
          padding="0,40,0,50"
          gravity="center"
          root="true">

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.firstNameHolder}>

                <TextInputView
                  height="wrap_content"
                  width="match_parent"
                  hintText={window.__S.FIRST_NAME_HINT}
                  labelText={window.__S.FIRST_NAME}
                  margin="20,0,24,12"
                  _onChange={this.updateFirstName}/>

            </LinearLayout>

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.userNameHolder}>

              <TextInputView
                height="wrap_content"
                width="match_parent"
                hintText={window.__S.HINT_USER_NAME}
                labelText={window.__S.USER_NAME}
                margin="20,0,24,12"
                _onChange={this.updateUserName}/>

            </LinearLayout>

             <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.emailHolder}
              >


                <TextInputView
                  height="wrap_content"
                  width="match_parent"
                  hintText={window.__S.HINT_EMAIL_ID}
                  labelText={window.__S.EMAIL_ID}
                  margin="20,0,24,12"
                  _onChange={this.updateEmail}/>

            </LinearLayout>

             <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.passwordHolder}>


                <TextInputView
                    height="wrap_content"
                    width="match_parent"
                    hintText={window.__S.HINT_PASSWORD}
                    labelText={window.__S.PASSWORD}
                    inputType="password"
                    margin="20,0,24,12"
                    _onChange={this.updateUserPassword}/>

              </LinearLayout>      

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.mobileNumberHolder}>

              <TextInputView
                hintText={window.__S.HINT_MOBILE_NUMBER}
                labelText={window.__S.MOBILE_NUMBER}
                margin="20,0,24,12"
                inputType="numeric"
                _onChange={this.updateMobileNumber}/>

            </LinearLayout>

            <LinearLayout
              height="wrap_content"
              width="match_parent"
              id={this.idSet.languageHolder}>

            </LinearLayout>

            

         </LinearLayout>

       </ScrollView>
       </LinearLayout>)
  }


  getSignUpSection = () => {
    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        clickable="true"
        gravity="center_horizontal"
        root="true">
           <TextView
            height="wrap_content"
            width="match_parent"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.alreadyHaveAccHolder}
            onClick={this.toggleSignUpForm}
            visibility={this.isLoginMode?"gone":"visible"}
            textFromHtml= {"<font color='#007AFF'><a href=''>"+window.__S.ALREADY_HAVE_ACC+"</a></font>"}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

          <TextView
            height="wrap_content"
            width="match_parent"
            padding="0,10,0,10"
            gravity="center"
            id={this.idSet.needAccHolder}
            onClick={this.toggleSignUpForm}
            visibility={this.isLoginMode?"visible":"gone"}
            textFromHtml= {"<font color='#007AFF'><a href=''>"+window.__S.NO_ACC_YET+"</a></font>"}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

        </LinearLayout>)
  }


  getBody = () =>{
    return (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        clickable="true"
        padding="0,12,0,0"
        background={window.__Colors.WHITE}
        height="match_parent">

         <LinearLayout
          height="0"
          weight="1"
          root="true"
          layoutTransition="true"
          width="match_parent"
          gravity="center"
          orientation="vertical">

         {this.getTopLayout()}

       

         {this.getForum()}


        </LinearLayout>

        {this.getOptions()}

        <LinearLayout
          height="wrap_content"
          width="match_parent"
          gravity="center_horizontal"
          padding="12,12,12,12"
          orientation="vertical">


          {this.getSignUpSection()}
         </LinearLayout>



      </LinearLayout>);
  }


  afterRender = () =>{

    if(("YES"==JBridge.getFromSharedPrefs("logged_in"))){

      if("__failed" != JBridge.getFromSharedPrefs("intentFilePath")){

          console.log("INSIDE FILE PATH INTENT");
       
          var filePath = JBridge.getFromSharedPrefs("intentFilePath");
          JBridge.importEcar(filePath);

          JBridge.setInSharedPrefs("intentFilePath", "__failed");

          _this.setLoginPreferences();



      }else if("__failed" != JBridge.getFromSharedPrefs("intentLinkPath")){

          console.log("INSIDE LINK INTENT");

          var output = JBridge.getFromSharedPrefs("intentLinkPath");

          console.log("Intent from link",output)
          JBridge.setInSharedPrefs("intentLinkPath", "__failed");
          
          var identifier = output.substr(output.indexOf('do'),output.length);
          _this.setLoginPreferences();
          _this.handleDeepLinkAction(identifier);


      }
      else {
          console.log("ALREADY LOGGED IN");
          this.performLogin();
      }


    }else{
      console.log("NOT LOGGED IN");
      this.replaceChild(this.idSet.parentContainer,this.getBody().render(),0);
    }

  }

  render() {
    this.layout = (

        <LinearLayout
        root="true"
        id={this.idSet.parentContainer}
        width="match_parent"
        height="match_parent">
          <LinearLayout
            height="match_parent"
            width="match_parent"
            gravity="center"
            orientation="vertical">

               <ImageView
                height="250"
                width="250"
                layout_gravity="center"
                imageUrl="ic_launcher"/>
              <TextView
                text={window.__S.SPLASH_MESSAGE}
                margin="20,120,20,20"
                layout_gravity="center"
                height="wrap_content"/>

           </LinearLayout>
      </LinearLayout>

    );

    return this.layout.render();
  }
}

              // <TextInputView
              //   hintText={window.__S.HINT_LANGUAGE}
              //   labelText={window.__S.LANGUAGE}
              //   margin="20,0,24,12"
              //   text="English"
              //   _onChange={this.updateLanguage}/>


module.exports = Connector(UserActivity);
