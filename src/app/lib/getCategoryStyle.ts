export function getCategoryStyle(category: string) {
  switch (category.toLowerCase()) {
    case 'arbitrage':
      return 'bg-[#ECF2E0] border-[#C6DB9E] text-[#36581E]'

    case 'crypto':
      return 'bg-[#FEFDF2] border-[#E9E9D1] text-[#655E4A]'

    case 'whale alert':
      return 'bg-[#E8E0F2] border-[#ADABE7] text-[#3C3985]'

    case 'politics':
      return 'bg-[#F0EFFE] border-[#D4D2EA] text-[#444263]'

    case 'technology':
      return 'bg-[#FEF2F2] border-[#E9D1D1] text-[#654A4A]'

    case 'sports':
      return 'bg-[#F2FEF3] border-[#D1E9D4] text-[#4A654F]'

    case 'science':
      return 'bg-[#EBF5FF] border-[#C7DBEC] text-[#3B586F]'

    default:
      return 'bg-[#F4F0ED] border-[#E1DDD5] text-[#5D554F]'
  }
}
