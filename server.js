const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const CLIENT_ID = 'Ov23liKDMeACPWHnA2xa';
const CLIENT_SECRET = 'e318632c23675cbc2259170acf92f9795f4ec89c';

app.use(bodyParser.json());

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code
            },
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const username = userResponse.data.login;
        const avatarUrl = userResponse.data.avatar_url;

        res.redirect(`http://localhost:5500?username=${username}&avatar=${avatarUrl}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao realizar login com GitHub');
    }
});