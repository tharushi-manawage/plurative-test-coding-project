require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { dirname, join } = require('path');
const { fileURLToPath } = require('url');
const authRouter = require('./routes/auth-routes.js');
const userRouter = require('./routes/user-routes.js');

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

const app = express();
const PORT = process.env.PORT;
const corsOptions = { credentials: true, origin: process.env.URL || '*' };

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/', express.static(join(__dirname, 'public')));
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
    res.render('index');
});

// app.post('/auth', (req, res) => {
//     let token = req.body.token;

//     async function verify() {
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: CLIENT_ID,
//         });
//         const payload = ticket.getPayload();
//         const userid = payload['sub'];
//         console.log(payload);
//       }
//       verify()
//       .then(() => {
//           res.cookie('session-token', token);
//           res.send('success')
//       })
//       .catch(console.error);

//       const accessToken = generateAccessToken(payload);
//       const refreshToken = jwt.sign(playload, process.env.REFRESH_TOKEN_SECRET)
//       refreshTokens.push(refreshToken)
//       res.json({ accessToken: accessToken, refreshToken: refreshToken })

//       console.log(token);
// })

// router.get('/auth-callback', async (req, res) => {
//         const { code } = req.query;
//         const { token } = await client.getToken(code);
//         client.setCredentials(token);
      
//         const { data } = await client.request({
//             url: 'https://www.googleapis.com/oauth2/v1/userinfo',
//         });
//         res.redirect(process.env.APP_DOMAIN_URI);
//       });

// let refreshTokens = []

// app.post('/token', (req, res) => {
//     const refreshToken = req.body.token;
//     if (refreshToken == null) return res.sendStatus(401)
//     if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, playload) => {
//         if (err) return res.sendStatus(403)
//         const accessToken = generateAccessToken({name: playload.name})
//         res.json({ accessToken: accessToken })
//     })
// })

// app.get('/logout', (req, res) => {
//     res.clearCookie('session-token');
//     res.redirect('/login')
// })

// function checkAuthenticated(req, res, next) {
//     let token = req.cookies['session-token'];

//     let user = {};
//     async function verify() {
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: CLIENT_ID,
//         });
//         const payload = ticket.getPayload();
//         user.name = payload.name;
//         user.email = payload.email;
//         user.picture = payload.picture;
//     }
//     verify()
//     .then(() => {
//         req.user = user;
//         next();
//     })
//     .catch(err => {
//         res.redirect('/login')
//     })
// }

// function generateAccessToken(payload) {
//     return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
// }

app.listen(PORT, () => {
    console.log(`Server listening and running on port ${PORT}`);
})