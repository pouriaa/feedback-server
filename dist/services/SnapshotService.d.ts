/**
 * SnapshotService - Business logic for handling DOM snapshot comparison
 * Compares fingerprints to detect changes between snapshots
 */
import type { SnapshotData, StoredSnapshot, ChangeDetectionResponse } from "../types/index.js";
export declare class SnapshotService {
    /**
     * Process a snapshot and detect changes compared to previous snapshot
     */
    processSnapshot(data: SnapshotData): Promise<ChangeDetectionResponse>;
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
     * Get a snapshot by ID
     */
    getById(id: string): Promise<StoredSnapshot | null>;
    /**
     * Get all snapshots for a session
     */
    getBySessionId(sessionId: string): Promise<StoredSnapshot[]>;
    /**
     * Get the count of stored snapshots
     */
    getCount(): Promise<number>;
    /**
     * Clear all snapshots (useful for testing)
     */
    clear(): Promise<void>;
}
export declare const snapshotService: SnapshotService;
//# sourceMappingURL=SnapshotService.d.ts.map