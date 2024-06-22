function createCard() {
  // Get the array of entries from local storage
  var entries = JSON.parse(localStorage.getItem("feedbackEntries")) || [];

  // Loop through each entry in the array
  entries.forEach(function (entry) {
    let divCard = document.createElement("div");
    let imgCard = document.createElement("img");
    let divLeft = document.createElement("div");
    let h3Left = document.createElement("h3");
    let pLeft = document.createElement("p");

    let divRight = document.createElement("div");
    let pRightFirst = document.createElement("p");
    let aRight = document.createElement("a");
    let pEmail = document.createElement("p");
    let pRightSecond = document.createElement("p");

    // Set class names for styling
    divCard.className = "FullCard";
    divLeft.className = "FeedbackText";
    divRight.className = "CardTitles";
    pRightSecond.className = "dateNN";
    pEmail.className = "email";

    // Set image source based on gender
    imgCard.src = entry.Gender == "Male" ? "assets/images/male.jpg" : "assets/images/female.jpg";

    // Assign alt text to the image
    imgCard.alt = "Profile Image";

    // Append image to the card
    divCard.appendChild(imgCard);

    // Fill the left section with data from the entry
    h3Left.textContent = entry.Subject;
    pLeft.textContent = entry.Message;
    divLeft.appendChild(h3Left);
    divLeft.appendChild(pLeft);

    // Fill the right section with data from the entry
    pRightFirst.textContent = entry.Name;
    aRight.textContent = entry.Title;
    pEmail.textContent = entry.Email;
    pRightSecond.textContent = new Date(entry.Date).toLocaleString();

    divRight.appendChild(pRightFirst);
    divRight.appendChild(aRight);
    divRight.appendChild(pEmail);
    divRight.appendChild(pRightSecond);
    divCard.appendChild(divLeft);
    divCard.appendChild(divRight);
    // Append the card to the container
    document.getElementById("feedbackContainer").appendChild(divCard);
  });
}

// Call createCard when the page loads or when needed
createCard();
