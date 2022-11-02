import { useMoralis } from "react-moralis";
import { useEffect } from "react";

const MannualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(async () => {
    if (isWeb3Enabled) return;

    if (typeof window != undefined) {
      if (window.localStorage.getItem("connected")) {
        await enableWeb3();
      }
    }

    console.log(isWeb3Enabled);
  }, [isWeb3Enabled]);

  const connectWallet = async () => {
    await enableWeb3();

    if (window != undefined) window.localStorage.setItem("connected", "inject");
  };
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("account changed to", { account });
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("null account found");
      }
    });
  }, []);

  return (
    <div>
      Hello
      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      ) : (
        <div>
          connected to {account.slice(0, 6)}....
          {account.slice(account.length - 4)}
        </div>
      )}
    </div>
  );
};

export default MannualHeader;
