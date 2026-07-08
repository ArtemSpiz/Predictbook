import AboutMain from '@/app/components/About/AboutMain'
import Feed from '@/app/components/Home/Feed'
import RealCard from '@/app/components/Home/RealCard'

export default function About() {
  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className=" flex flex-col gap-5 flex-1 md:border-r border-[#E1DDD5] md:pr-5 max-lg:pl-5 max-md:pl-0">
          <AboutMain />
        </div>
        <div className="w-full h-px bg-[#E1DDD5] md:hidden" />
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <Feed />
          <RealCard />
        </div>
      </div>
    </main>
  )
}
