export function calculateVotingPower(stxBalance: number, daoTokens: number) {
    return stxBalance * 0.5 + daoTokens;
}

export function formatDaoAddress(address: string) {
    return address.substring(0, 8) + '...' + address.slice(-4);
}
