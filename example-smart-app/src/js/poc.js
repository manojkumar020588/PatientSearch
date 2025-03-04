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
                   FHIR.client("https://fhir-ehr-code.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d/")
                  .request("Binary/XR-206940587")
                  .then(res => res.blob())
                  .then(blob => {
                    const frame = document.createElement("iframe");
                    document.body.appendChild(frame);
                    var a = URL.createObjectURL(blob);
                    alert("a,",a);
                  client.request("DocumentReference?patient=" + client.patient.id,{
                    pageLimit:1,
                    flat:true
                  }).then(data=>{
                    console.log('Observation:',data)
                  }).catch(error=>{
                    console.error('Error:',error);
                  });
                  
      
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
