import { TreeItem } from 'performant-array-to-tree';
import { useMemo } from 'react';

/**
 * Extracts text from a label that can be either string or JSX.Element
 * Falls back to filterBasis if label is a React element
 */
function extractLabelText(item: TreeItem): string {
  if (typeof item.label === 'string') {
    return item.label;
  }
  // For JSX.Element labels, use filterBasis which is always a string
  return item.filterBasis || String(item.value);
}

/**
 * Flattens tree structure into a Map for O(1) lookups
 */
function flattenTree(treeData: TreeItem[]): Map<string, TreeItem> {
  const flatMap = new Map<string, TreeItem>();

  const traverse = (items: TreeItem[]) => {
    items.forEach((item) => {
      flatMap.set(item.value, item);
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  };

  traverse(treeData);
  return flatMap;
}

/**
 * Builds hierarchical path for a single tree item
 * Returns path like "Parent > Child > Item"
 */
function buildPath(item: TreeItem, flatMap: Map<string, TreeItem>): string {
  const path: string[] = [];
  let current: TreeItem | undefined = item;
  const visited = new Set<string>();

  while (current) {
    // Prevent infinite loops from circular references
    if (visited.has(current.value)) {
      break;
    }
    visited.add(current.value);

    // Extract text label
    const labelText = extractLabelText(current);
    path.unshift(labelText);

    // Stop if no parent or parent not found
    if (!current.parent_value) {
      break;
    }

    current = flatMap.get(current.parent_value);
  }

  return path.join(' > ');
}

/**
 * Custom hook to build hierarchical paths for selected tree items
 *
 * @param treeData - Full tree structure
 * @param selectedItems - Currently selected items
 * @returns Map of value to hierarchical path string
 *
 * @example
 * const paths = useTreePaths(treeData, value);
 * const itemPath = paths.get(item.value); // "Parent > Child > Item"
 */
export function useTreePaths(treeData: TreeItem[], selectedItems: TreeItem[]): Map<string, string> {
  return useMemo(() => {
    if (!treeData || treeData.length === 0) {
      return new Map();
    }

    if (!selectedItems || selectedItems.length === 0) {
      return new Map();
    }

    const flatMap = flattenTree(treeData);
    const pathsMap = new Map<string, string>();

    selectedItems.forEach((item) => {
      const path = buildPath(item, flatMap);
      pathsMap.set(item.value, path);
    });

    return pathsMap;
  }, [treeData, selectedItems]);
}
