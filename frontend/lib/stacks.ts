'use client';

// Centralizing all Stacks imports to help the bundler deduplicate them 
// and avoid Turbopack "Module factory not available" errors.

export * from '@stacks/transactions';
export {
    showConnect,
    authenticate,
    AppConfig,
    UserSession,
    openContractCall,
    openSTXTransfer
} from '@stacks/connect';
export * from '@stacks/network';
export * from '@stacks/common';
