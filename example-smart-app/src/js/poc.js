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
                      
                          var docr='No document reference(s) found!';
                          client.request("DocumentReference?patient=" + client.patient.id,{
                            pageLimit:1,
                            flat:true
                          }).then(data=>{
                            console.log('doc ref:',data);
                            docr=data;
                          }).catch(error=>{
                            console.error('Error:',error);
                          });
                          p.docr=JSON.stringify(docr,undefined,2);
                          ret.resolve(p); 
                    }
                );
                                     
                  
                  
      
                // Get MedicationRequests for the selected patient
                const getPath = FHIR.client("https://r2.smarthealthit.org").getPath;
                
                med=FHIR.client("https://r2.smarthealthit.org")
                .request("/Medication?_id=" + client.patient.id, {
                    resolveReferences: [ "phone" ],
                    graph: true
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
      docr: {value: ''},
    };
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#docr').html(p.docr);
  };

})(window);
