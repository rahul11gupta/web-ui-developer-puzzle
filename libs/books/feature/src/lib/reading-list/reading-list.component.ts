import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getReadingList,
  removeFromReadingList,
  toggleMarkBookAsRead,
} from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store) {}

  removeFromReadingList(item: ReadingListItem) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.toggleMarkBookAsRead(item, false);
  }

  toggleMarkBookAsRead(item: ReadingListItem, status?: Boolean) {
    const props = {
      item: item,
      status: status === null ? !item.finished : status,
    };
    this.store.dispatch(toggleMarkBookAsRead(props));
  }
}
