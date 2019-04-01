import Taro, { Component, Config } from '@tarojs/taro'
import Index from "./pages/login"
// import "antd/dist/antd.css"
import { Provider } from "@tarojs/mobx"
import session from "./store/session";

import "taro-ui/dist/style/index.scss";
import './app.scss'
import "@tarojs/async-await";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
const store = {
  session
}
class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: ["pages/login/index", "pages/index/index", "pages/news/index"],

    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#0068C4",
      navigationBarTitleText: "新闻",
      navigationBarTextStyle: "white",
      enablePullDownRefresh: true
    },
    tabBar: {
      color: "#626567",
      selectedColor: "#2A8CE5",
      backgroundColor: "#FBFBFB",
      borderStyle: "white",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "./asset/image/index.png",
          selectedIconPath: "./asset/image/index_focus.png"
        },
        {
          pagePath: "pages/login/index",
          text: "我的主页",

          iconPath: "./asset/image/user.png",
          selectedIconPath: "./asset/image/user-focus.png"
        }
      ]
    }
  };
  componentWillMount() {
    if (!Taro.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      Taro.cloud.init({
        traceUser: true
      });
    }
  }
  componentDidMount() {}

  componentDidShow() {
    console.log(Taro);
  }

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'))
