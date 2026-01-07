const bcrypt = require('bcryptjs');

const password = 'password123'; // The password you want to set

async function generateHash() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(`\nPassword: ${password}`);
    console.log(`Hash: ${hash}\n`);
}

generateHash();
