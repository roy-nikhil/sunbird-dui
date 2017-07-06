var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var CardComponent = require('../Sunbird/core/CardComponent');


class ResourceContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);
    
  }


  afterRender = () => {
  }

  formatBytes = (bytes)=> {
      if(bytes < 1024) return bytes + " Bytes";
      else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
      else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
      else return(bytes / 1073741824).toFixed(3) + " GB";
  };

  getRows = () =>{
    this.data = JSON.parse(this.props.data);
    var rows = this.data.map((item,i) => {

                
                console.log("item data in getrows",item);
                var size = item.contentData.hasOwnProperty("size") ? this.formatBytes(item.contentData.size) : "N/A";
                var type = item.mimeType.split('.')[2];
                var footerTitle = type+" ["+size+"]";
               
                var temp = {};
                temp['imageUrl'] = "file://storage/emulated/0/SunbirdTest/content/domain_8808-64dd60d5-94cd-4896-a60e-11897bf69fd6/domain_8808/1461668536884adb212cfde_1465896981928.jpg";
                temp['title'] = item.contentData.name;
                temp['footerTitle'] = footerTitle;
                temp['footerSubTitle'] = "";
                temp['actionText'] = "OPEN";

         return (<CardComponent 
                 data={temp}
                 content={item.contentData}
                 onCardClick = {this.handleCardClick}/>)
    });

    var layout = (<LinearLayout
                    width="wrap_content"
                    height="wrap_content">

                    {rows}

                  </LinearLayout>);
    return layout;
                    
  }



  getHeader(){
    return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="16,16,16,16"
            orientation="horizontal">

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={this.props.title}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

            <ViewWidget
            weight="1"
            height="0"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text="View all"
            onClick={()=>{this.handleViewAllClick()}}
            style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

            </LinearLayout>)
  }


    handleCourseClick = (courseName)=>{
      this.props.onCourseOpenClick(courseName);
    }

    handleCardClick = (content,type)=>{
      window.__runDuiCallback({tag:"StartResourceDetailFlow",contents:{resourceDetails:JSON.stringify(content)}});
    }

    handleViewAllClick(){
        this.props.onViewAllClick();
    }

  render() {
      this.layout = (
        <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "wrap_content"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

           <LinearLayout
                    width="match_parent"
                    height="wrap_content">

           {this.getRows()}

         </LinearLayout>



          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = ResourceContainer;
