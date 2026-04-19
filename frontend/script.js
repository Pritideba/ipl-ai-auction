// ================= GLOBAL =================

let players = []
let index = 0

let currentBid = 0
let currentWinner = "Base Price"

let timeLeft = 10
let timerInterval

let skipped = false
let lastBidder = ""
let interestedTeams = []

// ================= RULES =================

const MAX_PLAYERS = 25
const MIN_PLAYERS = 18
const MAX_OVERSEAS = 8

const ROLE_LIMITS = {
Batter: {min:5, max:10},
Bowler: {min:5, max:10},
Allrounder: {min:3, max:8},
Wicketkeeper: {min:1, max:4}
}

// ================= TEAMS =================

const allTeams = ["MI","CSK","RCB","KKR","DC","RR","SRH","PBKS","LSG","GT"]

let myTeam = localStorage.getItem("myTeam") || "RCB"

const aiTeams = allTeams.filter(t => t !== myTeam)

// ================= DATA =================

let purse = {}
let squads = {}

allTeams.forEach(t=>{
purse[t] = 350
squads[t] = []
})

// ================= INIT =================

document.getElementById("myTeam").innerText = myTeam

fetch("http://127.0.0.1:5000/players")
.then(res=>res.json())
.then(data=>{
players = createAuctionSets(data)
showPlayer()
updatePurseBoard()
updateAllSquads()
})

// ================= GROUPING =================

function createAuctionSets(players){

let sortFn = (a,b)=>b.rating - a.rating

return [
...players.filter(p=>p.type==="Capped" && p.role==="Batter").sort(sortFn),
...players.filter(p=>p.type==="Capped" && p.role==="Wicketkeeper").sort(sortFn),
...players.filter(p=>p.type==="Capped" && p.role==="Allrounder").sort(sortFn),
...players.filter(p=>p.type==="Capped" && p.role==="Bowler").sort(sortFn),
...players.filter(p=>p.type==="Uncapped" && p.role==="Batter").sort(sortFn),
...players.filter(p=>p.type==="Uncapped" && p.role==="Allrounder").sort(sortFn),
...players.filter(p=>p.type==="Uncapped" && p.role==="Bowler").sort(sortFn)
]
}

// ================= INTERESTED TEAMS =================

function getInterestedTeams(player){

let interested = []

aiTeams.forEach(team=>{

let chance = 0.4

let roleCount = squads[team].filter(p=>p.role===player.role).length

if(roleCount < ROLE_LIMITS[player.role].min){
chance += 0.4
}

if(player.rating > 90) chance += 0.3

if(isOverseas(player) && countOverseas(team) >= MAX_OVERSEAS){
chance = 0
}

if(Math.random() < chance){
interested.push(team)
}

})

// max 5 teams only
return interested.slice(0,5)

}

// ================= DISPLAY =================

function showPlayer(){

let p = players[index]

if(!p){
alert("Auction Finished")
window.location.href="dashboard.html"
return
}

skipped = false
lastBidder = ""

interestedTeams = getInterestedTeams(p)

document.getElementById("playerName").innerText = p.player
document.getElementById("country").innerText = p.country
document.getElementById("role").innerText = p.role
document.getElementById("price").innerText = p.base_price

document.getElementById("setName").innerText = p.type + " - " + p.role

currentBid = p.base_price
currentWinner = "Base Price"

document.getElementById("bid").innerText = currentBid.toFixed(1)
document.getElementById("highestBidder").innerText = currentWinner

document.getElementById("bidHistory").innerHTML = ""

startTimer()
}

// ================= TIMER =================

function startTimer(){

clearInterval(timerInterval)

timeLeft = 10
document.getElementById("timer").innerText = timeLeft

timerInterval = setInterval(()=>{

timeLeft--
document.getElementById("timer").innerText = timeLeft

if(timeLeft<=0){
clearInterval(timerInterval)
sellPlayer()
}

},1000)
}

// ================= PRICE LOGIC =================

function getIncrement(price){
if(price < 2) return 0.5
if(price < 5) return 0.5
if(price < 10) return 1
return 2
}

