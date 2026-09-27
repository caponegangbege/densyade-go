let currentStep = 1;
let insertedAmount = 0;
let selectedFare = 0;
let hasTicket = false;

const stepIndicator = document.getElementById("step-indicator");

function updateStepIndicator() {
    const titles = [
        "ステップ 1 / 5 : きっぷをかおう",
        "ステップ 2 / 5 : 改札を入ろう",
        "ステップ 3 / 5 : 電車に乗ろう",
        "ステップ 4 / 5 : 電車を降りよう",
        "ステップ 5 / 5 : 改札を出ろう"
    ];
    stepIndicator.textContent = titles[currentStep - 1];
}

function showStage(stageNum) {
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`stage-${i}`).classList.add("hidden");
    }
    document.getElementById("stage-clear").classList.add("hidden");

    if (stageNum <= 5) {
        document.getElementById(`stage-${stageNum}`).classList.remove("hidden");
    } else {
        document.getElementById("stage-clear").classList.remove("hidden");
    }
    currentStep = stageNum;
    updateStepIndicator();

    // ステップ3に入ったときの自動アニメーション開始
    if (stageNum === 3) {
        startTrainArrivalAnimation();
    }
    // ステップ4に入ったときの自動到着アニメーション開始
    if (stageNum === 4) {
        startTrainDestinationAnimation();
    }
}

// --- ステップ1: 券売機ロジック ---
function insertMoney(amount) {
    insertedAmount += amount;
    document.getElementById("inserted-money").textContent = insertedAmount;
    document.getElementById("machine-instruction").textContent = "金額ボタンを押してください";
    // 金額ボタンを有効化
    document.getElementById("fare-buttons-area").classList.remove("disabled-area");
}

function selectFare(price) {
    if (insertedAmount < price) {
        alert("お金が足りません！もっとお金を入れてください。");
        return;
    }
    selectedFare = price;
    const change = insertedAmount - price;
    document.getElementById("machine-instruction").textContent = `発券中...（おつり: ${change}円）`;
    
    // 金額ボタンを再ロック
    document.getElementById("fare-buttons-area").classList.add("disabled-area");

    // 切符が発券されて受取口に出てくるアニメーション
    setTimeout(() => {
        const outlet = document.getElementById("ticket-slot-outlet");
        outlet.innerHTML = `
            <div id="dispensed-ticket" class="ticket-piece" onclick="takeTicket()">
                🎫 きっぷ (${price}円) <br><small>【タッチして取る】</small>
            </div>
        `;
        document.getElementById("machine-instruction").textContent = "きっぷをお取りください";
    }, 800);
}

function takeTicket() {
    hasTicket = true;
    alert("きっぷを取りました！改札へ進みます。");
    showStage(2);
}

// --- ステップ2: 入口改札ロジック ---
function insertTicketToEntryGate() {
    if (!hasTicket) return;
    const slot = document.getElementById("entry-slot");
    slot.innerHTML = "<span>🎫 切符挿入中...</span>";
    document.getElementById("entry-display").textContent = "きっぷを確認しています";

    setTimeout(() => {
        // 扉が開く
        const gateBody = document.querySelector("#stage-2 .gate-body");
        gateBody.classList.add("gate-open");
        document.getElementById("entry-display").textContent = "どうぞお通りください";
        slot.style.display = "none";
        document.getElementById("entry-take-slot").style.display = "block";
    }, 1000);
}

function takeTicketFromEntryGate() {
    hasTicket = false; // 切符を持ってホームへ
    alert("切符を取りました。ホームへ向かいます。");
    showStage(3);
}

// --- ステップ3: 電車乗車ロジック ---
function startTrainArrivalAnimation() {
    const msg = document.getElementById("platform-msg");
    const doors = document.getElementById("train-doors");
    const boardBtn = document.getElementById("board-btn");

    msg.textContent = "電車がホームに到着しました。";
    
    setTimeout(() => {
        msg.textContent = "ドアが開きました。電車に乗りましょう！";
        doors.classList.add("open");
        boardBtn.classList.remove("hidden");
    }, 1500);
}

function boardTrain() {
    alert("電車に乗りました。目的地へ出発進行！");
    showStage(4);
}

// --- ステップ4: 下車ロジック ---
function startTrainDestinationAnimation() {
    const msg = document.getElementById("arrival-msg");
    const doors = document.getElementById("arrival-doors");
    const getOffBtn = document.getElementById("getoff-btn");

    msg.textContent = "まもなく目的地の駅に到着します...";

    setTimeout(() => {
        msg.textContent = "到着しました。ドアが開きます。ホームに降りましょう！";
        doors.classList.add("open");
        getOffBtn.classList.remove("hidden");
    }, 1500);
}

function getOffTrain() {
    alert("ホームに降りました。改札へ向かいます。");
    showStage(5);
}

// --- ステップ5: 出口改札ロジック（切符回収・切符をとらない） ---
function insertTicketToExitGate() {
    const slot = document.getElementById("exit-slot");
    slot.innerHTML = "<span>📥 切符を回収中...</span>";
    document.getElementById("exit-display").textContent = "精算完了・ありがとうございます";

    setTimeout(() => {
        // 扉が開く（切符は戻ってこない）
        const gateBody = document.querySelector("#stage-5 .gate-body");
        gateBody.classList.add("gate-open");
        slot.innerHTML = "<span>(切符は回収されました)</span>";
        
        setTimeout(() => {
            showStage(6); // クリア画面へ
        }, 1200);
    }, 1000);
}

// リセット
function resetApp() {
    insertedAmount = 0;
    selectedFare = 0;
    hasTicket = false;
    
    // UIの初期化
    document.getElementById("inserted-money").textContent = "0";
    document.getElementById("machine-instruction").textContent = "まず、お金を入れてください";
    document.getElementById("fare-buttons-area").classList.add("disabled-area");
    document.getElementById("ticket-slot-outlet").innerHTML = "";
    
    document.querySelector("#stage-2 .gate-body").classList.remove("gate-open");
    document.getElementById("entry-slot").style.display = "block";
    document.getElementById("entry-slot").innerHTML = "<span>📥 切符投入口</span>";
    document.getElementById("entry-take-slot").style.display = "none";
    document.getElementById("entry-display").textContent = "きっぷを入れてください";

    document.getElementById("train-doors").classList.remove("open");
    document.getElementById("board-btn").classList.add("hidden");

    document.getElementById("arrival-doors").classList.remove("open");
    document.getElementById("getoff-btn").classList.add("hidden");

    document.querySelector("#stage-5 .gate-body").classList.remove("gate-open");
    document.getElementById("exit-slot").innerHTML = "<span>📥 切符投入口（回収）</span>";
    document.getElementById("exit-display").textContent = "きっぷを入れてください";

    showStage(1);
}