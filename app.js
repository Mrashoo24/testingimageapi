const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const sharp = require('sharp')
const axios = require("axios") ;
const request = require("request") ;
const FormData = require('form-data');
const imageToBase64 = require('image-to-base64');
const https = require('https');
const fs = require('fs');

app.get('/', async (req, res) => {

  const width = Number(req.query.widthqr);
  let widthimage = Number(req.query.widthimage);
  let heightimage = Number(req.query.heightimage);

  let uid = req.query.uid;

const image = req.query.image
const qrimage = req.query.qr


const input = (await axios({ url: image, responseType: "arraybuffer" })).data ;
const inputqr = (await axios({ url: qrimage, responseType: "arraybuffer" })).data ;
// const composite = (await axios({ url: "https://somewhere.com/another-image.png", responseType: "arraybuffer" })).data;

let label1 = "Scan QR code using any camera in an emergency"; // "Medium Text" "Short"

const label = Buffer.from(`
<svg height="90" width="200">
<text x="5" y="20" style="fill:white;">Scan QR code using any camera
  <tspan x="5" y="45">in an emergency</tspan>

</text>
</svg>
`);

{/* <rect x="0" y="0" width="100%" height="100%" fill="#044B94" fill-opacity="0.4" /> */}

 await   sharp(inputqr)
  .resize(width, width,{
    fit: sharp.fit.fill
}) // Resize the image
  .toBuffer({ resolveWithObject: true }) // We want it to a buffer
  .then( async ({ data, info }) => {  // We now have the data / info of that buffer
   await sharp(input) // Let's start a new sharp on the underside image 
      .resize(widthimage,heightimage,{
        fit: 'cover'
        // sharp.fit.contain
    }) // Resize the underside image
      .composite([{     
        input: data 
      // Pass in the buffer data to the composite function
      ,gravity: "southeast",
        left: widthimage -90,
        top:heightimage - 90,
        hasOffset: true,
      }])
      .toFile(uid+"temp"+'.png', function(err) {
        console.log("Error: ", err)
      }).toBuffer({ resolveWithObject: true}).then(async ({ data1, info1 })=>{


      await  sharp(uid+"temp"+'.png')
        .composite([{     
          input: label 
        // Pass in the buffer data to the composite function
        ,gravity: "southwest",
        left: 10,
        top:heightimage - 80,
        hasOffset: true,
        }]).toFile(uid+'.png', function(err) {
          console.log("Error: ", err)
        }).toBuffer({ resolveWithObject: true}).then(async ({ data1, info1 })=>{


          var base64str =  base64_encode(uid+'.png');
      
          function base64_encode(file) {
            return "data:image/gif;base64,"+fs.readFileSync(file, 'base64');
        } 
  
        let url = `http://okwale.com/qrcode.php`;
        // let url = `http://192.168.1.12/test/imagechange.php`;   
                  
    
            
    
    
        request.post(
            url,
            { form: { file: base64str , uid:uid } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // console.log(body);
                    // console.log(info);
       res.send(body);
                }
            }
        );

        })





      


    

      })



  })
  .catch(err => { 
    console.log("Error: ", err);
  });
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))



// URL TO RUN 
// http://localhost:4000/?widthqr=50&widthimage=220&heightimage=240&uid=king&image=https://images.unsplash.com/photo-1612012460576-5d51b5b04b00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbHBhcGVyJTIwZm9yJTIwbW9iaWxlfGVufDB8fDB8fA%3D%3D&w=1000&q=80&qr=https://admin.okwale.com/imagereport/9653137263Qr.png

// https://stackoverflow.com/questions/65865875/node-js-sharp-make-text-take-up-100-of-svg-width