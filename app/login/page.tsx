import Link from 'next/link'
import Image from 'next/image'
import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <nav className="border-b border-border-cream bg-ivory">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <Link href="/" className="flex items-center gap-0">
            <Image src="/logo.png" alt="Asky" width={72} height={72} />
            <span className="text-3xl font-serif font-medium text-near-black">Asky</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-serif font-medium text-near-black mb-3">
              Welcome back
            </h1>
            <p className="text-lg text-olive-gray">
              Sign in to continue your conversations
            </p>
          </div>

          <div className="bg-ivory rounded-lg border border-border-cream p-10 shadow-whisper">
            <AuthForm type="login" />
          </div>

          <p className="text-center text-olive-gray mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-terracotta hover:text-coral font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
