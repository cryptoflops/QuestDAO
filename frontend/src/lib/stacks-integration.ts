import { showConnect, AppConfig, UserSession, openContractCall } from '@stacks/connect';
import { STACKS_MAINNET } from '@stacks/network';
import { PostConditionMode } from '@stacks/transactions';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

/**
 * Initiates the wallet connection flow for the user.
 */
export function authenticate() {
    showConnect({
        appDetails: {
            name: 'Stacks Integration',
            icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '',
        },
        redirectTo: '/',
        onFinish: () => {
            const userData = userSession.loadUserData();
            console.log('User connected:', userData.profile.stxAddress.mainnet);
        },
        userSession,
    });
}

/**
 * Wrapper for executing an arbitrary smart contract call.
 * This is primarily used as a generic helper throughout the application.
 */
export function executeContractCall(contractAddress: string, contractName: string, functionName: string) {
    const network = STACKS_MAINNET;

    openContractCall({
        network,
        contractAddress,
        contractName,
        functionName,
        functionArgs: [], // Provide default args if necessary
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
            console.log('Transaction broadcast successfully! Tx ID:', data.txId);
        },
        onCancel: () => {
            console.log('Transaction canceled by user.');
        },
    });
}
