import { RdfType } from '@pod-os/core';
import { AvailableTools } from './availableTools';

/**
 * Describes a tool that can be used
 */
export interface ToolConfig {
  /**
   * The HTML custom element that renders the tool
   */
  element: string;
  /**
   * A human-readable short label to identify the tool
   */
  label: string;
  /**
   * An icon to identify the tool
   * Available values see https://shoelace.style/components/icon/#default-icons
   */
  icon: string;
  /**
   * The types that can be handled by that tool
   */
  types: TypePriority[];
}

/**
 * Describes how well a given RDF type can be handled
 */
interface TypePriority {
  /**
   * URI identifying the RDF type
   */
  uri: string;
  /**
   * how well that type can be handled (higher values === better fit)
   */
  priority: number;
}

/**
 * Describes the priority (order) that applies to a tool
 */
interface ToolPriority {
  /**
   * The tool in question
   */
  tool: ToolConfig;
  /**
   * The priority given to the tool (higher values === better fit)
   */
  priority: number;
}

export function selectToolsForTypes(types: RdfType[]) {
  const typeUris = new Set(types.map(type => type.uri));

  return Object.values(AvailableTools)
    .map(maxPriorityFor(typeUris))
    .filter(onlyRelevant)
    .toSorted(byPriority)
    .map(it => it.tool)
    .concat(AvailableTools.Generic)
    .concat(AvailableTools.Attachments);
}

const maxPriorityFor = (typeUris: Set<string>) => tool =>
  ({
    tool,
    priority: maxPriority(tool.types, typeUris),
  }) as ToolPriority;

function maxPriority(types: TypePriority[], typeUris: Set<string>): number {
  return types.filter(type => typeUris.has(type.uri)).reduce((max, type) => Math.max(max, type.priority), 0);
}

const onlyRelevant = (it: ToolPriority) => it.priority > 0;

const byPriority = (a: ToolPriority, b: ToolPriority) => b.priority - a.priority;
