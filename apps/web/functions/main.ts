//START ALPHA CHANGE 3559 -- remove old Uniswap entry-gateway worker config injection --
import { createApp } from 'functions/app'

const app = createApp({
  fetchSpaHtml: (c) => c.env.ASSETS.fetch(c.req.raw),
})
//FINISH ALPHA CHANGE 3559 -- remove old Uniswap entry-gateway worker config injection --

// eslint-disable-next-line import/no-unused-modules
export default app
