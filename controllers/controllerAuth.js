

const checkOTP = (req, res) => {
    
  console.log("emailPage")
  let query = require('url').parse(req.url,true).query;

  let otp = query.otp;
  let email = query.email;

  console.log(otp, email)

  async function run() {
    const loginData = await db.collection('userData').doc(email).collection('OTP').doc('Recent OTP').get();
    const userData = await db.collection('userData').doc(email).get();
 
    // console.log(loginData._fieldsProto)
    
    if (loginData._fieldsProto == null) {
      
      console.log('Wrong OTP or Email');
      res.json({
        status: "No Content",
        statusCode: 204,
        message: "Wrong OTP or Email",
        error: null
    })
    
      return;
    } 
    req.session.email = email;

    if(otp != loginData._fieldsProto.otp.integerValue)
    {
      let errormessage = "Incorrect Otp";
      console.log("Incorrect OTP..!");
      res.render("login",{data : email, errormessage});
    }

    
   
  else{

    if(userData._fieldsProto == null){
      console.log("New User");
      req.session.flag = 1;
      res.render("demo",{data : email})
    }

    else{

    // if(loginData._fieldsProto.timeStamp.integerValue == null){
    //   console.log("new User")
      
    // }


    console.log(loginData._fieldsProto.timeStamp.integerValue)

    console.log(loginData._fieldsProto.otp.integerValue)

    let storedOtp = loginData._fieldsProto.otp.integerValue;
    console.log(storedOtp)

    let resObj = {
      status: "success",
      statusCode: 200,
      message: "OK",
      error: null
  }


    // res.json(resObj)
    console.log(resObj)

    //console.log(userData._fieldsProto.socialData.mapValue.fields.Twitter.mapValue.fields.Twitter.stringValue);
 
    if(userData._fieldsProto.id == null){
      req.session.flag = 1;
    }
    else{
      req.session.uid = userData._fieldsProto.id.stringValue;
    }

   

if(userData._fieldsProto.socialData == null){
  //console.log(userData._fieldsProto.socialData.mapValue.fields);
  console.log("Null Value")

}

else{

  let socialKeys = Object.keys(userData._fieldsProto.socialData.mapValue.fields);
  console.log(socialKeys)

  console.log(userData._fieldsProto.socialData.mapValue.fields);
    let data1 = {}
    for (let i = 0; i < socialKeys.length; i++) {
      let a = socialKeys[i] 
      //data1[a] = userData._fieldsProto.socialData.mapValue.fields[a].mapValue.fields[a].stringValue;
      data1[a] = userData._fieldsProto.socialData.mapValue.fields[a].mapValue.fields[a].arrayValue.values
      // console.log(data1[a])
    }

    console.log(data1)
    res.render("demo",{data : email, data1: data1})


    //console.log(userData._fieldsProto.socialData.mapValue.fields.Facebook.mapValue.fields.Facebook.arrayValue.values);
    
  }

    //res.render("demo",{data : email, data1: data1})
        
    }
  }
}  
    run().catch(console.error);

};

const uploadImage = (req, res) => {

    console.log(req.body)
  
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');
  
  // Ensure the uploads folder exists
  const uploadFolder = 'uploads';
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
  }
  
  // Set up storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      cb(null, req.session.email + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
      upload.single('file')(req, res, function (err) {
  
        if (err) {
          return res.status(400).send('Error uploading file.');
        }
        if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }   
        // res.send('File uploaded successfully.');
  
        const localFilePath = path.join(uploadFolder, req.file.filename);
        const remoteFilePath = `uploads/${req.file.filename}`;
        bucket.upload(localFilePath, { destination: remoteFilePath }, (err, file) => {
          if (err) {
            return res.status(500).send('Error uploading file to Firestore Storage.');
          }
          console.log('File uploaded successfully to Firestore Storage.');
        });
  
  
  
      });
    };
   

