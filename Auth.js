(function (window) {

    window.extractData = function () {
        var ret = $.Deferred();

        function onError() {
            console.log('Loading error', arguments);
            ret.reject();
        }

        function onReady(smart) {
            if (smart.hasOwnProperty('patient')) {
                var patient = smart.patient;
                // console.log(patient);
                console.log("Smart Object", smart);
                var parctitionerId = smart.userId;
                console.log('parctitionerId: ', parctitionerId);
                var patientID = patient.id;

                var encounterID = smart.tokenResponse.encounter;
                localStorage.setItem('encounterRef', encounterID);
                localStorage.setItem('fhirpatientid', patientID);
                localStorage.setItem('parctitionerId', parctitionerId);


                $('#loading').hide();
                var pt = patient.read();

                for (var key in localStorage) {
                    console.log(key, localStorage.getItem(key))
                }

            } else {
                onError();
            }

        }
        FHIR.oauth2.ready(onReady, onError);

        return ret.promise();
    }

})(window);