/**
 * File overview: src/components/ui/use-toast.ts
 *
 * General TypeScript module supporting the application.
 * Behavior:
 * - Encapsulates a small, well-defined responsibility within the codebase.
 * Assumptions:
 * - Callers rely on the exported surface; internal details may evolve over time.
 * Performance:
 * - Keep logic straightforward and avoid hidden global side effects.
 */
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
