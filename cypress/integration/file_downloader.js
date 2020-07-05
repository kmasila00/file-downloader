import fileData from "../support/data";

const clearRows = () => {
  // unchecking on intermediate actually checks box -- unchecking ensures always unchecking
  cy.get('[data-test="select-all"] [type="checkbox"]').uncheck().uncheck();
};

before(() => {
  cy.visit("localhost:8080");
});

describe("File downloader tests", () => {
  it("has correct number of rows for data", () => {
    cy.get("tbody > tr").should("have.length", fileData.length);
  });
});

describe("Renders data correctly", () => {
  it("has correct data for each row", () => {
    cy.get("tbody > tr").each(($el, index) => {
      cy.wrap($el)
        .get('[data-test="name"]')
        .eq(index)
        .contains(fileData[index].name);
      cy.wrap($el)
        .get('[data-test="device"]')
        .eq(index)
        .contains(fileData[index].device);
      cy.wrap($el)
        .get('[data-test="path"]')
        .eq(index)
        .contains(fileData[index].path);
      cy.wrap($el)
        .get('[data-test="status"]')
        .eq(index)
        .contains(fileData[index].status);
    });
  });
});

describe("Selecting items", () => {
  it("Clicking select all selects all rows", () => {
    cy.get('[data-test="select-all"] [type="checkbox"]').click();
  });
  it("Clicking select all again deselects all rows", () => {
    cy.get('[data-test="select-all"] [type="checkbox"]').click();
  });
});

describe("Select label updates properly", () => {
  it("displays correct text when none are selected", () => {
    clearRows();
    cy.get('[data-test="select-all"] .label').contains("None Selected");
  });
  it("correctly increments number of selected", () => {
    cy.get("tbody").children().eq(0).click();
    cy.get('[data-test="select-all"] .label').contains("Selected 1");
    cy.get("tbody").children().eq(1).click();
    cy.get('[data-test="select-all"] .label').contains("Selected 2");
    cy.get('[data-test="select-all"] [type="checkbox"]').click();
    cy.get('[data-test="select-all"] .label').contains(
      `Selected ${fileData.length}`
    );
  });
});

describe("Select all checkbox statuses", () => {
  it("not checked when no rows are selected", () => {
    clearRows();
    cy.get('[data-test="select-all"] [type="checkbox"]').then(($el) => {
      expect($el).not.to.be.checked;
    });
  });
  it("has intermediate value to display intermediate checkbox", () => {
    clearRows();
    cy.get("tbody").children().eq(0).click();
    cy.get('[data-test="select-all"] [type="checkbox"]').then(($el) => {
      expect($el).to.have.attr("data-indeterminate", "true");
    });
  });
  it("checked when select all clicked", () => {
    cy.get('[data-test="select-all"] [type="checkbox"]').click();
    cy.get('[data-test="select-all"] [type="checkbox"]').then(($el) => {
      expect($el).to.be.checked;
    });
  });
  it("checked when all rows are selected", () => {
    clearRows();
    cy.get("tbody > tr")
      .children()
      .each(($el) => {
        cy.wrap($el).click();
      });
    cy.get('[data-test="select-all"] [type="checkbox"]').then(($el) => {
      expect($el).to.be.checked;
    });
  });
});

describe("Clicking rows selects and deselects", () => {
  it("clicks on a row selects", () => {
    clearRows();
    const row = cy.get("tbody > tr").first();
    row.click();
    row.get('[type="checkbox"]').should("be.checked");
  });
  it("clicking on same row deselects", () => {
    const row = cy.get("tbody > tr").first();
    row.click();
    row.get('[type="checkbox"]').should("not.be.checked");
  });
  it("clicking multiple rows selects multiple items", () => {
    const row1 = cy.get("tbody").children().eq(0).click();
    const row2 = cy.get("tbody").children().eq(1).click();
    const row3 = cy.get("tbody").children().eq(3).click();

    row1.get('[type="checkbox"]').should("be.checked");
    row2.get('[type="checkbox"]').should("be.checked");
    row3.get('[type="checkbox"]').should("be.checked");
  });
});

describe("Downloading files", () => {
  it("cannot download if selected row has status unavailable", () => {
    clearRows();
    const unavailableFiles = cy
      .get('tbody > tr [data-test="scheduled"]')
      .first()
      .click();
    unavailableFiles.get('[type="checkbox"]').should("be.checked");
    cy.get('[data-test="download"]').should(
      "have.css",
      "cursor",
      "not-allowed"
    );
  });
  it("able to click download prompt", () => {
    clearRows();
    const download = cy.get('[data-test="download"]');
    const availableFiles = cy
      .get('tbody > tr [data-test="available"]')
      .first()
      .click();
    availableFiles.get('[type="checkbox"]').should("be.checked");
    download.should("have.css", "cursor", "pointer");
  });
  it("opens dialog if files are able to be downloaded", () => {
    clearRows();
    cy.get('tbody > tr [data-test="available"]')
      .children()
      .each(($el) => {
        cy.wrap($el).click();
      });
    cy.get('[data-test="download"]').click();
    cy.get('[data-test="dialog"]').contains("You have downloaded these files");
  });
});
