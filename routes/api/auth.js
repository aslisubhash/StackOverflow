const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");


//@type GET
//@route /api/auth
//@desc just for testing
//@acess PUBLIC
router.get("/",(req,res)=>res.json({test:"auth is being tested..."}));

//import schema for person to register
const Person = require ("../../models/Person");

//@type POST
//@route /api/auth/register
//@desc route for registration of users
//@acess PUBLIC
router.post("/register",(req,res)=>{
    Person.findOne({email:req.body.email})
    .then(person=>{
        if (person) {
            return res.status(400)
            .json({emailerror:"Email already exists"})
        } else{
            const newPerson = new Person({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            //Encrypt password using bcrypt js
            bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(newPerson.password, salt,(err, hash)=> {
                if(err) throw err;
                newPerson.password= hash;
                newPerson
                .save()
                .then(person=>res.json(person))
                .catch(err=>console.log(err));
            });
});

        }
    })
    .catch(err=>console.log(err));
})

//@type POST
//@route /api/auth/login
//@desc route for login of users
//@acess PUBLIC
router.post("/login",(req,res)=>{
    const  email = req.body.email;
    const password = req.body.password;

    Person.findOne({email})
    .then(person=>{
        if (!person) {
            return res.status(404).json({emailerror:"User not found"})
        }
        bcrypt.compare(password,person.password)
        .then(isCorrect =>{
            if(isCorrect){
                // res.json({success:"You are logged in successfully"})
                //use payload and create token for user
                const payload = {
                    id: person.id,
                    name: person.name,
                    email: person.email
                };
                jsonwt.sign(
                    payload,
                    key.secret,
                    {expiresIn:3600},
                    (err,token)=>{
                        res.json({
                            success:true,
                            token:"Bearer " + token
                        })
                    }
                )
            }
            else{
                res.status(400).json({passerror:"Incorrect Pasword.."})
            }
        })
        .catch(err=>console.log(err))
        if(person){
            
        }
    }
    )
    .catch(err=>console.log(err));
})
//@type GET
//@route /api/auth/profile
//@desc route for user profile
//@acess PRIVATE




module.exports = router;