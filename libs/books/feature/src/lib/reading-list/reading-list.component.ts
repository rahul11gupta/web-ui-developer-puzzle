import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  getReadingList,
  removeFromReadingList,
  confirmedRemoveFromReadingList,
  undoRemoveFromReadingList,
} from '@tmo/books/data-access';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent implements OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();
  readingList$ = this.store.select(getReadingList);

  constructor(
    private readonly store: Store,
    private readonly action$: Actions,
    private snackbar: MatSnackBar
  ) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.undoRemoveBookFromReadingList();
  }

  undoRemoveBookFromReadingList() {
    this.action$
      .pipe(
        ofType(confirmedRemoveFromReadingList),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(({ item }) => {
        const snackbarRef = this.snackbar.open(
          `${item.title} removed from your reading list!`,
          'Undo'
        );
        snackbarRef
          .onAction()
          .pipe(take(1), takeUntil(this.unsubscribe$))
          .subscribe(() =>
            this.store.dispatch(undoRemoveFromReadingList({ item }))
          );
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
