// codex-web may be served from a subpath (e.g. behind a reverse proxy at
// /codexweb/). the prefix is derived from the current url so browser history
// paths stay inside the deployed subtree.
export function getBasePrefix(): string {
  const withoutThread = window.location.pathname.replace(
    /\/thread\/[^/]+\/?$/,
    "",
  );
  return withoutThread.replace(/\/+$/, "");
}

function toRelativePathname(pathname: string): string {
  const prefix = getBasePrefix();
  const relative = pathname.slice(prefix.length);
  return relative === "" ? "/" : relative;
}

export function mapBrowserPathToInitialRoute(pathname: string, search: string) {
  const relative = toRelativePathname(pathname);
  if (relative === "/share/receive" && search) {
    const params = new URLSearchParams(search);

    const prompt = ["title", "text", "url"]
      .flatMap((name) => {
        const value = params.get(name);
        return value === null ? [] : [`${name}: ${value}`];
      })
      .join("\n");

    return {
      memoryPath: prompt
        ? `/?${new URLSearchParams({ prompt }).toString()}`
        : "/",
      browserPath: `${getBasePrefix()}/`,
    };
  }

  return {
    memoryPath: mapBrowserPathToRoute(relative),
  };
}

function mapBrowserPathToRoute(pathname: string): string {
  const match = pathname.match(/^\/thread\/([^/]+)$/);
  if (match) {
    try {
      return `/local/${decodeURIComponent(match[1])}`;
    } catch {
      return "/";
    }
  }

  return "/";
}

export function mapMemoryPathToBrowserPath(pathname: string) {
  const prefix = getBasePrefix();

  if (pathname === "/") {
    return { path: `${prefix}/`, titleChange: "Codex" };
  }

  const match = pathname.match(/^\/local\/([^/?#]+)$/);
  if (!match) {
    return null;
  }

  return { path: `${prefix}/thread/${encodeURIComponent(match[1])}` };
}

export function dispatchNavigateToRoute(path: string): void {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        type: "navigate-to-route",
        path,
      },
    }),
  );
}

window.addEventListener("popstate", () => {
  dispatchNavigateToRoute(
    mapBrowserPathToRoute(toRelativePathname(window.location.pathname)),
  );
});
