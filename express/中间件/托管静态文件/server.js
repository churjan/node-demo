const express=require('express');
const app=express();

//设置静态资源
// 方法一
app.use('/static',express.static('./public'))

app.listen(8080,() => console.log('Server is running...'))