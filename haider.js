/* =====================
   LOGIN SYSTEM
===================== */
function login() {
    let u = document.getElementById("luser").value.trim();
    let p = document.getElementById("lpass").value.trim();
    let msg = document.getElementById("msg");

    if (!u || !p) {
        msg.innerText = "Enter username and password";
        return;
    }

    // Admin login
    if(u === "admin" && p === "admin123") {
        localStorage.setItem("currentUser","admin");
        localStorage.setItem("role","admin");
        location.href="dashboard.html";
        return;
    }

    // Check sub-dealer login
    let subs = JSON.parse(localStorage.getItem("subdealers")||"[]");
    let found = subs.find(s=>s.user===u && s.pass===p);
    if(found){
        localStorage.setItem("currentUser",u);
        localStorage.setItem("role","sub");
        location.href="dashboard.html";
        return;
    }

    msg.innerText="Invalid login!";
}

/* =====================
   LOGOUT
===================== */
function logout(){
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    location.href="login.html";
}

/* =====================
   SHOW/HIDE ADD LINK
===================== */
function toggleAddLink(){
    let f = document.getElementById("addLinkForm");
    f.style.display = (f.style.display==="none")?"block":"none";
}

function addLink(){
    let currentUser = localStorage.getItem("currentUser");
    let key = "links_"+currentUser;

    let site=document.getElementById("site").value.trim();
    let user=document.getElementById("user").value.trim();
    let pass=document.getElementById("pass").value.trim();
    if(!site||!user||!pass){alert("Fill all fields"); return;}

    let data=JSON.parse(localStorage.getItem(key)||"[]");
    data.push({site,user,pass});
    localStorage.setItem(key,JSON.stringify(data));

    document.getElementById("site").value="";
    document.getElementById("user").value="";
    document.getElementById("pass").value="";

    loadLinks();
}

/* =====================
   SHOW/HIDE ADD SUB-DEALER (ADMIN ONLY)
===================== */
function toggleAddSub(){
    let role = localStorage.getItem("role");
    if(role !== "admin"){
        alert("Only admin can add sub-dealers!");
        return;
    }
    let f = document.getElementById("addSubForm");
    f.style.display = (f.style.display==="none")?"block":"none";
}

function addSub(){
    let role = localStorage.getItem("role");
    if(role !== "admin"){
        alert("Only admin can add sub-dealers!");
        return;
    }

    let subUser = document.getElementById("subUser").value.trim();
    let subPass = document.getElementById("subPass").value.trim();
    if(!subUser||!subPass){alert("Fill sub-dealer info"); return;}

    let subs = JSON.parse(localStorage.getItem("subdealers")||"[]");
    if(subs.find(s=>s.user===subUser)){
        alert("Sub-dealer username exists!");
        return;
    }

    subs.push({user:subUser,pass:subPass});
    localStorage.setItem("subdealers",JSON.stringify(subs));

    document.getElementById("subUser").value="";
    document.getElementById("subPass").value="";

    alert("Sub-dealer added!");
}

/* =====================
   LOAD LINKS
===================== */
function loadLinks(){
    let currentUser=localStorage.getItem("currentUser");
    if(!currentUser) return;

    // Hide Add Sub button if not admin
    let role = localStorage.getItem("role");
    if(role !== "admin"){
        let btn = document.getElementById("btnAddSub");
        if(btn) btn.style.display="none";
    }

    let key="links_"+currentUser;
    let data=JSON.parse(localStorage.getItem(key)||"[]");

    let list=document.getElementById("list");
    if(!list) return;
    list.innerHTML="";

    data.forEach((d,i)=>{
        let li=document.createElement("li");
        li.innerHTML=`<b>${d.user}</b><br>${d.site}`;
        list.appendChild(li);
    });
}

/* =====================
   AUTO LOAD ON DASHBOARD
===================== */
if(document.getElementById("list")){
    loadLinks();
}