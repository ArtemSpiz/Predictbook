import Link from 'next/link'
import footerTg from '../../public/footerTg.png'
import footerX from '../../public/footerX.png'
import Image from 'next/image'

const Icons = [
  {
    icon: footerTg,
    href: '',
  },
  {
    icon: footerX,
    href: '',
  },
]

const footerLinks = {
  home: {
    title: 'HOME',
    links: [
      { label: 'Whale Alerts', href: '/whale-alerts' },
      { label: 'Arbitrage Opportunities', href: '/arbitrage-opportunities' },
      { label: 'Live analysis', href: '/live-analysis' },
      { label: 'Daily Recap', href: '/daily-recap' },
      { label: 'Weekly series', href: '/weekly-series' },
      { label: 'Newsletter (Substack)', href: '/newsletter' },
    ],
  },
  analysis: {
    title: 'ANALYSIS',
    links: [
      { label: 'Politics', href: '/blog/category/politics' },
      { label: 'Economics', href: '/blog/category/economics' },
      { label: 'Crypto', href: '/blog/category/crypto' },
      { label: 'Technology', href: '/blog/category/technology' },
      { label: 'Sports', href: '/blog/category/sports' },
      { label: 'Science', href: '/blog/category/science' },
    ],
  },
  about: {
    title: 'ABOUT',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Contact us', href: '/contact' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
}

export async function Footer() {
  return (
    <footer className="bg-ink">
      <div className="container-custom ">
        <div className="border-l border-r border-line-a08 px-6 py-12 md:px-12">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl m-0 font-bold text-white">Predictbook</h2>
              <div className="mt-2 text-sm text-white-a80">
                AI-powered newsroom covering prediction markets
              </div>
            </div>

            <div className="flex items-center gap-3">
              {Icons.map((icon, i) => (
                <a
                  href={icon.href}
                  target="_black"
                  rel="noopener noreferrer"
                  key={i}
                  className="w-8 h-8"
                >
                  <Image src={icon.icon} alt={icon.href} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 border-t border-line-a08 pt-10 md:grid-cols-3">
            {Object.values(footerLinks).map((col) => (
              <div key={col.title}>
                <div className="text-xs tracking-wider font-medium text-muted-3 font-mono">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-2.5 pl-0">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="group inline-block">
                        <span className="text-sm text-cream">{link.label}</span>

                        <span className="block h-px w-full scale-x-0 bg-[#F4F0ED] origin-left transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col-reverse gap-4 border-t border-line-a08 pt-6 text-xs text-muted-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              This website does not constitute investing advice. Prediction markets and/or gambling
              may result in loss of funds. You are advised to conduct your own due diligence before
              taking any action
            </div>
            <div className="whitespace-nowrap text-white-a80">
              © {new Date().getFullYear()} Predicook. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
