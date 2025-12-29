'use client';

import { AppConfig, UserSession } from '@/lib/stacks';

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = typeof window !== 'undefined'
    ? new UserSession({ appConfig })
    : {
        isUserSignedIn: () => false,
        signUserOut: () => { },
        loadUserData: () => ({ profile: { stxAddress: {} } })
    } as any;
