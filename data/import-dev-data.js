const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');

dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('db connected succesfully');
  });

const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));

//IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded successfully');
   
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully');
    
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

console.log(process.argv);

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}
