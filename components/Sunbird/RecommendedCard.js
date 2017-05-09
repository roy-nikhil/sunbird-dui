var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class RecommendedCard extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";


  }


  render() {


    this.layout = (
      <LinearLayout
        width="wrap_content"
        height="match_parent"
        orientation = "vertical"
        >

          <LinearLayout
    			width="130"
    			height="100"
    			margin="16,0,0,0"
    			background = {this.props.item.moduleBackground? this.props.item.moduleBackground : "#229012FE" }
    			gravity="center"
          cornerRadius="5"
    			>
                  <ImageView
                  	height="48"
                  	width="45"
                    margin = "0,0,0,0"
                  	imageUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}
                  /> 
           </LinearLayout>
        <LinearLayout
          width="130"
          height="34"
          margin="16,12,12,6"
          >
          <TextView
                text= {this.props.item.moduleName ? this.props.item.moduleName : "Module Name"}
                style={window.__TextStyle.textStyle.HINT.BOLD}                
                />  
</LinearLayout>
    </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = RecommendedCard;
