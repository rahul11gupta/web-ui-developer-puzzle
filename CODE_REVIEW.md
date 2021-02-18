# T-Mobile Web UI Developer Puzzle Code Review

## Code Smells

- Reading list reducer test suite name incorrect.
    - Filename: `reading-list.reducer.spec.ts`
    - Fix: Changed from `Books Reducer` to `Reading List Reducer`.
- Selector subscribed but not unsubscribed. Can cause memory leaks.
    - Filename: `book-search.component.ts`
    - Fix: Can use async pipe to get all books. Changed from `books` variable to Observable type `books$` and used `async` pipe in the template.
- No action handler for actions `failedAddToReadingList` and `failedRemoveFromReadingList`
    - Filename: `reading-list.reducer.ts`
    - Fix: Added handlers for both actions.
- Error type should not be of type `any`
    - Filename: `books.action.ts`
    - Fix: Changed error type to `string`

## Improvements

- Could possibly create a seperate component for search results. This will allow reusability.
- Could use reference projection using `ngTemplateOutlet` for templates of search result cards and reading list items. This will resolve the templates during the compile time and new template need not be created at runtime for every item in the search result and reading list. Hence improving the performance.

## Lighthouse Automated Scan Report

- ***Buttons do not have an accessible name***
    - Failing element: Search icon button.
        - Fix: Icon buttons can be given accessible names by using attribute `aria-label`. Added `aria-label` to search icon button.

- ***Background and foreground colors do not have a sufficient contrast ratio***
    - Failing Element 1: Reading list button in navbar. (Button text hasn't got sufficient contrast with respect to the navbar color)
        - Fix: Changed `$pink-accent` color code from `#ff4081` to `#e20074` to provide sufficient contrast.
    - Failing Element 2: `p` (paragraph) tag
        - Fix: Added new darker shade of gray color `$gray50: #707070` to provide sufficient contrast.

## Chrome Manual Accessibility Check

- ***Logical tab order***
    - No issues found. All tabs are working logically.
- ***Interactive controls are keyboard focusable***
    - No issues found. All action elements can be accessed through keyboard.
- ***Interactive elements indicate their purpose and state***
    - No issues found. All interactive elements are distinguishable from non-interactive elements. Interactive elements are changing their state properly.
- ***Users focus is directed to the new content on the page***
    - No issues found. No route change involved. No focus redirection required.
- ***User focus is not accidentally trapped in a region***
    - No issues found. User can move their focus forward and backward to all parts of the application.
- ***Custom controls have ARIA roles***
    - No issues found. No custom controls.
- ***Custom controls have ARIA roles***
    - No issues found. No custom controls.
- ***Visual order on the page follows DOM order***
    - No issues found. `Tab` navigates the DOM elements orderly
- ***Offscreen content is hidden from assistive technology***
    - No issues found. Reading list already provided with style `visibility: hidden`.
- ***HTML5 landmark elements are used to improve navigation***
    - Added Missing `section` tag for the search form and the book list content.
- ***Additional Issues***
    - Fixed Missing `aria-labels` on reading list close button.