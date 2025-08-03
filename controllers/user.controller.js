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

    worker.on('message', (msg) => {
        console.log('Worker:', msg);
    });

    worker.on('error', (err) => {
        console.error('Error:', err);
        res.status(500).json({
            status: false, message: 'Worker encountered an error', error: err.message
        });
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            res.status(500).json({ status: false, message: 'Worker thread exited with error', exitCode: code });
        }

        res.status(200).json({ status: true, message: 'File processed successfully' });
    });
};

module.exports = {
    getAllCollection,
    uploadData
};
