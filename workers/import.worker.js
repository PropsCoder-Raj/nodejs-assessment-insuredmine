const mongoose = require('mongoose');
require('dotenv').config();
const { workerData, parentPort } = require('worker_threads');
const XLSX = require('xlsx');

const { agentService } = require('../services/agent.service');
const { userService } = require('../services/user.service');
const { accountService } = require('../services/account.service');
const { categoryService } = require('../services/category.service');
const { carrierService } = require('../services/carrier.service');
const { policyService } = require('../services/policy.service');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const workbook = XLSX.readFile(workerData.filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const CHUNK_SIZE = 250;
        const chunks = [];
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            chunks.push(data.slice(i, i + CHUNK_SIZE));
        }

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            const session = await mongoose.startSession();

            try {
                await session.withTransaction(async () => {
                    for (const row of chunk) {
                        const { agent: agentName, userType, policy_number, company_name, category_name, policy_start_date, policy_end_date, account_name, email, gender, firstname, phone, address, state, zip, dob } = row;

                        const [agent, user, account, category, carrier] = await Promise.all([
                            agentService.upsert({ name: agentName }, { name: agentName }, session),
                            userService.create({ firstName: firstname, dob, address, phone, state, zip, email, gender, userType }, session),
                            accountService.upsert({ name: account_name }, { name: account_name }, session),
                            categoryService.upsert({ name: category_name }, { name: category_name }, session),
                            carrierService.upsert({ companyName: company_name }, { companyName: company_name }, session)
                        ]);

                        if (!user || !user[0]?._id || !carrier?._id || !category?._id) {
                            throw new Error(`Missing required references in chunk ${i + 1}`);
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
                });

                await session.endSession();
                console.log(`Chunk ${i + 1} processed successfully`);
            } catch (chunkErr) {
                await session.abortTransaction();
                await session.endSession();
                console.error(`Chunk ${i + 1} failed:`, chunkErr);
                throw chunkErr;
            }
        }

        parentPort.postMessage('All chunks inserted successfully');
        process.exit(0);
    } catch (err) {
        console.error('Worker failed:', err);
        parentPort.postMessage('Worker failed: ' + err.message);
        process.exit(1);
    }
})();
