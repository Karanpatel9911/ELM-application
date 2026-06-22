/* CLOCK */

function updateClock(){

const now =
new Date().toLocaleTimeString();

const ids = [
"clock",
"employeeClock",
"adminClock"
];

ids.forEach(id=>{

const el =
document.getElementById(id);

if(el){

el.innerHTML = now;
}
});
}

setInterval(updateClock,1000);

updateClock();

/* STARS */

const stars =
document.getElementById("stars");

for(let i=0;i<150;i++){

let star =
document.createElement("div");

star.classList.add("star");

star.style.top =
Math.random()*100 + "%";

star.style.left =
Math.random()*100 + "%";

stars.appendChild(star);
}

/* LOGIN */

let currentRole = "";
let currentUser = "";

function openLogin(role){

currentRole = role;

document
.getElementById("loginPanel")
.style.display = "block";

const adminHint =
document.getElementById("adminDemoHint");

if(role === "admin"){

adminHint.classList.remove("hidden");

}else{

adminHint.classList.add("hidden");
}
}

/* ADMIN QUICK DEMO LOGIN */

function quickAdminLogin(){

document
.getElementById("loginUsername")
.value = "admin123";

document
.getElementById("loginPassword")
.value = "admin123";

loginUser();
}

function loginUser(){

const username =
document
.getElementById("loginUsername")
.value.trim();

const password =
document
.getElementById("loginPassword")
.value.trim();

if(username === "" ||
password === ""){

alert(
"Fill all fields"
);

return;
}

currentUser = username;

localStorage.setItem(
"currentUser",
currentUser
);

if(currentRole === "user"){

document
.getElementById("welcomePage")
.classList.add("hidden");

document
.getElementById("employeePage")
.classList.remove("hidden");

renderLeaves();
}

if(currentRole === "admin"){

document
.getElementById("welcomePage")
.classList.add("hidden");

document
.getElementById("adminPage")
.classList.remove("hidden");

renderLeaves();
}
}

/* MENU */

function toggleMenu(menuId){

document
.getElementById(menuId)
.classList.toggle("active");
}

/* LOGOUT */

function logout(){

document
.getElementById("employeePage")
.classList.add("hidden");

document
.getElementById("adminPage")
.classList.add("hidden");

document
.getElementById("welcomePage")
.classList.remove("hidden");

document
.getElementById("loginPanel")
.style.display = "none";

document
.getElementById("adminDemoHint")
.classList.add("hidden");

document
.getElementById("leaveForm")
.reset();
}

/* DATE */

const today =
new Date().toISOString().split("T")[0];

document
.getElementById("fromDate")
.min = today;

document
.getElementById("toDate")
.min = today;

document
.getElementById("fromDate")
.addEventListener("change",()=>{

document
.getElementById("toDate")
.min =
document
.getElementById("fromDate")
.value;
});

/* STORAGE */

let allLeaves =
JSON.parse(
localStorage.getItem("allLeaves")
) || [];

/* ENTER NEXT FIELD */

const fields =
document.querySelectorAll(
"#leaveForm input, #leaveForm textarea, #leaveForm select"
);

fields.forEach((field,index)=>{

field.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){

e.preventDefault();

if(fields[index + 1]){

fields[index + 1].focus();
}
}
});
});

/* FORM */

const form =
document.getElementById("leaveForm");

form.addEventListener("submit",(e)=>{

e.preventDefault();

const name =
document.getElementById("name").value.trim();

const leaveType =
document.getElementById("leaveType").value;

const reason =
document.getElementById("reason").value.trim();

const fromDate =
document.getElementById("fromDate").value;

const toDate =
document.getElementById("toDate").value;

/* VALIDATION */

const textPattern =
/^[A-Za-z\s]+$/;

if(!textPattern.test(name)){

alert(
"Only characters allowed in name"
);

return;
}

if(!textPattern.test(reason)){

alert(
"Only characters allowed in reason"
);

return;
}

if(
name === "" ||
leaveType === "" ||
reason === "" ||
fromDate === "" ||
toDate === ""
){

alert(
"Fill all fields"
);

return;
}

if(toDate < fromDate){

alert(
"Invalid To Date"
);

return;
}

/* SAVE */

const leave = {

id:Date.now(),

username:currentUser,

name,
leaveType,
reason,
fromDate,
toDate,

status:"pending"
};

allLeaves.push(leave);

saveData();

form.reset();

alert(
"✅ Leave Applied Successfully"
);
});

/* SAVE */

function saveData(){

localStorage.setItem(
"allLeaves",
JSON.stringify(allLeaves)
);

renderLeaves();
}

/* RENDER */

function renderLeaves(){

const leaveList =
document.getElementById("leaveList");

const adminLeaveList =
document.getElementById("adminLeaveList");

leaveList.innerHTML = "";
adminLeaveList.innerHTML = "";

/* USER */

const userLeaves =
allLeaves.filter(
leave=>leave.username === currentUser
);

userLeaves.forEach((leave)=>{

const card =
document.createElement("div");

card.classList.add("leave-card");

card.innerHTML = `

<p>
👤 <strong>Name:</strong>
${leave.name}
</p>

<p>
📋 <strong>Leave Type:</strong>
${leave.leaveType}
</p>

<p>
📝 <strong>Reason:</strong>
${leave.reason}
</p>

<p>
📅 <strong>Duration:</strong>
${leave.fromDate} → ${leave.toDate}
</p>

<div class="status ${leave.status}">
${leave.status.toUpperCase()}
</div>

${
leave.status === "pending"

?

`

<div class="action-buttons">

<button class="cancel-btn"
onclick="cancelLeave(${leave.id})">

❌ Cancel

</button>

</div>

`

:

""
}
`;

leaveList.appendChild(card);
});

/* ADMIN */

allLeaves.forEach((leave)=>{

const adminCard =
document.createElement("div");

adminCard.classList.add("leave-card");

adminCard.innerHTML = `

<p>
👤 <strong>User:</strong>
${leave.username}
</p>

<p>
📋 <strong>Leave Type:</strong>
${leave.leaveType}
</p>

<p>
📝 <strong>Reason:</strong>
${leave.reason}
</p>

<p>
📅 <strong>Duration:</strong>
${leave.fromDate} → ${leave.toDate}
</p>

<div class="status ${leave.status}">
${leave.status.toUpperCase()}
</div>

${
leave.status === "pending"

?

`

<div class="action-buttons">

<button class="approve-btn"
onclick="approveLeave(${leave.id})">

✅ Approve

</button>

<button class="reject-btn"
onclick="rejectLeave(${leave.id})">

❌ Reject

</button>

</div>

`

:

""
}
`;

adminLeaveList.appendChild(adminCard);
});
}

/* ACTIONS */

function cancelLeave(id){

allLeaves =
allLeaves.filter(
leave=>leave.id !== id
);

saveData();
}

function approveLeave(id){

allLeaves.forEach((leave)=>{

if(leave.id === id){

leave.status = "approved";
}
});

saveData();

alert(
"🎉 Leave Approved"
);
}

function rejectLeave(id){

allLeaves.forEach((leave)=>{

if(leave.id === id){

leave.status = "rejected";
}
});

saveData();

alert(
"❌ Leave Rejected"
);
}

/* CLEAR */

function clearAllRequests(){

if(confirm(
"Delete all requests?"
)){

allLeaves = [];

saveData();
}
}

/* INITIAL */

renderLeaves();
