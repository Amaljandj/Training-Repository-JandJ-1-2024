/** * @NApiVersion 2.x */
require(['N/record', 'N/log'],
    function (record, log) {
        var objRecord = record.create({
            type: record.Type.CUSTOMER,
            isDynamic: true
        });
        objRecord.setValue({
            fieldId: 'companyname',
            value: 'Debug customer 1'
        });
        objRecord.setValue({
            fieldId: 'entitystatus',
            value: '13'
        });
        objRecord.setValue({
            fieldId: 'subsidiary',
            value: '1'
        })
        objRecord.setValue({
            fieldId: 'email',
            value: 'customerdebug1@gg.com'
        })
        objRecord.setValue({
            fieldId: 'salesrep',
            value: '295'
        })
 
        var recordId = objRecord.save({
            enableSourcing: false,
            ignoreMandatoryFields: true
        });
        log.debug("Customer details", recordId);
 
 
        var customerDetails = [];
 
 
        var newCustomer = record.load({
            type: record.Type.CUSTOMER,
            id: recordId,
            isDynamic: true
        });
 
 
        customerDetails.push({
            companyId: newCustomer.getValue({ fieldId: 'companyname' }),
            entityStatus: newCustomer.getText({ fieldId: 'entitystatus' }),
            subsidiary: newCustomer.getText({ fieldId: 'subsidiary' }),
            email: newCustomer.getValue({ fieldId: 'email' }),
            salesRep: newCustomer.getText({ fieldId: 'salesrep' })
        });
 
 
        customerDetails.forEach(function (customer) {
            log.debug("New Customer Details:", JSON.stringify(customer));
        });
    });
 