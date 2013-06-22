
/*
 * GET users listing.
 */

exports.list = function(req, res){
  //res.send("respond with a resource");
  var sql = 'select * from tbl_test';
  processReqResSql(req, res, sql);
};