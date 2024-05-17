import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
const app = express();
const port = 3000;
const saltRounds = 10;

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie:{
      maxAge:1000*60*60*24,
    }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "cars",
  password: "ROOT",
  port: 5432,
});
db.connect();

app.get("/", async(req, res) => {
  const result= await db.query("select cars_brand from cars_brand")
  console.log(result.rows)
    res.render("index.ejs",{
      brands:result.rows
    });
  });
  app.post("/cars",async(req,res)=>{
    console.log(req.body.name)
    const result=await db.query(`SELECT  cm.model_name, cm.price,cm.specification
    FROM car_models cm
    JOIN cars_brand cb ON cm.brand_id = cb.brand_id
    WHERE cb.cars_brand = $1; `,[req.body.name]
    );
    console.log(result.rows)
    res.render("brand.ejs",{
    models:result.rows
  })
  })

  app.get("/login", (req, res) => {
    res.render("login.ejs");
  });
app.get("/wishlist",async(req,res)=>{
  
})

  app.post("/wishlist",async(req,res)=>{
    

  })


  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  