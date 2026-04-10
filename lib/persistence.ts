import { AgentSpec } from '@/lib/types/agent';
import { SpecBuilder } from '@/lib/spec-builder';

/**
 * Persistence Layer
 * Handles saving and loading agent specs
 * For MVP: Uses localStorage on client, file system on server
 */

// Type for persistence storage
interface StoredSpec {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  data: AgentSpec;
}

/**
 * Client-side persistence using localStorage
 */
export class ClientPersistence {
  private static readonly STORAGE_KEY = 'agent_specs';

  /**
   * Save spec to localStorage
   */
  static saveSpec(spec: AgentSpec): void {
    try {
      const specs = this.getAllSpecs();
      const index = specs.findIndex(s => s.id === spec.id);

      const storedSpec: StoredSpec = {
        id: spec.id!,
        name: spec.name,
        created_at: spec.created_at!,
        updated_at: new Date().toISOString(),
        data: spec
      };

      if (index >= 0) {
        specs[index] = storedSpec;
      } else {
        specs.push(storedSpec);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(specs));
    } catch (error) {
      console.error('Failed to save spec:', error);
      throw new Error('Failed to save specification');
    }
  }

  /**
   * Load spec by ID
   */
  static loadSpec(id: string): AgentSpec | null {
    try {
      const specs = this.getAllSpecs();
      const stored = specs.find(s => s.id === id);
      return stored ? stored.data : null;
    } catch (error) {
      console.error('Failed to load spec:', error);
      return null;
    }
  }

  /**
   * Get all saved specs (summary)
   */
  static getAllSpecs(): StoredSpec[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to read specs:', error);
      return [];
    }
  }

  /**
   * Delete spec by ID
   */
  static deleteSpec(id: string): boolean {
    try {
      const specs = this.getAllSpecs();
      const filtered = specs.filter(s => s.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete spec:', error);
      return false;
    }
  }

  /**
   * Export spec as YAML file
   */
  static exportAsYAML(spec: AgentSpec): string {
    return SpecBuilder.toYAML(spec);
  }

  /**
   * Export spec as JSON file
   */
  static exportAsJSON(spec: AgentSpec): string {
    return SpecBuilder.toJSON(spec);
  }

  /**
   * Clear all saved specs (dangerous!)
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

/**
 * Server-side persistence (for API routes)
 * For MVP: simple in-memory storage
 * For production: would connect to database
 */
export class ServerPersistence {
  // In-memory store (in production, this would be a database)
  private static store: Map<string, StoredSpec> = new Map();

  /**
   * Save spec
   */
  static saveSpec(spec: AgentSpec): void {
    const storedSpec: StoredSpec = {
      id: spec.id!,
      name: spec.name,
      created_at: spec.created_at!,
      updated_at: new Date().toISOString(),
      data: spec
    };
    this.store.set(spec.id!, storedSpec);
  }

  /**
   * Load spec by ID
   */
  static loadSpec(id: string): AgentSpec | null {
    const stored = this.store.get(id);
    return stored ? stored.data : null;
  }

  /**
   * Get all specs
   */
  static getAllSpecs(): StoredSpec[] {
    return Array.from(this.store.values());
  }

  /**
   * Get specs summary (for listing)
   */
  static getSpecsSummary(): Array<{ id: string; name: string; created_at: string; updated_at: string }> {
    return Array.from(this.store.values()).map(spec => ({
      id: spec.id,
      name: spec.name,
      created_at: spec.created_at,
      updated_at: spec.updated_at
    }));
  }

  /**
   * Delete spec
   */
  static deleteSpec(id: string): boolean {
    return this.store.delete(id);
  }

  /**
   * Check if spec exists
   */
  static exists(id: string): boolean {
    return this.store.has(id);
  }
}

/**
 * Export helper - download file to browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  if (typeof window === 'undefined') return; // Server-side guard

  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