function getPlayerMaxPrice(player){

let r = player.rating || 80

if(r >= 95) return 18 + Math.random()*4
if(r >= 90) return 12 + Math.random()*4
if(r >= 85) return 8 + Math.random()*3
if(r >= 80) return 5 + Math.random()*3

return 3 + Math.random()*2
}

// ================= OVERSEAS =================

function isOverseas(player){
return player.country !== "India"
}

function countOverseas(team){
return squads[team].filter(p=>p.country !== "India").length
}

// ================= VALIDATION =================

function canBuyPlayer(team,player){

let squad = squads[team]

if(squad.length >= MAX_PLAYERS) return false

let roleCount = squad.filter(p=>p.role === player.role).length

if(roleCount >= ROLE_LIMITS[player.role].max) return false

if(isOverseas(player)){
if(countOverseas(team) >= MAX_OVERSEAS) return false
}

return true
}

function canTeamAffordBid(team,nextBid){

let playersOwned = squads[team].length
let playersNeeded = MIN_PLAYERS - playersOwned

if(playersNeeded < 1) playersNeeded = 1

let reserve = playersNeeded * 3

return nextBid <= (purse[team] - reserve)
}

// ================= USER BID =================

function userBid(){

if(skipped) return

let p = players[index]

if(!canBuyPlayer(myTeam,p)){
alert("Limit reached")
return
}

let nextBid

if(currentWinner === "Base Price"){
nextBid = currentBid
} else {
nextBid = Math.round((currentBid + getIncrement(currentBid)) * 10) / 10
}

if(purse[myTeam] < nextBid){
alert("Not enough purse")
return
}

currentBid = nextBid
currentWinner = myTeam
lastBidder = myTeam

document.getElementById("bid").innerText = currentBid.toFixed(1)
document.getElementById("highestBidder").innerText = currentWinner

addBid(myTeam,currentBid)

timeLeft = 10
}

// ================= AI BID =================

function aiBid(){

let p = players[index]

let available = interestedTeams.filter(t => t !== lastBidder)

if(available.length === 0) return

let team = available[Math.floor(Math.random()*available.length)]

if(!canBuyPlayer(team,p)) return

let baseMax = getPlayerMaxPrice(p)

let playersOwned = squads[team].length

if(playersOwned > 15) baseMax -= 3
if(purse[team] < 30) baseMax -= 5

let nextBid

if(currentWinner === "Base Price"){
nextBid = currentBid
} else {
nextBid = Math.round((currentBid + getIncrement(currentBid)) * 10) / 10
}

if(nextBid > baseMax) return
if(!canTeamAffordBid(team,nextBid)) return

currentBid = nextBid
currentWinner = team
lastBidder = team

document.getElementById("bid").innerText = currentBid.toFixed(1)
document.getElementById("highestBidder").innerText = currentWinner

addBid(team,currentBid)

timeLeft = 10
}

setInterval(aiBid,2000)

// ================= SKIP =================

function skipPlayer(){
skipped = true
alert("You skipped player")
}

// ================= SELL =================

function sellPlayer(){

let p = players[index]

if(currentWinner !== "Base Price"){

purse[currentWinner] -= currentBid
squads[currentWinner].push(p)

alert(currentWinner + " bought " + p.player + " for ₹" + currentBid + " Cr")

updatePurseBoard()
updateAllSquads()
}

localStorage.setItem("auctionSquads",JSON.stringify(squads))
localStorage.setItem("auctionPurse",JSON.stringify(purse))

nextPlayer()
}

// ================= NEXT =================

function nextPlayer(){
index++
showPlayer()
}

// ================= UI =================

function addBid(team,price){
document.getElementById("bidHistory").innerHTML += 
team + " → ₹" + price.toFixed(1) + " Cr<br>"
}

function updatePurseBoard(){

let html=""

for(let t in purse){
html += `<li>${t} : ₹${purse[t]} Cr</li>`
}

document.getElementById("teamPurseBoard").innerHTML = html
}

function updateAllSquads(){

let html=""

for(let t in squads){

html += `<b>${t}</b><br>`

squads[t].forEach(p=>{
html += p.player + "<br>"
})

html += "<hr>"
}

document.getElementById("allSquads").innerHTML = html
}