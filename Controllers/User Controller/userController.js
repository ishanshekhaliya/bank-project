const express = require('express');
const router = express.Router();
const moment = require('moment');
const { v4: uuidv4 } = require("uuid");
const Bank = require('../../Models/BankModel/bankSckema');
const Branch = require('../../Models/BranchModel/branchSckema');
const User = require('../../Models/UserModel/userSchema');
const Numbers = require('../../Models/NumberModel/uniqueCodeSchema');

router.post('/', async (req, res) => {
    try {

        const { bankId, branchId, name, contactNo, email, isCreaditCard, isDebitCard, totalBalance, accountType } = req.body

        const bankExist = await Bank.findOne({ _id: bankId })
        if (!bankExist) {
            return res.send({ success: false, message: "Bank does not exist!" })
        }

        const branchExist = await Branch.findById({ _id: branchId })
        let branchBankCheck = branchExist.bankId

        if (String(branchBankCheck) !== bankId) {
            return res.send({ success: false, message: "Branch does not exist!" })
        }

        const generateNumericUUID = () => {
            let numericUUID = uuidv4().replace(/\D/g, "");
            return numericUUID.padEnd(20, "0").slice(0, 20);
        };

        const numberCheck = await Numbers.findOne()
        let uniqCode = `CUC${numberCheck.number + 1}`

        const accountNo = generateNumericUUID();

        const user = new User({
            bankId: bankId,
            branchId: branchId,
            name: name,
            contactNo: Number(contactNo),
            accountNo: Number(accountNo),
            email: email,
            isCreaditCard: isCreaditCard,
            isDebitCard: isDebitCard,
            totalBalance: Number(totalBalance),
            accountType: Number(accountType),
            customerUniqueCode: uniqCode,
            createdAt: moment().format(),
            updatedAt: moment().format()
        })

        const response = await user.save()

        if (response) {
            const response2 = await Numbers.findByIdAndUpdate(
                {
                    _id: numberCheck._id
                },
                {
                    $set: {
                        number: numberCheck.number + 1,
                    }
                }
            )
            return res.send({ success: true, message: "User Added Successfully!" })
        }

    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const response = await User.aggregate([
            {
                $lookup: {
                    from: "banks",
                    localField: "bankId",
                    foreignField: "_id",
                    as: "bank"
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchId",
                    foreignField: "_id",
                    as: "branch"
                }
            },
            {
                $addFields: {
                    bank: {
                        $mergeObjects: [
                            { $arrayElemAt: ["$bank", 0] },
                            { branch: { $arrayElemAt: ["$branch", 0] } }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "accountNo",
                    foreignField: "accountNo",
                    as: "transactions"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    contactNo: 1,
                    email: 1,
                    isCreaditCard: 1,
                    accountNo: 1,
                    transactions: 1,
                    isDebitCard: 1,
                    totalAmount: { $sum: "$transactions.amount" },
                    accountType: 1,
                    bank: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }

        ])
        if (response) {
            return res.send({ success: true, data: response })
        }

    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

router.put('/', async (req, res) => {

    try {
        const { _id, bankId, branchId, name, contactNo, email, isCreaditCard, isDebitCard, totalBalance, accountType } = req.body

        const userExist = await User.findOne({ _id: _id })
        if (!userExist) {
            return res.send({ success: false, message: "User does not exist!" })
        }

        const bankExist = await Bank.findOne({ _id: bankId })
        if (!bankExist) {
            return res.send({ success: false, message: "Bank does not exist!" })
        }

        const branchExist = await Branch.findById({ _id: branchId })
        let branchBankCheck = branchExist.bankId

        if (String(branchBankCheck) !== bankId) {
            return res.send({ success: false, message: "Branch does not exist!" })
        }

        const response = await User.findByIdAndUpdate(
            {
                _id: _id
            },
            {
                bankId: bankId,
                branchId: branchId,
                name: name,
                contactNo: Number(contactNo),
                email: email,
                isCreaditCard: isCreaditCard,
                isDebitCard: isDebitCard,
                totalBalance: Number(totalBalance),
                accountType: Number(accountType),
                updatedAt: moment().format()
            }
        )

        if (response) {
            return res.send({ success: true, message: "User Updated Successfully!" })
        }


    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})


module.exports = router