require('dotenv').config()
const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/subscribe', async(req, res) => {
    if(!req.body.captcha ||req.body.captcha === "") {
        return res.send({
            success: false,
            message: "Please Check Captcha"
        });
    }

    // Site key -> client
    // Secret key -> Server
    const secretKey = process.env.SECRET_KEY_CAPTCHA;

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`;

    // Make request to verify URL
    try {
        const response = await axios(verifyUrl);
        if(!response.data.success) {
            return res.send({
                success: false,
                message: "Failed captcha verification!"
            });
        }

        // If successful
        return res.send({
            success: true,
            message: "Captcha verification success!",

        })

    } catch (error) {
        console.log("catch error: ", error);
    }
 

});

app.listen(3000, () => {
    console.log("Server Running on port 3000!");
});
