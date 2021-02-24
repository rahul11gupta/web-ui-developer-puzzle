import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  beforeAll(async () => {
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const removeFromListButton = await $$('.reading-list-item')
      .first()
      .$$('button')
      .get(1);
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
  it('Then: Finished Date should show when a book is marked as read', async () => {
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

    const markAsReadButton = await $$('.reading-list-item')
      .first()
      .$$('button')
      .first();
    await browser.wait(
      ExpectedConditions.visibilityOf(markAsReadButton),
      10000
    );
    await markAsReadButton.click();

    const finishedBookMessage = await $$(
      'reading-list-item--details--status'
    ).first();
    expect(finishedBookMessage).toBeTruthy();
  });

  it('Then: Text should change in the book list when a book is marked as read', async () => {
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
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(firstBookButton, 'Finished')
    );
  });

  it('Then: Removing a book will reset the finished status', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const removeFromListButton = await $$('.reading-list-item')
      .first()
      .$$('button')
      .get(1);
    await browser.wait(
      ExpectedConditions.visibilityOf(removeFromListButton),
      10000
    );
    await removeFromListButton.click();

    const firstBookButton = await $$('[data-testing="book-item"]')
      .first()
      .$('button');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        firstBookButton,
        'Want to Read'
      )
    );
  });
});
