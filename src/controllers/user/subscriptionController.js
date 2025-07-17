const { fetchUserById } = require("../../helper/user")
const { sendNotification } = require("../../helper/sendNotification")
const { logger } = require("../../utils/logger")

// Mock subscription data (in a real app, this would come from a database)
const MOCK_SUBSCRIPTIONS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Hobbyists, testers, and new users',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Create and print shipping labels',
      'Send letters and postcards (pay per piece sent)',
      'Store up to 10 contacts',
      'Limited support',
      'No API access',
      'Standard shipping rates',
      'No access to the Partner Program',
      'Manual one-by-one shipping & mailing only',
      'No batch import tools'
    ],
    included: [0, 1, 2],
    excluded: [3, 4, 5, 6, 7, 8],
    maxContacts: 10
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    description: 'Freelancers and side businesses',
    price: { monthly: 19, yearly: 182.4 },
    features: [
      'Create and print shipping labels',
      'Send letters and postcards (pay per piece sent)',
      'Store up to 50 contacts',
      'Priority support',
      'Full API access',
      'Access to discounted shipping rates',
      'Access to the Partner Program',
      'Manual one-by-one shipping & mailing only',
      'No batch import tools'
    ],
    included: [0, 1, 2, 3, 4, 5, 6],
    excluded: [7, 8],
    maxContacts: 50
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Teams and growing businesses',
    price: { monthly: 49, yearly: 470.4 },
    features: [
      'Create and print shipping labels',
      'Send letters and postcards (pay per piece sent)',
      'Store unlimited contacts',
      'Priority support',
      'Full API access',
      'Access to discounted shipping rates',
      'Access to the Partner Program',
      'Batch shipping & mailing tools',
      'Import/export for contacts/campaigns'
    ],
    included: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    excluded: [],
    maxContacts: -1 // unlimited
  }
};

// Get current user's subscription
const getCurrentSubscription = async (req, res) => {
  const userId = req.userId
  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // For now, return mock data. In a real app, this would come from a subscription table
    const currentPlan = user.subscriptionPlan || 'starter'
    const subscription = MOCK_SUBSCRIPTIONS[currentPlan]
    
    const currentDate = new Date()
    const renewalDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    return res.status(200).json({
      success: true,
      data: {
        plan: currentPlan,
        status: user.subscriptionStatus || 'active',
        currentPeriodEnd: renewalDate.toISOString(),
        billingCycle: user.billingCycle || 'monthly',
        features: subscription.features,
        included: subscription.included,
        excluded: subscription.excluded,
        maxContacts: subscription.maxContacts,
        price: subscription.price
      }
    })
  } catch (error) {
    const err = { message: "Failed to fetch current subscription", error: error }
    logger.error(err)
    return res.status(500).json(err)
  }
}

// Get all available subscription plans
const getSubscriptionPlans = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: Object.values(MOCK_SUBSCRIPTIONS)
    })
  } catch (error) {
    const err = { message: "Failed to fetch subscription plans", error: error }
    logger.error(err)
    return res.status(500).json(err)
  }
}

// Upgrade subscription plan
const upgradeSubscription = async (req, res) => {
  const userId = req.userId
  const { planId, billingCycle = 'monthly' } = req.body

  try {
    if (!planId) {
      return res.status(400).json({ message: "Plan ID is required" })
    }

    if (!MOCK_SUBSCRIPTIONS[planId]) {
      return res.status(400).json({ message: "Invalid plan selected" })
    }

    const user = await fetchUserById(userId, true)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user subscription (in a real app, this would update a subscription table)
    user.subscriptionPlan = planId
    user.billingCycle = billingCycle
    user.subscriptionStatus = 'active'
    user.subscriptionUpdatedAt = new Date()
    
    await user.save()

    // Send notification
    await sendNotification({
      user: user,
      message: `Your subscription has been upgraded to ${MOCK_SUBSCRIPTIONS[planId].name} plan.`,
      emailMessage: `<p>Your subscription has been successfully upgraded to ${MOCK_SUBSCRIPTIONS[planId].name} plan.</p>`,
      emailSubject: "Subscription Upgraded",
    })

    return res.status(200).json({
      success: true,
      data: {
        message: `Successfully upgraded to ${MOCK_SUBSCRIPTIONS[planId].name} plan`,
        plan: planId,
        billingCycle,
        status: 'active'
      }
    })
  } catch (error) {
    const err = { message: "Failed to upgrade subscription", error: error }
    logger.error(err)
    return res.status(500).json(err)
  }
}

// Cancel subscription
const cancelSubscription = async (req, res) => {
  const userId = req.userId

  try {
    const user = await fetchUserById(userId, true)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user subscription status
    user.subscriptionStatus = 'cancelled'
    user.subscriptionCancelledAt = new Date()
    
    await user.save()

    // Send notification
    await sendNotification({
      user: user,
      message: "Your subscription has been cancelled. You can still use the service until the end of your billing period.",
      emailMessage: `<p>Your subscription has been cancelled. You can still use the service until the end of your billing period.</p>`,
      emailSubject: "Subscription Cancelled",
    })

    return res.status(200).json({
      success: true,
      data: {
        message: "Subscription cancelled successfully",
        status: 'cancelled'
      }
    })
  } catch (error) {
    const err = { message: "Failed to cancel subscription", error: error }
    logger.error(err)
    return res.status(500).json(err)
  }
}

// Get subscription billing cycle
const getBillingCycle = async (req, res) => {
  const userId = req.userId

  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({
      success: true,
      data: {
        billingCycle: user.billingCycle || 'monthly',
        plan: user.subscriptionPlan || 'starter',
        price: MOCK_SUBSCRIPTIONS[user.subscriptionPlan || 'starter'].price
      }
    })
  } catch (error) {
    const err = { message: "Failed to fetch billing cycle", error: error }
    logger.error(err)
    return res.status(500).json(err)
  }
}

// Get next renewal date
const getRenewalDate = async (req, res) => {
  const userId = req.userId

  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Calculate renewal date based on billing cycle
    const currentDate = new Date()
    let renewalDate
    
    if (user.billingCycle === 'yearly') {
      renewalDate = new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    } else {
      renewalDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    }

    return res.status(200).json({
      success: true,
      data: {
        renewalDate: renewalDate.toISOString(),
        billingCycle: user.billingCycle || 'monthly',
        status: user.subscriptionStatus || 'active'
      }
    })
  } catch (error) {
    const err = { message: "Failed to fetch renewal date", error: error }
    logger.error(err)
    return res.status(500).json(err)
  }
}

module.exports = {
  getCurrentSubscription,
  getSubscriptionPlans,
  upgradeSubscription,
  cancelSubscription,
  getBillingCycle,
  getRenewalDate
} 