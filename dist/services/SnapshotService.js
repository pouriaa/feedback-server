/**
 * SnapshotService - Business logic for handling DOM snapshot comparison
 * Uses Prisma with SQLite/D1 for persistent storage
 */
import { getPrisma } from "../db/index.js";
export class SnapshotService {
    /**
     * Process a snapshot and detect changes compared to previous snapshot
     * @param data - Snapshot data from the client
     * @param projectId - Project ID for multi-tenancy
     */
    async processSnapshot(data, projectId) {
        const prisma = getPrisma();
        // Find existing snapshot for this project + session + url combination
        const existingSnapshot = await prisma.snapshot.findUnique({
            where: {
                projectId_sessionId_url: {
                    projectId,
                    sessionId: data.sessionId,
                    url: data.url,
                },
            },
        });
        // Upsert the new snapshot (replace if exists, create if not)
        await prisma.snapshot.upsert({
            where: {
                projectId_sessionId_url: {
                    projectId,
                    sessionId: data.sessionId,
                    url: data.url,
                },
            },
            update: {
                html: data.html,
                timestamp: data.timestamp,
                fingerprint: data.fingerprint,
                title: data.title,
                viewportWidth: data.viewport?.width,
                viewportHeight: data.viewport?.height,
            },
            create: {
                projectId,
                html: data.html,
                url: data.url,
                timestamp: data.timestamp,
                sessionId: data.sessionId,
                fingerprint: data.fingerprint,
                title: data.title,
                viewportWidth: data.viewport?.width,
                viewportHeight: data.viewport?.height,
            },
        });
        // If no existing snapshot, this is the first one - no changes to detect
        if (!existingSnapshot) {
            console.log(`[SnapshotService] First snapshot for session ${data.sessionId} at ${data.url}`);
            return {
                hasChanges: false,
                changedElements: [],
            };
        }
        // Compare fingerprints
        const hasChanges = existingSnapshot.fingerprint !== data.fingerprint;
        if (!hasChanges) {
            console.log(`[SnapshotService] No changes detected for session ${data.sessionId} at ${data.url}`);
            return {
                hasChanges: false,
                changedElements: [],
            };
        }
        // Fingerprints differ - detect what changed
        console.log(`[SnapshotService] Changes detected for session ${data.sessionId} at ${data.url}`, {
            oldFingerprint: existingSnapshot.fingerprint.substring(0, 20) + "...",
            newFingerprint: data.fingerprint.substring(0, 20) + "...",
        });
        // Perform DOM comparison to find changed elements
        const changedElements = this.detectChangedElements(existingSnapshot.html, data.html);
        // Optionally generate a prompt config based on detected changes
        const promptConfig = this.generatePromptConfig(changedElements);
        return {
            hasChanges: true,
            changedElements,
            promptConfig,
        };
    }
    /**
     * Detect changed elements between two HTML snapshots
     * This is a simplified implementation - in production, you might use
     * a more sophisticated DOM diffing algorithm
     */
    detectChangedElements(oldHtml, newHtml) {
        const changedElements = [];
        // Extract common interactive elements for comparison
        const interactiveSelectors = [
            "button",
            "a",
            "input",
            "form",
            "select",
            "[role='button']",
            "[data-feedback]",
        ];
        // Simple heuristic: check for new/removed elements by counting
        for (const selector of interactiveSelectors) {
            const oldCount = this.countElements(oldHtml, selector);
            const newCount = this.countElements(newHtml, selector);
            if (newCount > oldCount) {
                changedElements.push({
                    selector,
                    changeType: "added",
                    metadata: {
                        count: newCount - oldCount,
                    },
                });
            }
            else if (newCount < oldCount) {
                changedElements.push({
                    selector,
                    changeType: "removed",
                    metadata: {
                        count: oldCount - newCount,
                    },
                });
            }
        }
        // Check for modified content in key areas
        const contentAreas = ["main", "article", "[role='main']", ".content"];
        for (const selector of contentAreas) {
            const oldContent = this.extractContent(oldHtml, selector);
            const newContent = this.extractContent(newHtml, selector);
            if (oldContent !== newContent && (oldContent || newContent)) {
                changedElements.push({
                    selector,
                    changeType: "modified",
                    metadata: {
                        contentChanged: true,
                    },
                });
            }
        }
        return changedElements;
    }
    /**
     * Count occurrences of an element type in HTML
     * Simple regex-based counting (production should use proper DOM parsing)
     */
    countElements(html, selector) {
        // Handle tag selectors
        if (/^[a-z]+$/.test(selector)) {
            const regex = new RegExp(`<${selector}[\\s>]`, "gi");
            const matches = html.match(regex);
            return matches?.length ?? 0;
        }
        // Handle attribute selectors like [role='button']
        if (selector.startsWith("[") && selector.endsWith("]")) {
            const attrMatch = selector.match(/\[([^=]+)=['"]?([^'"\]]+)['"]?\]/);
            if (attrMatch) {
                const [, attr, value] = attrMatch;
                const regex = new RegExp(`${attr}=['"]?${value}['"]?`, "gi");
                const matches = html.match(regex);
                return matches?.length ?? 0;
            }
        }
        // Handle class selectors
        if (selector.startsWith(".")) {
            const className = selector.slice(1);
            const regex = new RegExp(`class=['"][^'"]*\\b${className}\\b[^'"]*['"]`, "gi");
            const matches = html.match(regex);
            return matches?.length ?? 0;
        }
        return 0;
    }
    /**
     * Extract content from a specific selector area
     * Simple implementation for basic content comparison
     */
    extractContent(html, selector) {
        // Handle tag selectors
        if (/^[a-z]+$/.test(selector)) {
            const regex = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)</${selector}>`, "i");
            const match = html.match(regex);
            return match?.[1]?.trim() ?? "";
        }
        // Handle class selectors
        if (selector.startsWith(".")) {
            const className = selector.slice(1);
            const regex = new RegExp(`<[^>]+class=['"][^'"]*\\b${className}\\b[^'"]*['"][^>]*>([\\s\\S]*?)</`, "i");
            const match = html.match(regex);
            return match?.[1]?.trim() ?? "";
        }
        // Handle attribute selectors
        if (selector.startsWith("[") && selector.endsWith("]")) {
            const attrMatch = selector.match(/\[([^=]+)=['"]?([^'"\]]+)['"]?\]/);
            if (attrMatch) {
                const [, attr, value] = attrMatch;
                const regex = new RegExp(`<[^>]+${attr}=['"]?${value}['"]?[^>]*>([\\s\\S]*?)</`, "i");
                const match = html.match(regex);
                return match?.[1]?.trim() ?? "";
            }
        }
        return "";
    }
    /**
     * Generate a prompt configuration based on detected changes
     * This allows the server to suggest appropriate feedback prompts
     */
    generatePromptConfig(changedElements) {
        // No changes, no prompt needed
        if (changedElements.length === 0) {
            return undefined;
        }
        // Check for specific change patterns
        const hasAddedButtons = changedElements.some((el) => el.changeType === "added" &&
            (el.selector === "button" || el.selector === "[role='button']"));
        const hasContentChanges = changedElements.some((el) => el.changeType === "modified" && el.metadata?.contentChanged);
        const hasFormChanges = changedElements.some((el) => el.selector === "form" || el.selector === "input");
        // Generate appropriate prompt based on changes
        if (hasFormChanges) {
            return {
                title: "How was your experience with this form?",
                type: "rating",
            };
        }
        if (hasAddedButtons) {
            return {
                title: "We noticed some new features. What do you think?",
                type: "choice",
                options: ["Love it!", "It's okay", "Not sure", "Don't like it"],
            };
        }
        if (hasContentChanges) {
            return {
                title: "Was this content helpful?",
                type: "choice",
                options: ["Yes, very helpful", "Somewhat helpful", "Not helpful"],
            };
        }
        // Default prompt for general changes
        return {
            title: "We've made some updates. How are we doing?",
            type: "rating",
        };
    }
    /**
     * Get a snapshot by ID (optionally scoped to project)
     */
    async getById(id, projectId) {
        const prisma = getPrisma();
        const snapshot = await prisma.snapshot.findUnique({
            where: { id },
        });
        if (!snapshot)
            return null;
        // If projectId provided, verify ownership
        if (projectId && snapshot.projectId !== projectId) {
            return null;
        }
        return this.toStoredSnapshot(snapshot);
    }
    /**
     * Get all snapshots for a session (scoped to project)
     */
    async getBySessionId(sessionId, projectId) {
        const prisma = getPrisma();
        const snapshots = await prisma.snapshot.findMany({
            where: { sessionId, projectId },
            orderBy: { receivedAt: "desc" },
        });
        return snapshots.map((s) => this.toStoredSnapshot(s));
    }
    /**
     * Get the count of stored snapshots for a project
     */
    async getCount(projectId) {
        const prisma = getPrisma();
        return prisma.snapshot.count({ where: { projectId } });
    }
    /**
     * Clear all snapshots for a project (useful for testing)
     */
    async clear(projectId) {
        const prisma = getPrisma();
        await prisma.snapshot.deleteMany({ where: { projectId } });
    }
    /**
     * Convert Prisma model to StoredSnapshot type
     */
    toStoredSnapshot(snapshot) {
        return {
            id: snapshot.id,
            receivedAt: snapshot.receivedAt.toISOString(),
            html: snapshot.html,
            url: snapshot.url,
            timestamp: snapshot.timestamp,
            sessionId: snapshot.sessionId,
            fingerprint: snapshot.fingerprint,
            title: snapshot.title ?? undefined,
            viewport: snapshot.viewportWidth !== null && snapshot.viewportHeight !== null
                ? {
                    width: snapshot.viewportWidth,
                    height: snapshot.viewportHeight,
                }
                : undefined,
        };
    }
}
// Export a singleton instance
export const snapshotService = new SnapshotService();
//# sourceMappingURL=SnapshotService.js.map