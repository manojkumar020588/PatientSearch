(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    FHIR.oauth2.ready().then(function(client) {
     client.patient.read().then(
                    function(pt) {
                          var fname = pt.name[0].given.join(' ');
                          var lname = pt.name[0].family.join(' ');
                          var gender = pt.gender;
                         
                          var p = defaultPatient();
                          p.birthdate = pt.birthDate;
                          p.gender = gender;
                          p.fname = fname;
                          p.lname = lname;
                          var p = defaultPatient();
                          p.birthdate = pt.birthDate;
                          p.gender = gender;
                          p.fname = fname;
                          p.lname = lname;
                          ret.resolve(p); 
                    }
                );
                
                // Get MedicationRequests for the selected patient
                client.request("/MedicationRequest/" + client.patient.id, {
                    resolveReferences: [ "medicationReference" ],
                    graph: true
                })
                
                // Reject if no MedicationRequests are found
                .then(function(data) {
                    if (!data.entry || !data.entry.length) {
                        throw new Error("No medications found for the selected patient");
                    }
                    return data.entry;
                });

            }).catch(console.error);
                   
    return ret.promise();

  };

  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
    };
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
  };

})(window);
