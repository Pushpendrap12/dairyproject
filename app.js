const express = require("express");
const path = require("path"); 
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;
 mongoose.connect("mongodb://127.0.0.1:27017/MyDairy");
  const contact1= new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    address:String,
    message:String
  });
  const users = new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    address:String,
    password:String
  })

  const product = new mongoose.Schema({
    name:String,
    password:String,
    quantity:String,
    fat:String,
    snf:String,
    date:String
  });
  const MyUser = mongoose.model('myusers' ,users);
  const Contact = mongoose.model('WantToContact',contact1);
  const Products = mongoose.model('productdetails' ,product);
// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

 
// ENDPOINTS
app.get('/', (req, res)=>{ 
   
    res.status(200).render('home.pug');
})
app.get('/register' , (req,res)=>{
    res.render('register.pug');
})

let userData;
app.post('/register' ,async (req,res)=>{
  userData = req.body;
  const check = await MyUser.find({password:req.body.password}); 
  try{
         if(check.length == 0)
         {
          res.render('review',userData);
         }else{
          res.send("this  password already in use , try another password ")
         }
  }catch(e){
        res.send("invalid detail");
  }
}
);

app.get('/save',async(req,res)=>{
    const  userdata = new MyUser(userData);
    await userdata.save();
    let obj = [];
    let obj1= JSON.stringify(obj);
    let obj2 = [{name:userData.name , password:userData.password}]
    let obj3=JSON.stringify(obj2);
    res.render('useraccount.pug',{datas:obj1 , check2:obj3});
})

app.get('/login' ,(req,res)=>{
res.render('login.pug',{validation:'none'});
});

app.post('/login', async (req,res)=>{
    let consumer = req.body;
     try{
      const check = await MyUser.find({name:consumer.name,password:consumer.password});

      if(check.length !=0){
       const data = await Products.find({name:consumer.name,password:consumer.password});
       const data2 = JSON.stringify(data);
       const check1 = JSON.stringify(check);
       res.render('useraccount',{datas:data2 , check2:check1});
      }else{
        
       res.render('login.pug',{validation:'block'});
      }
     }catch{
       
       res.send('error');
     } 
});

app.post('/adddata',async (req,res)=>{
    const data1 = req.body;
    let date1= new Date();
    let day= date1.getDate();
    let month= date1.getMonth();
    let year= date1.getFullYear();
    let date2 = `${day}/${month}/${year}`
    data1.date= date2;
    let obj = [{name:data1.name,password:data1.password}];
    const getdata = new Products(data1);
     await getdata.save();
    const detail1 =await Products.find({name:data1.name,password:data1.password})
    const detail2 = JSON.stringify(detail1);
    let obj1= JSON.stringify(obj);
    res.render('useraccount.pug',{datas:detail2,check2:obj1});
})
app.post('/clear',async (req,res)=>{
  const data1 = req.body;
  let obj = [{name:data1.name,password:data1.password}]
  await Products.deleteMany({name:req.body.name,password:req.body.password});
  const detail1 =await Products.find({name:data1.name,password:data1.password});
    const detail2 = JSON.stringify(detail1);
    let obj1= JSON.stringify(obj);
    res.render('useraccount.pug',{datas:detail2,check2:obj1});
  //res.send('ALL Data Clear ')
})
app.get('/contact', (req, res)=>{ 
   
    res.status(200).render('contact.pug');
})

app.post('/contact',(req,res)=>{
    
        const  data = req.body;
        const myData = new Contact(data);
        myData.save().then(()=>{
            res.send('<p style="font-size:30px;margin-top:30px;text-align:center;color:green">Your form has been submitted successfully</p>')
        }).catch(()=>{
            res.send('<p style="font-size:30px;margin-top:30px;text-align:center">Your form could not be submitted </p>')
        }) 
});  
    


// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});

