import { Suspense } from 'react'
import BlogCol from '../Blog/BlogsCol'
import RealCard from '../Home/RealCard'
import SignalsInfo from './SignalsInfo'

export default function SignalsMain() {
  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
          <SignalsInfo />

        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RealCard />
        </div>
      </div>
    </div>
  )
}
