import { Playbook } from "@prisma/client";

export function serializePlaybook(playbook: Playbook) {
  return {
    id: playbook.id,
    name: playbook.name,
    description: playbook.description,
    color: playbook.color,
    createdAt: playbook.createdAt.toISOString(),
  };
}
