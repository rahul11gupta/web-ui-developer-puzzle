import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  confirmedAddToReadingList,
  undoAddToReadingList,
} from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  private unsubscribe$: Subject<void> = new Subject();
  searchForm = this.fb.group({
    term: '',
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly action$: Actions,
    private snackbar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {}

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    this.undoAddBookToReadingList();
  }

  undoAddBookToReadingList() {
    this.action$
      .pipe(ofType(confirmedAddToReadingList), takeUntil(this.unsubscribe$))
      .subscribe(({ book }) => {
        const snackbarRef = this.snackbar.open(
          `${book.title} added to your reading list!`,
          'Undo'
        );
        snackbarRef
          .onAction()
          .pipe(take(1), takeUntil(this.unsubscribe$))
          .subscribe(() => this.store.dispatch(undoAddToReadingList({ book })));
      });
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
