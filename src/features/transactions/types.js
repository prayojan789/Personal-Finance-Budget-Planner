/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} description
 * @property {number} amount
 * @property {"income"|"expense"} type
 * @property {string} category
 * @property {string} date
 * @property {string} [note]
 * @property {boolean} [isRecurring]
 * @property {string} [recurringId]
 * @property {boolean} [isSubscription]
 */

export const transactionTypes = ["expense", "income"];
