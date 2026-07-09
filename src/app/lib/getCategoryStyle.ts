export function getCategoryStyle(category: string) {
  switch (category.toLowerCase()) {
    case 'arbitrage':
      return 'bg-cat-arb-bg border-cat-arb-border text-cat-arb-text'

    case 'crypto':
      return 'bg-cat-crypto-bg border-cat-crypto-border text-cat-crypto-text'

    case 'whale alert':
      return 'bg-cat-whale-bg border-cat-whale-border text-cat-whale-text'

    case 'politics':
      return 'bg-cat-politics-bg border-cat-politics-border text-cat-politics-text'

    case 'technology':
      return 'bg-cat-tech-bg border-cat-tech-border text-cat-tech-text'

    case 'sports':
      return 'bg-cat-sports-bg border-cat-sports-border text-cat-sports-text'

    case 'science':
      return 'bg-cat-science-bg border-cat-science-border text-cat-science-text'

    default:
      return 'bg-cream border-line text-muted'
  }
}
