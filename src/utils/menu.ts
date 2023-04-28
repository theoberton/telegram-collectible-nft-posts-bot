import { CallbackButtonTemplate } from "grammy-inline-menu";

export function createBackMainMenuButtons<Context>(
  backButtonText: string,
  mainMenuButtonText: string,
  mainMenuPath: string
): (context: Context, path: string) => CallbackButtonTemplate[][] {
  return (_context, path) => {
    const hasMainMenu = mainMenuButtonText && path.startsWith("/");

    const parts = path.split("/").length;
    const row = [];

    if (parts >= (hasMainMenu ? 4 : 3)) {
      row.push({
        text: backButtonText,
        relativePath: "..",
      });
    }

    if (hasMainMenu && parts >= 3) {
      row.push({
        text: mainMenuButtonText,
        relativePath: `${mainMenuPath}`,
      });
    }

    return [row];
  };
}


export function extractChannelUsernameFromDisplayName(displayName: string) {
  return displayName.substring(
    displayName.lastIndexOf("@") + 1,
    displayName.length-1
  );
}