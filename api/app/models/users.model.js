import connection from "./connection.js";

// constructor
class UsersModel {
  constructor(user) {
    this.id = user.id;
    this.tg_id = user.tg_id;
    this.eth_prvkey = user.eth_prvkey;
    this.eth_address = user.eth_address;
    this.stk_prvkey = user.stk_prvkey;
    this.stk_pubkey = user.stk_pubkey;
    this.stk_yordkey = user.stk_yordkey;
    this.dydx_apikey = user.dydx_apikey;
    this.dxdy_passphrase = user.dxdy_passphrase;
    this.dxdy_secret = user.dxdy_secret;
    this.user_status = user.user_status;
    this.create_date = user.create_date;
    this.pause_date = user.pause_date;
  }

  static registerUser = (user_data, result) => {
    connection.query("INSERT INTO users SET ?", user_data, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...user_data });
    });
  };

  static findUserByTelegramID = (tg_id, result) => {
    connection.query(
      `SELECT * FROM users WHERE tg_id = "${tg_id}"`,
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (res.length) {
          result(null, res[0]);
          return;
        }
        // not found UsersModel with the fromTxn
        result({ kind: "not_found" }, null);
      }
    );
  };
}

// UsersModel.updateById = (id, transaction, result) => {
//   sql.query(
//     "UPDATE transactions SET toTxn = ?, endDate = ? WHERE id = ?",
//     [transaction.toTxn, transaction.endDate, id],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found UsersModel with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated transaction: ", { id: id, ...transaction });
//       result(null, { id: id, ...transaction });
//     }
//   );
// };

// UsersModel.findByFromTxn = (fromTxn, result) => {
//   sql.query(
//     `SELECT * FROM transactions WHERE fromTxn = "${fromTxn}"`,
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }

//       if (res.length) {
//         console.log("found transaction: ", res[0]);
//         result(null, res[0]);
//         return;
//       }

//       // not found UsersModel with the fromTxn
//       result({ kind: "not_found" }, null);
//     }
//   );
// };

// UsersModel.findLastBlockNumberByChainId = (chainId, result) => {
//   sql.query(
//     `SELECT MAX(blockNumber) as prevBlock FROM transactions WHERE fromChain = "${chainId}"`,
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }

//       if (res.length) {
//         console.log("found transaction: ", res[0]);
//         result(null, res[0]);
//         return;
//       }

//       // not found UsersModel with the fromTxn
//       result({ kind: "not_found" }, null);
//     }
//   );
// };

// UsersModel.findPendingTxn = (result) => {
//   sql.query(
//     `SELECT * FROM transactions WHERE toTxn is NULL ORDER BY id`,
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }

//       if (res.length) {
//         console.log("found transaction: ", res[0]);
//         result(null, res[0]);
//         return;
//       }

//       // not found UsersModel with the fromTxn
//       result({ kind: "not_found" }, null);
//     }
//   );
// };

// UsersModel.getAll = (address, page, result) => {
//   let query = "SELECT * FROM transactions";

//   if (address) {
//     query += ` WHERE sender LIKE '%${address}%'`;
//   }
//   let offset = (page - 1) * 10;
//   query += ` ORDER BY startDate DESC LIMIT 10 OFFSET ${offset}`;
//   sql.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     result(null, res);
//   });
// };

// UsersModel.getTotalCount = (address, result) => {
//   sql.query(
//     `SELECT count(*) as total FROM transactions WHERE sender LIKE '%${address}%'`,
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }

//       if (res.length) {
//         console.log("found transaction: ", res[0]);
//         result(null, res[0]);
//         return;
//       }

//       // not found UsersModel with the fromTxn
//       result({ kind: "not_found" }, null);
//     }
//   );
// };

// UsersModel.getAllPublished = (result) => {
//   sql.query("SELECT * FROM transactions WHERE published=true", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("transactions: ", res);
//     result(null, res);
//   });
// };

// UsersModel.remove = (id, result) => {
//   sql.query("DELETE FROM transactions WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found UsersModel with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted transaction with id: ", id);
//     result(null, res);
//   });
// };

// UsersModel.removeAll = (result) => {
//   sql.query("DELETE FROM transactions", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} transactions`);
//     result(null, res);
//   });
// };

export default UsersModel;
