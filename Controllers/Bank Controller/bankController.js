const express = require('express');
const Bank = require('../../Models/BankModel/bankSckema');
const router = express.Router();
const moment = require('moment')

router.post('/', async (req, res) => {
    try {
        const { bankName, shareName, sharePrice } = req.body

        const bankExist = await Bank.findOne({ bankName: bankName })
        if (bankExist) {
            return res.send({ success: false, message: "Bank already exists!" })
        }

        if (!bankName || !shareName || !sharePrice) {
            return res.send({ success: false, message: "All Fields are required!" })
        }

        const bank = new Bank({
            bankName: bankName,
            shareName: shareName,
            sharePrice: sharePrice
        })

        const response = await bank.save()

        if (response) {
            return res.send({ success: true, message: "Bank Added Successfully!" })
        }


    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const response = await Bank.aggregate([
            {
                $lookup: {
                    from: "branches",
                    localField: "_id",
                    foreignField: "bankId",
                    as: "branchData"
                }
            },
            {
                $unwind: "$branchData"
            },
            {
                $lookup: {
                    from: "staffs",
                    localField: "branchData._id",
                    foreignField: "branchId",
                    as: "branchData.staffData"
                }
            },
            {
                $addFields: {
                    "branchData.totalStaff": { $size: "$branchData.staffData" },
                }
            },
            {
                $group: {
                    _id: "$_id",
                    bankName: { $first: "$bankName" },
                    shareName: { $first: "$shareName" },
                    sharePrice: { $first: "$sharePrice" },
                    branchData: { $push: "$branchData" },
                    updatedAt: { $first: "$updatedAt" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "_id",
                    foreignField: "bankId",
                    as: "userData"
                }
            },
            {
                $project: {
                    _id: 1,
                    bankName: 1,
                    shareName: 1,
                    sharePrice: 1,
                    totalBranches: { $size: "$branchData" },
                    totalCustomers: { $size: "$userData" },
                    branchData: 1,
                    userData:1,
                    updatedAt: 1,
                    createdAt: 1
                }
            },
        ])

        if (response) {
            return res.send({ success: true, data: response })
        }

    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

router.put('/', async (req, res) => {
    try {

        const { _id, bankName, shareName, sharePrice } = req.body

        const bankExist = await Bank.findOne({ _id: _id })
        if (!bankExist) {
            return res.send({ success: false, message: "Bank does not exist!" })
        }

        const bankNameExist = bankExist?.bankName
        if (bankNameExist && bankNameExist !== bankName) {
            return res.send({ success: false, message: "Bank Name already exists!" })
        }


        const response = await Bank.findByIdAndUpdate(
            {
                _id: _id
            },
            {
                bankName: bankName,
                shareName: shareName,
                sharePrice: sharePrice,
                updatedAt: moment().format()
            }
        )

        if (response) {
            return res.send({ success: true, message: "Bank Updated Successfully!" })
        }

    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

module.exports = router