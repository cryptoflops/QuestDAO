import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const IS_MAINNET = true; // Switch to false for Testnet
export const NETWORK = IS_MAINNET ? STACKS_MAINNET : STACKS_TESTNET;

export const CONTRACT_ADDRESS = IS_MAINNET
    ? 'SP1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7M3CKVJJ'
    : 'ST1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7MAMP23P';

export const CONTRACTS = {
    VOTING: 'dao-voting-v4',
    REGISTRY: 'quest-registry-v4',
    BADGE: 'soulbound-badge-v2',
    TRAIT: 'sip-009-nft-trait'
};

export const API_URL = IS_MAINNET
    ? 'https://api.hiro.so'
    : 'https://api.testnet.hiro.so';
