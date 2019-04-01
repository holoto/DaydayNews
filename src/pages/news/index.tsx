import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { AtAvatar, AtButton } from 'taro-ui'
import dbuser from '../../utils/db'
import './index.scss'

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
function createMarkup(a) {
  return { __html: a };
}

function MyComponent(a) {
  return <div dangerouslySetInnerHTML={createMarkup(a)}></div>;
}

@inject("session")
@observer
class Index extends Component {
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

  componentWillMount() {
    console.log(this.props.session.news.weburl);
    wx.setNavigationBarTitle({
      title: this.props.session.news.title
    })
  }

  componentWillReact() {


  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const {
      session: { user ,news}
    } = this.props;

    return (
      <View className="index">
        <web-view src={this.props.session.news.url}></web-view>


      </View>
    );
  }



}

export default Index as ComponentType
