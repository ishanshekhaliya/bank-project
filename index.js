const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');
require('dotenv').config();
const port = process.env.PORT;
require('./db')
const User = require('./Models/UserModel/userSchema');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())



const bankController = require('./Controllers/Bank Controller/bankController')
const branchController = require('./Controllers/Branch Controller/branchController')
const staffController = require('./Controllers/Staff Controller/staffController')
const userController = require('./Controllers/User Controller/userController')
const transactionController = require('./Controllers/TransactionController/transactionController');

app.use('/bank', bankController)
app.use('/branch', branchController)
app.use('/staff', staffController)
app.use('/user', userController)
app.use('/transaction', transactionController)

// async function UniqCodeAdd() {
//     try {
//         const users = await User.find();

//         users.forEach(async (user, i) => {

//             let uniqueCode = `CUC${i + 1}`
// const response = await User.findByIdAndUpdate(
//     {
//         _id: user._id
//     },
//     {
//         $set: {
//             customerUniqueCode: uniqueCode,
//         }
//     }
// )
//             if (response) {
//                 console.log(`User ${user.name} has been updated with Unique Code: ${uniqueCode}`);
//             }
//         })

//     } catch (error) {
//         console.error('Error updating users:', error);
//     }
// }

// UniqCodeAdd();


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});