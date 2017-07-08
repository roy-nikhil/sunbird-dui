

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
var CourseCard = require('../Sunbird/CourseCard');


class PopularCourses extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);

    this.data = 
      [{
        "imageUrl":"http://m.rgbimg.com/cache1nyMIz/users/w/we/weirdvis/600/mg13M24.jpg",
        "moduleText":"Organic Chemistry for Std VII",
        "stars":"(4 stars)",
        "votes":"(2,350 votes)",
        "type":"course"
      },
      {
        "imageUrl":"http://m.rgbimg.com/cache1nyMIz/users/w/we/weirdvis/600/mg13M24.jpg",
        "moduleText":"Organic Chemistry for Std VII",
        "stars":"(4 stars)",
        "votes":"(2,350 votes)",
        "type":"course"
      },
      {
        "imageUrl":"http://m.rgbimg.com/cache1nyMIz/users/w/we/weirdvis/600/mg13M24.jpg",
        "moduleText":"Organic Chemistry for Std VII",
        "stars":"(4 stars)",
        "votes":"(2,350 votes)",
        "type":"course"
      }
      ];
    
  }


  afterRender = () => {

  }

  getRows = () =>{
    var rows = this.data.map((item,i) => {
         return (<CourseCard 
                 data={item}
                 onCourseClick = {this.handleCourseClick}
                 onCourseOpenClick = {this.handleCourseOpenClick}/>)
                 
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
            text="Popular"
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>


            </LinearLayout>)
  }


    handleCourseClick = (courseName)=>{
        console.log("course selected",courseName);
    }

    handleCourseOpenClick = (courseName)=>{
        console.log("course open selected",courseName);
    }

    handleResourceClick = (resourceName)=>{
        console.log("resource selected",resourceName);
    }

    handleResourceOpenClick = (resourceName)=>{
        console.log("resource open selected",resourceName);
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

module.exports = PopularCourses;
