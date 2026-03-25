// app/+native-intent.tsx

export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  try {
    // Parse the incoming path - handle both full URLs and scheme paths
    let pathname: string;

    if (path.startsWith("http://") || path.startsWith("https://")) {
      // Full URL from universal link
      const url = new URL(path);
      pathname = url.pathname;
    } else if (path.startsWith("wholewordapp://")) {
      // Custom scheme URL
      const url = new URL(path);
      pathname = url.pathname;
    } else {
      // Already a pathname
      pathname = path.startsWith("/") ? path : `/${path}`;
    }

    // Rewrite /app → root (let AppNav handle auth redirect)
    if (pathname === "/app" || pathname === "/app/") {
      return "/";
    }

    // Handle event deep links: /app/event/:id → /stack/eventDetails?id=:id
    const eventMatch = pathname.match(/^\/app\/event\/(\d+)$/);
    if (eventMatch) {
      const eventId = eventMatch[1];
      return `/stack/eventDetails?id=${eventId}`;
    }

    // Handle video deep links: /app/video/:id → /stack/videoDetailsScreen?videoId=:id
    const videoMatch = pathname.match(/^\/app\/video\/(\d+)$/);
    if (videoMatch) {
      const videoId = videoMatch[1];
      return `/stack/videoDetailsScreen?videoId=${videoId}`;
    }

    // Handle audio deep links: /app/audio/:id → /stack/audioPlay?id=:id
    const audioMatch = pathname.match(/^\/app\/audio\/(\d+)$/);
    if (audioMatch) {
      const audioId = audioMatch[1];
      return `/stack/audioPlay?id=${audioId}`;
    }

    // Handle book deep links: /app/book/:id → /(tabs)/library/bookDetails?bookId=:id
    const bookMatch = pathname.match(/^\/app\/book\/(\d+)$/);
    if (bookMatch) {
      const bookId = bookMatch[1];
      return `/(tabs)/library/bookDetails?bookId=${bookId}`;
    }

    // Handle stack deep links: /app/stack/<slug> → /stack/<slug>
    const stackMatch = pathname.match(/^\/app\/stack\/(.+)$/);
    if (stackMatch) {
      const rest = stackMatch[1];
      return `/stack/${rest}`;
    }

    // Let all other paths through unchanged
    return pathname;
  } catch {
    // Fallback — never let this function crash the app
    return "/(tabs)";
  }
}
