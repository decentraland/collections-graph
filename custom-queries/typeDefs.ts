// You can import types as you wish, but libraries you import will not be available in the VM where these functions are run.
// The available global libraries are:
// _ (lodash)
// moment
// knex
// console

// Do not change this export. Satsuma expects a non-default `resolvers` string to be exported from this file.
export const typeDefs = `
    type CustomResponseItem {
      total_rows: Int!
      id: String!
      blockchain_id: Int!
      search_is_collection_approved: Boolean
      metadata: String
      image: String!
      collection: String!
      rarity: String!
      item_type: String!
      price: Int
      available: Int!
      search_is_store_minter: Boolean
      creator: String!
      beneficiary: String!
      created_at: Int!
      updated_at: Int
      reviewed_at: Int
      sold_at: String
      network: String!
      first_listed_at: Int!
      min_listing_price: String
      max_listing_price: String
      listings_count: Int!
      max_order_created_at: String
      min_price: Int
      max_price: Int
      total: Int!
    }
    
    type Query {
        # Your type definitions here
        testing(skip: Int = 0, limit: Int = 100): [CustomResponseItem]!
    }
`;
