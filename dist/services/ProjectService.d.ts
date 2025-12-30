/**
 * ProjectService - Business logic for managing projects
 * Uses Prisma with SQLite/D1 for persistent storage
 */
export interface CreateProjectInput {
    name: string;
    allowedOrigins?: string[];
}
export interface UpdateProjectInput {
    name?: string;
}
export interface ProjectWithOrigins {
    id: string;
    name: string;
    apiKey: string;
    allowedOrigins: string[];
    createdAt: string;
    updatedAt: string;
}
export interface AllowedOriginData {
    id: string;
    origin: string;
    createdAt: string;
}
export declare class ProjectService {
    /**
     * Generate a unique API key for a project
     */
    private generateApiKey;
    /**
     * Create a new project
     */
    create(input: CreateProjectInput): Promise<ProjectWithOrigins>;
    /**
     * Get a project by ID
     */
    getById(id: string): Promise<ProjectWithOrigins | null>;
    /**
     * Get all projects
     */
    getAll(): Promise<ProjectWithOrigins[]>;
    /**
     * Update a project
     */
    update(id: string, input: UpdateProjectInput): Promise<ProjectWithOrigins | null>;
    /**
     * Delete a project
     */
    delete(id: string): Promise<boolean>;
    /**
     * Add an allowed origin to a project
     */
    addOrigin(projectId: string, origin: string): Promise<AllowedOriginData | null>;
    /**
     * Remove an allowed origin from a project
     */
    removeOrigin(originId: string): Promise<boolean>;
    /**
     * Rotate a project's API key
     */
    rotateApiKey(projectId: string): Promise<string | null>;
}
export declare const projectService: ProjectService;
//# sourceMappingURL=ProjectService.d.ts.map