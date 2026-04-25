'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex h-screen bg-parchment">
      <Sidebar />
      <ChatWindow />
    </div>
  )
}
