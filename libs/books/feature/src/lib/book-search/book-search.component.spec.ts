import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Book } from '@tmo/shared/models';
import {
  addToReadingList,
  confirmedAddToReadingList,
} from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';
import { Actions, ofType } from '@ngrx/effects';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;
  let snackbar: MatSnackBar;
  let actions$: Actions;
  const initialState = {
    loaded: false,
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({ initialState }),
        MatSnackBar,
        Overlay,
        Actions,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    snackbar = TestBed.inject(MatSnackBar);
    actions$ = TestBed.inject(Actions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should dispatch addToReadingList action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const book: Book = createBook('A');
    component.addBookToReadingList(book);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(addToReadingList({ book }));
  });

  it('should open Snackbar', () => {
    const book: Book = createBook('A');
    const snackBarSpy = spyOn(snackbar, 'open');
    component.addBookToReadingList(book);
    actions$.pipe(ofType(confirmedAddToReadingList)).subscribe(({ book }) => {
      expect(snackBarSpy).toHaveBeenCalledWith(
        `${book.title} added to your reading list!`,
        'Undo'
      );
    });
  });
});
