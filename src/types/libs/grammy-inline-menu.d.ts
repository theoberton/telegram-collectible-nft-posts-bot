declare module 'grammy-inline-menu/examples/main-typescript' {
  export {};

}
declare module 'grammy-inline-menu/source/action-hive' {
  import type { ConstOrPromise, ContextPathFunc, RegExpLike } from 'grammy-inline-menu/source/generic-types';
  export type ActionFunc<Context> = (context: Context, path: string) => ConstOrPromise<string | boolean>;
  export type ButtonAction<Context> = {
      readonly trigger: RegExpLike;
      readonly doFunction: ActionFunc<Context>;
  };
  export class ActionHive<Context> {
      private readonly _actions;
      add(trigger: RegExpLike, doFunction: ActionFunc<Context>, hide: undefined | ContextPathFunc<Context, boolean>): void;
      list(path: RegExpLike): ReadonlySet<ButtonAction<Context>>;
  }

}
declare module 'grammy-inline-menu/source/action-hive.test' {
  export {};

}
declare module 'grammy-inline-menu/source/body' {
  import type { InputFile } from 'grammy';
  import type { LabeledPrice, Location, ParseMode, Venue } from 'grammy/types';
  import type { ReadonlyDeep } from 'type-fest';
  export type Body = string | TextBody | MediaBody | LocationBody | VenueBody | InvoiceBody;
  export const MEDIA_TYPES: readonly ["animation", "audio", "document", "photo", "video"];
  export type MediaType = typeof MEDIA_TYPES[number];
  export type TextBody = {
      readonly text: string;
      readonly parse_mode?: ParseMode;
      readonly disable_web_page_preview?: boolean;
  };
  export type MediaBody = {
      readonly type: MediaType;
      readonly media: string | InputFile;
      /** Caption */
      readonly text?: string;
      readonly parse_mode?: ParseMode;
  };
  export type LocationBody = {
      readonly location: Readonly<Location>;
      readonly live_period?: number;
  };
  export type VenueBody = {
      readonly venue: ReadonlyDeep<Venue>;
  };
  export type InvoiceBody = {
      readonly invoice: {
          readonly title: string;
          readonly description: string;
          readonly payload: string;
          readonly provider_token: string;
          readonly currency: string;
          readonly prices: ReadonlyArray<Readonly<LabeledPrice>>;
      };
  };
  export function isTextBody(body: unknown): body is string | TextBody;
  export function isMediaBody(body: unknown): body is MediaBody;
  export function isLocationBody(body: unknown): body is LocationBody;
  export function isVenueBody(body: unknown): body is VenueBody;
  export function isInvoiceBody(body: unknown): body is InvoiceBody;
  export function getBodyText(body: TextBody | string): string;

}
declare module 'grammy-inline-menu/source/body.test' {
  export {};

}
declare module 'grammy-inline-menu/source/buttons/align' {
  export const DEFAULT_BUTTON_COLUMNS = 6;
  export const DEFAULT_BUTTON_ROWS = 10;
  export function getRowsOfButtons<T>(buttons: readonly T[], columns?: number, maxRows?: number, page?: number): T[][];
  export function getButtonsOfPage<T>(buttons: readonly T[], columns?: number, maxRows?: number, page?: number): T[];
  export function getButtonsAsRows<T>(buttons: readonly T[], columns?: number): T[][];
  export function maximumButtonsPerPage(columns?: number, maxRows?: number): number;

}
declare module 'grammy-inline-menu/source/buttons/align.test' {
  export {};

}
declare module 'grammy-inline-menu/source/buttons/basic' {
  import type { ContextPathFunc } from 'grammy-inline-menu/source/generic-types';
  export interface BasicOptions<Context> {
      /**
       * Return true when the button(s) should be hidden and not to be called
       */
      readonly hide?: ContextPathFunc<Context, boolean>;
  }
  export interface SingleButtonOptions<Context> extends BasicOptions<Context> {
      /**
       * Decide whether the button should be in the last added row or in a new row. Own row per default, last row when true.
       */
      readonly joinLastRow?: boolean;
  }

}
declare module 'grammy-inline-menu/source/buttons/choose' {
  import type { ConstOrPromise } from 'grammy-inline-menu/source/generic-types';
  import type { ManyChoicesOptions } from 'grammy-inline-menu/source/choices/index';
  export type ChooseActionFunc<Context> = (context: Context, key: string) => ConstOrPromise<string | boolean>;
  export interface ChooseOptions<Context> extends ManyChoicesOptions<Context> {
      /**
       * Function which is called when the button is pressed.
       * The specific button which was pressed is given as second argument `key`.
       */
      readonly do: ChooseActionFunc<Context>;
  }

}
declare module 'grammy-inline-menu/source/buttons/pagination' {
  import type { ConstOrPromise, ContextFunc } from 'grammy-inline-menu/source/generic-types';
  import type { BasicOptions } from 'grammy-inline-menu/source/buttons/basic';
  export type SetPageFunction<Context> = (context: Context, page: number) => ConstOrPromise<void>;
  export type GetCurrentPageFunction<Context> = ContextFunc<Context, number | undefined>;
  export type GetTotalPagesFunction<Context> = ContextFunc<Context, number>;
  export interface GenericPaginationOptions<Context> {
      /**
       * Function which is called when the user chooses a new page.
       * This is used to store the user selection.
       *
       * @example
       * setPage: (ctx, page) => {
       *   ctx.session.page = page
       * }
       */
      readonly setPage: SetPageFunction<Context>;
      /**
       * Function which returns the current page.
       * This is used to get the last user selection from your store.
       *
       * Defaults to page 1 when undefined or not a finite number.
       *
       * @example
       * getCurrentPage: ctx => ctx.session.page
       */
      readonly getCurrentPage: GetCurrentPageFunction<Context>;
  }
  export interface PaginationOptions<Context> extends BasicOptions<Context>, GenericPaginationOptions<Context> {
      /**
       * Returns the amount of pages which are available.
       *
       * @example
       * getTotalPages: ctx => amountOfElements / ITEMS_PER_PAGE
       */
      readonly getTotalPages: GetTotalPagesFunction<Context>;
  }
  /**
   * Creates Choices for the paginator
   * @param  totalPages  total amount of pages. Array.length is a good way to return this one.
   * @param  currentPage current page. Has to be between [1..totalPages]
   * @return returns the Choices
   */
  export function createPaginationChoices(totalPages: number, currentPage: number | undefined): Record<number, string>;

}
declare module 'grammy-inline-menu/source/buttons/pagination.test' {
  export {};

}
declare module 'grammy-inline-menu/source/buttons/select' {
  import type { CallbackButtonTemplate } from 'grammy-inline-menu/source/keyboard';
  import type { Choices, ManyChoicesOptions } from 'grammy-inline-menu/source/choices/index';
  import type { ConstOrContextFunc, ConstOrPromise } from 'grammy-inline-menu/source/generic-types';
  export type IsSetFunction<Context> = (context: Context, key: string) => ConstOrPromise<boolean>;
  export type SetFunction<Context> = (context: Context, key: string, newState: boolean) => ConstOrPromise<string | boolean>;
  export type FormatStateFunction<Context> = (context: Context, textResult: string, state: boolean, key: string) => ConstOrPromise<string>;
  export interface SelectOptions<Context> extends ManyChoicesOptions<Context> {
      /**
       * Show an emoji for the choices currently false.
       * This is helpful to show the user there can be selected multiple choices at the same time.
       */
      readonly showFalseEmoji?: boolean;
      /**
       * Function returning the current state of a given choice.
       */
      readonly isSet: IsSetFunction<Context>;
      /**
       * Function which is called when a user selects a choice.
       * Arguments include the choice (`key`) and the new `state` which is helpful for multiple toggles.
       */
      readonly set: SetFunction<Context>;
      /**
       * Format the button text which is visible to the user.
       */
      readonly formatState?: FormatStateFunction<Context>;
  }
  export function generateSelectButtons<Context>(actionPrefix: string, choices: ConstOrContextFunc<Context, Choices>, options: SelectOptions<Context>): (context: Context, path: string) => Promise<CallbackButtonTemplate[][]>;

}
declare module 'grammy-inline-menu/source/buttons/select.test' {
  export {};

}
declare module 'grammy-inline-menu/source/buttons/submenu' {
  import type { ManyChoicesOptions } from 'grammy-inline-menu/source/choices/index';
  import type { SingleButtonOptions } from 'grammy-inline-menu/source/buttons/basic';
  export interface SubmenuOptions<Context> extends SingleButtonOptions<Context> {
  }
  export interface ChooseIntoSubmenuOptions<Context> extends ManyChoicesOptions<Context> {
  }

}
declare module 'grammy-inline-menu/source/buttons/toggle' {
  import type { CallbackButtonTemplate } from 'grammy-inline-menu/source/keyboard';
  import type { ConstOrContextPathFunc, ConstOrPromise, ContextPathFunc } from 'grammy-inline-menu/source/generic-types';
  import type { SingleButtonOptions } from 'grammy-inline-menu/source/buttons/basic';
  export type FormatStateFunction<Context> = (context: Context, text: string, state: boolean, path: string) => ConstOrPromise<string>;
  export interface ToggleOptions<Context> extends SingleButtonOptions<Context> {
      /**
       * Function returning the current state.
       */
      readonly isSet: ContextPathFunc<Context, boolean>;
      /**
       * Function which is called when a user presses the button.
       */
      readonly set: (context: Context, newState: boolean, path: string) => ConstOrPromise<string | boolean>;
      /**
       * Format the button text which is visible to the user.
       */
      readonly formatState?: FormatStateFunction<Context>;
  }
  export function generateToggleButton<Context>(text: ConstOrContextPathFunc<Context, string>, actionPrefix: string, options: ToggleOptions<Context>): ContextPathFunc<Context, CallbackButtonTemplate | undefined>;

}
declare module 'grammy-inline-menu/source/buttons/toggle.test' {
  export {};

}
declare module 'grammy-inline-menu/source/choices/actions' {
  import type { ConstOrContextFunc, ContextPathFunc } from 'grammy-inline-menu/source/generic-types';
  import type { Choices } from 'grammy-inline-menu/source/choices/types';
  export function combineHideAndChoices<Context>(actionPrefix: string, choices: ConstOrContextFunc<Context, Choices>, hide: undefined | ContextPathFunc<Context, boolean>): ContextPathFunc<Context, boolean>;

}
declare module 'grammy-inline-menu/source/choices/actions.test' {
  export {};

}
declare module 'grammy-inline-menu/source/choices/buttons' {
  import type { CallbackButtonTemplate } from 'grammy-inline-menu/source/keyboard';
  import type { ConstOrContextFunc } from 'grammy-inline-menu/source/generic-types';
  import type { Choices, ChoiceTextFunc, ManyChoicesOptions } from 'grammy-inline-menu/source/choices/types';
  export function generateChoicesButtons<Context>(actionPrefix: string, isSubmenu: boolean, choices: ConstOrContextFunc<Context, Choices>, options: ManyChoicesOptions<Context>): (context: Context, path: string) => Promise<CallbackButtonTemplate[][]>;
  export function generateChoicesPaginationButtons<Context>(actionPrefix: string, choiceKeys: number, currentPage: number | undefined, options: ManyChoicesOptions<Context>): CallbackButtonTemplate[];
  export function createChoiceTextFunction<Context>(choices: Choices, buttonText: undefined | ChoiceTextFunc<Context>): ChoiceTextFunc<Context>;

}
declare module 'grammy-inline-menu/source/choices/buttons.test' {
  export {};

}
declare module 'grammy-inline-menu/source/choices/index' {
  export * from 'grammy-inline-menu/source/choices/actions';
  export * from 'grammy-inline-menu/source/choices/buttons';
  export * from 'grammy-inline-menu/source/choices/types';

}
declare module 'grammy-inline-menu/source/choices/types' {
  import type { BasicOptions } from 'grammy-inline-menu/source/buttons/basic';
  import type { ConstOrPromise } from 'grammy-inline-menu/source/generic-types';
  import type { GenericPaginationOptions } from 'grammy-inline-menu/source/buttons/pagination';
  export type Choice = string | number;
  export type ChoiceText = string;
  export type ChoicesArray = readonly Choice[];
  export type ChoicesRecord = Readonly<Record<Choice, ChoiceText>>;
  export type ChoicesMap = Readonly<ReadonlyMap<Choice, ChoiceText>>;
  export type Choices = ChoicesArray | ChoicesRecord | ChoicesMap;
  export type ChoiceTextFunc<Context> = (context: Context, key: string) => ConstOrPromise<string>;
  export interface ManyChoicesOptions<Context> extends BasicOptions<Context>, Partial<GenericPaginationOptions<Context>> {
      /**
       * Amount of buttons shown per row (side by side).
       *
       * Defaults to 6
       */
      readonly columns?: number;
      /**
       * Maximum rows to be shown.
       * Consider pagination when you have many buttons rather than increasing the amount of buttons as its more user friendly.
       *
       * Defaults to 10
       */
      readonly maxRows?: number;
      /**
       * Per default the action (do or set) is only run when the user selected choice does exist.
       * For this the choices are queried again and has to contain the user selection.
       * Normally this is useful: Shop offers some drinks and user should only click existing drinks. If some drink isnt in the offer, the menu will be updated to show the current drinks instead of calling the do / set.
       *
       * Sometimes this behaviour is not helpful and can be disabled.
       */
      readonly disableChoiceExistsCheck?: boolean;
      /**
       * Function which has to return the text the user will see on the button of a given choice
       */
      readonly buttonText?: ChoiceTextFunc<Context>;
  }

}
declare module 'grammy-inline-menu/source/choices/understand-choices' {
  import type { Choices, ChoicesArray, ChoicesMap } from 'grammy-inline-menu/source/choices/types';
  export function choicesIsArray(choices: Choices): choices is ChoicesArray;
  export function choicesIsMap(choices: Choices): choices is ChoicesMap;
  export function getChoiceKeysFromChoices(choices: Choices): string[];
  export function getChoiceTextByKey(choices: Choices, key: string): string;
  export function ensureCorrectChoiceKeys(actionPrefix: string, path: string, choiceKeys: readonly string[]): void;

}
declare module 'grammy-inline-menu/source/choices/understand-choices.test' {
  export {};

}
declare module 'grammy-inline-menu/source/generic-types' {
  export type ConstOrPromise<T> = T | Promise<T>;
  export type ContextFunc<Context, ReturnType> = (context: Context) => ConstOrPromise<ReturnType>;
  export type ContextPathFunc<Context, ReturnType> = (context: Context, path: string) => ConstOrPromise<ReturnType>;
  export type ConstOrContextFunc<Context, ReturnType> = ReturnType | ContextFunc<Context, ReturnType>;
  export type ConstOrContextPathFunc<Context, ReturnType> = ReturnType | ContextPathFunc<Context, ReturnType>;
  export type RegExpLike = {
      readonly source: string;
      readonly flags?: string;
  };
  export function isObject(something: unknown): something is Record<string, unknown>;
  export function hasTruthyKey(something: unknown, key: string): boolean;
  export function isRegExpExecArray(something: unknown): something is RegExpExecArray;
  export function filterNonNullable<T>(): (o: T) => o is NonNullable<T>;

}
declare module 'grammy-inline-menu/source/generic-types.test' {
  export {};

}
declare module 'grammy-inline-menu/index' {
  export { getMenuOfPath } from 'grammy-inline-menu/source/path';
  export * from 'grammy-inline-menu/source/menu-middleware';
  export * from 'grammy-inline-menu/source/menu-template';
  export * from 'grammy-inline-menu/source/row-creators/index';
  export * from 'grammy-inline-menu/source/send-menu';
  export type { Body } from 'grammy-inline-menu/source/body';

}
declare module 'grammy-inline-menu/source/keyboard' {
  import type { InlineKeyboardButton as TelegramInlineKeyboardButton } from 'grammy/types';
  import type { ReadonlyDeep } from 'type-fest';
  import type { ConstOrContextPathFunc, ContextPathFunc } from 'grammy-inline-menu/source/generic-types';
  export type CallbackButtonTemplate = {
      readonly text: string;
      readonly relativePath: string;
  };
  export type InlineKeyboardButton = ReadonlyDeep<TelegramInlineKeyboardButton>;
  export type InlineKeyboard = ReadonlyArray<readonly InlineKeyboardButton[]>;
  export type ButtonTemplate = CallbackButtonTemplate | InlineKeyboardButton;
  export type ButtonTemplateRow = readonly ButtonTemplate[];
  type UncreatedTemplate<Context> = ConstOrContextPathFunc<Context, ButtonTemplate | undefined>;
  type ButtonTemplateRowGenerator<Context> = ContextPathFunc<Context, ButtonTemplateRow[]>;
  export class Keyboard<Context> {
      private readonly _entries;
      addCreator(creator: ButtonTemplateRowGenerator<Context>): void;
      add(joinLastRow: boolean, ...buttons: ReadonlyArray<UncreatedTemplate<Context>>): void;
      render(context: Context, path: string): Promise<InlineKeyboard>;
  }
  export {};

}
declare module 'grammy-inline-menu/source/keyboard.test' {
  export {};

}
declare module 'grammy-inline-menu/source/menu-like' {
  import type { Body } from 'grammy-inline-menu/source/body';
  import type { ButtonAction } from 'grammy-inline-menu/source/action-hive';
  import type { ContextPathFunc, RegExpLike } from 'grammy-inline-menu/source/generic-types';
  import type { InlineKeyboard } from 'grammy-inline-menu/source/keyboard';
  export type MenuLike<Context> = {
      readonly renderBody: ContextPathFunc<Context, Body>;
      readonly renderKeyboard: ContextPathFunc<Context, InlineKeyboard>;
      readonly renderActionHandlers: (path: RegExpLike) => ReadonlySet<ButtonAction<Context>>;
      readonly listSubmenus: () => ReadonlySet<Submenu<Context>>;
  };
  export type Submenu<Context> = {
      readonly action: RegExpLike;
      readonly hide: undefined | ContextPathFunc<Context, boolean>;
      readonly menu: MenuLike<Context>;
  };

}
declare module 'grammy-inline-menu/source/menu-middleware' {
  import type { Context as BaseContext } from 'grammy';
  import type { RegExpLike } from 'grammy-inline-menu/source/generic-types';
  import type { MenuLike } from 'grammy-inline-menu/source/menu-like';
  import type { SendMenuFunc } from 'grammy-inline-menu/source/send-menu';
  export type Options<Context> = {
      /**
       * Function which is used to send and update the menu.
       *
       * Defaults to `editMenuOnContext`
       */
      readonly sendMenu?: SendMenuFunc<Context>;
  };
  export class MenuMiddleware<Context extends BaseContext> {
      readonly rootTrigger: string | RegExpLike;
      readonly rootMenu: MenuLike<Context>;
      readonly options: Options<Context>;
      private readonly _sendMenu;
      private readonly _responder;
      constructor(rootTrigger: string | RegExpLike, rootMenu: MenuLike<Context>, options?: Options<Context>);
      /**
       * Send the root menu to the context. Shortcut for `replyMenuToContext(…)`
       * @param context Context where the root menu should be replied to
       * @example
       * const menuMiddleware = new MenuMiddleware('/', menuTemplate)
       * bot.command('start', async ctx => menuMiddleware.replyToContext(ctx))
       */
      replyToContext(context: Context, path?: string | RegExpLike): Promise<import("@grammyjs/types").Message.DocumentMessage | import("@grammyjs/types").Message.AudioMessage | import("@grammyjs/types").Message.PhotoMessage | import("@grammyjs/types").Message.VideoMessage | import("@grammyjs/types").Message.LocationMessage | import("@grammyjs/types").Message.InvoiceMessage | import("@grammyjs/types").Message.TextMessage>;
      /**
       * The tree structure can be shown for debugging purposes.
       * You can take a look on the menu you created.
       */
      tree(): string;
      middleware(): (context: Context, next: () => Promise<void>) => void;
  }

}
declare module 'grammy-inline-menu/source/menu-template' {
  import type { ActionFunc, ButtonAction } from 'grammy-inline-menu/source/action-hive';
  import type { Body } from 'grammy-inline-menu/source/body';
  import type { ButtonTemplate, ButtonTemplateRow, InlineKeyboard } from 'grammy-inline-menu/source/keyboard';
  import type { Choices } from 'grammy-inline-menu/source/choices/index';
  import type { ChooseIntoSubmenuOptions, SubmenuOptions } from 'grammy-inline-menu/source/buttons/submenu';
  import type { ChooseOptions } from 'grammy-inline-menu/source/buttons/choose';
  import type { ConstOrContextFunc, ConstOrContextPathFunc, ContextPathFunc, RegExpLike } from 'grammy-inline-menu/source/generic-types';
  import type { MenuLike, Submenu } from 'grammy-inline-menu/source/menu-like';
  import type { PaginationOptions } from 'grammy-inline-menu/source/buttons/pagination';
  import type { SelectOptions } from 'grammy-inline-menu/source/buttons/select';
  import type { SingleButtonOptions } from 'grammy-inline-menu/source/buttons/basic';
  import type { ToggleOptions } from 'grammy-inline-menu/source/buttons/toggle';
  export interface InteractionOptions<Context> extends SingleButtonOptions<Context> {
      /**
       * Function which is called when the button is pressed
       */
      readonly do: ActionFunc<Context>;
  }
  export class MenuTemplate<Context> {
      private readonly _body;
      private readonly _keyboard;
      private readonly _actions;
      private readonly _submenus;
      constructor(body: ConstOrContextPathFunc<Context, Body>);
      /**
       * Creates the message body. Usage only recommended for advanced usage of this library.
       * @param context Context to be supplied to the buttons on on creation
       */
      renderBody(context: Context, path: string): Promise<Body>;
      /**
       * Creates the raw keyboard information. Usage only recommended for advanced usage of this library.
       * @param context Context to be supplied to the buttons on on creation
       * @param path Path within the menu. Will be used for the relativePaths
       */
      renderKeyboard(context: Context, path: string): Promise<InlineKeyboard>;
      /**
       * Creates the actions that the buttons of the template want to happen. Usage only recommended for advanced usage of this library.
       * @param path Path within the menu. Will be used for the relativePaths
       */
      renderActionHandlers(path: RegExpLike): ReadonlySet<ButtonAction<Context>>;
      /**
       * Lists the submenus used in this menu template. Usage only recommended for advanced usage of this library.
       */
      listSubmenus(): ReadonlySet<Submenu<Context>>;
      /**
       * Allows for manual creation of a button in a very raw way of doing. Less user friendly but very customizable.
       * @param button constant or function returning a button representation to be added to the keyboard
       * @param options additional options
       */
      manual(button: ConstOrContextPathFunc<Context, ButtonTemplate>, options?: SingleButtonOptions<Context>): void;
      /**
       * Allows for manual creation of many buttons. Less user friendly but very customizable.
       * @param creator function generating a keyboard part
       */
      manualRow(creator: ContextPathFunc<Context, ButtonTemplateRow[]>): void;
      /**
       * Allows for manual creation of actions. Less user friendly but very customizable.
       * Is probably used together with manualRow.
       * @param trigger regular expression which is appended to the menu path.
       * @param action function which is called when the trigger is matched.
       * @example
       * menuTemplate.manualRow((context, path) => [[{text: 'Page 2', relativePath: 'custom-pagination:2'}, {text: 'Page 3', relativePath: 'custom-pagination:3'}]])
       * menuTemplate.manualAction(/custom-pagination:(\d+)$/, (context, path) => {
       *   console.log('manualAction', path, context.match![1])
       *   return '.'
       * })
       */
      manualAction(trigger: RegExpLike, action: ActionFunc<Context>): void;
      /**
       * Add an url button to the keyboard
       * @param text text to be displayed on the button
       * @param url url where this button should be heading
       * @param options additional options
       */
      url(text: ConstOrContextPathFunc<Context, string>, url: ConstOrContextPathFunc<Context, string>, options?: SingleButtonOptions<Context>): void;
      /**
       * Add a switch_inline_query button to the keyboard
       * @param text text to be displayed on the button
       * @param query query that is shown next to the bot username. Can be empty ('')
       * @param options additional options
       */
      switchToChat(text: ConstOrContextPathFunc<Context, string>, query: ConstOrContextPathFunc<Context, string>, options?: SingleButtonOptions<Context>): void;
      /**
       * Add a switch_inline_query_current_chat button to the keyboard
       * @param text text to be displayed on the button
       * @param query query that is shown next to the bot username. Can be empty ('')
       * @param options additional options
       */
      switchToCurrentChat(text: ConstOrContextPathFunc<Context, string>, query: ConstOrContextPathFunc<Context, string>, options?: SingleButtonOptions<Context>): void;
      /**
       * Button which only purpose is to move around the menu on click.
       * The relative path is inspired by the cd command.
       * If you want to execute a function on click use `menuTemplate.interact(…)` instead.
       * @param text text to be displayed on the button
       * @param relativePath relative target path like 'child/', '..' or '../sibling/
       * @param options additional options
       *
       * @example menuTemplate.navigate('back to parent menu', '..')
       * @example menuTemplate.navigate('to the root menu', '/')
       * @example menuTemplate.navigate('to a sibling menu', '../sibling/')
       */
      navigate(text: ConstOrContextPathFunc<Context, string>, relativePath: string, options?: SingleButtonOptions<Context>): void;
      /**
       * Add a button to which a function is executed on click.
       * You can update the menu afterwards by returning a relative path. If you only want to update the menu or move around use `menuTemplate.navigate(…)` instead.
       * @param text text to be displayed on the button
       * @param action unique identifier for this button within the menu template
       * @param options additional options. Requires `do` as you want to do something when the user pressed the button.
       * @example
       * menuTemplate.interact('Knock Knock', 'unique', {
       *   do: async context => {
       *     await context.answerCallbackQuery('Who is there?')
       *     return false // Do not update the menu afterwards
       *   }
       * })
       * @example
       * menuTemplate.interact('Update the current menu afterwards', 'unique', {
       *   do: async context => {
       *     // do what you want to do
       *     return '.' // . like the current one -> this menu
       *   }
       * })
       */
      interact(text: ConstOrContextPathFunc<Context, string>, action: string, options: InteractionOptions<Context>): void;
      /**
       * Add a button to a submenu
       * @param text text to be displayed on the button
       * @param action unique identifier for this button within the menu template
       * @param submenu submenu to be entered on click
       * @param options additional options
       * @example
       * const submenuTemplate = new MenuTemplate('I am a submenu')
       * submenuTemplate.interact('Text', 'unique', {
       *   do: async ctx => ctx.answerCallbackQuery('You hit a button in a submenu')
       * })
       * submenuTemplate.manualRow(createBackMainMenuButtons())
       *
       * menuTemplate.submenu('enter submenu', 'unique', submenuTemplate)
       */
      submenu(text: ConstOrContextPathFunc<Context, string>, action: string, submenu: MenuLike<Context>, options?: SubmenuOptions<Context>): void;
      /**
       * Let the user choose one of many options and execute a function for the one the user picked
       * @param actionPrefix prefix which is used to create a unique identifier for each of the resulting buttons
       * @param choices choices the user can pick from
       * @param options additional options. Requires `do` as you want to do something when the user pressed a button.
       */
      choose(actionPrefix: string, choices: ConstOrContextFunc<Context, Choices>, options: ChooseOptions<Context>): void;
      /**
       * Submenu which is entered when a user picks one of many choices
       * @param actionPrefix prefix which is used to create a unique identifier for each of the resulting buttons
       * @param choices choices the user can pick from. Also see `menuTemplate.choose(…)` for examples on choices
       * @param submenu submenu to be entered when one of the choices is picked
       * @param options additional options
       * @example
       * const submenu = new MenuTemplate<MyContext>(ctx => `Welcome to ${ctx.match[1]}`)
       * submenu.interact('Text', 'unique', {
       *   do: async ctx => {
       *     console.log('Take a look at ctx.match. It contains the chosen city', ctx.match)
       *     await ctx.answerCallbackQuery('You hit a button in a submenu')
       *     return false
       *   }
       * })
       * submenu.manualRow(createBackMainMenuButtons())
       *
       * menu.chooseIntoSubmenu('unique', ['Gotham', 'Mos Eisley', 'Springfield'], submenu)
       */
      chooseIntoSubmenu(actionPrefix: string, choices: ConstOrContextFunc<Context, Choices>, submenu: MenuLike<Context>, options?: ChooseIntoSubmenuOptions<Context>): void;
      /**
       * Let the user select one (or multiple) options from a set of choices
       * @param actionPrefix prefix which is used to create a unique identifier for each of the resulting buttons
       * @param choices choices the user can pick from. Also see `menuTemplate.choose(…)` for examples on choices
       * @param options additional options. Requires `set` and `isSet`.
       * @example
       * // User can select exactly one
       * menuTemplate.select('unique', ['at home', 'at work', 'somewhere else'], {
       *   isSet: (context, key) => context.session.currentLocation === key,
       *   set: (context, key) => {
       *     context.session.currentLocation = key
       *     return true
       *   }
       * })
       * @example
       * // User can select one of multiple options
       * menuTemplate.select('unique', ['has arms', 'has legs', 'has eyes', 'has wings'], {
       *   showFalseEmoji: true,
       *   isSet: (context, key) => Boolean(context.session.bodyparts[key]),
       *   set: (context, key, newState) => {
       *     context.session.bodyparts[key] = newState
       *     return true
       *   }
       * })
       */
      select(actionPrefix: string, choices: ConstOrContextFunc<Context, Choices>, options: SelectOptions<Context>): void;
      /**
       * Shows a row of pagination buttons.
       * When the user presses one of the buttons `setPage` is called with the specified button.
       * In order to determine which is the current page and how many pages there are `getCurrentPage` and `getTotalPages` are called to which you have to return the current value
       * @param actionPrefix prefix which is used to create a unique identifier for each of the resulting buttons
       * @param options additional options. Requires `getCurrentPage`, `getTotalPages` and `setPage`.
       */
      pagination(actionPrefix: string, options: PaginationOptions<Context>): void;
      /**
       * Toogle a value when the button is pressed.
       * If you want to toggle multiple values use `menuTemplate.select(…)`
       * @param text text to be displayed on the button
       * @param actionPrefix unique identifier for this button within the menu template
       * @param options additional options. Requires `set` and `isSet`.
       * @example
       * menuTemplate.toggle('Text', 'unique', {
       *   isSet: context => Boolean(context.session.isFunny),
       *   set: (context, newState) => {
       *     context.session.isFunny = newState
       *     return true
       *   }
       * })
       * @example
       * // You can use a custom format for the state instead of the default emoji
       * menuTemplate.toggle('Lamp', 'unique', {
       *   formatState: (context, text, state) => `${text}: ${state ? 'on' : 'off'}`,
       *   isSet: context => Boolean(context.session.lamp),
       *   set: (context, newState) => {
       *     context.session.lamp = newState
       *     return true
       *   }
       * })
       */
      toggle(text: ConstOrContextPathFunc<Context, string>, actionPrefix: string, options: ToggleOptions<Context>): void;
  }

}
declare module 'grammy-inline-menu/source/path' {
  import type { RegExpLike } from 'grammy-inline-menu/source/generic-types';
  export function ensureTriggerChild(trigger: string | RegExpLike): void;
  export function ensureTriggerLastChild(trigger: string | RegExpLike): void;
  export function combineTrigger(parent: RegExpLike, child: string | RegExpLike): RegExp;
  export function createRootMenuTrigger(rootTrigger: string | RegExpLike): RegExpLike;
  export function ensurePathMenu(path: string): void;
  export function combinePath(parent: string, relativePath: string): string;
  export function getMenuOfPath(path: string): string;

}
declare module 'grammy-inline-menu/source/path.test' {
  export {};

}
declare module 'grammy-inline-menu/source/prefix' {
  export type PrefixOptions = {
      /**
       * Emoji which is used as prefix when true.
       *
       * Defaults to ✅
       */
      readonly prefixTrue?: string;
      /**
       * Emoji which is used as prefix when false.
       *
       * Defaults to 🚫
       */
      readonly prefixFalse?: string;
      /**
       * Do not show the prefix when true.
       */
      readonly hideTrueEmoji?: boolean;
      /**
       * Do not show the prefix when false.
       */
      readonly hideFalseEmoji?: boolean;
  };
  export const emojiTrue = "\u2705";
  export const emojiFalse = "\uD83D\uDEAB";
  /**
   * Prefixes the text with a true / false emoji.
   * Can also be used with custom prefixes.
   * @param text text which should receive the prefix.
   * @param prefix true / false or a custom (string) prefix.
   * @param options optional options to customize emojis
   */
  export function prefixEmoji(text: string, prefix: string | boolean | undefined, options?: PrefixOptions): string;
  /**
   * Prefixes the text with the prefix.
   * If the prefix is undefined or '' the raw text is returned.
   * @param text text which should receive the prefix.
   * @param prefix prefix to end up in front of the text.
   */
  export function prefixText(text: string, prefix: string | undefined): string;

}
declare module 'grammy-inline-menu/source/prefix.emoji.test' {
  export {};

}
declare module 'grammy-inline-menu/source/prefix.text.test' {
  export {};

}
declare module 'grammy-inline-menu/source/row-creators/back-main-buttons' {
  import type { CallbackButtonTemplate } from 'grammy-inline-menu/source/keyboard';
  import type { ConstOrContextPathFunc } from 'grammy-inline-menu/source/generic-types';
  export function createBackMainMenuButtons<Context>(backButtonText?: ConstOrContextPathFunc<Context, string>, mainMenuButtonText?: ConstOrContextPathFunc<Context, string>): (context: Context, path: string) => Promise<CallbackButtonTemplate[][]>;

}
declare module 'grammy-inline-menu/source/row-creators/back-main-buttons.test' {
  export {};

}
declare module 'grammy-inline-menu/source/row-creators/index' {
  export * from 'grammy-inline-menu/source/row-creators/back-main-buttons';

}
declare module 'grammy-inline-menu/source/send-menu' {
  import type { Api, Context as BaseContext } from 'grammy';
  import type { Message } from 'grammy/types';
  import type { MenuLike } from 'grammy-inline-menu/source/menu-like';
  /**
   * Generic Method which is able to send a menu to a context (given a path where it is)
   */
  export type SendMenuFunc<Context> = (menu: MenuLike<Context>, context: Context, path: string) => Promise<unknown>;
  /**
   * Method which is able to send a menu to a chat.
   * Generated via `generateSendMenuToChatFunction`.
   */
  export type SendMenuToChatFunction<Context> = (chatId: string | number, context: Context, other?: Readonly<Record<string, unknown>>) => Promise<Message>;
  /**
   * Method which is able to edit a message in a chat into a menu.
   * Generated via `generateEditMessageIntoMenuFunction`.
   */
  export type EditMessageIntoMenuFunction<Context> = (chatId: number | string, messageId: number, context: Context, other?: Readonly<Record<string, unknown>>) => Promise<Message | true>;
  /**
   * Reply a menu to a context as a new message
   * @param menu menu to be shown
   * @param context current grammY context to reply the menu to it
   * @param path path of the menu
   * @param other optional additional options
   */
  export function replyMenuToContext<Context extends BaseContext>(menu: MenuLike<Context>, context: Context, path: string, other?: Readonly<Record<string, unknown>>): Promise<Message.DocumentMessage | Message.AudioMessage | Message.PhotoMessage | Message.VideoMessage | Message.LocationMessage | Message.InvoiceMessage | Message.TextMessage>;
  /**
   * Edit the context into the menu. If thats not possible the current message is deleted and a new message is replied
   * @param menu menu to be shown
   * @param context current grammY context to edit the menu into
   * @param path path of the menu
   * @param other optional additional options
   */
  export function editMenuOnContext<Context extends BaseContext>(menu: MenuLike<Context>, context: Context, path: string, other?: Readonly<Record<string, unknown>>): Promise<boolean | Message.DocumentMessage | Message.AudioMessage | Message.PhotoMessage | Message.VideoMessage | Message.LocationMessage | Message.InvoiceMessage | Message.TextMessage | (import("grammy/types").Update.Edited & Message)>;
  /**
   * Delete the message on the context.
   * If thats not possible the reply markup (keyboard) is removed. The user can not press any buttons on that old message.
   * @param context context of the message to be deleted
   */
  export function deleteMenuFromContext<Context extends BaseContext>(context: Context): Promise<void>;
  /**
   * Deletes to menu of the current context and replies a new one ensuring the menu is at the end of the chat.
   * @param menu menu to be shown
   * @param context current grammY context to send the menu to
   * @param path path of the menu
   * @param other optional additional options
   */
  export function resendMenuToContext<Context extends BaseContext>(menu: MenuLike<Context>, context: Context, path: string, other?: Readonly<Record<string, unknown>>): Promise<Message.DocumentMessage | Message.AudioMessage | Message.PhotoMessage | Message.VideoMessage | Message.LocationMessage | Message.InvoiceMessage | Message.TextMessage>;
  /**
   * Generate a function to send the menu towards a chat from external events
   * @param telegram The Telegram object to do the API calls with later on
   * @param menu menu to be shown
   * @param path path of the menu
   */
  export function generateSendMenuToChatFunction<Context>(telegram: Api, menu: MenuLike<Context>, path: string): SendMenuToChatFunction<Context>;
  /**
   * Edit the message into the the menu.
   * This fails when the current message is not compatible with the menu (you cant edit a media message into a text message and vice versa)
   * @param telegram The Telegram object to do the API calls with later on
   * @param menu menu to be shown
   * @param path path of the menu
   */
  export function generateEditMessageIntoMenuFunction<Context>(telegram: Api, menu: MenuLike<Context>, path: string): EditMessageIntoMenuFunction<Context>;

}
declare module 'grammy-inline-menu/test/menu-middleware/action' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-middleware/empty-menu' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-middleware/javascript-fails' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-middleware/reply-to-context' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-middleware/submenu' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-middleware/tree' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/body' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/choose-into-submenu' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/choose' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/empty-menu' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/interact' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/javascript-forgot' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/javascript-renamed' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/manual' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/navigate' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/other-buttons' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/pagination' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/select' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/submenu' {
  export {};

}
declare module 'grammy-inline-menu/test/menu-template/toggle' {
  export {};

}
declare module 'grammy-inline-menu/test/send-menu/context-edit' {
  export {};

}
declare module 'grammy-inline-menu/test/send-menu/context-reply' {
  export {};

}
declare module 'grammy-inline-menu/test/send-menu/context-resend' {
  export {};

}
declare module 'grammy-inline-menu/test/send-menu/javascript-fails' {
  export {};

}
declare module 'grammy-inline-menu/test/send-menu/telegram-edit' {
  export {};

}
declare module 'grammy-inline-menu/test/send-menu/telegram-send' {
  export {};

}
declare module 'grammy-inline-menu' {
  import main = require('grammy-inline-menu/index');
  export = main;
}