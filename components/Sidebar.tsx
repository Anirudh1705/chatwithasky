'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

interface ChatItem {
  _id: string
  title: string
  createdAt: string
}

export default function Sidebar() {
  const [chats, setChats] = useState<ChatItem[]>([])
  const [userName, setUserName] = useState('')
  const [open, setOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const fetchChats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/chat/history', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setChats(data.chats)
      }
    } catch (err) {
      console.error('Failed to fetch chats')
    }
  }, [])

  useEffect(() => {
    const name = localStorage.getItem('userName')
    setUserName(name || 'User')
    fetchChats()
  }, [fetchChats])

  // Re-fetch chats whenever the route changes (new chat created)
  useEffect(() => {
    fetchChats()
  }, [pathname, fetchChats])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    router.push('/login')
  }

  return (
    <div
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-dark-surface text-warm-silver transition-all duration-300 flex flex-col h-screen border-r border-border-dark`}
    >
      <div className="p-6 border-b border-border-dark flex items-center justify-between gap-2">
        {open && (
          <div className="flex items-center gap-0">
            <Image src="/logo.png" alt="Asky" width={56} height={56} className="rounded-sm" />
            <h1 className="text-xl font-serif font-medium text-ivory">Asky</h1>
          </div>
        )}
        {!open && (
          <Image src="/logo.png" alt="Asky" width={56} height={56} className="rounded-sm" />
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-deep-dark rounded-md transition-colors flex-shrink-0"
        >
          {open ? '←' : '→'}
        </button>
      </div>

      <Link
        href="/chat"
        className="m-4 p-3 rounded-md bg-terracotta text-ivory font-medium text-center hover:bg-coral transition-colors flex-shrink-0"
      >
        {open ? '+ New Chat' : '+'}
      </Link>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {open && (
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-stone-gray mb-4 font-medium">
              Recent Chats
            </p>
            <div className="space-y-2">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <Link
                    key={chat._id}
                    href={`/chat/${chat._id}`}
                    className="block p-3 rounded-md hover:bg-deep-dark transition-colors text-sm text-warm-silver hover:text-ivory break-words"
                    title={chat.title}
                  >
                    {chat.title}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-stone-gray italic">No chats yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border-dark space-y-3 flex-shrink-0">
        {open && (
          <div className="text-xs bg-deep-dark rounded-md p-3">
            <p className="text-stone-gray mb-1">Signed in as</p>
            <p className="font-medium text-ivory break-words">{userName}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full p-2 rounded-md hover:bg-deep-dark transition-colors text-sm font-medium"
        >
          {open ? 'Logout' : '⊗'}
        </button>
      </div>
    </div>
  )
}
