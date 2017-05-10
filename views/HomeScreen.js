var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ViewPager = require("@juspay/mystique-backend").androidViews.ViewPager;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var objectAssign = require('object-assign');

var BottomNavBar = require("../components/Sunbird/BottomNavBar")

var ChooseCourseComponent = require("../components/Sunbird/ChooseCourseComponent")
var ClassRoomHomeComponent = require("../components/Sunbird/ClassRoomHomeComponent")
var HomeComponent = require('../components/Sunbird/HomeComponent');
var ProfileActivityComponent = require('../components/Sunbird/ProfileActivityComponent');

window.R = require("ramda");

class HomeScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.setIds([
      "viewPagerContainer",
      "tabLayoutContainer",
    ]);
    this.Homedata = {
      name: "Andy"
    }
    this.recommendedData = ["Organic Chemistry for Standard VII", "Molecular Reactions for Beginners", "Intermediate Metallurgy", "My Module"];
    this.imageUrls = ["ic_flask_black", "ic_molecule_black", "ic_metallurgy_black", "ic_flask_black"];

    this.screenName = "HOME_SCREEN"
    this.data = ["HOME", "COURSES", "CLASSROOM", "FORUM", "PROFILE"];
    this.tabValues = [{
        name: "HOME",
        select: "1",
        icon: "ic_home"
      }, {
        name: "COURSES",
        select: "0",
        icon: "ic_courses"
      }, {
        name: "CLASSROOM",
        select: "0",
        icon: "ic_notebook"
      }, {
        name: "FORUM",
        select: "0",
        icon: "ic_chat"
      }, {
        name: "PROFILE",
        select: "0",
        icon: "ic_profile"
      }

    ]
  }


  handleCourseInfoClick = (data) => {
    this.state = R.merge(this.state, { event: 'showCourseInfo' })
    window.__runDuiCallback({ action: "showCourseInfo" });
  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {

    var tabData = [];
    var jso = [];
    var tmp;
    this.color = "#123123"
    var tabItems = this.data.map((item, index) => {
      switch (index) {
        case 0:
          tmp = (<HomeComponent
              recommendedData={this.recommendedData}
              imageUrls={this.imageUrls}
              data={this.Homedata}/>)
          break;
        case 1:
          tmp = (<ChooseCourseComponent
                  showScreen = {this.handleCourseInfoClick}
                  height="match_parent"
                  width="match_parent" />)
          break;
        case 2:
          tmp = (<ClassRoomHomeComponent
                  showScreen = {this.props.showScreen}
                  height="match_parent"
                  width="match_parent" />)
          break;
        case 3:
          tmp = (<LinearLayout
                    height="match_parent"
                    width="match_parent">
                      <TextView
                        text={item}
                        background={this.color}
                        color="#ffffff"
                        height="match_parent"
                        width="match_parent"
                        gravity="center" />
                </LinearLayout>)
          break;

        default:
          tmp = (<LinearLayout
                  height="match_parent"
                  width="match_parent">
                    <TextView
                      text={item}
                      background={this.color}
                      color="#ffffff"
                      height="match_parent"
                      width="match_parent"
                      gravity="center" />
                </LinearLayout>)
          break;
      }
      jso.push({ view: this.getView(tmp.render()), value: "", viewType: 0 });
      tabData.push({ value: item })
    });

    var callback = callbackMapper.map((params) => {
      this.handleViewPagerAction([params[0]])

    });

    JBridge.viewPagerAdapter(this.idSet.viewPagerContainer, JSON.stringify(jso), JSON.stringify(tabData), callback);

  }

  handleViewPagerAction = (index) => {
    this.bNavBar.handleNavigationChange(index);
  }

  handleBottomNavBarAction = (index) => {
    JBridge.switchToViewPagerIndex(index + "");
  }

  getBottomNavBar = () => {
    this.bNavBar = (<BottomNavBar
                      tabItems = {this.tabValues}
                      _onClick = {this.handleBottomNavBarAction} />);

    return this.bNavBar;
  }



  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <ViewPager
          height="0"
          weight="1"
          id={this.idSet.viewPagerContainer}
          width="match_parent" />



          <LinearLayout
            background={window.__Colors.WHITE}
            width="match_parent"
            orientation="vertical"
            id={this.idSet.tabLayoutContainer}
            height="56">
              <ViewWidget
                height="2"
                alpha="0.2"
                width="match_parent"
                background={window.__Colors.DARK_GRAY} />

              {this.getBottomNavBar()}
          </LinearLayout>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(HomeScreen);