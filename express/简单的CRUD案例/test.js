const api=require('./studentApi');

const student = {
   "name": "Kobe",
   "sex": "M",
   "hobbies": [
       "basketball",
       "swimming",
       "sleep"
   ]
}
const student2 = {
    "id":1,
    "name": "Kobe",
    "sex": "Female",
    "hobbies": [
        "basketball",
        "swimming",
        "sleep"
    ]
 }
const id=4;

// api.add(student);
// api.delete(id);
// api.update(student2);
// api.search(id,function(data){
//     console.log(data)
// })