var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');

var CourseInProgressContainer = require('../../components/Sunbird/CourseInProgressContainer');
var CourseContainer = require('../../components/Sunbird/CourseContainer');
var _this;
class CourseFragment extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer",
      "fetchingHolder",
      "scrollViewContainerCourse"
    ]);
    _this = this;

    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" },
        { imageUrl: "ic_action_filter" }
      ]
    }
    this.enrolledCourses = []
    window.setEnrolledCourses = this.setEnrolledCourses;
  }


  setEnrolledCourses = (list) => {
    this.enrolledCourses = list;

    window.__UpdateUserCourses(this.enrolledCourses);
  }


  checkIfEnrolled = (identifier) => {
    var enrolled = false;

    this.enrolledCourses.map((item) => {

      if (item.identifier === identifier) {
        enrolled = true;
      } else if (item.contentId === identifier) {
        enrolled = true;
      } else if (item.courseId === identifier) {
        enrolled = true;
      }
    })
    return enrolled;
  }




  handleResponse = () => {

      console.log("SERVER GAVE RESPONSE", this.props.response)
      if(this.props.response===undefined) {
        return;
      }

      this.details = this.props.response.result.response;
      if (!this.details.hasOwnProperty("name")) {
        JBridge.showSnackBar("Error Fetching Data");
        return;
      }

      if(this.details.sections==undefined && this.details.sections.length==0){
          JBridge.showSnackBar("Error Fetching Data");
          return;
      }

      Android.runInUI(this.set({
        id :this.idSet.fetchingHolder,
        visibility : "gone"
      }),0);
      var emptyBody =(<LinearLayout
                          layoutTransition="true"
                          height="match_parent"
                          width="match_parent"/>)
      this.replaceChild(this.idSet.parentContainer, emptyBody.render(), 0)

      var rows=this.details.sections.map((item,index) => {
          return this.getCourseCardLayout(item);
          //this.appendChild(this.idSet.parentContainer,this.getCourseCardLayout(item).render(),index);
      })


      var layout=(<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        root="true">

          {rows}

        </LinearLayout>)

      return layout;
    //this.replaceChild(this.idSet.parentContainer,layout.render(),0)


  }


  getCourseCardLayout = (item) => {

    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        root="true"
        orientation="vertical">
          {this.getSpaceSeparator()}

                  <CourseContainer
                    title={item.name}
                    data = {item.contents}
                    onCourseClick={this.handleCourseClick}/>


        </LinearLayout>)
  }


  handleCourseClick = (content, type) => {
    console.log("content in handle course click1",content)
    console.log("content in handle course click1",type)
    var tmp = JSON.stringify(content)
    var whatToSend = []
    var event = {};
    console.log("content   ",content)
    if (this.checkIfEnrolled(content.identifier)) {
      whatToSend = { "course": tmp }
      event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    } else {
      whatToSend = { "course": tmp }
      event = { tag: 'OPEN_CourseInfoActivity', contents: whatToSend }
    }
    window.__runDuiCallback(event);


  }

  handleUserCoursesClick = (content, type) => {
    console.log("content in handle course click",content)
    console.log("content in handle course click",type)
    var whatToSend = { "course": JSON.stringify(content) }
    var event = { tag: 'OPEN_EnrolledCourseActivity', contents: whatToSend }
    window.__runDuiCallback(event);
  }

  addSwipeFunction = () => {

      var callbackRefresh = callbackMapper.map(function(params) {
        window.__BNavFlowRestart();         
    });

      JBridge.addSwipeRefreshScrollView(this.idSet.scrollViewContainerCourse,callbackRefresh);
  }


  getBody = () => {

    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        afterRender={this.addSwipeFunction}
        height="match_parent">

          <SimpleToolbar
            title="Courses"
            width="match_parent"
            showMenu="true"
            invert="true"
            hideBack="true"
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}/>


            <ScrollView
              height="0"
              weight="1"
              id={this.idSet.scrollViewContainerCourse}
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  background={window.__Colors.WHITE}
                  orientation="vertical">


                  <CourseInProgressContainer
                    transparent="true"
                    title="Courses In Progress"
                    onCourseClick={this.handleUserCoursesClick}/>


                  {this.handleResponse()}

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
    )
  }

  handleMenuClick = (url) => {

    if (url == "ic_notification_red") {
      JBridge.showSnackBar("Comming Soon")
    }
    else if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Course" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) } 
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend}
      window.__runDuiCallback(event);

    }
     else if (url == "ic_action_filter") {
      window.__PageFilterPopup.resetPopup("Cource");
      window.__PageFilterPopup.show();
    }
  }


  getSpaceSeparator = () => {
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }


  render() {
    this.layout = (
        <LinearLayout
          root="true"
          orientation="vertical"
          width="match_parent"
          height="match_parent">

          {this.getBody()}

        </LinearLayout>



    )

    return this.layout.render();
  }
}



module.exports = CourseFragment;
