/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/https', 'N/url'],
    /**
 * @param{https} https
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    (serverWidget, https, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                // try{
                    var form = serverWidget.createForm({
                        title: 'Bitcoin Price List'
                    });
    
                    form.addField({
                        id: 'custpage_disclaimer',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'Disclaimer',
                        defaultValue: '<p>This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org</p>'
                    });
                    
                    // Fetch Bitcoin price data from Coindesk API
                    var response = https.get({
                        url: 'https://api.coindesk.com/v1/bpi/currentprice.json'
                    });
                    var bitcoinData = JSON.parse(response.body);


                    log.debug('bitcoin details',bitcoinData);
                    linecount=bitcoinData.length
                    log.debug('length',linecount)
    
                    // Create a sublist to display Bitcoin prices
                    var sublist = form.addSublist({
                        id: 'custpage_bitcoin_sublist',
                        type: serverWidget.SublistType.LIST,
                        label: 'Bitcoin Prices'
                    });
    
                    // Add sublist columns
                    sublist.addField({
                        id: 'currency',
                        type: serverWidget.FieldType.TEXT,
                       // source : '15',
                        label: 'Currency'
                    });
                    sublist.addField({
                        id: 'rate',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Rate'
                    });
                    sublist.addField({
                        id: 'description',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Description'
                    });
                    sublist.addField({
                        id: 'ratefloat',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Rate in Float'
                    });
                    
                   // scriptContext.response.writePage(form);
                   var currency = scriptContext.response.currency;
                    for (let i=0;i<linecount;i++){
                       for (var currency in bitcoinData.bpi) {
                        
                            log.debug('test');
                           sublist.setSublistValue({
                               id: 'currency',
                               line:i,
                               value: currency
                           });
                           sublist.setSublistValue({
                               id: 'rate',
                               line: i,
                               value: bitcoinData.bpi[currency].rate
                           });
                           sublist.setSublistValue({
                               id: 'description',
                               line: i,
                               value: bitcoinData.bpi[currency].description
                           });
                           sublist.setSublistValue({
                               id: 'ratefloat',
                               line: i,
                               value: parseFloat(bitcoinData.bpi[currency].rate)
                           });
                        }
                           
                           
                    }
                    
    
                    // Add a refresh button
                    form.addButton({
                        id: 'custpage_refresh_button',
                        label: 'Refresh',
                        functionName: 'refreshPage'
                    });
                    
                    // Add client script to handle refresh action
                //    form.clientScriptModulePath = 'SuiteScripts/jj_cl_suitelet_attach_1_otp7049.js';

                    scriptContext.response.writePage(form);
                // }catch(error){
                //     log.error(`Error!! ${error.message}`);
                // }
                }else if(scriptContext.request.method === 'POST'){
                 
                }
                
        }

        return {onRequest}

    });
