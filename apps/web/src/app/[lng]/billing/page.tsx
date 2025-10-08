import { prisma } from '@/server/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// Mock current user - replace with your auth solution
const MOCK_USER_EMAIL = 'demo@example.com'

export default async function BillingPage() {
  // Ensure demo user exists
  let user = await prisma.user.findUnique({ where: { email: MOCK_USER_EMAIL } })
  if (!user) {
    user = await prisma.user.create({ data: { email: MOCK_USER_EMAIL } })
  }

  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } })
  const credits = await prisma.credit.findUnique({ where: { userId: user.id } })

  const currentPlan = subscription?.plan || 'FREE'
  const currentStatus = subscription?.status || 'N/A'

  const buyLinkMonth = process.env.LEMONSQUEEZY_BUY_LINK_MONTH || '#'
  const buyLinkYear = process.env.LEMONSQUEEZY_BUY_LINK_YEAR || '#'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Billing & Credits</h1>
        <p className="text-slate-600 mb-8">Manage your subscription and usage</p>

        {/* Current Plan Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Current Plan</h2>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-blue-600">{currentPlan}</span>
            <span className="text-sm text-slate-500">Status: {currentStatus}</span>
          </div>
          {subscription?.renewsAt && (
            <p className="text-sm text-slate-600">
              Renews: {new Date(subscription.renewsAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Credits Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Available Credits</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-purple-700 font-medium mb-1">Clip Credits</p>
              <p className="text-3xl font-bold text-purple-900">{credits?.clip || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <p className="text-sm text-emerald-700 font-medium mb-1">L10n Credits</p>
              <p className="text-3xl font-bold text-emerald-900">{credits?.l10n || 0}</p>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Upgrade Your Plan</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Monthly Plan */}
            <div className="border border-slate-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Monthly</h3>
              <p className="text-3xl font-bold text-slate-900 mb-1">$29<span className="text-base font-normal text-slate-500">/mo</span></p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>✓ 100 Clip credits/mo</li>
                <li>✓ 300 L10n credits/mo</li>
                <li>✓ Priority support</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <a
                href={buyLinkMonth}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Subscribe Monthly
              </a>
            </div>

            {/* Yearly Plan */}
            <div className="border-2 border-blue-500 rounded-lg p-6 relative hover:border-blue-600 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Yearly</h3>
              <p className="text-3xl font-bold text-slate-900 mb-1">$290<span className="text-base font-normal text-slate-500">/year</span></p>
              <p className="text-sm text-emerald-600 font-semibold mb-4">Save $58 (2 months free)</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>✓ 150 Clip credits/mo</li>
                <li>✓ 500 L10n credits/mo</li>
                <li>✓ Priority support</li>
                <li>✓ Annual billing</li>
              </ul>
              <a
                href={buyLinkYear}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Subscribe Yearly
              </a>
            </div>
          </div>

          {/* Setup Notice */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Setup Required:</strong> Replace <code className="bg-amber-100 px-1 rounded">LEMONSQUEEZY_BUY_LINK_MONTH</code> and{' '}
              <code className="bg-amber-100 px-1 rounded">LEMONSQUEEZY_BUY_LINK_YEAR</code> in your environment variables with actual Lemon Squeezy checkout URLs.
            </p>
          </div>
        </div>

        {/* Dev Tools */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-slate-800 text-slate-100 rounded-lg">
            <p className="text-sm font-semibold mb-2">🛠️ DEV TOOLS</p>
            <p className="text-xs text-slate-400 mb-3">Test endpoints (only available in development):</p>
            <div className="space-y-2">
              <Link href={`/api/dev/grant-pro?email=${MOCK_USER_EMAIL}`} className="block text-xs text-blue-400 hover:text-blue-300">
                → Grant PRO to {MOCK_USER_EMAIL}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