const uploadd = (req, res) => {

console.log(req.body);

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads folder exists
const uploadFolder = 'uploads';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, req.session.email + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

    upload.single('file')(req, res, function (err) {

      console.log(req.body);
      let socials = req.body.social;
      console.log(socials);
      let socialss = socials.split(",");
      a = [];
      for (let i = 0; i < socialss.length; i++) {
        a.push(socialss[i])
        console.log(socialss[i])
      }

let result = [];
let count = {};

a.forEach(item => {
  if (count[item]) {
    count[item]++;
  } else {
    count[item] = 1;
  }
});

for (let item in count) {
  result.push(new Array(count[item]).fill(item));
}

console.log(result)

const socialData = {}

for (let i = 0; i < result.length; i++) {
  let key = result[i][0]
  console.log(result[i]);
  if(Array.isArray(req.body[key]) == false){
    socialData[key] = {[key] : [req.body[key]]};
  }
  else{
  socialData[key] = {[key] : req.body[key]};
  }

  console.log(socialData)
}



      async function run() {

        let email = req.session.email;

        if(req.session.flag == 1){

        const timestamp = Date.now(); // Current timestamp in milliseconds
        const randomNum = Math.floor(Math.random() * 1000000); // Random number between 0 and 999999
        let id = `id-${timestamp}-${randomNum}`;

        await db.collection('userData').doc(email).set({userName: req.body.userName, socialData: socialData, timeStamp : Date.now(), id :id});
        await db.collection('viewData').doc(id).set({email});
        res.redirect(`viewpage?id=${id}`);


        }
        else{
          await db.collection('userData').doc(email).set({userName: req.body.userName, socialData: socialData, timeStamp : Date.now(), id :req.session.uid});
          res.redirect(`viewpage?id=${req.session.uid}`);
        }
        
          let resObj = {
            status: "success",
            statusCode: 200,
            message: "OK",
            // data,
            error: null
        }
        // res.json(resObj)
      }

      run().catch(console.error);


      if (err) {
        return res.status(400).send('Error uploading file.');
      }
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }   
      // res.send('File uploaded successfully.');

      const localFilePath = path.join(uploadFolder, req.file.filename);
      const remoteFilePath = `uploads/${req.file.filename}`;
      bucket.upload(localFilePath, { destination: remoteFilePath }, (err, file) => {
        if (err) {
          return res.status(500).send('Error uploading file to Firestore Storage.');
        }
        console.log('File uploaded successfully to Firestore Storage.');
      });



    });
  };



  
const getViewPage = (req, res) => {


  let query = require('url').parse(req.url,true).query;
  let id = query.id;
  console.log(id);


  async function run() {

    const linkData = await db.collection('viewData').doc(id).get()
    console.log(linkData);

    if(linkData._fieldsProto == null){

      res.render("pagenotfound")

    }
    else{
      console.log(linkData._fieldsProto.email.stringValue);

      let email = linkData._fieldsProto.email.stringValue;
      const userData = await db.collection('userData').doc(email).get()

      // console.log(userData._fieldsProto.socialData.mapValue.fields)
      //console.log(userData._fieldsProto.socialData.mapValue.fields.Twitter.mapValue.fields.Twitter.arrayValue.values.length);


      let dataa = {};

      for (const key in userData._fieldsProto.socialData.mapValue.fields) {
        if (userData._fieldsProto.socialData.mapValue.fields.hasOwnProperty(key)) {
          console.log(key); // Logs 'Twitter' and 'Facebook'
          
          dataa[key] = []; // Initialize the array for each key
      
          const values = userData._fieldsProto.socialData.mapValue.fields[key].mapValue.fields[key].arrayValue.values;
          
          for (let i = 0; i < values.length; i++) {
            dataa[key].push(values[i].stringValue); // Push the string values into the array
          }
        }
      }
      
      console.log(dataa);
      // let dataaa = {};
      console.log(userData._fieldsProto.userName.stringValue);
      let dataaa = userData._fieldsProto.userName.stringValue;

      //console.log(userData._fieldsProto.socialData.mapValue.fields.Facebook.mapValue.fields.Facebook.arrayValue)


      // for (const key in data) {
      //   if (data.hasOwnProperty(key)) {
      //     const value = data[key].mapValue;
      //     console.log(`${key}: ${value}`);
      //   }
      // }

      res.render("viewpage", {dataa, dataaa});
    }

      let resObj = {
        status: "success",
        statusCode: 200,
        message: "OK",
        // data,
        error: null
    }
    // res.json(resObj)
  }

  run().catch(console.error);
    
  };



const getDemo1 = (req, res) => {

res.render("demo1")

};

const getPageNotFound = (req, res) => {

  res.render("pagenotfound")
  
  };

const getHomepage = (req, res) => {

    res.render("homepage")
    
    };


module.exports = {getDemo, getDemo1, loginData, getEmail, sendOtp, checkOTP, uploadImage, uploadd, getViewPage, getPageNotFound, getHomepage}