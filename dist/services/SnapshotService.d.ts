/**
 * SnapshotService - Business logic for handling DOM snapshot comparison
 * Uses Prisma with SQLite/D1 for persistent storage
 */
import type { SnapshotData, StoredSnapshot, ChangeDetectionResponse } from "../types/index.js";
export declare class SnapshotService {
    /**
     * Process a snapshot and detect changes compared to previous snapshot
     * @param data - Snapshot data from the client
     * @param projectId - Project ID for multi-tenancy
     */
    processSnapshot(data: SnapshotData, projectId: string): Promise<ChangeDetectionResponse>;
    /**
     * Detect changed elements between two HTML snapshots
     * This is a simplified implementation - in production, you might use
     * a more sophisticated DOM diffing algorithm
     */
    private detectChangedElements;
    /**
     * Count occurrences of an element type in HTML
     * Simple regex-based counting (production should use proper DOM parsing)
     */
    private countElements;
    /**
     * Extract content from a specific selector area
     * Simple implementation for basic content comparison
     */
    private extractContent;
    /**
     * Generate a prompt configuration based on detected changes
     * This allows the server to suggest appropriate feedback prompts
     */
    private generatePromptConfig;
    /**
     * Get a snapshot by ID (optionally scoped to project)
     */
    getById(id: string, projectId?: string): Promise<StoredSnapshot | null>;
    /**
     * Get all snapshots for a session (scoped to project)
     */
    getBySessionId(sessionId: string, projectId: string): Promise<StoredSnapshot[]>;
    /**
     * Get the count of stored snapshots for a project
     */
    getCount(projectId: string): Promise<number>;
    /**
     * Clear all snapshots for a project (useful for testing)
     */
    clear(projectId: string): Promise<void>;
    /**
     * Convert Prisma model to StoredSnapshot type
     */
    private toStoredSnapshot;
}
export declare const snapshotService: SnapshotService;
//# sourceMappingURL=SnapshotService.d.ts.map