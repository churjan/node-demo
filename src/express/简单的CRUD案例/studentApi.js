const fs = require('fs');
const dataBase = './db.json';

//增
exports.add=(student)=>{
    fs.readFile(dataBase,{
        encoding:'utf8'
    },(err,data)=>{
        if(err) throw err;
        let students=JSON.parse(data).students;
        students=[
            ...students,
            {
                id:Object.keys(students||[]).length+1,
                ...student,
            }
        ]
        let dataStr = JSON.stringify({students},null,2);
        fs.writeFile(dataBase,dataStr,(err)=>{
            if(err) throw err;
            console.log('添加成功')
        })
    })
}
//删
exports.delete=(id)=>{
    fs.readFile(dataBase,{
        encoding:'utf8'
    },(err,data)=>{
        if(err) throw err;
        let students=JSON.parse(data).students;
        let flag=students.findIndex(item=>item.id==id);
        if(flag!==-1){
            students.splice(flag,1);
            let dataStr = JSON.stringify({students},null,2);
            fs.writeFile(dataBase,dataStr,(err)=>{
                if(err) throw err;
                console.log('删除成功');
            })
        }else{
            console.log('查无此人');
        }
    })
}
//改
exports.update=(student)=>{
    fs.readFile(dataBase,{
        encoding:'utf8'
    },(err,data)=>{
        if(err) throw err;
        let students=JSON.parse(data).students;
        let flag=students.findIndex(item=>item.id==student.id);
        if(flag!==-1){
            students[flag]=student;
            let dataStr = JSON.stringify({students},null,2);
            fs.writeFile(dataBase,dataStr,(err)=>{
                if(err) throw err;
                console.log('修改成功');
            })
        }else{
            console.log('查无此人')
        }

    }) 
}
//查
exports.search=(id,cb)=>{
    fs.readFile(dataBase,{
        encoding:'utf8'
    },(err,data)=>{
        if(err) throw err;
        let students=JSON.parse(data).students;
        let filter_data=students.filter(item=>item.id==id);
        cb(filter_data);
    })
}

