/*
 * @Author: Chenxu
 * @Date: 2022-12-28 13:26:25
 * @LastEditTime: 2023-02-14 15:49:35
 * @Msg: Nothing
 */
export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/students/group/index',
    'pages/index/result/index',
    'pages/index/index',
    'pages/webview/index',
    'pages/progress/planover/index',
    'pages/students/index',
    'pages/progress/plan/index',
    'pages/progress/entrance/index',
    'pages/progress/index',
    'pages/index/replay/index',
    'pages/mine/index',
    'pages/progress/progress-hack-by-android/index',
    'pages/index/replay/replay-hack-by-android/index',
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#3723B9',
    backgroundColor: '#F6F7F9',
    navigationBarTitleText: '清华SIGS答辩助手',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: false
  },
  tabBar: {
    backgroundColor: '#ffffff',
    selectedColor: '#418CFF',
    color: '#666666',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '答辩',
        iconPath: './static/index.png',
        selectedIconPath: './static/index-selected.png'
      },
      {
        pagePath: 'pages/index/replay/index',
        text: '答辩',
        iconPath: './static/index.png',
        selectedIconPath: './static/index-selected.png'
      },
      {
        pagePath: 'pages/progress/index',
        text: '学习进度',
        iconPath: './static/progress.png',
        selectedIconPath: './static/progress-selected.png'
      },
      {
        pagePath: 'pages/students/index',
        text: '我的学生',
        iconPath: './static/students.png',
        selectedIconPath: './static/students-selected.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './static/mine.png',
        selectedIconPath: './static/mine-selected.png'
      }
    ]
  },
})
