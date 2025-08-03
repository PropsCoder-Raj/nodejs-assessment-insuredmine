const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Worker connected to MongoDB');

        const { workerData, parentPort } = require('worker_threads');
        const XLSX = require('xlsx');

        const { agentService } = require('../services/agent.service');
        const { userService } = require('../services/user.service');
        const { accountService } = require('../services/account.service');
        const { categoryService } = require('../services/category.service');
        const { carrierService } = require('../services/carrier.service');
        const { policyService } = require('../services/policy.service');

        const workbook = XLSX.readFile(workerData.filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            for (const row of data) {
                const { agent: agentName, userType, policy_number, company_name, category_name, policy_start_date, policy_end_date, account_name, email, gender, firstname, phone, address, state, zip, dob } = row;

                const [agent, user, account, category, carrier] = await Promise.all([
                    agentService.upsert({ name: agentName }, { name: agentName }, session),
                    userService.create({ firstName: firstname, dob, address, phone, state, zip, email, gender, userType }, session),
                    accountService.upsert({ name: account_name }, { name: account_name }, session),
                    categoryService.upsert({ name: category_name }, { name: category_name }, session),
                    carrierService.upsert({ companyName: company_name }, { companyName: company_name }, session)
                ]);

                if (user.length == 0 || !carrier?._id || !category?._id) {
                    throw new Error('One or more references are missing before creating policy');
                }
                
                await policyService.create({
                    policyNumber: policy_number,
                    startDate: policy_start_date,
                    endDate: policy_end_date,
                    category: category._id,
                    carrier: carrier._id,
                    user: user[0]._id
                }, session);
            }

            await session.commitTransaction();
            session.endSession();

            parentPort.postMessage('All data inserted successfully with transaction');
            process.exit();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Transaction failed:', error);
            parentPort.postMessage('Worker transaction failed: ' + error.message);
            process.exit(1);
        }
    } catch (err) {
        console.error('Worker failed:', err);
        parentPort.postMessage('Worker failed: ' + err.message);
        process.exit(1);
    }
})();
