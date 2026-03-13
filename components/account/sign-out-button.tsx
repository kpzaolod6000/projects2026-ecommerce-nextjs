'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  )
}
