/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
/***************************************************************************************************************
 *  *  Restlet to Create API for the fetching the Sales order details
 *
 *
 **************************************************************************************************************
 *
 * Author :Jobin and Jismi IT Services
 *
 * Date Created :13 -May -2024
 *
 * Created By: Amal Mathai,Jobin and Jismi IT Services
 *
 * Description :Custom module To Create API for the fetching the Sales order details
 *
 * REVISION HISTORY
 *
 *
 *
 ********************************************************************************************************************/
 define(['N/record', 'N/search'],
    
 /**
* @param{record} record
* @param{search} search
*/
 (record, search) => {
     /**
      * Defines the function that is executed when a GET request is sent to a RESTlet.
      * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
      *     content types)
      * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
      *     Object when request Content-Type is 'application/json' or 'application/xml'
      * @since 2015.2
      */
     var objArr =[];
     var lineObj =[];
     const get = (requestParams) => {
         try {
             if(requestParams.salesId==null){
                 let salesOrderSearch=search.load({
                     id:'customsearch_jj_opensalesorder_otp7207'
                 });
                 let searchObj=salesOrderSearch.run().getRange({
                     start:0,
                     end:100
                 });
                 for (let i=0; i< searchObj.length;i++){
                     objArr[i]=[
                         searchObj[i].getValue('internalid')+" "+
                         searchObj[i].getValue('tranid')+" "+
                         searchObj[i].getValue('trandate')+" "+
                         searchObj[i].getValue('amount')
                     ];
                     log.debug(objArr);
                 }
                 return JSON.stringify(objArr);
             }
             else{
                 let order=search.lookupFields({
                     type:search.Type.SALES_ORDER,
                     id:requestParams.salesId,
                     columns:["internalid"]
                 });
                 let internalId=order["internalid"];
                 
                 if(internalId==null){
                     return("RESULT NOT FOUND");
                 }
                 else{
                     let salesRec = record.load({
                         type: record.Type.SALES_ORDER,
                         id:requestParams.salesId,
                         isDynamic:true
                     });
                     let lineCount=salesRec.getLineCount({
                         sublistId:'item'
                     });
                     for(let i=0;i< lineCount;i++) {
                         let Item = salesRec.getSublistText({
                             sublistId: 'item',
                             fieldId: 'item',
                             line: i
                         });
                         log.debug(Item);
                         let Quantity = salesRec.getSublistValue({
                             sublistId: 'item',
                             fieldId: 'quantity',
                             line: i
                         });
                         log.debug(Quantity);
                         let Rate = salesRec.getSublistValue({
                             sublistId: 'item',
                             fieldId: 'rate',
                             line: i
                         });
                         log.debug(Rate);
                         let Amount = salesRec.getSublistValue({
                             sublistId: 'item',
                             fieldId: 'amount',
                             line: i
                         });
                         log.debug(Amount);
                         lineObj[i] = [Item, Quantity, Rate, Amount];
                     }
                     return JSON.stringify( lineObj);
                 }
 
             }
         } catch (error) {
             log.debug(error)
         }
         

     }

     return {get}

 });
