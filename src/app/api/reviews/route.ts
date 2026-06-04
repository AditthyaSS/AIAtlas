import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

const DB_ENABLED = !!(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("[password]"));

// POST /api/reviews — submit a review for a model or tool
export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await request.json();
        const { entityType, entityId, rating, comment } = body;

        if (!entityType || !entityId || !rating) {
            return NextResponse.json(
                { error: "entityType, entityId, and rating are required" },
                { status: 400 }
            );
        }

        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be a number between 1 and 5" },
                { status: 400 }
            );
        }

        if (!["model", "tool"].includes(entityType)) {
            return NextResponse.json(
                { error: "entityType must be 'model' or 'tool'" },
                { status: 400 }
            );
        }

        // Validate entityId: must be a non-empty string within a safe length limit.
        // Without this check an attacker can submit megabyte-length strings or values
        // that do not correspond to any real entity, polluting the database.
        if (typeof entityId !== "string" || entityId.trim().length === 0) {
            return NextResponse.json(
                { error: "entityId must be a non-empty string." },
                { status: 400 }
            );
        }
        if (entityId.length > 100) {
            return NextResponse.json(
                { error: "entityId must not exceed 100 characters." },
                { status: 400 }
            );
        }

        // Validate and sanitize comment field to prevent spam submissions
        let sanitizedComment = comment;
        if (comment !== undefined && comment !== null) {
            if (typeof comment !== "string") {
                return NextResponse.json(
                    { error: "comment must be a string." },
                    { status: 400 }
                );
            }
            // Trim whitespace from both ends
            sanitizedComment = comment.trim();
            // Prevent all-whitespace submissions
            if (sanitizedComment.length === 0 && comment.length > 0) {
                return NextResponse.json(
                    { error: "comment cannot contain only whitespace." },
                    { status: 400 }
                );
            }
            if (sanitizedComment.length > 2000) {
                return NextResponse.json(
                    { error: "comment must not exceed 2000 characters." },
                    { status: 400 }
                );
            }
        }

        if (!DB_ENABLED) {
            return NextResponse.json(
                { message: "Review received (DB not connected — configure DATABASE_URL to persist).", status: "pending" },
                { status: 201 }
            );
        }

        // Verify the entity (model or tool) exists before allowing a review submission
        // This prevents polluting the database with reviews for non-existent entities
        let entityExists = false;
        if (entityType === "model") {
            const model = await prisma.model.findUnique({ where: { id: entityId } });
            entityExists = !!model;
        } else if (entityType === "tool") {
            // Assuming tools also have a database representation
            // Adjust this based on your actual data model
            const tool = await prisma.tool.findUnique({ where: { id: entityId } });
            entityExists = !!tool;
        }

        if (!entityExists) {
            return NextResponse.json(
                { error: `${entityType} not found` },
                { status: 404 }
            );
        }

        // Find or create user
        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.upsert({
            where: { githubUsername },
            update: {},
            create: { githubUsername, avatarUrl: session.user.image ?? undefined },
        });

        // Upsert review: one review per user per entity.
        // Using upsert prevents a single authenticated user from flooding
        // the database with duplicate reviews by simply re-submitting the
        // form. A repeat submission updates the existing record instead of
        // inserting a new row, keeping the data clean without any external
        // rate-limit store.
        const review = await prisma.review.upsert({
            where: {
                userId_entityType_entityId: {
                    userId: user.id,
                    entityType,
                    entityId,
                },
            },
            update: {
                rating: Math.round(rating),
                comment: sanitizedComment || undefined,
            },
            create: {
                userId: user.id,
                entityType,
                entityId,
                rating: Math.round(rating),
                comment: sanitizedComment || undefined,
            },
        });

        // Only emit a feed event when a new review is created, not on updates.
        const isNewReview = review.createdAt.getTime() === review.updatedAt.getTime();
        if (isNewReview) {
            await prisma.feedEvent.create({
                data: {
                    userId: user.id,
                    eventType: "review_posted",
                    entityType,
                    entityId,
                    entityName: entityId, // enriched client-side
                    metadata: { rating },
                },
            });
        }

        return NextResponse.json({ message: "Review submitted.", data: review }, { status: 201 });
    } catch (err) {
        console.error("POST /api/reviews error:", err);
        return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }
}
