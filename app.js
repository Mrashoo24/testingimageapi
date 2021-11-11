const express = require('express')
const app = express()
const port = process.env.PORT || 80;
const sharp = require('sharp')
const axios = require("axios") ;

app.get('/', async (req, res) => {

  const width = Number(req.query.widthqr);
  let widthimage = Number(req.query.widthimage);
  let heightimage = Number(req.query.heightimage);

const image = "https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"


const input = (await axios({ url: image, responseType: "arraybuffer" })).data ;
// const composite = (await axios({ url: "https://somewhere.com/another-image.png", responseType: "arraybuffer" })).data;

 await   sharp('./images/qr_1.png')
  .resize(width, width,{
    fit: sharp.fit.fill
}) // Resize the image
  .toBuffer({ resolveWithObject: true }) // We want it to a buffer
  .then( ({ data, info }) => {  // We now have the data / info of that buffer
    sharp(input) // Let's start a new sharp on the underside image 
      .resize(widthimage,heightimage,{
        fit: sharp.fit.fill
    }) // Resize the underside image
      .composite([{     
        input: data 
      // Pass in the buffer data to the composite function
      ,gravity: "southeast",
        left: widthimage - 70,
        top:heightimage-70,
        hasOffset: true,
      }])
      .toFile('output.jpg', function(err) {
        console.log("Error: ", err)
      });
    console.log(info);
    res.send("sUCCESS");
  })
  .catch(err => { 
    console.log("Error: ", err);
  });
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))