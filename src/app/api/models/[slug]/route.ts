import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getModelBySlug } from "@/lib/mock-data";

const DB_ENABLED = !!(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("[password]"));

// GET /api/models/[slug] — get single model by slug
export async function GET(
    _request: Request,
    { params }: { params: { slug: string } }
) {
    if (!DB_ENABLED) {
        const model = getModelBySlug(params.slug);
        if (!model) return NextResponse.json({ error: "Model not found" }, { status: 404 });
        return NextResponse.json({ data: model });
    }

    try {
        const model = await prisma.model.findUnique({
            where: { slug: params.slug },
            include: {
                provider: true,
            },
        });

        if (!model) {
            return NextResponse.json({ error: "Model not found" }, { status: 404 });
        }

        // Prevent returning unverified models to the public API
        if (!model.isVerified) {
            return NextResponse.json({ error: "Model not found" }, { status: 404 });
        }

        return NextResponse.json({ data: model });
    } catch (err) {
        console.error("GET /api/models/[slug] error:", err);
        return NextResponse.json({ error: "Failed to fetch model" }, { status: 500 });
    }
}
