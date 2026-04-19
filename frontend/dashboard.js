const teams=["MI","CSK","RCB","KKR","DC","RR","SRH","PBKS","LSG","GT"]

const spending=[120,110,130,95,100,105,90,85,115,108]

const squadSize=[18,17,16,15,17,16,14,13,18,17]

new Chart(document.getElementById("spendingChart"),{

type:"bar",

data:{
labels:teams,
datasets:[{
label:"Team Spending (Cr)",
data:spending
}]
}

})

new Chart(document.getElementById("squadChart"),{

type:"pie",

data:{
labels:teams,
datasets:[{
label:"Squad Size",
data:squadSize
}]
}

})