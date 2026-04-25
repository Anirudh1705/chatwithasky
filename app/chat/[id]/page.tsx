'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'

export default function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex h-screen bg-parchment">
      <Sidebar />
      <ChatWindow chatId={id} />
    </div>
  )
}
