/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/error', 'N/record' ,'N/search'],
    /**
 * @param{error} error
 * @param{record} record
 * @param{search} search
 */
    (error, record, search) => {
        
        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {
            try {
                let itemFulfillmentId = requestBody.itemFulfillmentId;
                let memo = requestBody.memo;

                let itemFulfillSearch = search.create({
                    type: "itemfulfillment",
                    filters: [["type","anyof","ItemShip"], 
                    "AND", 
                    ["internalid","anyof",itemFulfillmentId]],
                    columns: ['name']
                }).run().getRange(0, 1);
    
                if (itemFulfillSearch && itemFulfillSearch.length === 0){
                    return { error: 'please give the correct internal Id of item Fulfillment record' }
                }
                
                fulfillmentRec = record.load({
                    type : record.Type.ITEM_FULFILLMENT,
                    id : itemFulfillmentId,
                    isDynamic : true
                });

                fulfillmentRec.setValue({
                    fieldId : 'memo',
                    value : memo
                });

                let updateFulfilmentId = fulfillmentRec.save();

                return updateFulfilmentId

            } catch (error) {
                return (error.message);
            }
        }


        return {put}

    });
