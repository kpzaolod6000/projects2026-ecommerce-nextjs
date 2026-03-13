'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  RefreshCcw,
  Clock,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatPrice } from '@/lib/utils'

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Pending' | 'Cancelled' | 'Refunded'

interface Order {
  id: string
  customer: string
  email: string
  items: number
  amount: number
  status: OrderStatus
  method: string
  date: string
}

const orders: Order[] = [
  { id: 'TS-001284', customer: 'Alex Johnson', email: 'alex@example.com', items: 2, amount: 1799.99, status: 'Delivered', method: 'Visa •••• 4242', date: '2026-02-19' },
  { id: 'TS-001283', customer: 'Maria Garcia', email: 'maria@example.com', items: 1, amount: 349.99, status: 'Shipped', method: 'Mastercard •••• 1234', date: '2026-02-19' },
  { id: 'TS-001282', customer: 'James Lee', email: 'james@example.com', items: 3, amount: 3499.99, status: 'Processing', method: 'PayPal', date: '2026-02-18' },
  { id: 'TS-001281', customer: 'Sarah Kim', email: 'sarah@example.com', items: 1, amount: 229.97, status: 'Delivered', method: 'Visa •••• 5678', date: '2026-02-18' },
  { id: 'TS-001280', customer: 'Robert Chen', email: 'robert@example.com', items: 1, amount: 999.99, status: 'Pending', method: 'Bank Transfer', date: '2026-02-17' },
  { id: 'TS-001279', customer: 'Emma Wilson', email: 'emma@example.com', items: 4, amount: 569.96, status: 'Delivered', method: 'Amex •••• 9999', date: '2026-02-17' },
  { id: 'TS-001278', customer: 'Daniel Brown', email: 'daniel@example.com', items: 1, amount: 159.99, status: 'Cancelled', method: 'Visa •••• 3333', date: '2026-02-16' },
  { id: 'TS-001277', customer: 'Olivia Davis', email: 'olivia@example.com', items: 2, amount: 479.98, status: 'Refunded', method: 'Mastercard •••• 7777', date: '2026-02-16' },
  { id: 'TS-001276', customer: 'Liam Martinez', email: 'liam@example.com', items: 1, amount: 329.99, status: 'Shipped', method: 'Visa •••• 2020', date: '2026-02-15' },
  { id: 'TS-001275', customer: 'Sophia Anderson', email: 'sophia@example.com', items: 2, amount: 1079.98, status: 'Delivered', method: 'PayPal', date: '2026-02-15' },
]

const statusStyles: Record<OrderStatus, string> = {
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  Processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  Pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  Refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
}

const summaryStats = [
  { label: 'Total Revenue', value: formatPrice(9419.83), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-950', change: 'This month' },
  { label: 'Total Orders', value: '10', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950', change: 'Showing' },
  { label: 'Pending', value: '1', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-950', change: 'Awaiting payment' },
  { label: 'Refunded', value: formatPrice(479.98), icon: RefreshCcw, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-950', change: '1 order' },
]

const allStatuses: OrderStatus[] = ['Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled', 'Refunded']

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | OrderStatus>('all')

  const filtered = useMemo(() => {
    let list = [...orders]
    if (search) list = list.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()))
    if (status !== 'all') list = list.filter((o) => o.status === status)
    return list
  }, [search, status])

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Track and manage all orders and transactions</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-0.5 text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.change}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-40 h-9 text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All Statuses</SelectItem>
            {allStatuses.map((s) => (
              <SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Payment</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-primary font-medium">{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                          {order.customer.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-foreground">{order.customer}</p>
                        <p className="text-[10px] text-muted-foreground hidden sm:block">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-muted-foreground">{order.method}</p>
                    <p className="text-[10px] text-muted-foreground">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold text-foreground">{formatPrice(order.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold border-0 ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem className="text-xs gap-2">
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2">
                          <TrendingUp className="h-3.5 w-3.5" /> Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2 text-purple-600 focus:text-purple-600">
                          <RefreshCcw className="h-3.5 w-3.5" /> Refund
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No orders match your search.
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing <strong>{filtered.length}</strong> of <strong>{orders.length}</strong> orders
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" disabled>Prev</Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs bg-primary/10 text-primary border-primary/30">1</Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
