import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { Season } from './models/Episode';
import { fetchEpisodes } from './api/fetchData'

import { StarFilledIcon, BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';


export const App = () => {
  const [bookmark, setBookmark] = useState<Record<string, boolean>>(() => JSON.parse(localStorage.getItem('bookmark') || '{}'));
  const [showBookmarked, setShowBookmarked] = useState(false);

  const { data, error, isLoading } = useQuery<Season, Error>({
    queryKey: ['episodes'],
    queryFn: fetchEpisodes
  });

  useEffect(() => localStorage.setItem('bookmark', JSON.stringify(bookmark)), [bookmark]);

  const toggleBookmark = (imdbID: string) => {
    setBookmark(prev => {
      const newState = { ...prev, [imdbID]: !prev[imdbID] };
      return newState;
    });
  };

  const handleToggleAllEpisodes = () => setShowBookmarked(!showBookmarked);

  const filteredEpisodes = showBookmarked 
    ? data?.Episodes.filter(episode => bookmark[episode.imdbID]) 
    : data?.Episodes;

  if (isLoading) return <h1 className='text-4xl font-bold pb-2'>Loading content...</h1>;
  if (error) return <div>Error occurred! {error.message}</div>;

  return (
    <div>
      <div className='w-[750px] flex flex-row items-center justify-between pb-4'>
        <h1 className='text-4xl font-bold'>{data?.Title}</h1>
        <Toggle
          aria-label='Toggle bookmarked list'
          onClick={handleToggleAllEpisodes}
        >
          {showBookmarked ? 'Bookmarked' : 'All episodes'}
        </Toggle>
      </div>
      <Tabs defaultValue='s03' className='space-y-4'>
        <TabsList className='w-[750px]'>
          <TabsTrigger value='s01' disabled>Season 1</TabsTrigger>
          <TabsTrigger value='s02' disabled>Season 2</TabsTrigger>
          <TabsTrigger value='s03'>Season 3</TabsTrigger>
          <TabsTrigger value='s04' disabled>Season 4</TabsTrigger>
          <TabsTrigger value='s05' disabled>Season 5</TabsTrigger>
          <TabsTrigger value='s06' disabled>Season 6</TabsTrigger>
          <TabsTrigger value='s07' disabled>Season 7</TabsTrigger>
          <TabsTrigger value='s08' disabled>Season 8</TabsTrigger>
        </TabsList>
        <TabsContent value='s03' className='space-y-4'>
          {filteredEpisodes?.map(episode => (
            <Card key={episode.imdbID} className='w-[750px] flex flex-row items-center justify-between'>
              <CardHeader>
                <CardTitle className='text-xl font-bold'>{episode.Title}</CardTitle>
                <CardDescription>Episode {episode.Episode} •  Released {moment(episode.Released).format('MMMM Do, YYYY')}</CardDescription>
              </CardHeader>

              <CardContent className='flex flex-col bg-zinc-100 rounded-r-xl'>
                <Toggle
                  className='m-5'
                  aria-label='Toggle bookmarked icon'
                  onClick={() => toggleBookmark(episode.imdbID)}
                >
                  {bookmark[episode.imdbID] ? <BookmarkFilledIcon className='text-blue-600' /> : <BookmarkIcon />}
                </Toggle>
                <span className='flex flex-row items-center'>
                  <StarFilledIcon className='mr-1 text-yellow-500'  />
                  <span className='text-lg font-bold'>{episode.imdbRating}</span>/10
                </span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
