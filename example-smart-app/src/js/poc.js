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

                          pt.api.search({type: "DocumentReference"}) //.where.typeIn(['report','note'])
                          .then(function(r) {
                              var docs = r.data.entry;
                              if (docs.length > 0) {
                                  docs.forEach(function(doc){
                                      startingpoint = startingpoint.pipe(function() {
                                          return $.when(smart.fetchBinary(doc.resource.content[0].attachment.url)).then(function (blob) {
                                              alert(doc_list, doc.resource.description, blob);
                                          });
                                      });
                                  });
                              } else {
                                  alert("<li><h3>No documents found</h3></li>");
                              }
                          });

                      
                          ret.resolve(p); 
                    }
                );
              
                // Get MedicationRequests for the selected patient
                const getPath = FHIR.client("https://r2.smarthealthit.org").getPath;
                
                med=FHIR.client("https://r2.smarthealthit.org")
                .request("/Medication?_id=" + client.patient.id, {
                    resolveReferences: [ "medication" ],
                    graph: true
                });
                alert("a",JSON.stringify(med, null, 4));
                med="nopeeee"
                
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
