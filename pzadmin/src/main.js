import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import panelHead from './components/panelHead.vue'

router.beforeEach((to,form)=>{
  const token=localStorage.getItem('pz_token')
  //当非登录页面token不存在
  if(!token&&to.path!=='/login'){
    return '/login'
  }else if(token&&to.path==='/login'){
    return '/'
  }else{
    return true
  }
})

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// router.beforeEach((to,form)=>{
//   if(to.path!='/login'){
//     if(!localStorage.getItem('h5_token')){
//       return '/login'
//     }
//   }
// })

app.component('panelHead',panelHead)
app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
