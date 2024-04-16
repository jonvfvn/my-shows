import axios from 'axios';
import { Season } from '../models/Episode';

export const fetchEpisodes = async (): Promise<Season> => {
  const { data } = await axios.get<Season>('https://www.omdbapi.com/', {
    params: {
      apikey: 'e0b97856',
      i: 'tt0944947',
      season: '3'
    }
  });

  return data;
};