import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-parchment">
      <nav className="border-b border-border-cream bg-ivory sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0">
            <Image src="/logo.png" alt="Asky" width={72} height={72} style={{mixBlendMode: 'multiply'}} />
            <h1 className="text-3xl font-serif font-medium text-near-black">Asky</h1>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 rounded-md text-near-black hover:bg-border-cream transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 rounded-md bg-terracotta text-ivory hover:bg-coral transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-32 text-center">
        <h2 className="text-7xl font-serif font-medium text-near-black mb-8 leading-tight">
          Meet Asky
        </h2>
        <p className="text-2xl text-olive-gray mb-16 max-w-3xl mx-auto leading-relaxed">
          A thoughtful AI companion designed to help you think, create, and explore ideas with clarity and nuance.
        </p>
        <Link
          href="/register"
          className="inline-block px-10 py-4 rounded-md bg-terracotta text-ivory font-medium hover:bg-coral transition-colors text-xl"
        >
          Start Chatting
        </Link>
      </section>

      <section className="bg-deep-dark text-warm-silver py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-5xl font-serif font-medium mb-16 text-ivory text-center">
            Why Asky?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg bg-dark-surface border border-border-dark hover:border-ring-warm transition-colors">
              <h4 className="text-2xl font-serif font-medium text-ivory mb-4">
                Thoughtful
              </h4>
              <p className="text-warm-silver leading-relaxed text-lg">
                Designed to engage in nuanced conversations with depth and consideration.
              </p>
            </div>
            <div className="p-8 rounded-lg bg-dark-surface border border-border-dark hover:border-ring-warm transition-colors">
              <h4 className="text-2xl font-serif font-medium text-ivory mb-4">
                Reliable
              </h4>
              <p className="text-warm-silver leading-relaxed text-lg">
                Built with safety and accuracy in mind to provide trustworthy assistance.
              </p>
            </div>
            <div className="p-8 rounded-lg bg-dark-surface border border-border-dark hover:border-ring-warm transition-colors">
              <h4 className="text-2xl font-serif font-medium text-ivory mb-4">
                Versatile
              </h4>
              <p className="text-warm-silver leading-relaxed text-lg">
                Helps with writing, analysis, coding, creative projects, and much more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center">
          <h3 className="text-5xl font-serif font-medium text-near-black mb-8">
            Ready to explore?
          </h3>
          <p className="text-olive-gray mb-12 text-xl leading-relaxed">
            Join thousands of users discovering new possibilities with Asky.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 rounded-md bg-terracotta text-ivory font-medium hover:bg-coral transition-colors text-xl"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-border-cream bg-ivory py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-stone-gray">
          <p className="text-base">
            © {new Date().getFullYear()} Asky.{' '}
            <a
              href="https://www.linkedin.com/in/anirudh8760/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta hover:text-coral transition-colors"
            >
              Made by Anirudh Kaushik
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
