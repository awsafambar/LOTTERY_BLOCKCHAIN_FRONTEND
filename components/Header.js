import React from "react";
import { ConnectButton } from "web3uikit";

export default function header() {
  return (
    <div>
      Decentralized Lottery
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
