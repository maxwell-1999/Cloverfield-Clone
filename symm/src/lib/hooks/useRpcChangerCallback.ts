import { useCallback } from "react";

import { ChainInfo } from "../../constants/chainInfo";
import { SupportedChainId } from "../../constants/chains";
import useWagmi from "./useWagmi";
import { useSwitchNetwork } from "wagmi";

export default function useRpcChangerCallback() {
  const { chainId } = useWagmi();
  const { switchNetworkAsync } = useSwitchNetwork();

  return useCallback(
    async (targetChainId: SupportedChainId) => {
      if (!chainId) return false;
      if (!targetChainId || !ChainInfo[targetChainId]) return false;
      if (targetChainId === chainId) return true;

      try {
        await switchNetworkAsync?.(targetChainId);
        return true;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // handle other "switch" errors
        if (switchError instanceof Error) {
          if (switchError.name === "ChainNotConfiguredForConnectorError") {
            console.log(
              `The application does not currently accommodate chainId: ${targetChainId}`
            );
            return;
          } else {
            console.log(
              "Unknown error occurred when trying to change the network RPC: "
            );
            return;
          }
        }
        console.log(
          "Unknown warning occurred when trying to change the network RPC: ",
          switchError
        );
        return false;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [chainId, switchNetworkAsync]
  );
}
