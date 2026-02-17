/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} description
 * @property {number} amount
 * @property {"income"|"expense"} type
 * @property {string} category
 * @property {string} date
 * @property {string} [note]
 */

export const transactionTypes = ["expense", "income"];
