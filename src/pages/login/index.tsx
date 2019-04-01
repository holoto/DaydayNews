import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { AtAvatar, AtButton, AtCard } from 'taro-ui'
import dbuser from '../../utils/db'
import './index.scss'

type PageStateProps = {
  session: {
    user: any,
    news:any,
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
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "个人信息"
  };

  componentWillMount() {}

  componentWillReact() {
    console.log(Taro);
    console.log(dbuser);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const {
      session: { user }
    } = this.props;
    const User = (
      <View>
        {/* <AtAvatar
          className="user_avatar "
          class="maincenter"
          image={user.avatarUrl}
        /> */}
        <AtCard
          note=""
          extra="登录成功"
          title={user.nickName}
          thumb={user.avatarUrl}
        />
      </View>
    );
    const Login = (
     <View>
       点击登录
     </View>
    );
    return (
      <View className="index">
        <view>
          <Button
            type="default"
            onClick={this.handleLogin}
            bindgetuserinfo={this.bindgetuserinfofuc.bind(this)}
            open-type="getUserInfo"

          >
            <view><AtCard
              note=""
              extra={user ? '登录成功' : '点击登录'}
              title={user ? user.nickName:'点击登录'}
              thumb={user ? user.avatarUrl :'https://ww1.sinaimg.cn/large/007i4MEmly1g1nj5q93rgj305k05kdfq.jpg'}
            /></view>
          </Button>
        </view>
      </View>
    );
  }

  handleLogout = async () => {
    this.props.session.logout();
  };
  onGetOpenid = async () => {
    // 调用云函数

    Taro.cloud.callFunction({
      name: "login",
      data: {},
      success: res => {
        console.log(res.result.event);
      },
      fail: res => {
        console.log(res);
      }
    });




  }
  bindgetuserinfofuc= async (res)=>{
console.log(res)
  }
  handleLogin = async () => {
    try {
      await Taro.showLoading({ mask: true, title: "登录中" });
      await Taro.login().then(res => {
        console.log(res);
      });

     await this.onGetOpenid();
      await Taro.checkSession().then(res => {
        console.log(res);
      });
      const userInfo = await Taro.getUserInfo({ lang: "zh_CN" });
      Taro.cloud.callFunction({
        name: "addorupdate",
        data: {
          loginuser: userInfo.userInfo
        },
        success: res => {
          console.log(res);
        },
        fail: res => {
          console.log(res);
        }
      });
      this.props.session.logged(userInfo.userInfo);
    } catch (e) {
      await Taro.showToast({ title: e.message });
    } finally {
      await Taro.hideLoading();
    }
  };
}

export default Index as ComponentType
