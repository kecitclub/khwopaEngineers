const bcrypt = require('bcrypt');

function hashPassword(password) {
    const saltRounds = 'PASSWORD_DEFAULT'; // Number of salt rounds for bcrypt

    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

const password = 'Test@123';

hashPassword(password)
    .then((hashedPassword) => {
        console.log('Hashed password:', hashedPassword);
        // Store the hashedPassword in the database
    })
    .catch((err) => {
        console.error('Error hashing password:', err);
    });