const { agentService } = require('../services/agent.service');
const { userService } = require('../services/user.service');
const { accountService } = require('../services/account.service');
const { carrierService } = require('../services/carrier.service');
const { categoryService } = require('../services/category.service');
const { policyService } = require('../services/policy.service');

const path = require('path');
const { Worker } = require('worker_threads');

const getAllCollection = async (req, res) => {
    try {
        const [agents, users, accounts, carriers, categories, policies] = await Promise.all([
            agentService.list(),
            userService.list(),
            accountService.list(),
            carrierService.list(),
            categoryService.list(),
            policyService.list()
        ]);

        return res.status(200).json({
            status: true,
            message: 'Fetched all collections',
            data: {
                agents,
                users,
                accounts,
                carriers,
                categories,
                policies
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch collections',
            error: error.message
        });
    }
}

const uploadData = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: false,
            message: 'File not provided'
        });
    }

    const worker = new Worker(path.join(__dirname, '../workers/import.worker.js'), {
        workerData: { filePath: req.file.path }
    });

    let responded = false;

    worker.on('message', (msg) => {
        if (!responded) {
            responded = true;
            res.status(200).json({ status: true, message: msg });
        }
    });

    worker.on('error', (err) => {
        if (!responded) {
            responded = true;
            res.status(500).json({ status: false, message: 'Worker encountered an error', error: err.message });
        }
    });

    worker.on('exit', (code) => {
        if (code !== 0 && !responded) {
            responded = true;
            res.status(500).json({ status: false, message: `Worker exited with code ${code}` });
        }
    });
};

module.exports = {
    getAllCollection,
    uploadData
};
