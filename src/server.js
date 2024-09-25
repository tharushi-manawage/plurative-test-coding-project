const app = require("./app.js");

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening and running on port ${PORT}`);
});