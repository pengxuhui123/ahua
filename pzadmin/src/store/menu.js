const state={
    isCollapse:false,
    selectMenu:[],
    // routerList:[]
    menuActive:'1-1'
}
const mutations={
    collapseMenu(state){
        state.isCollapse=!state.isCollapse
    },
    addMenu(state,payload){
        if(state.selectMenu.findIndex(item=>item.path===payload.path)===-1){
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state,payload){
        const index=state.selectMenu.findIndex(val=>val.path===payload.path)
        state.selectMenu.splice(index,1)
    },
    // dynamicMenu(state,payload){
    //     //通过glob导入文件
    //     const modules=import.meta.glob('../views/**/**/*.vue')
    //     function routerSet(router){
    //         router.forEach(route=>{
    //             //判断没有子菜单，拼接路由数据
    //             if(!router.children){
    //                 const url=`../views${route.meta.path}/index.vue`
    //                 //拿到获取的vue组件
    //                 route.component=modules[url]
    //             }else{
    //                 routerSet(route.children)
    //             }
    //         })
    //     }
    //     routerSet(payload)
    //     // 拿到完整的路由数据
    //     state.routerList=payload
    // }
    updateMenuActive(state,payload){
        state.menuActive=payload
    }
}
export default{
    state,
    mutations
}