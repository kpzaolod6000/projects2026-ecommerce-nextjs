'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  MoreHorizontal,
  Ban,
  Mail,
  ShieldCheck,
  ShieldOff,
  UserCog,
  Download,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type UserRole = 'Admin' | 'Customer' | 'Manager'
type UserStatus = 'Active' | 'Inactive' | 'Banned'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  orders: number
  spent: number
  joined: string
  lastSeen: string
  country: string
}

const users: User[] = [
  { id: 'u-001', name: 'Alex Johnson', email: 'alex@example.com', role: 'Customer', status: 'Active', orders: 12, spent: 4521.87, joined: '2024-03-15', lastSeen: '2026-02-19', country: 'US' },
  { id: 'u-002', name: 'Maria Garcia', email: 'maria@example.com', role: 'Customer', status: 'Active', orders: 8, spent: 2340.50, joined: '2024-05-22', lastSeen: '2026-02-18', country: 'ES' },
  { id: 'u-003', name: 'James Lee', email: 'james@example.com', role: 'Manager', status: 'Active', orders: 3, spent: 8750.00, joined: '2023-11-01', lastSeen: '2026-02-19', country: 'KR' },
  { id: 'u-004', name: 'Sarah Kim', email: 'sarah@example.com', role: 'Customer', status: 'Active', orders: 21, spent: 6120.33, joined: '2024-01-10', lastSeen: '2026-02-17', country: 'US' },
  { id: 'u-005', name: 'Admin User', email: 'admin@techstore.com', role: 'Admin', status: 'Active', orders: 0, spent: 0, joined: '2023-01-01', lastSeen: '2026-02-20', country: 'US' },
  { id: 'u-006', name: 'Robert Chen', email: 'robert@example.com', role: 'Customer', status: 'Active', orders: 5, spent: 1899.95, joined: '2024-08-14', lastSeen: '2026-02-15', country: 'CN' },
  { id: 'u-007', name: 'Emma Wilson', email: 'emma@example.com', role: 'Customer', status: 'Inactive', orders: 2, spent: 569.98, joined: '2024-09-30', lastSeen: '2026-01-05', country: 'UK' },
  { id: 'u-008', name: 'Daniel Brown', email: 'daniel@example.com', role: 'Customer', status: 'Banned', orders: 1, spent: 159.99, joined: '2024-10-11', lastSeen: '2025-12-20', country: 'US' },
  { id: 'u-009', name: 'Olivia Davis', email: 'olivia@example.com', role: 'Customer', status: 'Active', orders: 7, spent: 3412.80, joined: '2024-02-28', lastSeen: '2026-02-16', country: 'CA' },
  { id: 'u-010', name: 'Liam Martinez', email: 'liam@example.com', role: 'Customer', status: 'Active', orders: 4, spent: 1329.96, joined: '2024-07-07', lastSeen: '2026-02-14', country: 'MX' },
]

const roleStyles: Record<UserRole, string> = {
  Admin: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  Manager: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  Customer: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const statusStyles: Record<UserStatus, string> = {
  Active: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  Inactive: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  Banned: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
}

const flagMap: Record<string, string> = { US: '🇺🇸', ES: '🇪🇸', KR: '🇰🇷', CN: '🇨🇳', UK: '🇬🇧', CA: '🇨🇦', MX: '🇲🇽' }

const formatSpent = (v: number) => v === 0 ? '—' : `$${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let list = [...users]
    if (search) list = list.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter)
    if (statusFilter !== 'all') list = list.filter((u) => u.status === statusFilter)
    return list
  }, [search, roleFilter, statusFilter])

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((u) => u.id)))
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const activeCount = users.filter((u) => u.status === 'Active').length
  const bannedCount = users.filter((u) => u.status === 'Banned').length
  const totalSpent = users.reduce((s, u) => s + u.spent, 0)

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">
            {users.length} registered · {activeCount} active · {bannedCount} banned
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-3.5 w-3.5" /> Add User
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Users', value: users.length, color: 'text-foreground' },
          { label: 'Active Users', value: activeCount, color: 'text-green-600' },
          { label: 'Total Spent', value: formatSpent(totalSpent), color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All Roles</SelectItem>
            {(['Admin', 'Manager', 'Customer'] as UserRole[]).map((r) => (
              <SelectItem key={r} value={r} className="text-sm">{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All Statuses</SelectItem>
            {(['Active', 'Inactive', 'Banned'] as UserStatus[]).map((s) => (
              <SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <Button variant="destructive" size="sm" className="gap-1.5 h-9">
            <Ban className="h-3.5 w-3.5" /> Ban ({selected.size})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground hidden lg:table-cell">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground hidden lg:table-cell">Spent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden xl:table-cell">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden xl:table-cell">Last Seen</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selected.has(user.id)}
                      onCheckedChange={() => toggleOne(user.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                          <span className="text-xs">{flagMap[user.country]}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleStyles[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${user.status === 'Active' ? 'bg-green-500' : user.status === 'Banned' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <span className={`text-[10px] font-semibold ${statusStyles[user.status].split(' ').slice(2).join(' ')}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-xs font-medium text-foreground">{user.orders}</span>
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-xs font-semibold text-foreground">{formatSpent(user.spent)}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-[10px] text-muted-foreground">{user.joined}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-[10px] text-muted-foreground">{user.lastSeen}</span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="text-xs gap-2">
                          <UserCog className="h-3.5 w-3.5" /> Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2">
                          <Mail className="h-3.5 w-3.5" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2">
                          <ShieldCheck className="h-3.5 w-3.5" /> Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs gap-2 text-red-600 focus:text-red-600">
                          <ShieldOff className="h-3.5 w-3.5" />
                          {user.status === 'Banned' ? 'Unban' : 'Ban User'}
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
            No users match your search.
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing <strong>{filtered.length}</strong> of <strong>{users.length}</strong> users
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
