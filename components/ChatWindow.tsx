'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TokenIcon, CarbonIcon, LightbulbIcon, CheckIcon } from './Icons'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  tokens?: {
    input: number
    output: number
    total: number
  }
  carbon?: {
    kg: number
    formatted: string
  }
}

interface ChatWindowProps {
  chatId?: string
}

function parseMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactElement[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-semibold mt-3 mb-2 text-near-black">
          {parseInline(line.substring(4))}
        </h3>
      )
      i++
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold mt-4 mb-2 text-near-black">
          {parseInline(line.substring(3))}
        </h2>
      )
      i++
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-bold mt-4 mb-3 text-near-black">
          {parseInline(line.substring(2))}
        </h1>
      )
      i++
    }
    // Tables
    else if (line.includes('|')) {
      const tableLines = [line]
      i++
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i])
        i++
      }
      const table = renderTable(tableLines, i)
      if (table) elements.push(table)
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) i++
      elements.push(
        <pre key={`code-${i}`} className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-sm">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
    }
    // Lists
    else if (line.match(/^[\s]*[-*]\s/)) {
      const listItems: React.ReactElement[] = []
      while (i < lines.length && lines[i].match(/^[\s]*[-*]\s/)) {
        const content = lines[i].replace(/^[\s]*[-*]\s/, '')
        listItems.push(
          <li key={`li-${i}`} className="ml-4">
            {parseInline(content)}
          </li>
        )
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc my-2">
          {listItems}
        </ul>
      )
    }
    // Empty lines
    else if (line.trim() === '') {
      i++
    }
    // Regular paragraphs
    else {
      elements.push(
        <p key={`p-${i}`} className="my-2">
          {parseInline(line)}
        </p>
      )
      i++
    }
  }

  return <>{elements}</>
}

function parseInline(text: string) {
  const parts: (string | React.ReactElement)[] = []
  let lastIndex = 0

  // Bold
  const boldRegex = /\*\*(.*?)\*\*/g
  let match: RegExpExecArray | null
  const boldMatches: { start: number; end: number; content: string; type: string }[] = []
  while ((match = boldRegex.exec(text)) !== null) {
    boldMatches.push({ start: match.index, end: match.index + match[0].length, content: match[1], type: 'bold' })
  }

  // Italic
  const italicRegex = /\*(.*?)\*/g
  while ((match = italicRegex.exec(text)) !== null) {
    if (!boldMatches.some(b => b.start <= match!.index && match!.index < b.end)) {
      boldMatches.push({ start: match.index, end: match.index + match[0].length, content: match[1], type: 'italic' })
    }
  }

  // Code
  const codeRegex = /`(.*?)`/g
  while ((match = codeRegex.exec(text)) !== null) {
    if (!boldMatches.some(b => b.start <= match!.index && match!.index < b.end)) {
      boldMatches.push({ start: match.index, end: match.index + match[0].length, content: match[1], type: 'code' })
    }
  }

  boldMatches.sort((a, b) => a.start - b.start)

  boldMatches.forEach((item, idx) => {
    if (item.start > lastIndex) {
      parts.push(text.substring(lastIndex, item.start))
    }
    if (item.type === 'bold') {
      parts.push(
        <strong key={`bold-${idx}`} className="font-semibold">
          {item.content}
        </strong>
      )
    } else if (item.type === 'italic') {
      parts.push(
        <em key={`italic-${idx}`} className="italic">
          {item.content}
        </em>
      )
    } else if (item.type === 'code') {
      parts.push(
        <code key={`code-${idx}`} className="bg-gray-200 px-1 rounded text-sm">
          {item.content}
        </code>
      )
    }
    lastIndex = item.end
  })

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts
}

