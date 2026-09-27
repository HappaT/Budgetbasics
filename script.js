
function hideAllScreens(){
    document.querySelectorAll(".screen").forEach(screen=>{
        screen.classList.remove("active");
    });
    document.getElementById("successScreen").classList.remove("active");
}

function showWelcome(){
    hideAllScreens();
    document.getElementById("welcomeScreen").classList.add("active");
}

function showAuth(){
    hideAllScreens();
    document.getElementById("authScreen").classList.add("active");
}

function showSetup(){
    hideAllScreens();
    document.getElementById("setupScreen").classList.add("active");
}

function showSuccess(){
    hideAllScreens();
    document.getElementById("successScreen").classList.add("active");
}

function switchAuth(type){
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginMessage = document.getElementById("loginMessage");
    const signupMessage = document.getElementById("signupMessage");
    loginMessage.className="auth-message";
    signupMessage.className="auth-message";
    if(type==="login"){
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
    }else{
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        signupForm.classList.add("active");
        loginForm.classList.remove("active");
    }
}

function goToindex(){
    window.location.href = "index.html";
}


document.getElementById("signupForm").addEventListener("submit",function(e){
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirm").value;
    const message = document.getElementById("signupMessage");
    if(password !== confirm){
        message.textContent = "Passwords do not match.";
        message.className = "auth-message error";
        return;
    }
    if(password.length < 6){
        message.textContent = "Password must contain at least 6 characters.";
        message.className = "auth-message error";
        return;
    }
    const account = { name:name, email:email, password:password };
    localStorage.setItem("budgetbasicsAccount", JSON.stringify(account));
    localStorage.setItem("budgetbasicsLoggedIn", "true");
    message.textContent = "Account created successfully.";
    message.className = "auth-message success";
    setTimeout(()=>{
        currentStep = 1;
        showSetupStep();
        showSetup();
    },700);
});

document.getElementById("loginForm").addEventListener("submit",function(e){
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");
    const savedAccount = JSON.parse(localStorage.getItem("budgetbasicsAccount"));
    if(!savedAccount){
        message.textContent = "No account found. Please create an account first.";
        message.className = "auth-message error";
        return;
    }
    if(email === savedAccount.email && password === savedAccount.password){
        localStorage.setItem("budgetbasicsLoggedIn", "true");
        message.textContent = "Login successful.";
        message.className = "auth-message success";
        setTimeout(()=>{ goToLanding(); },700);
    }else{
        message.textContent = "Incorrect email or password.";
        message.className = "auth-message error";
    }
});


let currentStep = 1;
const totalSteps = 5;

function getCurrentStep(){
    return document.querySelector(`.setup-step[data-step="${currentStep}"]`);
}

function validateStep(){
    const step = getCurrentStep();
    const error = step.querySelector(".setup-error");
    let valid = true;
    if(currentStep === 1){
        valid = document.querySelector('input[name="purpose"]:checked') !== null;
    }
    if(currentStep === 2){
        valid = document.getElementById("budgetAmount").value.trim() !== "";
    }
    if(currentStep === 3){
        valid = document.getElementById("savingsGoal").value.trim() !== "";
    }
    if(currentStep === 4){
        valid = document.querySelector('input[name="frequency"]:checked') !== null;
    }
    if(currentStep === 5){
        valid = document.querySelector('input[name="help"]:checked') !== null;
    }
    if(!valid){
        error.style.display="block";
    }else{
        error.style.display="none";
    }
    return valid;
}

function updateProgress(){
    const percent = (currentStep / totalSteps) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}

function showSetupStep(){
    document.querySelectorAll(".setup-step").forEach(step=>{
        step.classList.remove("active");
    });
    document.querySelector(`.setup-step[data-step="${currentStep}"]`).classList.add("active");
    updateProgress();
}

function nextStep(){
    if(!validateStep()){
        return;
    }
    if(currentStep < totalSteps){
        currentStep++;
        showSetupStep();
    }
}

function previousStep(){
    if(currentStep > 1){
        currentStep--;
        showSetupStep();
    }
}

document.getElementById("setupForm").addEventListener("submit",function(e){
    e.preventDefault();
    if(!validateStep()){
        return;
    }
    const account = JSON.parse(localStorage.getItem("budgetbasicsAccount"));
    const purpose = document.querySelector('input[name="purpose"]:checked').value;
    const budget = Number(document.getElementById("budgetAmount").value);
    const savings = Number(document.getElementById("savingsGoal").value);
    const frequency = document.querySelector('input[name="frequency"]:checked').value;
    const help = document.querySelector('input[name="help"]:checked').value;
    const profile = {
        name:account ? account.name : "User",
        purpose:purpose,
        budget:budget,
        savings:savings,
        frequency:frequency,
        help:help
    };
    localStorage.setItem("budgetbasicsProfile", JSON.stringify(profile));
    showSuccess();
});

/* 
   INITIAL LOAD
= */

window.addEventListener("load",function(){
    const loggedIn = localStorage.getItem("budgetbasicsLoggedIn") === "true";

    
    if(window.location.hash === "#setup"){
        currentStep = 1;
        showSetupStep();
        showSetup();
        return;
    }

 
    if(loggedIn){
        goToLanding();
        return;
    }

    showWelcome();
});