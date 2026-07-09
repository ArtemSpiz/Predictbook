import Info from '../../../../public/Information.png'
import Poly from '../../../../public/Polymarket.png'
import Kalshi from '../../../../public/Kalshi.png'
import Image from 'next/image'

const Sponsors = [
  {
    icon: Poly,
  },
  {
    icon: Kalshi,
  },
]

export default function SponsoredCard() {
  return (
    <div className="p-6 flex flex-col gap-3 border border-line">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">Sponsored by</div>

        <div className="w-4 h-4">
          <Image src={Info} alt="" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mx-auto self-stretch">
        {Sponsors.map((card, i) => (
          <div key={i} className="bg-white border border-line-2 px-2 py-4 rounded-s flex justify-center items-center">
            <Image src={card.icon} alt="" className='max-h-5 w-auto' />
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-5">
        Trusted by the leading companies shaping prediction markets.
      </div>
    </div>
  )
}
