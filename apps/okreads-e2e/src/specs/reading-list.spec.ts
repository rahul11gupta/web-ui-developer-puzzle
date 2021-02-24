import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  beforeAll(async () => {
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const removeFromListButton = await $$('.reading-list-item')
      .first()
      .$('button');
    await browser.wait(
      ExpectedConditions.visibilityOf(removeFromListButton),
      10000
    );
    if (removeFromListButton) await removeFromListButton.click();
  });

  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should be able to undo adding book to reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const firstBookButton = await $$('[data-testing="book-item"]')
      .first()
      .$('button');
    await firstBookButton.click();

    const snackBarUndoButton = await $('.mat-simple-snackbar-action');
    await browser.wait(
      ExpectedConditions.visibilityOf(snackBarUndoButton),
      10000
    );
    await snackBarUndoButton.click();

    const firstBookButtonAttr = firstBookButton.getAttribute('disabled');
    expect(firstBookButtonAttr).toBeFalsy();
  });

  it('Then: I should be able to undo removing book from reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const firstBookButton = await $$('[data-testing="book-item"]')
      .first()
      .$('button');
    await firstBookButton.click();

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const removeFromListButton = await $$('.reading-list-item')
      .first()
      .$('button');
    await browser.wait(
      ExpectedConditions.visibilityOf(removeFromListButton),
      10000
    );
    await removeFromListButton.click();

    const snackBarUndoButton = await $('.mat-simple-snackbar-action');
    await browser.wait(
      ExpectedConditions.visibilityOf(snackBarUndoButton),
      10000
    );
    await snackBarUndoButton.click();

    const firstBookButtonAttr = firstBookButton.getAttribute('disabled');
    expect(firstBookButtonAttr).toBeTruthy();
  });
});
