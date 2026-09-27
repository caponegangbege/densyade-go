let currentStep = 1;
let selectedFare = 0;

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
}

// ステップ1の処理：金額を選んで切符を買う
function buyTicket(price) {
    selectedFare = price;
    alert(`${price}円のきっぷが発券されました！`);
    
    // 表示を更新して次のステージへ
    document.getElementById("ticket-price-display").textContent = price;
    document.getElementById("my-ticket-display").classList.remove("hidden");
    showStage(2);
}

// ステップ2の処理：改札に入る
function passEntryGate() {
    const gate = document.getElementById("entry-gate");
    const statusText = document.getElementById("gate-status-text");
    
    gate.classList.add("gate-open");
    statusText.textContent = "通れます！どうぞ（ピッ！）";
    
    setTimeout(() => {
        showStage(3);
    }, 1200);
}

// ステップ3の処理：電車に乗る
function boardTrain() {
    alert("電車に乗りました。出発進行！");
    showStage(4);
}

// ステップ4の処理：電車を降りる
function getOffTrain() {
    alert("目的地に到着しました。ホームに降ります。");
    showStage(5);
}

// ステップ5の処理：改札を出る
function passExitGate() {
    const gate = document.getElementById("exit-gate");
    const statusText = document.getElementById("exit-gate-status");

    gate.classList.add("gate-open");
    statusText.textContent = `ありがとうございました（${selectedFare}円区間・ピッ！）`;

    setTimeout(() => {
        showStage(6); // クリア画面へ
    }, 1200);
}

// リセット
function resetApp() {
    selectedFare = 0;
    document.getElementById("entry-gate").classList.remove("gate-open");
    document.getElementById("exit-gate").classList.remove("gate-open");
    document.getElementById("my-ticket-display").classList.add("hidden");
    showStage(1);
}