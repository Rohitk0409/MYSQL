const mysql=require("mysql2");
const { faker } = require('@faker-js/faker');
const express=require("express");
const { render } = require("ejs");
const { v4: uuidv4 } = require('uuid');

const app=express();
methodOverride = require('method-override');
let port=8080;

app.set("view engine","ejs");
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));


// let createRandomUser=()=>{
//     return [
//         faker.string.uuid(),
//        faker.internet.userName(),
//       faker.internet.email(),
//       faker.internet.password(),
//     ]
//   };
//   let arrdata=[];
//    for(let i=1;i<=50;i++){
//     arrdata.push(createRandomUser());
//    }
  
 

connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta_app",
    password:"rohit@0409",
    });

    let qur="SHOW TABLES";
    let qr="CREATE TABLE temp(id VARCHAR(300) NOT NULL,username VARCHAR(300) UNIQUE,email VARCHAR(300) UNIQUE,password VARCHAR(300) NOT NULL)";
    let insert="INSERT INTO temp(id,username,email,password) VALUES ?";
    
    // Home rout
  app.get("/",(req,res)=>{
    let q="SELECT count(*) FROM temp";
    try{
        connection.query(q,(err,result)=>{
          let val=result[0]["count(*)"];
          res.render("home.ejs",{val})
          });
      }
      catch(err){
        console.log(err);
        res.send("error find in database..");
      }
    });
  
    
      //show all (id,user,email)
      app.get("/show",(req,res)=>{
        let showall="SELECT * FROM temp";
        let i=1;
    try{
        connection.query(showall,(err,result)=>{
        res.render("showuser.ejs",{users:result,i})
          });
      }
      catch(err){
        console.log(err);
        res.send("error find in database..");
      }
    });

  // access the user page for edit
    app.get("/user/:id/edit",(req,res)=>{
      let {id}=req.params;
      let q2=`SELECT * FROM temp WHERE id='${id}'`;
      
      try{
        connection.query(q2,(err,result)=>{
        if(err) throw err;
        let data=result[0];
         console.log(result);
         res.render("edit.ejs",{data});
         console.log(data);
          });
      }
      catch(err){
        console.log(err);
        res.send("error find in database..");
      }
        
    });

    // edit(Update) user page by using patch request
     app.patch("/user/:id",(req,res)=>{
      let {id}=req.params;
      let {password:formpass,username:newusername}=req.body;
      let q2=`SELECT * FROM temp WHERE id='${id}'`;
      try{
        connection.query(q2,(err,result)=>{
        
        if(err) throw err;
        let data=result[0];
        console.log(data.password);
        if(formpass!=data.password){
          res.send("Wrong password!");
        }else{
          let q3="SET SQL_SAFE_UPDATES=0";
          let q4=`UPDATE temp SET username='${newusername}'WHERE id='${id}'`;
          connection.query(q4,(err,result)=>{
            if(err) throw err;
            res.redirect("/show");
          })
        }
          });
      }
      catch(err){
        console.log(err);
        res.send("error find in database..");
      }
    });

    //delete user data from the table
    app.delete("/user/:id",(req,res)=>{
      let{id}=req.params;
      let deleteQuery=`DELETE FROM temp WHERE id='${id}'`;
      try{
        connection.query(deleteQuery,(err,result)=>{
          if(err) throw err;
          res.redirect("/show");
        })
      }
      catch(err){
        console.log(err);
        res.send("some error find in database.....");
      }
    });

// Get request for creating new username ,email ,id and password(and send form of create new user)
app.get("/user/new",(req,res)=>{
  res.render("newuser.ejs");
});


//create new user by using post
app.post("/user",(req,res)=>{
  let newid=uuidv4();
  let{username:user,email:newemail,password:newpass}=req.body;
  
  let insert=`INSERT INTO temp(id,username,email,password) VALUES ('${newid}','${user}','${newemail}','${newpass}')`;
  console.log(newpass);
 
  try{
    connection.query(insert,(err,result)=>{
      if(err) throw err;
         console.log(result);
      res.redirect("/show");
    });
  }
  catch(err){
    console.log(err);
    res.send("some erro found in database...")
  }
  
  
});


  app.listen(port,()=>{
    console.log(`Listenting port ${port}`);
  });