const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const moment = require('moment');
const Bank = require('../../Models/BankModel/bankSckema');
const Branch = require('../../Models/BranchModel/branchSckema');
const Staff = require('../../Models/StaffModal/staffSchema');


router.post('/', async (req, res) => {
    try {

        const { bankId, branchId, name, contactNo, type, salary, email } = req.body

        const bankExist = await Bank.findOne({ _id: bankId })
        if (!bankExist) {
            return res.send({ success: false, message: "Bank does not exist!" })
        }

        const branchExist = await Branch.findById({ _id: branchId })

        let branchBankCheck = branchExist.bankId

        if (String(branchBankCheck) !== bankId) {
            return res.send({ success: false, message: "Branch does not exist!" })
        }

        const staffExist = await Staff.findOne({ name: name })
        if (staffExist) {
            return res.send({ success: false, message: "Staff already exists!" })
        }

        if (!bankId || !branchId || !name || !contactNo || !type || !salary || !email) {
            return res.send({ success: false, message: "All fields are required!" })
        }

        const staff = new Staff({
            bankId: bankId,
            branchId: branchId,
            name: name,
            contactNo: Number(contactNo),
            type: Number(type),
            salary: Number(salary),
            email: email,
        })

        const response = await staff.save()
        if (response) {
            return res.send({ success: true, message: "Staff Added Successfully!" })
        }

    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

router.get('/getAll', async (req, res) => {
    try {

        const response = await Staff.aggregate([
            {
                $lookup: {
                    from: "banks",
                    localField: "bankId",
                    foreignField: "_id",
                    as: "bank"
                }
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
                $project: {
                    _id: 1,
                    bankId: 1,
                    branchId: 1,
                    name: 1,
                    contactNo: 1,
                    salary: 1,
                    email: 1,
                    type: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$type", 0] }, then: "Manager" },
                                { case: { $eq: ["$type", 1] }, then: "Clerk" },
                                { case: { $eq: ["$type", 2] }, then: "Cashier" },
                                { case: { $eq: ["$type", 3] }, then: "Loan Officer" },
                                { case: { $eq: ["$type", 4] }, then: "Security" },
                            ],
                            default: null
                        }
                    },
                    bank: { $arrayElemAt: ["$bank", 0] },
                    branch: { $arrayElemAt: ["$branch", 0] },
                    createdAt: 1,
                    updatedAt: 1
                }
            }
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

        const { _id, bankId, branchId, name, contactNo, type, salary, email } = req.body

        const staffExist = await Staff.findOne({ _id: _id })
        if (!staffExist) {
            return res.send({ success: false, message: "Staff does not exist!" })
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

        const response = await Staff.findByIdAndUpdate(
            {
                _id: _id
            },
            {
                bankId: bankId,
                branchId: branchId,
                name: name,
                email: email,
                contactNo: Number(contactNo),
                type: Number(type),
                salary: Number(salary),
                updatedAt: moment().format()
            }
        )

        if (response) {
            return res.send({ success: true, message: "Staff Updated Successfully!" })
        }

    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "Something Went Wrong!" })
    }
})

module.exports = router