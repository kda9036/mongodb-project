// Form processing for keyword search
function keywordSearch(event) {
  // Stop page from reloading
  event.preventDefault();

  // Process input
  const keyword = event.target.keyword.value;

  // Ajax Request
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const resultArr = JSON.parse(this.responseText);
      const table = document.getElementById("searchResults");
      table.innerHTML = "";
      console.log(JSON.parse(this.responseText));
      // Make table rows and insert them into #searchResults
      updateTable(resultArr);
    }
  };
  request.open("POST", "/api/reports/search", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`term=${keyword}`);
}

// Form processing for location search
function locSearch(event) {
  // Stop page from reloading
  event.preventDefault();

  // Process input
  const lat = parseFloat(event.target.lat.value);
  const lon = parseFloat(event.target.lon.value);
  const distance = parseInt(event.target.distance.value);
  // Ajax Request
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const resultArr = JSON.parse(this.responseText);
      const table = document.getElementById("searchResults");
      table.innerHTML = "";
      console.log(JSON.parse(this.responseText));
      updateTable(resultArr);
    }
  };
  request.open("POST", "/api/reports/location", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`lat=${lat}&long=${lon}&distance=${distance}`);
  // Make table rows and insert them into #searchResults
}

// Filling in incident data when a modal opens
const incidentModal = document.getElementById("incidentModal");
incidentModal.addEventListener("show.bs.modal", (event) => {
  // Button that triggered the modal
  const button = event.relatedTarget;

  // Extract incident id & number in table
  const incidentID = button.getAttribute("data-incident");

  // Do an AJAX request here to get the entire report for the incident
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const resultArr = JSON.parse(this.responseText);
      console.log(JSON.parse(this.responseText));

      // Update the modal's content.
      // Product
      const modalIncidentID = incidentModal.querySelector("#incident-id");
      modalIncidentID.innerHTML = incidentID;
      const modalIncidentDate = incidentModal.querySelector("#incident-date");
      modalIncidentDate.innerHTML = resultArr[0].ReportDate;
      const modalProdDesc = incidentModal.querySelector("#product-description");
      modalProdDesc.innerHTML = resultArr[0].ProductDescription;

      // Insert the product image if it has one, or a placeholder image if not
      const modalImage = incidentModal.querySelector("#image");
      modalImage.src = resultArr[0].Image
        ? `/api/images/${resultArr[0].Image}`
        : `/api/images/placeholder.png`;

      const modalCategory = incidentModal.querySelector("#category");
      modalCategory.innerHTML = resultArr[0].Category;
      const modalSubCat = incidentModal.querySelector("#sub-category");
      modalSubCat.innerHTML = resultArr[0].SubCategory;
      const modalType = incidentModal.querySelector("#type");
      modalType.innerHTML = resultArr[0].Type;
      const modalManufacturer = incidentModal.querySelector("#manufacturer");
      modalManufacturer.innerHTML = resultArr[0].Manufacturer;
      const modalBrand = incidentModal.querySelector("#brand");
      modalBrand.innerHTML = resultArr[0].Brand;
      const modalRetailer = incidentModal.querySelector("#retailer");
      modalRetailer.innerHTML = resultArr[0].Retailer;
      // Incident
      const modalCity = incidentModal.querySelector("#city");
      modalCity.innerHTML = resultArr[0].City;
      const modalState = incidentModal.querySelector("#state");
      modalState.innerHTML = resultArr[0].State;
      const modalZip = incidentModal.querySelector("#zip");
      modalZip.innerHTML = resultArr[0].Zip;
      const modalIncidDesc = incidentModal.querySelector(
        "#incident-description"
      );
      modalIncidDesc.innerHTML = resultArr[0].IncidentDescription;
      displayComments(incidentID);
    }
  };
  request.open("GET", "/api/reports/" + incidentID, true);
  request.send();
});

// Form processing for location search
function submitComment(event) {
  // Stop page from reloading
  event.preventDefault();

  // Process input
  let name = event.target.name.value
  let comment = event.target.comment.value
  let objectID = incidentModal.querySelector("#incident-id").innerHTML;

  // Ajax Request to submit comment
  const request = new XMLHttpRequest();

  //Frontent event listener for web form success
  request.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        displayComments(objectID)
      } 
    };

  request.open("PUT", `/api/appendComment/${objectID}`, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`name=${name}&comment=${comment}`);
}

function displayComments(objectID){
  // Get the table, and clear of previous results
  const commentRows = document.getElementById("commentRows");

  // Ajax Request to get updated list of comments
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //Clear out text fields
      commentRows.innerHTML = "";

      const response = JSON.parse(this.responseText)
      const comments = response[0].Comments
      
      //error message for no comments found
      if (comments == undefined || comments.length == 0) {
        const newRow = commentRows.insertRow(-1);
        const errCell = newRow.insertCell(0);
        newRow.insertCell(1);
        newRow.insertCell(2);
        return (errCell.innerHTML = "No results returned.");
      }

      // Make table rows and insert them into #commentRows
      comments.forEach((item) => {
        const newRow = commentRows.insertRow(-1);
        const dateCell = newRow.insertCell(0);
        const nameCell = newRow.insertCell(1);
        const commentCell = newRow.insertCell(2);
        dateCell.innerHTML = item.Date;
        nameCell.innerHTML = item.Name;
        commentCell.innerHTML = item.Text;
      })


      
    } else {
      const newRow = commentRows.insertRow(-1);
      const errCell = newRow.insertCell(0);
      newRow.insertCell(1);
      newRow.insertCell(2);
      return (errCell.innerHTML = "Failed to retrieve results from the server.");
    }
  };

  request.open("GET", `/api/reports/${objectID}`, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();
}

function updateTable(arr) {
  // Get the table, and clear of previous results
  const table = document.getElementById("searchResults");
  const count = document.getElementById("result-count");

  table.innerHTML = "";

  // If there are no results, tell the user
  if (arr.length == 0) {
    return (count.innerHTML = "No results returned");
  }

  // Update the result count
  count.innerHTML =
    arr.length > 1 ? `${arr.length} results returned` : "1 result returned";

  // Create a new row for each result
  arr.forEach((result, i) => {
    const newRow = table.insertRow(-1);
    const numCell = newRow.insertCell(0);
    const dateCell = newRow.insertCell(1);
    const descriptCell = newRow.insertCell(2);
    const btnCell = newRow.insertCell(3);
    numCell.innerHTML = i + 1;
    dateCell.innerHTML = result.ReportDate;

    const description =
      result.ProductDescription.length > 100
        ? result.ProductDescription.substring(0, 100) + "..."
        : result.ProductDescription;

    descriptCell.innerHTML = description;
    btnCell.innerHTML = `<td><button type="submit" class="btn btn-primary" data-incident="${result._id}" data-bs-toggle="modal" data-bs-target="#incidentModal">See more</button></td>`;
  });
}
