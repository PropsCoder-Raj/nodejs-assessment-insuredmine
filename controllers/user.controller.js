const { agentService } = require('../services/agent.service');
const { userService } = require('../services/user.service');
const { accountService } = require('../services/account.service');
const { carrierService } = require('../services/carrier.service');
const { categoryService } = require('../services/category.service');
const { policyService } = require('../services/policy.service');

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

module.exports = {
    getAllCollection
};
