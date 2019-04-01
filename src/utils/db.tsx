import Taro from "@tarojs/taro"
const db = Taro.cloud.database();
const dbuser = db.collection("todos");


export default dbuser

