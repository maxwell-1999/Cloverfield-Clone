import { SupportedChainId } from "@symmio/frontend-sdk/constants/chains";
import { bsc, fantom, base, polygon, arbitrum, mainnet } from "wagmi/chains";

const supportedWagmiChain = {
  [SupportedChainId.FANTOM]: fantom,
  [SupportedChainId.BSC]: bsc,
  [SupportedChainId.BASE]: base,
  [SupportedChainId.POLYGON]: polygon,
  [SupportedChainId.ARBITRUM]: arbitrum,
  [SupportedChainId.MAINNET]: mainnet,
};

function getWagmiChain(supportChainList: number[]) {
  return supportChainList.map((chainId) => supportedWagmiChain[chainId]);
}

export const ClientChain = [SupportedChainId.BSC, SupportedChainId.POLYGON];

export const APP_CHAINS = getWagmiChain(ClientChain);

export const FALLBACK_CHAIN_ID = SupportedChainId.POLYGON;
