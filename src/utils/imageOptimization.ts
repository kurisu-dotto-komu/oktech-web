// Safe wrapper for Astro's getImage function that handles test environments
export async function safeGetImage(options: any): Promise<{ src: string }> {
  try {
    // Try to dynamically import getImage
    const { getImage } = await import("astro:assets");
    return await getImage(options);
  } catch (error) {
    // In test environment or when getImage is not available,
    // return the original src
    return { src: options.src?.src || options.src || "" };
  }
}
