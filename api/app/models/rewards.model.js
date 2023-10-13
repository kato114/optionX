import connection from "./connection.js";

// constructor
class RewardsModel {
  constructor(user) {
    this.id = user.id;
    this.address = user.address;
    this.unclaimed_rewards = user.unclaimed_rewards;
    this.block_number = user.block_number;
    this.type = user.type;
    this.status = user.status;
  }

  static add = (data) => {
    connection.query("INSERT INTO rewards SET ?", data, (err, res) => {
      if (err) console.log("error: ", err);
    });
  };

  static updateStatus = (data, result) => {
    connection.query(
      "UPDATE rewards SET status = ? WHERE address = ? && status = ?",
      data,
      (err, res) => {
        if (err) console.log("error: ", err);
      }
    );
  };

  static getHistoryByUser = (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM rewards WHERE address = "${data.address}" ORDER BY id DESC`,
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

  static find = (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM rewards WHERE address = "${data.address}" AND status = ${data.status}`,
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

  static getAll = (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM rewards WHERE status = ${data.status}`,
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
}

export default RewardsModel;
