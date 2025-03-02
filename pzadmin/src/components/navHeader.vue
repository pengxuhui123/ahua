<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
            <ul class="flex-box">
                <li
                 v-for="(item,index) in selectMenu"
                 :key="item.path"
                 class="tab flex-box"
                 :class="{selected: route.path==item.path}">
                    <el-icon size="12"><component :is="item.icon" /></el-icon>
                    <router-link class="text flex-box" :to="{path:item.path}">
                        {{ item.name }}
                    </router-link>
                    <el-icon size="12" class="close" @click="closeTab(item,index)"><Close /></el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
           <el-dropdown @command="handleClick">
            <div class="el-dropdown-link flex-box">
                <el-avatar :src="userInfo.avatar"/>
                <p class="username">{{ userInfo.name }}</p>
            </div>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="cancel">退出</el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import {computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute,useRouter} from 'vue-router'

const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))
const store=useStore()
const selectMenu=computed(()=>store.state.menu.selectMenu)
const route=useRoute()
const router=useRouter()
const closeTab=(item,index)=>{
    store.commit('closeMenu',item)
    if(item.path!==route.path){
        return
    }
    const selectMenuData=selectMenu.value
    if(index===selectMenuData.length){
        if(!selectMenuData.length){
        router.push('/')
        }else{
            router.push({
                path:selectMenuData[index-1].path
            })
        }
    }else{
        router.push({
            path:selectMenuData[index].path
        })
    } 
       
}
const handleClick=(command)=>{
    if(command==='cancel'){
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        window.location.href=window.location.origin
    }
}
</script>
<style lang="less" scoped>
.flex-box{
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .icon{
            width: 45px;
            height: 100%;
        }
        .icon:hover{
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab{
            padding: 0 10px;
            height: 100%;
            .text{
                margin: 0 5px;
            }
            .close{
                visibility:hidden;
            }
            &.selected{
                a{
                    color: #409eff;
                }
                i{
                    color: #409eff;
                }
            }
        }
        .tab:hover{
            background-color: #f5f5f5;
            .close{
                visibility:inherit;
                cursor: pointer;
                color: #000;
            }
        }
    }
    .header-right{
        .username{
            margin-left: 10px;
        }
    }
    a{
        height: 100%;
        color: #333;
        font-size: 15px;
    }
}
</style>