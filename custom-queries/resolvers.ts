// You can import types as you wish, but libraries you import will not be available in the VM where these functions are run.
// The available global libraries are:
// _ (lodash)
// moment
// knex
// console

import { Context } from './schema'
import { tables } from './schema'

// Do not change this export. Satsuma expects a non-default `resolvers` object to be exported from this file.
export const resolvers = {
  Query: {
    sales_aggregation: async (parent: any, args: any, context: Context, info: any) => {
      const daysInPast = args.daysInPast || 0

      console.log(tables.ITEMS_DAY_DATA)

      const result = await context.db.entities.raw(
        `SELECT * FROM ? WHERE date > EXTRACT(EPOCH FROM CURRENT_TIMESTAMP - INTERVAL '${daysInPast} days')`, [tables.ITEMS_DAY_DATA]
      )

      return result.rows.reduce(
        (acc, next) => {
          return {
            amount: acc.amount + next.sales,
            volume: acc.volume + next.volume
          }
        },
        {
          amount: 0,
          volume: 0
        }
      )
    }
  }
}
