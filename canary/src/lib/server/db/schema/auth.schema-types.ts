import type { createAuth } from '../../auth';

type Auth = ReturnType<typeof createAuth>;

export type User = Auth['$Infer']['Session']['user'];
export type Session = Auth['$Infer']['Session']['session'];
