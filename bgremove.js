var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('image_file', fs.createReadStream('test.jpg'));

var config = {
  method: 'post',
  url: 'https://api.removal.ai/3.0/remove',
  headers: { 
    'Rm-Token': "64d67558dfda33.31498684", 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response));
})
.catch(function (error) {
  console.log(error);
});