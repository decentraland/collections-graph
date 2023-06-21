// You can import types as you wish, but libraries you import will not be available in the VM where these functions are run.
// The available global libraries are:
// _ (lodash)
// moment
// knex
// console
//
import { Context } from './schema'

// Do not change this export. Satsuma expects a non-default `resolvers` object to be exported from this file.
export const resolvers = {
  Query: {
    salesAggregation: async (parent: any, args: any, context: Context, info: any) => {
      const daysInPast = args.daysInPast || 0

      // Wanted to check if this is logged by the process run with `npx @satsuma/cli local`
      // Satsuma: We are supposed to use `context.db.entities.tables` instead of importing the `tables` variable directly.
      console.log(context.db.entities.tables)

      const result = await context.db.entities.raw(
        `SELECT * FROM :table: WHERE date > EXTRACT(EPOCH FROM CURRENT_TIMESTAMP - INTERVAL '${daysInPast} days')`, {
          table: context.db.entities.tables.ITEMS_DAY_DATA
        }
      )

      // Need to parseInt any values that are returned as strings
      return result.rows.reduce(
        (acc, next) => {
          return {
            amount: acc.amount + parseFloat(next.sales),
            volume: acc.volume + parseFloat(next.volume)
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
