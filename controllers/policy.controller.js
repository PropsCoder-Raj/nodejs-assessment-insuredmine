const { userService } = require('../services/user.service');
const { policyService } = require('../services/policy.service');

const getPolicyByUsername = async (req, res) => {
  try {
    const { name } = req.params;

    const user = await userService.findOne({ firstName: { $regex: new RegExp(name, 'i') } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const policies = await policyService.list({ user: user._id }, ['category', 'carrier']);

    return res.status(200).json({
      status: true,
      message: 'Policies fetched successfully',
      data: policies
    });
  } catch (error) {
    console.error('❌ Error in getPolicyByUsername:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getPolicyByUsername
};
