// You can import types as you wish, but libraries you import will not be available in the VM where these functions are run.
// The available global libraries are:
// _ (lodash)
// moment
// knex
// console

// Do not change this export. Satsuma expects a non-default `resolvers` object to be exported from this file.
import { Context, CustomQueryHelpers, CustomResponseItem, QueryTestingArgs } from './schema'

export const resolvers = {
    Query: {
        // ... - Your resolvers here


        custom_query_helpers: async (root: any, args: any, context: Context, info: any): Promise<CustomQueryHelpers> => {
            // Get a list of the fields that are being requested.
            const expectedFields = new Set<string>(info.fieldNodes[0].selectionSet.selections.map((selection: any) => selection.name.value));
            const result: CustomQueryHelpers = {
                schema: context.db.entities.schema,
            };

            // This field is expensive, so let's only run it if it's requested.
            if (expectedFields.has('available_entity_tables')) {
                // See if the columns field is requested.
                const availableEntityTables = info.fieldNodes[0].selectionSet.selections.find((selection: any) => selection.name.value === 'available_entity_tables');
                const wantsColumns = availableEntityTables.selectionSet.selections.some((selection: any) => selection.name.value === 'columns');

                // Get the list of tables and their descriptions.
                result.available_entity_tables = await Promise.all(
                    Object.entries(context.db.entities.tablesRaw).map(async (table) => {
                    const [tableName, tableMapping] = table as [string, {description?: string; name: string, actualName: string}];
                    let columns: Array<string> = [];

                    // Expensive query, only run if requested
                    if (wantsColumns) {
                        columns = (
                          await context.db.entities.raw(
                            `SELECT * FROM information_schema.columns WHERE table_schema = ? AND table_name = ?`,
                            [context.db.entities.schema, tableMapping.actualName]
                          )
                        ).rows.map((row: any) => row.column_name);
                    }

                    return {
                        name: tableName,
                        description: tableMapping.description,
                        columns
                    }
                }));
            }

            return result;
        },

        testing: async (root: any, args: QueryTestingArgs, context: Context, info: any): Promise<{
            total_rows: number;
            id: number
        }[]> => {
            const {skip, limit} = args;

            const data = await context.db.entities.raw(`SELECT *, COUNT(*) OVER() as total FROM (
                SELECT
                  COUNT(*) OVER() as total_rows,
                  items.id,
                  items.blockchain_id,
                  items.search_is_collection_approved,
                  to_json(
                    CASE WHEN (
                      items.item_type = 'wearable_v1' OR items.item_type = 'wearable_v2' OR items.item_type = 'smart_wearable_v1') THEN metadata_wearable 
                      ELSE metadata_emote 
                    END
                  ) as metadata,
                  items.image, 
                  items.blockchain_id,
                  items.collection,
                  items.rarity,
                  items.item_type::text,
                  items.price,
                  items.available,
                  items.search_is_store_minter,
                  items.creator,
                  items.beneficiary,
                  items.created_at,
                  items.updated_at,
                  items.reviewed_at,
                  items.sold_at,
                  'Ethereum' as network,
                  items.first_listed_at,
                  nfts_with_orders.min_price AS min_listing_price,
                  nfts_with_orders.max_price AS max_listing_price, 
                  COALESCE(nfts_with_orders.listings_count,0) as listings_count,
                  nfts_with_orders.max_order_created_at as max_order_created_at,
                  CASE
                    WHEN items.available > 0 AND items.search_is_store_minter = true THEN LEAST(items.price, nfts_with_orders.min_price) 
                    ELSE nfts_with_orders.min_price 
                  END AS min_price,
                  CASE 
                    WHEN available > 0 AND items.search_is_store_minter = true THEN GREATEST(items.price, nfts_with_orders.max_price) 
                    ELSE nfts_with_orders.max_price END
                 AS max_price
                FROM item__all AS items
                LEFT JOIN (
                  SELECT 
                    orders.item, 
                    COUNT(orders.id) AS listings_count,
                    MIN(orders.price) AS min_price,
                    MAX(orders.price) AS max_price,
                    MAX(orders.created_at) AS max_order_created_at 
                  FROM order__all AS orders 
                WHERE 
                    orders.status = 'open' 
                    AND orders.expires_at < 253378408747000 
                    AND to_timestamp(orders.expires_at / 1000.0) > now() 
                                                                
                    GROUP BY orders.item
                  ) AS nfts_with_orders ON nfts_with_orders.item = items.id AND items.search_text LIKE '%space%'
                  LEFT JOIN (
                    SELECT 
                    metadata.id, 
                    wearable.description, 
                    wearable.category, 
                    wearable.body_shapes, 
                    wearable.rarity, 
                    wearable.name
                  FROM wearable__all AS wearable
                JOIN metadata__all AS metadata ON metadata.wearable = wearable.id
          ) AS metadata_wearable ON metadata_wearable.id = items.metadata AND (items.item_type = 'wearable_v1' OR items.item_type = 'wearable_v2' OR items.item_type = 'smart_wearable_v1')
                LEFT JOIN (
                  SELECT 
                    metadata.id, 
                    emote.description, 
                    emote.category, 
                    emote.body_shapes, 
                    emote.rarity, 
                    emote.name, 
                    emote.loop
                  FROM emote__all AS emote
                JOIN metadata__all AS metadata ON metadata.emote = emote.id
                ) AS metadata_emote ON metadata_emote.id = items.metadata AND items.item_type = 'emote_v1' WHERE items.search_is_collection_approved = true AND items.item_type IN 
                ('wearable_v1', 'wearable_v2', 'smart_wearable_v1') AND ((search_is_store_minter = true AND available > 0) OR listings_count IS NOT NULL) 
                AND items.search_text LIKE '%space%' 
     UNION ALL 
                SELECT
                  COUNT(*) OVER() as total_rows,
                  items.id,
                  items.blockchain_id,
                  items.search_is_collection_approved,
                  to_json(
                    CASE WHEN (
                      items.item_type = 'wearable_v1' OR items.item_type = 'wearable_v2' OR items.item_type = 'smart_wearable_v1') THEN metadata_wearable 
                      ELSE metadata_emote 
                    END
                  ) as metadata,
                  items.image, 
                  items.blockchain_id,
                  items.collection,
                  items.rarity,
                  items.item_type::text,
                  items.price,
                  items.available,
                  items.search_is_store_minter,
                  items.creator,
                  items.beneficiary,
                  items.created_at,
                  items.updated_at,
                  items.reviewed_at,
                  items.sold_at,
                  'Matic' as network,
                  items.first_listed_at,
                  nfts_with_orders.min_price AS min_listing_price,
                  nfts_with_orders.max_price AS max_listing_price, 
                  COALESCE(nfts_with_orders.listings_count,0) as listings_count,
                  nfts_with_orders.max_order_created_at as max_order_created_at,
                  CASE
                    WHEN items.available > 0 AND items.search_is_store_minter = true THEN LEAST(items.price, nfts_with_orders.min_price) 
                    ELSE nfts_with_orders.min_price 
                  END AS min_price,
                  CASE 
                    WHEN available > 0 AND items.search_is_store_minter = true THEN GREATEST(items.price, nfts_with_orders.max_price) 
                    ELSE nfts_with_orders.max_price END
                 AS max_price
                FROM item__all AS items
                LEFT JOIN (
                  SELECT 
                    orders.item, 
                    COUNT(orders.id) AS listings_count,
                    MIN(orders.price) AS min_price,
                    MAX(orders.price) AS max_price,
                    MAX(orders.created_at) AS max_order_created_at
                  FROM order__all AS orders 
                WHERE 
                    orders.status = 'open' 
                    AND orders.expires_at < 253378408747000 
                    AND to_timestamp(orders.expires_at / 1000.0) > now() 
                                                                
                    GROUP BY orders.item
                  ) AS nfts_with_orders ON nfts_with_orders.item = items.id AND items.search_text LIKE '%space%'
                  LEFT JOIN (
                    SELECT 
                    metadata.id, 
                    wearable.description, 
                    wearable.category, 
                    wearable.body_shapes, 
                    wearable.rarity, 
                    wearable.name
                  FROM wearable__all AS wearable
                JOIN metadata__all AS metadata ON metadata.wearable = wearable.id
          ) AS metadata_wearable ON metadata_wearable.id = items.metadata AND (items.item_type = 'wearable_v1' OR items.item_type = 'wearable_v2' OR items.item_type = 'smart_wearable_v1')
                LEFT JOIN (
                  SELECT 
                    metadata.id, 
                    emote.description, 
                    emote.category, 
                    emote.body_shapes, 
                    emote.rarity, 
                    emote.name, 
                    emote.loop
                  FROM emote__all AS emote
                JOIN metadata__all AS metadata ON metadata.emote = emote.id
                ) AS metadata_emote ON metadata_emote.id = items.metadata AND items.item_type = 'emote_v1' WHERE items.search_is_collection_approved = true AND items.item_type IN 
                ('wearable_v1', 'wearable_v2', 'smart_wearable_v1') AND ((search_is_store_minter = true AND available > 0) OR listings_count IS NOT NULL) 
                AND items.search_text LIKE '%space%' 
        ) as temp 
        ORDER BY first_listed_at desc NULLS last 
        LIMIT :limit: OFFSET :skip:`, {
                limit,
                skip
            });

            return data.rows
        }
    }
};