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
                const { agent: agentName, userType, policy_mode, producer, policy_number, premium_amount_written, premium_amount, policy_type, company_name, category_name, policy_start_date, policy_end_date, csr, account_name, email, gender, firstname, city, account_type, phone, address, state, zip, dob, primary, 'Applicant ID': applicant_id, agency_id, 'hasActive ClientPolicy': hasActiveClientPolicy } = row;

                const [agent, user, account, category, carrier] = await Promise.all([
                    agentService.create({ name: agentName }, session),
                    userService.create({ firstName: firstname, dob, address, phone, state, zip, email, gender, userType, city }, session),
                    accountService.create({ name: account_name, type: account_type }, session),
                    categoryService.create({ name: category_name }, session),
                    carrierService.create({ companyName: company_name }, session)
                ]);

                await policyService.create({
                    policyNumber: policy_number,
                    startDate: policy_start_date,
                    endDate: policy_end_date,
                    policyMode: policy_mode,
                    premiumAmountWritten: premium_amount_written,
                    premiumAmount: premium_amount,
                    policyType: policy_type,
                    csr,
                    producer,
                    primary,
                    applicantId: applicant_id,
                    agencyId: agency_id,
                    hasActiveClientPolicy,
                    category: category._id,
                    carrier: carrier._id,
                    user: user._id
                }, session);
            }

            await session.commitTransaction();
            session.endSession();

            parentPort.postMessage('All data inserted successfully with transaction');
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Transaction failed:', error);
            parentPort.postMessage('Worker transaction failed: ' + error.message);
            process.exit(1);
        }

        parentPort.postMessage('All data inserted successfully');
    } catch (err) {
        console.error('Worker failed:', err);
        parentPort.postMessage('Worker failed: ' + err.message);
        process.exit(1);
    }
})();
