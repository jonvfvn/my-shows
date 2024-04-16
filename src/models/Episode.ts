export interface Episode {
  imdbID: string;
  Title: string;
  Episode: string;
  Released: string;
  imdbRating: string;
}

export interface Season {
  Title: string;
  Season: string;
  totalSeasons: string;
  Response: string;
  Episodes: Episode[];
}