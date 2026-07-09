import RealCard from '../Home/RealCard'
import SignalsInfo from './SignalsInfo'
import { findSignals } from '@/utilities/getSignals'
import { getSignalsPageContent } from '@/utilities/getPageContent'
import { signalToView } from '@/app/lib/viewModels'

export default async function SignalsMain() {
  const [result, content] = await Promise.all([findSignals({ limit: 20 }), getSignalsPageContent()])
  const signals = result.docs.map(signalToView)

  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <SignalsInfo signals={signals} content={content} />

        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <RealCard />
        </div>
      </div>
    </div>
  )
}