function renderTable(lines: string[], key: number) {
  const rows = lines.map(line => 
    line.split('|').map(cell => cell.trim()).filter(cell => cell)
  )

  if (rows.length < 2) return null

  const headers = rows[0]
  const body = rows.slice(2)

  return (
    <div key={`table-${key}`} className="overflow-x-auto my-3">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, idx) => (
              <th key={`th-${idx}`} className="border border-gray-300 px-3 py-2 text-left font-semibold">
                {parseInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIdx) => (
            <tr key={`tr-${rowIdx}`} className="hover:bg-gray-50">
              {row.map((cell, cellIdx) => (
                <td key={`td-${cellIdx}`} className="border border-gray-300 px-3 py-2">
                  {parseInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false) // true while waiting for first token
  const [currentChatId, setCurrentChatId] = useState(chatId)
  const [sessionTokens, setSessionTokens] = useState(0)
  const [sessionCarbon, setSessionCarbon] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (chatId) {
      fetchChat(chatId)
    }
  }, [chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentChatId])

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus()
    }
  }, [loading])

  const fetchChat = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/chat/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.chat.msgs || [])
        setCurrentChatId(id)
      } else {
        console.error('Failed to fetch chat:', res.status)
      }
    } catch (err) {
      console.error('Failed to fetch chat:', err)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const messageText = input
    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageText, chatId: currentChatId }),
      })

      if (!res.ok) {
        if (res.status === 401) router.push('/login')
        const errData = await res.json().catch(() => ({}))
        console.error('API error:', res.status, errData)
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: `Error: ${errData.error || 'Failed to get response (status ' + res.status + ')'}`,
          timestamp: new Date(),
        }])
        setLoading(false)
        return
      }

      setLoading(false)
      setStreaming(true) // show dots while waiting for first token

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let firstDelta = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data) continue

          try {
            const parsed = JSON.parse(data)

            if (parsed.delta) {
              if (firstDelta) {
                // First token arrived — hide dots, add assistant message
                setStreaming(false)
                setMessages((prev) => [...prev, { role: 'assistant', content: parsed.delta, timestamp: new Date() }])
                firstDelta = false
              } else {
                // Append to existing message
                setMessages((prev) => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  if (last.role === 'assistant') {
                    updated[updated.length - 1] = { ...last, content: last.content + parsed.delta }
                  }
                  return updated
                })
              }
            }

            if (parsed.done) {
              setCurrentChatId(parsed.chatId)
              setMessages((prev) => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    tokens: parsed.tokens,
                    carbon: parsed.carbon,
                  }
                }
                return updated
              })
              if (parsed.tokens) {
                setSessionTokens((prev) => prev + parsed.tokens.total)
                setSessionCarbon((prev) => prev + parsed.carbon.kg)
              }
            }
          } catch {
            // skip malformed
          }
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Network error — please check your connection and try again.',
        timestamp: new Date(),
      }])
      setLoading(false)
      setStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-parchment flex-1">
      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col w-full">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h2 className="text-6xl font-serif font-medium text-near-black mb-4">
                Start a conversation
              </h2>
              <p className="text-lg text-olive-gray leading-relaxed">
                Ask me anything and I'll do my best to help
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 p-8">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-terracotta text-ivory rounded-br-none'
                      : 'bg-ivory border border-border-cream text-near-black rounded-bl-none'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="text-base leading-relaxed">
                      {parseMarkdown(msg.content)}
                      {msg.tokens && (
                        <div className="mt-3 pt-3 border-t border-border-cream text-xs text-stone-gray space-y-1">
                          <div className="flex items-center gap-2">
                            <TokenIcon className="w-3 h-3" />
                            <span>Tokens: {msg.tokens.input} input + {msg.tokens.output} output = {msg.tokens.total}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CarbonIcon className="w-3 h-3" />
                            <span>Carbon: {msg.carbon?.formatted}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-base leading-relaxed">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}
            {(loading || streaming) && (
              <div className="flex justify-start">
                <div className="bg-ivory border border-border-cream px-6 py-4 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2 items-center" style={{ gap: '6px' }}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#5e5d59',
                          animation: 'bounce 1s infinite',
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border-cream bg-ivory p-8">
        {(sessionTokens > 0 || sessionCarbon > 0) && (
          <div className="mb-4 p-3 rounded-lg bg-parchment border border-border-cream text-sm">
            <div className="flex justify-between items-center gap-4">
              <div className="text-stone-gray space-y-1">
                <div className="flex items-center gap-2">
                  <TokenIcon className="w-4 h-4" />
                  <span>Session: {sessionTokens} tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CarbonIcon className="w-4 h-4" />
                  <span>{sessionCarbon < 0.000001 ? `${(sessionCarbon * 1000000).toFixed(2)} mg` : `${sessionCarbon.toFixed(6)} kg`} CO₂</span>
                </div>
              </div>
              <div className="text-xs text-olive-gray flex items-center gap-2">
                {sessionTokens > 5000 ? (
                  <>
                    <LightbulbIcon className="w-4 h-4" />
                    <span>Try shorter questions</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Efficient usage</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-3 w-full">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading || streaming}
            placeholder="Type your message..."
            className="flex-1 px-6 py-3 rounded-lg border border-border-cream bg-parchment text-near-black placeholder-stone-gray focus:outline-none focus:border-focus-blue focus:ring-2 focus:ring-focus-blue/20 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={loading || streaming || !input.trim()}
            className="px-8 py-3 rounded-lg bg-terracotta text-ivory font-medium hover:bg-coral disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
