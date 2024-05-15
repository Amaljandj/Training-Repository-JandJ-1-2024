/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            try {
                if(requestBody){
                    let salesOrderId = requestBody.salesOrderId;
                    log.debug('salesOrderId',salesOrderId);
                   let itemDetails = requestBody.itemDetails;

                    let salesOrderFulfill = record.transform({
                        fromType : record.Type.SALES_ORDER,
                        fromId : salesOrderId,
                        toType : record.Type.ITEM_FULFILLMENT,
                        isDynamic : true
                    });
                    
                    itemDetails.forEach(itemDetail => {
                        let lineNum = salesOrderFulfill.findSublistLineWithValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            value: itemDetail.itemId
                        });
        
                        if (lineNum >= 0) {
                            salesOrderFulfill.selectLine({
                                sublistId: 'item',
                                line: lineNum
                            });
        
                            salesOrderFulfill.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: itemDetail.quantity
                            });
        
                            salesOrderFulfill.commitLine({
                                sublistId: 'item'
                            });
                        }
                    });
                        
                        
                    

                    let itemFulfill = salesOrderFulfill.save({
                        enableSourcing:true,
                        ignoreMandatoryFields:false
                    });

                    return itemFulfill
                }
            } catch (error) {
                log.debug(error.message)
            }
            
        }

        return {post}

    });
