import AllBtn from '@/app/ui/AllBtn'
import CustomBtn from '@/app/ui/CustomBtn'
import Timeline from '../../../../public/timeline.png'
import Image from 'next/image'

const FeedContent = [
  {
    title: 'Congress crypto hearing: how odds moved in real time',
    updates: 12,
    timeline: [
      {
        time: '15:01',
        text: 'Polymarket lifts "bill passes" to 61% — up 9pp since the session opened.',
      },
      {
        time: '14:18',
        text: 'Sen. Lummis confirms support for the Gillibrand amendment. Markets react within minutes.',
      },
      {
        time: '14:18',
        text: 'New market opens on Gillibrand amendment specifically. Opens at 38¢ YES.',
      },
    ],
  },
]

export default async function Feed() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full p-0.5  bg-[#D7564F3D] ">
            <div className="w-1 h-1 rounded-full bg-[#D7564F]" />
          </div>
          <div className="text-[#D7564F] text-2xl font-extrabold max-md:text-lg">Live Feed</div>
        </div>

        <AllBtn text="All threads " />
      </div>

      <div className="flex flex-col gap-6">
        {FeedContent.map((card, i) => (
          <div key={i} className="bg-white border border-solid border-[#E1DDD5]">
            <div className="border-b border-[#E1DDD5] p-4 font-medium text-base">{card.title}</div>
            <div className="p-4">
              {card.timeline.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="text-sm text-[#5D554F] ">{item.time}</div>

                  <div className="w-3 h-auto">
                    <Image src={Timeline} alt="" />
                  </div>

                  <div className="pb-6 text-sm text-[#5D554F] flex-1">{item.text}</div>
                </div>
              ))}
            </div>
            <div className="flex p-4 justify-between">
              <div className="flex items-center text-[#5D554F] font-medium text-xs uppercase">
                {card.updates} updates
              </div>
              <div className="w-max">
                <CustomBtn text="Read full thread" light />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
