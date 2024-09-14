'use strict';
const fetch = require('node-fetch')
module.exports = function (app) {
  async function getApi(stock, like = false) {
    console.log(like)
    if (!Array.isArray(stock)) {
      const sendReq = await fetch(`https://stock-price-checker.freecodecamp.rocks/api/stock-prices?stock=${stock}${like ? '&like=true' : ''}`)
      const output = await sendReq.json()
      return output
    }
    const sendReq = await fetch(`https://stock-price-checker.freecodecamp.rocks/api/stock-prices?stock=${stock[0]}&stock=${stock[1]}${like ? '&like=true' : ''}`)
    console.log(sendReq)
    const output = await sendReq.json()
    console.log(output)
    return output
  }
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query
      const respAPI = await getApi(stock, like)
      return res.status(200).json(respAPI)
    });

};
