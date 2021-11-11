const express = require('express')
const app = express()
const port = 3000
const sharp = require('sharp')

app.get('/', async (req, res) => {

  const width = Number(req.query.widthqr);
  let widthimage = Number(req.query.widthimage);
  let heightimage = Number(req.query.heightimage);

 await   sharp('./images/qr_1.png')
  .resize(width, width) // Resize the image
  .toBuffer({ resolveWithObject: true }) // We want it to a buffer
  .then( ({ data, info }) => {  // We now have the data / info of that buffer
    sharp('./images/novbanner.jpeg') // Let's start a new sharp on the underside image 
      .resize(widthimage,heightimage) // Resize the underside image
      .composite([{     
        input: data // Pass in the buffer data to the composite function
      }])
      .toFile('output.jpg', function(err) {
        console.log("Error: ", err)
      });
    console.log(info);
  })
  .catch(err => { 
    console.log("Error: ", err);
  });
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))