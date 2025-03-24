const express = require('express');
const Bank = require('../../Models/BankModel/bankSckema');
const router = express.Router();
const moment = require('moment');
const Branch = require('../../Models/BranchModel/branchSckema');

router.post('/', async (req, res) => {
    try {

        const { bankId, branchName, IFSCCode, address } = req.body

        const bankExist = await Bank.findOne({ _id: bankId })
        if (!bankExist) {
            return res.send({ success: false, message: "Bank does not exist!" })
        }

        const branchExist = await Branch.findOne({ branchName: branchName })

        if (branchExist) {
            return res.send({ success: false, message: "Branch already exists!" })
        }

        const branch = new Branch({
            bankId: bankId,
            branchName: branchName,
            IFSCCode: IFSCCode,
            address: address,
        })

        const response = await branch.save()
        if (response) {
            return res.send({ success: true, message: "Branch Added Successfully!" })
        }

    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const response = await Branch.aggregate([
            {
                $lookup: {
                    from: "staffs",
                    localField: "_id",
                    foreignField: "branchId",
                    as: "staffData"
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "_id",
                    foreignField: "branchId",
                    as: "userData"
                }
            },
            {
                $addFields: {
                    totalStaff: { $size: "$staffData" },
                    totalCustomer: { $size: "$userData" },
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

        const { _id, bankId, branchName, IFSCCode, address } = req.body

        const branchExist = await Branch.findOne({ _id: _id })
        if (!branchExist) {
            return res.send({ success: false, message: "Branch does not exist!" })
        }
        const bankExist = await Bank.findOne({ _id: bankId })
        if (!bankExist) {
            return res.send({ success: false, message: "Bank does not exist!" })
        }

        const branchNameExist = branchExist.branchName
        if (branchNameExist && branchNameExist !== branchName) {
            return res.send({ success: false, message: "Branch Name already exists!" })
        }

        const response = await Branch.findByIdAndUpdate(
            {
                _id: _id
            },
            {
                bankId: bankId,
                branchName: branchName,
                IFSCCode: IFSCCode,
                address: address,
                updatedAt: moment().format()
            }
        )

        if (response) {
            return res.send({ success: true, message: "Branch Updated Successfully!" })
        } else {

        }

    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

module.exports = router