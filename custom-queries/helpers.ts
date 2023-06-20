// You can import types as you wish, but libraries you import will not be available in the VM where these functions are run.
// The available global libraries are:
// _ (lodash)
// moment
// knex
// console

import * as _ from 'lodash';

// You should export `helpers` as an object with functions that you want to be available in your scripts.
// This is not required.
export const helpers = {
    // This is a helper function that you can use in your scripts
    // Example:
    getRandomItem: (arr: any[]) => {
       return _.sample(arr);
    }
}
