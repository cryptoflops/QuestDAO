import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  standardPrincipalCV,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

export interface QuestOptions {
  contractAddress: string;
  senderKey: string;
  network?: 'mainnet' | 'testnet';
}

export async function createQuest(
  opts: QuestOptions,
  agentOwner: string,
  agentId: number,
  bounty: number
) {
  const network = opts.network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  
  const txOptions = {
    contractAddress: opts.contractAddress,
    contractName: 'quest-escrow',
    functionName: 'create-quest',
    functionArgs: [
      standardPrincipalCV(agentOwner),
      uintCV(agentId),
      uintCV(bounty),
    ],
    senderKey: opts.senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 400,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, network);
}

export async function delegateVote(
  opts: QuestOptions,
  delegateAddress: string
) {
  const network = opts.network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

  const txOptions = {
    contractAddress: opts.contractAddress,
    contractName: 'dao-voting',
    functionName: 'delegate',
    functionArgs: [standardPrincipalCV(delegateAddress)],
    senderKey: opts.senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 400,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, network);
}
