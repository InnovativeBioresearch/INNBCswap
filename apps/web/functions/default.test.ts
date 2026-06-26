const defaultUrls = ['http://localhost:3000/', 'http://localhost:3000/swap', 'http://localhost:3000/pool']

test.each(defaultUrls)('should inject metadata for valid collections', async (defaultUrl) => {
  const body = await fetch(new Request(defaultUrl)).then((res) => res.text())
//START ALPHA CHANGE 1547 -- remove default image metadata expectations after deleting shared image metadata system --
  expect(body).toContain(`<meta property="og:title" content="INNBCswap | Trade Crypto on a Leading DeFi Exchange"`)
  expect(body).toContain(
    `<meta property="og:description" content="Swap crypto on Ethereum, INNBC chain, Solana, Base, Arbitrum, Polygon, Unichain and more"`,
  )
  expect(body).toContain(
    `<meta name="description" content="Swap crypto on Ethereum, INNBC chain, Solana, Base, Arbitrum, Polygon, Unichain and more"`,
  )
  expect(body).toContain(`<meta property="og:type" content="website"`)
  expect(body).toContain(`<meta property="twitter:card" content="summary"`)
  expect(body).toContain(`<meta property="twitter:title" content="INNBCswap | Trade Crypto on a Leading DeFi Exchange"`)
//FINISH ALPHA CHANGE 1547 -- remove default image metadata expectations after deleting shared image metadata system --
})
