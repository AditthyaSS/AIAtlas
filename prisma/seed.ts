import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding AIAtlas database...\n");

    // Create providers
    const providers = await Promise.all([
        prisma.provider.upsert({
            where: { name: "Anthropic" },
            update: {},
            create: { name: "Anthropic", website: "https://anthropic.com", hqCountry: "US" },
        }),
        prisma.provider.upsert({
            where: { name: "OpenAI" },
            update: {},
            create: { name: "OpenAI", website: "https://openai.com", hqCountry: "US" },
        }),
        prisma.provider.upsert({
            where: { name: "Google DeepMind" },
            update: {},
            create: { name: "Google DeepMind", website: "https://deepmind.google", hqCountry: "US" },
        }),
        prisma.provider.upsert({
            where: { name: "Meta AI" },
            update: {},
            create: { name: "Meta AI", website: "https://ai.meta.com", hqCountry: "US" },
        }),
        prisma.provider.upsert({
            where: { name: "Mistral AI" },
            update: {},
            create: { name: "Mistral AI", website: "https://mistral.ai", hqCountry: "FR" },
        }),
        prisma.provider.upsert({
            where: { name: "xAI" },
            update: {},
            create: { name: "xAI", website: "https://x.ai", hqCountry: "US" },
        }),
        prisma.provider.upsert({
            where: { name: "DeepSeek" },
            update: {},
            create: { name: "DeepSeek", website: "https://deepseek.com", hqCountry: "CN" },
        }),
        prisma.provider.upsert({
            where: { name: "Cohere" },
            update: {},
            create: { name: "Cohere", website: "https://cohere.com", hqCountry: "CA" },
        }),
    ]);

    console.log(`✅ Created ${providers.length} providers`);

    const providerMap: Record<string, string> = {};
    providers.forEach((p) => (providerMap[p.name] = p.id));

    // Create models
    const modelData = [
        { slug: "o3", name: "o3", providerId: providerMap["OpenAI"], contextWindow: 200000, inputPricePerMtok: 2.0, outputPricePerMtok: 8.0, benchmarkGpqa: 96.7, benchmarkMmlu: 96.1, license: "Proprietary", modalities: ["text"], isOpenSource: false, speedToksPerSec: 42, isVerified: true, tags: ["reasoning", "frontier"] },
        { slug: "gpt-5", name: "GPT-5", providerId: providerMap["OpenAI"], contextWindow: 128000, inputPricePerMtok: 1.25, outputPricePerMtok: 10.0, benchmarkGpqa: 92.1, benchmarkMmlu: 93.4, license: "Proprietary", modalities: ["text", "image"], isOpenSource: false, speedToksPerSec: 55, isVerified: true, tags: ["multimodal", "frontier"] },
        { slug: "claude-opus-4", name: "Claude Opus 4", providerId: providerMap["Anthropic"], contextWindow: 200000, inputPricePerMtok: 5.0, outputPricePerMtok: 25.0, benchmarkGpqa: 89.3, benchmarkMmlu: 91.2, license: "Proprietary", modalities: ["text"], isOpenSource: false, speedToksPerSec: 38, isVerified: true, tags: ["reasoning", "analysis", "frontier"] },
        { slug: "grok-3", name: "Grok 3", providerId: providerMap["xAI"], contextWindow: 131072, inputPricePerMtok: 3.0, outputPricePerMtok: 15.0, benchmarkGpqa: 87.5, benchmarkMmlu: 89.7, license: "Proprietary", modalities: ["text", "image"], isOpenSource: false, speedToksPerSec: 60, isVerified: true, tags: ["reasoning", "multimodal"] },
        { slug: "gemini-2-5-pro", name: "Gemini 2.5 Pro", providerId: providerMap["Google DeepMind"], contextWindow: 1000000, inputPricePerMtok: 1.25, outputPricePerMtok: 5.0, benchmarkGpqa: 86.4, benchmarkMmlu: 90.8, license: "Proprietary", modalities: ["text", "image", "video", "audio"], isOpenSource: false, speedToksPerSec: 75, isVerified: true, tags: ["multimodal", "long-context"] },
        { slug: "claude-sonnet-4", name: "Claude Sonnet 4", providerId: providerMap["Anthropic"], contextWindow: 200000, inputPricePerMtok: 3.0, outputPricePerMtok: 15.0, benchmarkGpqa: 84.1, benchmarkMmlu: 88.5, license: "Proprietary", modalities: ["text", "image"], isOpenSource: false, speedToksPerSec: 72, isVerified: true, tags: ["balanced", "coding"] },
        { slug: "gpt-4o", name: "GPT-4o", providerId: providerMap["OpenAI"], contextWindow: 128000, inputPricePerMtok: 2.50, outputPricePerMtok: 10.0, benchmarkGpqa: 79.4, benchmarkMmlu: 87.2, license: "Proprietary", modalities: ["text", "image", "audio"], isOpenSource: false, speedToksPerSec: 82, isVerified: true, tags: ["multimodal", "versatile"] },
        { slug: "deepseek-v3", name: "DeepSeek V3", providerId: providerMap["DeepSeek"], contextWindow: 64000, inputPricePerMtok: 0.27, outputPricePerMtok: 1.1, benchmarkGpqa: 75.9, benchmarkMmlu: 82.1, license: "MIT", modalities: ["text"], isOpenSource: true, parameterCount: "671B", speedToksPerSec: 90, isVerified: true, tags: ["open-source", "efficient"] },
        { slug: "mistral-large-2", name: "Mistral Large 2", providerId: providerMap["Mistral AI"], contextWindow: 128000, inputPricePerMtok: 2.0, outputPricePerMtok: 6.0, benchmarkGpqa: 74.9, benchmarkMmlu: 84.0, license: "MRL", modalities: ["text"], isOpenSource: false, parameterCount: "123B", speedToksPerSec: 68, isVerified: true, tags: ["multilingual", "enterprise"] },
        { slug: "llama-3-1-405b", name: "Llama 3.1 405B", providerId: providerMap["Meta AI"], contextWindow: 128000, inputPricePerMtok: 5.0, outputPricePerMtok: 16.0, benchmarkGpqa: 73.1, benchmarkMmlu: 85.9, license: "Llama Community", modalities: ["text"], isOpenSource: true, parameterCount: "405B", speedToksPerSec: 25, isVerified: true, tags: ["open-source", "frontier"] },
        { slug: "deepseek-r1", name: "DeepSeek R1", providerId: providerMap["DeepSeek"], contextWindow: 64000, inputPricePerMtok: 0.55, outputPricePerMtok: 2.19, benchmarkGpqa: 73.3, benchmarkMmlu: 79.8, license: "MIT", modalities: ["text"], isOpenSource: true, parameterCount: "671B", speedToksPerSec: 45, isVerified: true, tags: ["reasoning", "open-source"] },
        { slug: "llama-3-3-70b", name: "Llama 3.3 70B", providerId: providerMap["Meta AI"], contextWindow: 128000, inputPricePerMtok: 0.59, outputPricePerMtok: 0.79, benchmarkGpqa: 71.2, benchmarkMmlu: 80.4, license: "Llama Community", modalities: ["text"], isOpenSource: true, parameterCount: "70B", speedToksPerSec: 110, isVerified: true, tags: ["open-source", "efficient"] },
        { slug: "gemini-2-5-flash", name: "Gemini 2.5 Flash", providerId: providerMap["Google DeepMind"], contextWindow: 1000000, inputPricePerMtok: 0.30, outputPricePerMtok: 2.5, benchmarkGpqa: 70.5, benchmarkMmlu: 78.2, license: "Proprietary", modalities: ["text", "image"], isOpenSource: false, speedToksPerSec: 150, isVerified: true, tags: ["fast", "efficient", "long-context"] },
        { slug: "mistral-small-3", name: "Mistral Small 3", providerId: providerMap["Mistral AI"], contextWindow: 32000, inputPricePerMtok: 0.1, outputPricePerMtok: 0.3, benchmarkGpqa: 62.1, benchmarkMmlu: 72.5, license: "Apache 2.0", modalities: ["text"], isOpenSource: true, parameterCount: "24B", speedToksPerSec: 130, isVerified: true, tags: ["open-source", "compact", "efficient"] },
        { slug: "gpt-4o-mini", name: "GPT-4o mini", providerId: providerMap["OpenAI"], contextWindow: 128000, inputPricePerMtok: 0.15, outputPricePerMtok: 0.60, benchmarkGpqa: 65.2, benchmarkMmlu: 82.0, license: "Proprietary", modalities: ["text", "image"], isOpenSource: false, speedToksPerSec: 120, isVerified: true, tags: ["efficient", "affordable"] },
        { slug: "claude-haiku-3-5", name: "Claude Haiku 3.5", providerId: providerMap["Anthropic"], contextWindow: 200000, inputPricePerMtok: 0.80, outputPricePerMtok: 4.00, benchmarkGpqa: 60.8, benchmarkMmlu: 75.3, license: "Proprietary", modalities: ["text"], isOpenSource: false, speedToksPerSec: 140, isVerified: true, tags: ["fast", "affordable"] },
        { slug: "mistral-nemo", name: "Mistral NeMo", providerId: providerMap["Mistral AI"], contextWindow: 128000, inputPricePerMtok: 0.15, outputPricePerMtok: 0.15, benchmarkGpqa: 64.5, benchmarkMmlu: 76.0, license: "Apache 2.0", modalities: ["text"], isOpenSource: true, parameterCount: "12B", speedToksPerSec: 145, isVerified: true, tags: ["coding", "lightweight", "open-source"]}
    ];

    for (const model of modelData) {
        await prisma.model.upsert({
            where: { slug: model.slug },
            update: {},
            create: model,
        });
    }

    console.log(`✅ Created ${modelData.length} models`);
    console.log("\n🚀 Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
