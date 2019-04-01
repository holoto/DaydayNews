// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
const userdb = db.collection('user')
const wxContext = cloud.getWXContext()
const quertuser =await userdb.where({
  openid: wxContext.OPENID
}).get();
  const countResult = await userdb.count()
  if (countResult.total == 0 || quertuser.data.length==0) {
return {
  event: event,
  context: context,
  error: await userdb.add({

    data: {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      quertuser: quertuser,
      unionid: wxContext.UNIONI,
      createTime: db.serverDate(),
      userinfo: event.loginuser
    }


  })
}
  } else if (quertuser.data.length == 1) {
return {
  event: event,
    context: context,
    countResult: countResult,
    quertuser: quertuser,
  error: await userdb.where({
      openid: wxContext.OPENID
    }).update({
    data: {
      userinfo: event.loginuser

    }
  })
}
  }


}
