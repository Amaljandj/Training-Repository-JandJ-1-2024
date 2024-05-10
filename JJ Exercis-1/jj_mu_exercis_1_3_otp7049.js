/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            invoiceRec = record.load({
                type : params.type,
                id : params.id,
                isDynamic: true
            });

            invoiceRec.setValue({
                fieldId : 'duedate',
//               value : new Date()
                value : new Date('5/7/2024')
            });
            invoiceRec.save();

        }

        return {each}

    });
