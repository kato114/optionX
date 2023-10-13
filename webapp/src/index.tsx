import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ReactDOM from "react-dom/client";
import axios from "axios";
import { WebAppProvider, useExpand } from "@vkruglikov/react-telegram-web-app";
import "antd/dist/reset.css";

import "./index.css";

import { MainLayout } from "./layout/MainLayout";
import { Trade } from "./pages/trade/Trade";
import { Overview } from "./pages/portfolio/Overview";
import { Position } from "./pages/portfolio/Position";
import { Orders } from "./pages/portfolio/Orders";
import { Deposit } from "./pages/transfer/Deposit";
import { Withdraw } from "./pages/transfer/Withdraw";

import { API_URL } from "./config/constant";
import { SSOV } from "./pages/ssov/SSOV";
import { OLP } from "./pages/olp/OLP";
import { Atlantic } from "./pages/atlantic/Atlantic";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const App = () => {
  const [isExpanded, expand] = useExpand();
  const [smoothButtonsTransition, setSmoothButtonsTransition] = useState(true);

  const [tgid, setTgid] = useState("");
  const [userData, setUserData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const queryParameters = new URLSearchParams(window.location.search);
  let tg_id =
    queryParameters.get("tgid") !== null ? queryParameters.get("tgid") : "";

  // const init = () => {
  //   axios
  //     .get(API_URL + "/account/user/" + tg_id)
  //     .then((response) => {
  //       if (response.data.succeed == true) {
  //         setLoading(false);
  //         setUserData(response.data.data);
  //       } else {
  //         setTgid("");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

  // useEffect(() => {
  //   if (tg_id != null && tg_id != "") {
  //     init();
  //     setTgid(tg_id);
  //     localStorage.setItem("tgid", tg_id);
  //   } else {
  //     localStorage.setItem("tgid", "");
  //   }
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (tg_id != null && tg_id != "") {
  //       init();
  //     }
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, []);

  // if (tgid == "") {
  //   return (
  //     <div style={{ textAlign: "center", marginTop: "48vh" }}>
  //       You Need To Create Account First
  //     </div>
  //   );
  // }

  return (
    <WebAppProvider options={{ smoothButtonsTransition }}>
      {true ? "Need to wait" :
        <Router>
          {userData != undefined ? (
            <MainLayout>
              <Routes>
                <Route path="/" element={<SSOV userData={userData} />} />
                <Route path="/olp" element={<OLP userData={userData} />} />
                <Route path="/atlantic" element={<Atlantic userData={userData} />} />
                <Route path="/overview" element={<Overview userData={userData} />} />
              </Routes>
            </MainLayout>
          ) : loading == true ? (
            <div style={{ textAlign: "center", paddingTop: "48vh" }}>
              Loading...
            </div>
          ) : (
            <div style={{ textAlign: "center", paddingTop: "48vh" }}>
              You Need To Create Account First
            </div>
          )}
        </Router>}
    </WebAppProvider>
  );
};

root.render(<App />);
