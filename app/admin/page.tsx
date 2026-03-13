import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatPrice } from '@/lib/utils'

const stats = [
  {
    label: 'Total Revenue',
    value: formatPrice(128_450.75),
    change: '+14.2%',
    up: true,
    icon: DollarSign,
    sub: 'vs last month',
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-950',
  },
  {
    label: 'Total Orders',
    value: '1,284',
    change: '+8.1%',
    up: true,
    icon: ShoppingBag,
    sub: 'vs last month',
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-950',
  },
  {
    label: 'Active Products',
    value: '20',
    change: '+3',
    up: true,
    icon: Package,
    sub: 'added this month',
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-950',
  },
  {
    label: 'Registered Users',
    value: '3,741',
    change: '-2.3%',
    up: false,
    icon: Users,
    sub: 'vs last month',
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-950',
  },
]

const recentOrders = [
  { id: 'TS-001284', customer: 'Alex Johnson', email: 'alex@example.com', amount: 1799.99, status: 'Delivered', date: '2026-02-19' },
  { id: 'TS-001283', customer: 'Maria Garcia', email: 'maria@example.com', amount: 349.99, status: 'Shipped', date: '2026-02-19' },
  { id: 'TS-001282', customer: 'James Lee', email: 'james@example.com', amount: 3499.99, status: 'Processing', date: '2026-02-18' },
  { id: 'TS-001281', customer: 'Sarah Kim', email: 'sarah@example.com', amount: 229.97, status: 'Delivered', date: '2026-02-18' },
  { id: 'TS-001280', customer: 'Robert Chen', email: 'robert@example.com', amount: 999.99, status: 'Pending', date: '2026-02-17' },
]

const topProducts = [
  { name: 'Samsung 990 Pro 2TB SSD', sales: 89, revenue: 14239.11, trend: 'up' },
  { name: 'Logitech G502 HERO Mouse', sales: 74, revenue: 5179.26, trend: 'up' },
  { name: 'LG 27GP850-B Monitor', sales: 41, revenue: 14349.59, trend: 'down' },
  { name: 'Corsair K95 RGB Keyboard', sales: 38, revenue: 6839.62, trend: 'up' },
  { name: 'ASUS ROG Strix G16 Laptop', sales: 21, revenue: 37799.79, trend: 'up' },
]

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  Processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  Pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {s.up ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={s.up ? 'text-green-600' : 'text-red-500'}>{s.change}</span>
                    <span className="text-muted-foreground">{s.sub}</span>
                  </div>
                </div>
                <div className={`rounded-xl p-2.5 ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            <a href="/admin/payments" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Order</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Customer</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                              {order.customer.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{order.customer}</p>
                            <p className="text-[10px] text-muted-foreground hidden sm:block">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {order.date}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-foreground">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Top Products</CardTitle>
            <a href="/admin/products" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            {topProducts.map((p, i) => (
              <div key={p.name} className="border-b border-border last:border-0">
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs font-bold text-muted-foreground w-4 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-foreground">{formatPrice(p.revenue)}</p>
                    {p.trend === 'up' ? (
                      <TrendingUp className="ml-auto h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="ml-auto h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
