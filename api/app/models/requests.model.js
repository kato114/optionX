import connection from "./connection.js";

// constructor
class RequestsModel {
  constructor(user) {
    this.id = user.id;
    this.address = user.address;
    this.block = user.block;
    this.reward = user.reward;
    this.status = user.status;
  }

  static add = (data) => {
    connection.query("INSERT INTO requests SET ?", data, (err, res) => {
      if (err) console.log("error: ", err);
    });
  };

  static update = (data) => {
    connection.query(
      "UPDATE requests SET status = ?, txn = ? WHERE id = ?",
      data,
      (err, res) => {
        if (err) console.log("error: ", err);
      }
    );
  };

  static getOneRequest = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM requests WHERE status = 0 ORDER BY id ASC`,
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (res.length) {
            resolve(res[0]);
            return;
          }
          resolve({});
        }
      );
    });
  };

  static getHistoryByUser = (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM requests WHERE address = "${data.address}" ORDER BY id DESC`,
        (err, res) => {
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
        }
      );
    });
  };

  static getAll = () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM requests`, (err, res) => {
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

export default RequestsModel;
