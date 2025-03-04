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
                          p.j=JSON.stringify(pt,undefined,2);
                          ret.resolve(p); 
                    }
                );
              
                // Get MedicationRequests for the selected patient
                const getPath = FHIR.client("https://r2.smarthealthit.org").getPath;
                
                med=FHIR.client("https://r2.smarthealthit.org")
                .request("/Medication?_id=" + client.patient.id, {
                    resolveReferences: [ "medication" ],
                    graph: true
                }).then(data => data.entry.map(item => getMedicationName(
                  getPath(item, "resource.medicationCodeableConcept.coding") ||
                  getPath(item, "resource.medicationReference.code.coding")
                  ))).then(med=>JSON.stringify(data, null, 4));
                alert("a",med);
                alert("b",data);
                return med;
            }).catch(console.error);             
    return ret.promise();
  };
  function getMedicationName(medCodings = []) {
    var coding = medCodings.find(c => c.system === rxnorm);
    return coding && coding.display || "Unnamed Medication(TM)";
  }
  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      j: {value: ''},
    };
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#med').html(med);
    $('#j').html(p.j);
  };

})(window);
