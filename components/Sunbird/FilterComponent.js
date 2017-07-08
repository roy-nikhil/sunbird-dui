

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var FilterCard = require('../Sunbird/FilterCard');
var DoubleRadioList = require('../Sunbird/DoubleRadioList');
var ChooseItem = require('../Sunbird/ChooseItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;
class FilterComponent extends View {
  constructor(props, children) {
    super(props, children);
    this.filterData = [
    "Standard",
    "Subject",
    "Language",
    "Author name"
    ]   
   _this=this;

  }


  getSortCard(){
    return(<LinearLayout
                    height="match_parent"
                    width="match_parent"
                    padding="0,25,0,25"
                    background={window.__Colors.WHITE}
                    orientation="vertical">
                    
                      <LinearLayout
                      width="match_parent"
                      height="wrap_content">
                      
                          <ImageView
                          width="26"
                          height="21"
                          weight="1"
                          imageUrl="ic_star_ratings_blue"/>
                          
                          <ImageView
                          width="32"
                          height="27"
                          weight="1"
                          imageUrl="ic_action_done"/>
                          
                          <ImageView
                          width="26"
                          height="25"
                          weight="1"
                          imageUrl="ic_action_calendar"/>
                      </LinearLayout>

                      <LinearLayout
                      width="match_parent"
                      height="wrap_content"
                      gravity="center_horizontal"
                      margin="0,10,0,0">
                      
                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text="Star ratings"
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLUE}
                          weight="1"/>
                        
                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text="Number of votes"
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                          weight="1"/>
                          
                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text = "Published date"
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                          weight="1"/>

                      </LinearLayout>
                  </LinearLayout>)
  }

  handleSelection = (index) =>{

  }

  

  render() {
    this.layout = (

      <RelativeLayout
      root="true"
      width="match_parent"
      height="match_parent">


      <LinearLayout
        background={window.__Colors.WHITE_F7}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title="Filter"
          onBackPress={this.props.onFilterBackPress}
          invert="true"
          width="match_parent"/>
        
            <ScrollView
              height="0"
              weight="1"
              width="match_parent">
        
                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  gravity="center_vertical"
                  orientation="vertical">
                      <TextView
                      width="wrap_content"
                      height="28"
                      margin="16,6,0,6"
                      gravity="center_vertical"
                      style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                      text="SORT BY"/>

                      {this.getSortCard()}
                      
                        
                      <TextView
                      width="wrap_content"
                      height="28"
                      gravity="center_vertical"
                      margin="16,6,0,6"
                      style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                      text="FILTER BY"/>

                      <FilterCard
                      filterData={this.filterData}
                      />

               </LinearLayout>

            </ScrollView>


      </LinearLayout>
     

      </RelativeLayout>

    )
    return this.layout.render();
  }
}

module.exports = FilterComponent;
