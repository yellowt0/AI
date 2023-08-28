const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
const sharp = require('sharp');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json({limit: '10mb'}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/save-image', (req, res) => {
    const imageData = req.body.imageData.split(',')[1]; // Remove the "data:image/png;base64," part

    fs.writeFile('bg.png', imageData, 'base64', err => {
        if (err) {
            console.error("Error saving the image.", err);
            res.status(500).send('Error saving the image.');
        } else {
            res.send('Image saved.');
        }
    });


    
});




app.post('/remove-bg', (req, res) => {
    const inputPath = 'bg.png';
    const formData = new FormData();
    formData.append('preview', 'person');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

    axios({
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: formData,
    responseType: 'arraybuffer',
    headers: {
        ...formData.getHeaders(),
        'X-Api-Key': 'qZJEJZHBiD52rtyQFE2JiKat',
    },
    encoding: null
    })
    .then((response) => {
    if(response.status != 200) return console.error('Error:', response.status, response.statusText);
    fs.writeFileSync("no-bg.png", response.data);
    let base64Image = `data:image/png;base64,${response.data.toString('base64')}`;
        res.send({ imgData: base64Image });
    })
    .catch((error) => {
        return console.error('Request failed:', error);
    });

});


app.post('/dalle', async (req, res) => {
  
  

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);
    try {
        const response = await openai.createImageEdit(
            fs.createReadStream("bg.png"),
            " furtre style deco living room, wide lens effect, wabisabi",
            fs.createReadStream("no-bg.png"),
            1,
            "256x256"
        );
        res.json({ imageUrl: response.data.data[0].url });
    } catch (error) {
        res.status(500).json({ error: "Error processing request." });
        console.error(error);
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


