
document.getElementById("currentYear").textContent =
    new Date().getFullYear();
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formMessage = document.getElementById("formMessage");
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}
function validateName() {
    const name = nameInput.value.trim();

    const isValid =
        name.length >= 2 &&
        name.length <= 80;

    nameInput.setCustomValidity(
        isValid ? "" : "Enter a name between 2 and 80 characters."
    );

    nameInput.classList.toggle("is-invalid", !isValid);
    nameInput.classList.toggle("is-valid", isValid);

    return isValid;
}
function validateEmail() {
    const email = emailInput.value.trim();

    const isValid =
        email.length <= 254 &&
        isValidEmail(email);

    emailInput.setCustomValidity(
        isValid ? "" : "Enter a valid email address."
    );

    emailInput.classList.toggle("is-invalid", !isValid);
    emailInput.classList.toggle("is-valid", isValid);

    return isValid;
}

function validateMessage() {
    const message = messageInput.value.trim();

    const isValid =
        message.length >= 10 &&
        message.length <= 1000;

    messageInput.setCustomValidity(
        isValid ? "" : "Message must contain 10 to 1000 characters."
    );

    messageInput.classList.toggle("is-invalid", !isValid);
    messageInput.classList.toggle("is-valid", isValid);

    return isValid;
}



[nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => {
        input.classList.remove("is-invalid", "is-valid");
        input.setCustomValidity("");

        formMessage.textContent = "";
        formMessage.className = "mt-3";
    });
});
contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    formMessage.textContent = "";
    formMessage.className = "mt-3";

    const nameIsValid = validateName();
    const emailIsValid = validateEmail();
    const messageIsValid = validateMessage();

    if (!nameIsValid || !emailIsValid || !messageIsValid) {
        const firstInvalidInput =
            contactForm.querySelector(".is-invalid");

        if (firstInvalidInput) {
            firstInvalidInput.focus();
        }

        return;
    }
    formMessage.textContent =
        "Thank you, " +
        nameInput.value.trim() +
        "! Your form passed validation.";

    formMessage.classList.add("text-success");

    contactForm.reset();
    [nameInput, emailInput, messageInput].forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
        input.setCustomValidity("");
    });
});