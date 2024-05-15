/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search','N/error'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{error} error
 */
    (record, search) => {

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {
            try {
                let itemFulfillmentId = requestParams.itemFulfillmentId;

                let itemFulfillSearch = search.create({
                    type: "itemfulfillment",
                    filters: [["type","anyof","ItemShip"], 
                    "AND", 
                    ["internalid","anyof",itemFulfillmentId]],
                    columns: ['name']
                }).run().getRange(0, 1);
    
                if (itemFulfillSearch && itemFulfillSearch.length === 0){
                    return {error: 'please give the correct internal Id of item Fulfillment record to delete the record'}
                }

                record.delete({
                    type   : record.Type.ITEM_FULFILLMENT,
                     id    :requestParams.itemFulfillmentId
                    })
                     return(`This Item fulfillment Record ${itemFulfillmentId} is deleted`)


            } catch (error) {
                return error.message
            }
        }

        return {delete: doDelete}

    });
