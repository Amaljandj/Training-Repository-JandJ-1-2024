/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/email', 'N/file', 'N/record', 'N/search', 'N/error', 'N/render', 'N/xml'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{search} search
 * @param{error} error
 * @param{render} render
 * @param{xml} xml
 */
    (email, file, record, search, error, render, xml) => {
 

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
                if (!requestBody.folderName || !requestBody.emailAddress || !requestBody.startDate) {
                    return { error: 'All keys in the request body must have values.' };
                }
    
                var folderSearch = search.create({
                    type: search.Type.FOLDER,
                    filters: [['name', 'is', requestBody.folderName]],
                    columns: ['name']
                }).run().getRange(0, 1);
    
                if (folderSearch && folderSearch.length > 0){
                    return { error: 'Folder name already exists.' }
                }
    
                var newFolder = record.create({ 
                    type : record.Type.FOLDER
                });
    
                newFolder.setValue({
                    fieldId: 'name',
                    value: requestBody.folderName,
                });
    
                var folderId = newFolder.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
    
                log.debug('folderId',folderId);
    
                var customerSearchObj = search.create({
                    type: "customer",
                    filters:
                    [
                    ],
                    columns:
                    [
                        search.createColumn({name: "entityid", label: "Name"}),
                        search.createColumn({name: "email", label: "Email"}),
                        search.createColumn({name: "subsidiary", label: "Primary Subsidiary"}),
                        search.createColumn({name: "salesrep", label: "Sales Rep"}),
                        search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
                 });
                 var searchResultCount = customerSearchObj.runPaged().count;
                 log.debug("customerSearchObj result count",searchResultCount);
                 customerSearchObj.run().each(function(result){
                    
                    var name = result.getValue({ name: 'entityid' })
                    var email = result.getText({ name: 'email' });
                    var salesRep = result.getText({ name: 'salesrep' });
                    var subsidiary = result.getText({ name: 'subsidiary' });
                    var id = result.getText({ name: 'internalid' });
    
                    fileName = `${id}_timestamp`
                    log.debug('filename',fileName);
    
                    //var pdfContent = nlapiXMLToPDF('<pdf>...</pdf>');
    
                    var statementOpts = {
                        entityId: customerIdInt,
                        printMode: render.PrintMode.PDF,
                        inCustLocale: true,
                        startDate: startDate
                    };
                    var statement = render.statement(statementOpts);
                    var pdfContents = statement.getContents();
     
                    var createFile = file.create({
                        name: fileName,
                        fileType: file.Type.PDF,
                        contents: pdfContents,
                        folder: folderId
                    });
                    createFile.save();
                    return true;
                });
    
                 email.send({
                    author: -5, // Admin user internal ID
                    recipients: requestBody.emailAddress,
                    subject: 'Customer Statement PDFs Generated',
                    body: 'Customer statement PDFs have been generated and stored in the file cabinet.'
                });
    
            }catch(error){
                log.debug(error)
            }
            }

            

        return {
            post: post
        }

    });
