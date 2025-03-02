<template>
    <PanelHead :route="route"/>
    <el-table :data="tableData.list" style="width:100%">
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="昵称"/>
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active?'success':'danger'" >{{ scope.row.active?'正常':'失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作">              
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
            v-model:currentPage="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            size="small"
            :background="false"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
    </div>
    <el-dialog
        v-model="dialogFormVisible"
        :before-close="beforeClose"
        title="添加权限"
        width="500"
    >
        <el-form 
                ref="formRef"
                label-width="100px"
                label-position="left"
                :model="form"
                :rules="rules"
            >
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="1234" disabled/>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select 
                    v-model="form.permissions_id"
                    placeholder="请选择菜单权限"
                    style="width: 400px;" 
                >
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :model="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import {authAdmin,menuSelectList,updateUser} from '../../../api'
import {ref,reactive,onMounted} from 'vue' 
import dayjs from 'dayjs'
import PanelHead from '../../../components/panelHead.vue';
import {useRoute} from 'vue-router'

const route=useRoute()
console.log(route,'route');

const tableData=reactive({
    list:[],
    total:0
})
const paginationData=reactive({
    pageNum:1,
    pageSize:10
})

//点击页码的回调
const handleSizeChange=(val)=>{
    paginationData.pageSize=val
    getListData()
}
//点击当前页
const handleCurrentChange=(val)=>{
    paginationData.pageNum=val
    getListData()
}


onMounted(()=>{
    getListData()
    menuSelectList().then(({data})=>{
        options.value=data.data
    })
})
//请求列表
const getListData=()=>{
    authAdmin(paginationData).then(({data})=>{
        console.log(data,'authAdmin');
        const {list,total} =data.data
        list.forEach(item=>{
            item.create_time=dayjs(item.create_time).format('YYYY-MM-DD')
        })
        tableData.list=list
        tableData.total=total
    })
}
//弹窗
const dialogFormVisible=ref(false)
const beforeClose=()=>{
    dialogFormVisible.value=!dialogFormVisible.value
}

//编辑表单
const form=reactive({
    name:'',
    permissions_id:''
})
const formRef=ref()
//表单提交弹窗确认按钮
const confirm= async(formEl)=>{
    if(!formEl) return
    await formEl.validate((valid,fields)=>{
        if(valid){
           const {name,permissions_id} = form
           updateUser({name,permissions_id}).then((data)=>{
                // if(data.code===10000){
                //     dialogFormVisible.value=false
                //     getListData()
                // }
                dialogFormVisible.value=false
                    getListData()
           })
        }else{
            console.log('error submit!',fields);
        }
    })
}
//编辑操作
const open=(rowData)=>{
    dialogFormVisible.value=true
    Object.assign(form,{mobile:rowData.mobile,name:rowData.name,permissions_id:rowData.permissions_id})
}
//表单规则
const rules=reactive({
    name:[{required:true,trigger:'blur',message:'请填写昵称'}],
    permissions_id:[{required:true,trigger:'blur',message:'请选择菜单权限'}]
})
//响应式变量存储下拉列表的数据
const options=ref([])
console.log(options,'options');

//根据权限id匹配权限名称
const permissionName=(id)=>{
    const data=options.value.find(el=>el.id===id)
    return data?data.name:'超级管理员'
}
</script>
<style lang="less" scoped>
.flex-box{
    display: flex;
    align-items: center;
}
</style>