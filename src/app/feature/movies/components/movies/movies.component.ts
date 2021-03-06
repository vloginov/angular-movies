import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { MoviesService } from '../../services/movies.service';
import { IMovie, IMovieSearchResult, IMovieListColumn } from 'src/app/common/interfaces';
import { MatSelectChange } from '@angular/material/select';
import { UserSettingsService } from 'src/app/common/services/user-settings.service';
import { LocaleService } from 'src/app/common/services/locale.service';
import { MoviesTranslations } from '../../locale/movies.translations';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.sass']
})
export class MoviesComponent implements OnInit {
  movieList: IMovie[] = [];
  totalMovies: number;
  lastQuery: string;
  pageSize = 20;
  columns: IMovieListColumn[];
  columnIds: string[] = [];
  selectedColumnIds: string[] = [];

  constructor(
    private moviesService: MoviesService,
    private userSettingsService: UserSettingsService,
    localeService: LocaleService,
    moviesTranslations: MoviesTranslations,
  ) {
    localeService.addTranslations('ru', moviesTranslations.ru);
    localeService.addTranslations('en', moviesTranslations.en);
  }

  ngOnInit() {
    this.moviesService.init()
      .then(() => {
        this.columns = this.moviesService.getColumns();
        this.columnIds = this.getColumnIds();
        this.selectedColumnIds = this.getSelectedColumnIds();
      });
  }

  onFilterColumnsSelectionChange(event: MatSelectChange) {
    this.columns = this.columns.map((column) => {
      column.selected = event.value.includes(column.id);
      return column;
    });

    this.userSettingsService.selectedColumnIds = this.getSelectedColumnIds();
  }

  getSelectedColumnIds() {
    const reducer = (acc, curr) => acc.concat(curr.selected ? [curr.id] : []);

    return this.columns ? this.columns.reduce(reducer, []) : [];
  }

  getColumnIds() {
    return this.columns ? this.columns.map(column => column.id) : [];
  }

  getSelectedColumn() {
    const reducer = (acc, curr) => acc.concat(curr.selected ? [curr.name] : []);

    return this.columns ? this.columns.reduce(reducer, []) : [];
  }

  onPaginatorChange(page: PageEvent) {
    this.moviesService.searchMovies(this.lastQuery, page.pageIndex + 1)
      .subscribe((searchResult: IMovieSearchResult) => {
        this.movieList = searchResult.results;
        this.totalMovies = searchResult.total_results;
      });
  }

  onFilterSearch(e) {
    this.lastQuery = e.query;
    const searchResult: IMovieSearchResult = e.searchResult;

    this.movieList = searchResult.results;
    this.totalMovies = searchResult.total_results;
  }
}
