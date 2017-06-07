var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var ModulesContainer = require('../../components/Sunbird/ModulesContainer');
var VideoCard = require('../../components/Sunbird/VideoCard');
var SearchToolbar = require('../../components/Sunbird/SearchToolbar');
var FilterComponent = require('../../components/Sunbird/FilterComponent');
var objectAssign = require('object-assign');
var RecommendedContainer = require('../Sunbird/RecommendedContainer');

window.R = require("ramda");
var _this;

class ResourceComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.setIds([
      "parentContainer",
      "filterContainer"
    ]);
    _this = this;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_filter" },
        { imageUrl: "ic_action_notification_blue" }
      ]
    }
    this.dummyData = [{
      moduleData: "Assignments",
      imageUrls: "ic_assignment_module"
    }, {
      moduleData: "Refference Chapters",
      imageUrls: "ic_reference"
    }, {
      moduleData: "Quiz",
      imageUrls: "ic_action_completed"
    }, {
      moduleData: "Tutorial",
      imageUrls: "ic_action_close"
    }, {
      moduleData: "TextView",
      imageUrls: "ic_action_overflow"
    }, {
      moduleData: "EditText",
      imageUrls: "ic_action_close"
    }, {
      moduleData: "ImageView",
      imageUrls: "ic_action_completed"
    }]

    this.recommendedData = {
      title: "Text Books",
      data: [{
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      }, {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      }, {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      }, {
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      }, {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      }, {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      }]
    }

    if (this.props.response != undefined) {
      var tmp = this.props.response;
      //tmp = tmp.substring(1, tmp.length - 1);
      console.log("THIS IS WHAT WE HAVE ", tmp)
      var response = JSON.parse(tmp)
      this.sectionData = response.result.sections;
      console.log("GOT SECTION DATA :", this.sectionData)
    } else {
      console.log("EMPTY BODY")
    }


  }


  getScreenHead = () => {

    return (<LinearLayout
      height="222"
      background="#F5515F"
      width="match_parent"
      padding="16,22,16,22"
      orientation="vertical">
        <LinearLayout
          weight="1"
          width="match_parent">
          <ViewWidget
            weight="1"/>
          <ImageView
            height="24"
            width="24"
            imageUrls={"ic_subject"}/>
          <TextView
            width="wrap_content"
            text="Subjects"
            textStyle={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
        </LinearLayout>

        <ImageView
              height="48"
              width="48"
              margin="0,0,0,16"
              imageUrls="ic_flask"/>

        <TextView
          text="Organic Chemistry"
          textStyle={window.__TextStyle.textStyle.HEADING.LIGHT} />

     </LinearLayout>)

  }

  handleModuleClick = (index) => {
    console.log("IN INDEX ", index)
    this.state = R.merge(this.state, { event: 'showClassroomContet' })
    window.__runDuiCallback({ action: "showClassroomContet" });
  }

  handleMenuClick = (url) => {
    if (url == "ic_action_filter") {
      let cmd = _this.set({
        id: _this.idSet.parentContainer,
        visibility: "gone"
      });
      cmd += _this.set({
        id: _this.idSet.filterContainer,
        visibility: "visible"
      });

      Android.runInUI(cmd, null);
    }
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }


  getModuleContent = () => {
    return (<LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical">

           <ModulesContainer
           onClick={this.handleModuleClick}
           item={this.dummyData}
           title="Saved Resources"
           background="#F7F7F7"
           />
       </LinearLayout>)
  }


  getVideosContentHead = () => {
    return (<LinearLayout
       width = "match_parent"
       height = "wrap_content"
       >

       <TextView
        text = "Videos"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin = "0,0,0,0"
        />

        <ViewWidget
        height = "1"
        width = "0"
        weight = "1"/>

       <TextView
        text = "View All"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin = "0,0,0,0"
        />
       </LinearLayout>)
  }

  getVideosContent = () => {

    var cards = this.dummyData.map((item) => {
      return (<VideoCard
                height="wrap_content"
                item={item}
                width="match_parent"/>)
    })


    return (<LinearLayout
        height="match_parent"
        orientation="vertical"
        padding="16,0,16,0"
        width="match_parent">

        {
          this.getVideosContentHead()
        }

        {
          cards
        }

        </LinearLayout>)
  }

  handleFilterBackPress = () => {

    let cmd = _this.set({
      id: _this.idSet.parentContainer,
      visibility: "visible"
    });
    cmd += _this.set({
      id: _this.idSet.filterContainer,
      visibility: "gone"
    });

    Android.runInUI(cmd, null);

  }



  render() {
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        id={this.idSet.parentContainer}>

        <SearchToolbar
        title="Resources"
        hint="Search here"
        invert="true"
        hideBack="true"
        onMenuItemClick={this.handleMenuClick}
        menuData={this.menuData}
        onSearch={this.handleSearch}/>

        <ScrollView
          height="match_parent"
          width="match_parent"
          fillViewPort="true">

            <LinearLayout
              height="match_parent"
              width="match_parent"
              orientation="vertical">

              {
                this.getModuleContent()
              }
              <RecommendedContainer
                recommendedData = {this.recommendedData}
               />

              {
                this.getVideosContent()
              }

            </LinearLayout>

        </ScrollView>

        </LinearLayout>

        <LinearLayout
        orientation="vertical"
        width="match_parent"
        visibility="gone"
        height="match_parent"
        id={this.idSet.filterContainer}>
        <FilterComponent
        onFilterBackPress = {this.handleFilterBackPress}
        />

        </LinearLayout>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ResourceComponent;
