import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrumSepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "9733b14d8799280063aa8d5b91636d49";

export const CONTRACT_ADDRESS = "0x74672c5efBDB1779F3Cb48F5A769Cf20A4E36eAa";

if (!projectId) {
    throw new Error("Project ID is not defined");
}

export const networks = [arbitrumSepolia] as [AppKitNetwork, ...AppKitNetwork[]];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    ssr: true,
    projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;
