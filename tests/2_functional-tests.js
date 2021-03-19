const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let numOflike;
suite("Functional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    this.timeout(5000);
    //wait for 4 sec after every test
    this.afterEach(function(done) {
      setTimeout(() => {
        done();
      }, 4000);
    });

    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function(err, res) {
          //complete this one too
          assert.equal(res.status, 200);
          assert.isObject(res.body.stockData, "Body should be object");
          assert.property(res.body.stockData, "stock");
          assert.property(res.body.stockData, "price");
          assert.property(res.body.stockData, "likes");
          assert.equal(res.body.stockData.stock, "GOOG");
          numOflike = res.body.stockData.likes;
          console.log(err)
          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isNumber(res.body.stockData.price, "price");
          assert.equal(res.body.stockData.likes, numOflike);
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: "true" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.likes, numOflike);
          assert.equal(res.body.stockData.stock, "GOOG");
          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.isNumber(res.body.stockData[0].rel_likes, "should be number");
          assert.isNumber(res.body.stockData[1].rel_likes, "should be number");
          numOflike = [
            res.body.stockData[0].rel_likes,
            res.body.stockData[1].rel_likes
          ];
          done();
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"], like: "true" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.isNumber(res.body.stockData[0].rel_likes, "should be number");
          assert.isNumber(res.body.stockData[1].rel_likes, "should be number");
          assert.isAbove(res.body.stockData[0].rel_likes, 0 );
          assert.isAbove(res.body.stockData[1].rel_likes, 0);
        
          done();
        });
    });
  });
});