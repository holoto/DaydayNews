// https://wx.jdcloud.com/user/baseInfo
// api data
const myjdapikey = "4167297cce18bcf24ecae7b60c50f819"
// set you jd api key
const apiurl={
  baseurl: 'https://way.jd.com/',
  channel: 'jisuapi/channel',
  selectchannel: 'jisuapi/get?channel=',
  selectmaxnum: '&num=',
  selectbasestart: '&start=',
  withapikey: '&appkey='+myjdapikey,
  apikeyurl: '?appkey='+myjdapikey,
  searchkeyword: 'jisuapi/newSearch?keyword='
}

export default apiurl;
