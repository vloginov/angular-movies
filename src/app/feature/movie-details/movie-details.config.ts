import { Injectable } from '@angular/core';

@Injectable()
export class MovieDetailsConfig {
  api = {
    getMovieById: '{mdb}movie/',
  };
}
