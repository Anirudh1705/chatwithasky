import Link from 'next/link'
import Image from 'next/image'
import AuthForm from '@/components/AuthForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <nav className="border-b border-border-cream bg-ivory">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <Link href="/" className="flex items-center gap-0">
            <Image src="/logo.png" alt="Asky" width={72} height={72} style={{mixBlendMode: 'multiply'}} />
            <span className="text-3xl font-serif font-medium text-near-black">Asky</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-serif font-medium text-near-black mb-3">
              Create your account
            </h1>
            <p className="text-lg text-olive-gray">
              Join us to start exploring with Asky
            </p>
          </div>

          <div className="bg-ivory rounded-lg border border-border-cream p-10 shadow-whisper">
            <AuthForm type="register" />
          </div>

          <p className="text-center text-olive-gray mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-terracotta hover:text-coral font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
