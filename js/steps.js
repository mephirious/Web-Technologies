const steps = document.querySelectorAll('.step');
let currentStep = 0;

function showStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    steps[step].classList.add('active');
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

document.getElementById('musicSubscriptionForm').addEventListener('submit', function(event) {
    alert("Congratulations! Your answer has been sent");
    this.reset();
    currentStep = 0;
    showStep(currentStep);
});

showStep(currentStep);
