const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const moment = require('moment');
const User = require('../../Models/UserModel/userSchema');
const Transaction = require('../../Models/TransactionModel/transactionSchema');

router.post('/', async (req, res) => {
    try {
        const { accountNo, type, amount } = req.body

        const accountExist = await User.findOne({ accountNo: accountNo })
        if (!accountExist) {
            return res.send({ success: false, message: "Account does not exist!" })
        }

        // let currentBalance
        // if (currentBalance === undefined) {
        //     currentBalance = 0
        // }else{
        //     currentBalance = accountExist.balance
        // }

        let fAmount
        if (Number(type) === 1) {
            fAmount = -Number(amount)
        } else {
            fAmount = Number(amount)
        }

        // if(fAmount)
        // console.log(currentBalance, fAmount)

        const transaction = new Transaction({
            accountNo: Number(accountNo),
            type: Number(type),
            amount: fAmount,
        })

        const response = await transaction.save()

        if (response) {
            res.send({ success: true, message: "Transaction successful!" })
        }

    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

router.get('/getAll', async (req, res) => {
    try {

        const response = await Transaction.find()

        if (response) {
            return res.send({ success: true, data: response })
        }

    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

module.exports = router