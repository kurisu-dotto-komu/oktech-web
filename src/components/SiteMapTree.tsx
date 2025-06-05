import React from "react";
import Link from "./LinkReact";

// Data helpers
import { POSSIBLE_ROLES, ROLE_CONFIGS, getEvents, getMembers } from "../data";

// Build the flat list of pages at module load so we only execute the async
// data fetching once during the build. Top-level await is supported inside
// framework components rendered by Astro.

interface PageEntry {
  href: string;
  title: string;
}

/**
 * Build the flat list of pages that should appear in the sitemap.
 */
const buildPages = async (): Promise<PageEntry[]> => {
  const staticPages: PageEntry[] = [
    { href: "/", title: "Home" },
    { href: "/about", title: "About" },
    { href: "/events", title: "Events" },
    { href: "/community", title: "Community" },
    { href: "/sitemap", title: "Sitemap (human)" },
    { href: "/sitemap.xml", title: "Sitemap (XML)" },
  ];

  const rolePages: PageEntry[] = POSSIBLE_ROLES.map((role) => ({
    href: `/community/${role}`,
    title: ROLE_CONFIGS[role].plural,
  }));

  const events = await getEvents();
  const eventPages: PageEntry[] = events.map(({ id, data }) => ({
    href: `/event/${id}`,
    title: data.title as string,
  }));

  const members = await getMembers();
  const memberPages: PageEntry[] = members.map((m) => ({
    href: `/member/${m.id}`,
    title: m.name,
  }));

  return [...staticPages, ...rolePages, ...eventPages, ...memberPages];
};

// The pages promise will resolve once and remain cached for subsequent renders.
const pagesPromise = buildPages();

// Using top-level await (supported in Astro), resolve our pages list once at
// build time. This guarantees that the component has synchronous access to
// the data when it is rendered and avoids additional hooks or Suspense
// complexity.
const pages: PageEntry[] = await pagesPromise;

// Pre-compute the tree so that every render is as cheap as possible. Since
// the sitemap does not change during a single build, we can safely share this
// across all renders.
const prebuiltTree = (() => {
  return buildTree(pages);
})();

interface TreeNode extends PageEntry {
  children: TreeNode[];
}

interface Props {
  className?: string;
}

/**
 * Convert a flat array of pages into a nested tree based on URL segments.
 */
function buildTree(pages: PageEntry[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();

  const getNode = (segments: string[]): TreeNode => {
    const path = segments.length === 0 ? "/" : `/${segments.join("/")}`;
    if (!nodeMap.has(path)) {
      // Placeholder; title is replaced later if needed
      nodeMap.set(path, {
        href: path,
        title: segments.length === 0 ? "Home" : segments[segments.length - 1],
        children: [],
      });
    }
    return nodeMap.get(path)!;
  };

  const roots: TreeNode[] = [];

  const ALIAS_ROOTS: Record<string, string> = {
    event: "events",
    member: "community",
  };

  pages.forEach((page) => {
    const rawSegments =
      page.href === "/" ? [] : page.href.replace(/^\//, "").replace(/\/$/, "").split("/");

    // Apply alias mapping to the first segment if necessary, so that
    // `/event/*` pages appear under `/events` and `/member/*` pages appear
    // under `/community`.
    const segments = [...rawSegments];
    if (segments.length > 0 && ALIAS_ROOTS[segments[0]]) {
      segments[0] = ALIAS_ROOTS[segments[0]];
    }

    let parent: TreeNode | null = null;
    segments.forEach((_, idx) => {
      const node = getNode(segments.slice(0, idx + 1));
      if (parent && !parent.children.includes(node)) {
        parent.children.push(node);
      }
      parent = node;
    });

    // If root page ("/")
    if (segments.length === 0) {
      roots.push({ ...page, children: [] });
    } else {
      const top = getNode([segments[0]]);
      if (!roots.includes(top)) {
        roots.push(top);
      }
    }

    // Ensure final node has correct title/href
    const finalNode = parent ?? getNode([]);
    finalNode.title = page.title;
    finalNode.href = page.href;
  });

  return roots;
}

// Individual node renderer (can be reused elsewhere)
function Node({ node }: { node: TreeNode }) {
  return (
    <li key={node.href}>
      <Link href={node.href} className="link link-hover">
        {node.title}
      </Link>
      <span className="text-sm text-gray-500"> {node.href}</span>
      {node.children.length > 0 && (
        <ul className="ml-4">
          {node.children.map((child) => (
            <Node key={child.href} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Top-level component that receives a flat list of pages and renders the nested tree.
 */
export default function SiteMapTree({ className = "" }: Props) {
  const tree = React.useMemo(() => prebuiltTree, []);

  return (
    <ul className={className}>
      {tree.map((node) => (
        <Node key={node.href} node={node} />
      ))}
    </ul>
  );
}
