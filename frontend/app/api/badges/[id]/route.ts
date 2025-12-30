
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    const badges: Record<string, any> = {
        "1": {
            name: "Clarity Fundamentals",
            description: "Proof of foundational knowledge in Clarity smart contract development.",
            image: "https://quest-dao.vercel.app/badges/1.png",
            attributes: [
                { trait_type: "Module", value: "Fundamentals" },
                { trait_type: "Level", value: "Beginner" }
            ]
        },
        "2": {
            name: "Smart Contract Safety",
            description: "Proof of expertise in secure contract design and vulnerability mitigation.",
            image: "https://quest-dao.vercel.app/badges/placeholder.png",
            attributes: [
                { trait_type: "Module", value: "Safety" },
                { trait_type: "Level", value: "Intermediate" }
            ]
        },
        "3": {
            name: "SIP-009 NFT Mastery",
            description: "Proof of mastery in digital asset standards and on-chain ownership.",
            image: "https://quest-dao.vercel.app/badges/placeholder.png",
            attributes: [
                { trait_type: "Module", value: "NFTs" },
                { trait_type: "Level", value: "Intermediate" }
            ]
        },
        "4": {
            name: "DAO Architect Suite",
            description: "Proof of advanced proficiency in decentralized governance systems.",
            image: "https://quest-dao.vercel.app/badges/placeholder.png",
            attributes: [
                { trait_type: "Module", value: "Governance" },
                { trait_type: "Level", value: "Wizard" }
            ]
        },
        "5": {
            name: "BNS Identity Discovery",
            description: "Proof of identity verification via the Blockchain Name System.",
            image: "https://quest-dao.vercel.app/badges/placeholder.png",
            attributes: [
                { trait_type: "Module", value: "Identity" },
                { trait_type: "Level", value: "Verification" }
            ]
        }
    };

    const metadata = badges[id] || {
        name: "Architect Badge",
        description: "A mark of technical achievement in the Stacks ecosystem.",
        image: "https://quest-dao.vercel.app/badges/placeholder.png"
    };

    return NextResponse.json(metadata);
}
