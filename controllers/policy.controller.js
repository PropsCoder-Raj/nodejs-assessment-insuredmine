const { userService } = require('../services/user.service');
const { policyService } = require('../services/policy.service');

const getPolicyByUsername = async (req, res) => {
  try {
    const { name } = req.params;

    const user = await userService.findOne({ firstName: { $regex: new RegExp(name, 'i') } });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const policies = await policyService.list({ user: user._id }, ['category', 'carrier']);

    return res.status(200).json({ status: true, message: 'Policies fetched successfully', data: policies });
  } catch (error) {
    console.error('Error in getPolicyByUsername:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
  }
};

const getAggregatedPolicies = async (req, res) => {
  try {
    const pipline = [
      {
        $group: {
          _id: '$user',
          totalPolicies: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users', // collection name (not model name)
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          firstName: '$user.firstName',
          email: '$user.email',
          totalPolicies: 1
        }
      }
    ];

    const aggregation = await policyService.aggregate(pipline);
    return res.status(200).json({ status: true, message: 'Policy aggregation by user', data: aggregation });
  } catch (error) {
    console.error('❌ Error in getAggregatedPolicies:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getPolicyByUsername,
  getAggregatedPolicies
};
