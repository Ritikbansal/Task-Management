'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useAuthGuard() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) {
      router.replace('/login') // redirect
    } else {
      setChecked(true) // mark as authenticated
    }
  }, [router])

  return checked
}
