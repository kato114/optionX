import { DEV_WALLET_ADDRESS } from "../config/constants.js";
import connection from "./connection.js";

// constructor
class ReferralsModel {
  constructor(user) {
    this.id = user.id;
    this.tgId = user.tgId;
    this.ref_address = user.ref_address;
    this.created_date = user.created_date;
  }

  static add = (data) => {
    connection.query("INSERT INTO referrals SET ?", data, (err, res) => {
      if (err) console.log("error: ", err);
    });
  };

  static find = (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM referrals WHERE tgId = "${data.tgId}" AND ref_address = "${data.ref_address}"`,
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (res.length) {
            resolve(res[0]);
            return;
          }
          resolve(null);
        }
      );
    });
  };

  static findRef = (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT referrals.ref_address FROM referrals LEFT JOIN users ON users.tg_id = referrals.tgId WHERE users.eth_address = "${data.address}"`,
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (res.length) {
            resolve(res[0].ref_address);
            return;
          }
          // not found RewardsModel with the fromTxn
          resolve(DEV_WALLET_ADDRESS);
        }
      );
    });
  };

  static getAll = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT ref_address FROM referrals GROUP BY ref_address`,
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

export default ReferralsModel;
