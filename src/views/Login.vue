<template>
    <div id="login">
        <span>我是登录页面</span>
        <el-row>
            <el-button>默认按钮</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Login",
    }
</script>

<style scoped>
    #login{
        background-color: #344a5f;
        height: 100vh;
    }
</style>