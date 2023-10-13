import connection from "./connection.js";

// constructor
class FundsModel {
  constructor(user) {
    this.id = user.id;
    this.amount = user.amount;
    this.block = user.block;
    this.created_date = user.created_date;
  }

  static add = (data) => {
    connection.query("INSERT INTO funds SET ?", data, (err, res) => {
      if (err) console.log("error: ", err);
    });
  };

  static getLastBlock = () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM funds ORDER BY id DESC`, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length) {
          resolve(res[0].block + 1);
          return;
        }
        resolve(0);
      });
    });
  };

  static getAll = () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM funds`, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length) {
          resolve(res);
          return;
        }
        // not found RewardsModel with the fromTxn
        resolve([]);
      });
    });
  };
}

export default FundsModel;
