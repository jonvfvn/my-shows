import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '@/App';
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';

const fetchMock = createFetchMock(vi);

fetchMock.enableMocks();

beforeEach(() => fetchMock.resetMocks());

describe('App', () => {
  const queryClient = new QueryClient();

  test('Renders loading state', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading content...')).toBeInTheDocument;
  });
  
  test('Renders episodes when data is received', async () => {
    const episodes = {
      Title: 'Game of Thrones',
      Episodes: [
        {
          Title: 'Valar Dohaeris',
          Released: '2013-03-31',
          Episode: '1',
          imdbRating: '8.6',
          imdbID: 'tt2178782'
        }
      ]
    };
    fetchMock.mockResponseOnce(JSON.stringify(episodes));
    
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(await screen.findByText(episodes.Title)).toBeInTheDocument();
    expect(screen.getByText('Valar Dohaeris')).toBeInTheDocument();
    expect(screen.getByText(/Episode 1 • Released March 31st, 2013/i)).toBeInTheDocument();
  });

  test('Toggle bookmark and filter episodes by bookmarks', async () => {
    const episodes = {
      Title: 'Game of Thrones',
      Episodes: [
        {
          Title: 'Valar Dohaeris',
          Released: '2013-03-31',
          Episode: '1',
          imdbRating: '8.6',
          imdbID: 'tt2178782'
        },
        {
          Title: 'Dark Wings, Dark Words',
          Released: '2013-04-07',
          Episode: '2',
          imdbRating: '8.5',
          imdbID: 'tt2178772'
        },
      ]
    };
    fetchMock.mockResponseOnce(JSON.stringify(episodes));
    
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const toggleBookmarkButton = await screen.findAllByLabelText('Toggle bookmarked icon');
    fireEvent.click(toggleBookmarkButton[0]);

    const toggleAllEpisodesButton = screen.getByLabelText('Toggle bookmarked list');
    fireEvent.click(toggleAllEpisodesButton);

    expect(screen.getByText('Valar Dohaeris')).toBeInTheDocument();
    expect(screen.queryByText('Dark Wings, Dark Words')).toBeNull();
  });
})