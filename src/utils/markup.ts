import _ from "lodash/fp";


export const toItalic = (text: string) => `<i>${text}</i>`;
export const toBold = (text: string) => `<b>${text}</b>`;
export const createLinkText = (link: string, text: string) =>
  `<a href="${link}">${text}</a>`;

export const toBoldAndItalic = _.compose(toItalic, toBold);
