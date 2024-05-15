/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
/***************************************************************************************************************
 *  *  Restlet to Create API for creating the Item Fulfillment
 *
 *
 **************************************************************************************************************
 *
 * Author :Jobin and Jismi IT Services
 *
 * Date Created :14 -May -2024
 *
 * Created By: Amal Mathai,Jobin and Jismi IT Services
 *
 * Description :Custom module To Create API for creating the Item Fulfillment
 *
 * REVISION HISTORY
 *
 *
 *
 ********************************************************************************************************************/
define(['N/record', 'N/error'],
    /**
 * @param{record} record
 * @param{error} error
 */
    (record, error) => {
        

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
            let salesOrderId = requestBody.salesOrderId
            let itemDetails = requestBody.itemDetails;

            if (!salesOrderId || !itemDetails || !Array.isArray(itemDetails)) {
                throw error.create({
                    name: 'MISSING_REQUIRED_PARAMETERS',
                    message: 'Sales Order ID and item details are required and item details should be an array.',
                    notifyOff: false
                });
            }
            try {
                if(requestBody){
                

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
                return(error.message)
            }
            
        }

        return {post}

    });
