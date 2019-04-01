// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const userdb = db.collection('user')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await userdb.count()
  const total = countResult.total

     const tasks = []
if (countResult > 100) {
const batchTimes = Math.ceil(total / 100)
   for (let i = 0; i < batchTimes; i++) {
     const promise = userdb.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
     tasks.push(promise)
   }
   return (await Promise.all(tasks)).reduce((acc, cur) => ({
     data: acc.data.concat(cur.data),
     errMsg: acc.errMsg,
     dbuserlistcount: total
   }))
}else{
  return {
   data: await userdb.limit(100).get(),
     dbuserlistcount: total
  }
}
}
