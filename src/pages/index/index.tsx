import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
// import Tesseract from "tesseract.js";
// import "antd/dist/antd.css";
// import { DatePicker } from "antd";
import { AtTabs, AtTabsPane, AtCard, AtList, AtListItem, AtInput, AtIcon, AtSearchBar} from "taro-ui";
import apiurl  from "../../api/Getxinwen";
import { observer, inject } from '@tarojs/mobx'


// const axios = require("axios");
// import { axios } from 'axios'
type PageStateProps = {
  session: {
    user: any,
    news: any,
    logged: Function,
    logout: Function,
    setnews: Function
  }
}

interface Index {
  props: PageStateProps;
}
@inject("session")
@observer
 class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      loading: true,
      current: 1,
      selecttitle: "头条",
      inputtitle: "头条",
      list: [{ title: "标签页1" }],
      getnews: false,
      getnewslist: false,
      listnews: [],
      newstart: 0,
      newmaxnum: 40
    };
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "新闻"
  };
  handleClick = a => {
    console.log(a);
    let title1 = this.state.list[a].title;
    console.log(title1);
    this.setState({
      current: a,
      selecttitle: title1
    });
    this.updatedata(title1);
  };
  clicknews = (a, id) => {
    console.log(a);
    this.props.session.setnews(a)
    Taro.navigateTo({
      url: "/pages/news/index"
    });
    // console.log(id)
  };
  inputonBlur = async (b) => {
    let a=this.state.inputtitle
    console.log(a);
    Taro.showLoading({ title: "加载中" });

   await Taro.request({
      url: apiurl.baseurl + apiurl.searchkeyword + a + apiurl.withapikey
    }).then(res => {
      console.log(res.data);
      if (res.statusCode == 200) {
        console.log(res.data.result.result.list);

        this.setState({
          listnews: res.data.result.result.list,
          getnewslist: true,
          inputtitle: a
        });
      } else {
        this.setState({
          getnewslist: false
        });
      }
    });
    Taro.hideLoading();
  };
  inputsearchnews = async (a) => {
    console.log(a);
    this.setState({
      inputtitle: a
    });
  };
  updatedata =async (data) => {
    Taro.showLoading({ title: "加载中" });

   await Taro.request({
      url:
        apiurl.baseurl +
        apiurl.selectchannel +
        data +
        apiurl.selectmaxnum +
        this.state.newmaxnum +
        apiurl.selectbasestart +
        this.state.newstart +
        apiurl.withapikey
    }).then(res => {
      console.log(res.data);
      if (res.statusCode == 200) {
        console.log(res.data.result.result.list);

        this.setState({
          listnews: res.data.result.result.list,
          getnewslist: true
        });
      } else {
        this.setState({
          getnewslist: false
        });
      }
    });
    Taro.hideLoading();
  };
 async componentWillMount() {
    Taro.showLoading({ title: "加载中" });
    Taro.request({
      url: apiurl.baseurl + apiurl.channel + apiurl.apikeyurl
    }).then(res => {
      console.log(res.data);
      if (res.statusCode == 200) {
        let a = [];
        res.data.result.result.forEach(element => {
          // console.log(element)
          a.push({ title: element });
        });
        this.setState({
          list: a,
          getnews: true
        });
      } else {
        this.setState({
          getnews: false
        });
      }
    });
    Taro.hideLoading();

    this.updatedata("头条");
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    Taro.updateShareMenu({
      withShareTicket:true

    }).then(res => {
console.log(res)
    })
  }

  componentDidHide() {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  render() {
    const {
      session: { user ,news}
    } = this.props;
    let getnewsshow;
    let newslist;

    if (this.state.getnewslist) {
      let newlist = this.state.listnews;

      newslist = newlist.map(a => {
        return (
          <View
            className="at-row"
            id={a.id}
            key={a.id}
            style="height:133px;margin-top:10px"
            onClick={this.clicknews.bind(this, a)}
          >
            <Image
              className="at-col at-col-5"
              src={
                a.pic == ""
                  ? "https://nervjs.github.io/taro/img/logo-taro.png"
                  : a.pic
              }
            />
            <View className="at-col at-col-8 at-col--wrap">
              <text>{a.title + "\n"}</text>
              <text>{a.time + "\n"}</text>
              <text>{a.src}</text>
            </View>
          </View>
        );
      });
    } else {
      newslist = <View class="at-icon at-icon-loading-2">"network error"</View>;
    }
    if (this.state.getnews) {
      getnewsshow = (
        <AtTabs
          current={this.state.current}
          scroll
          tabList={this.state.list}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane current={this.state.current} index={0}>
            {/* <View style='font-size:18px;text-align:center;height:100px;'>{this.props.index}</View>s */}
          </AtTabsPane>
        </AtTabs>
      );
    } else {
      getnewsshow = (
        <view className="at-icon at-icon-loading-3">"network error"</view>
      );
    }
    return (
      <View className="index">
        <AtSearchBar
          showActionButton
          value={this.state.inputtitle}
          onChange={this.inputsearchnews.bind(this)}
          onActionClick={this.inputonBlur.bind(this)}
        />
        {getnewsshow}
        {newslist}
      </View>
    );
  }
}
export default Index as ComponentTyp;
