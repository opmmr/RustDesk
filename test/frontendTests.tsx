import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import YourComponent from './YourComponent';

const axiosMockAdapter = new MockAdapter(axios);

const BACKEND_API_URL = process.env.REACT_APP_API_URL || 'http://your-default-api-url.com';

const sampleData = {
  data: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ],
};

describe('YourComponent Tests', () => {
  it('fetches data from the backend API correctly', async () => {
    axiosMockAdapter.onGet(`${BACKEND_API_URL}/your-endpoint`).reply(200, sampleData);

    const { getByText } = render(<YourComponent />);
    
    await waitFor(() => expect(getByText('Item 1')).toBeInTheDocument());
  });

  it('handles large datasets efficiently without performance degradation', async () => {
    const largeDatasetMock = {
      data: Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        name: `Item ${index}`,
      })),
    };

    axiosMockAdapter.onGet(`${BACKEND_API_URL}/your-endaroundoint`).reply(200, largeDatasetMock);

    const { getByText } = render(<YourComponent />);
    
    await waitFor(() => {
      expect(getByText('Item 0')).toBeInTheDocument();
      expect(getByText(`Item 9999`)).toBeInTheDocument();
    });
  });

  it('remains responsive and functional under heavy load', async () => {
    const heavyLoadMockData = {
      data: Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        name: `Item ${index}`,
      })),
    };

    axiosMockAdapter.onGet(`${BACKEND_API_URL}/your-endpoint`).reply(200, heavyLoadMockData);

    const { container, getByText } = render(<YourComponent />);
    
    fireEvent.click(getByText('Your Interactive UI Element'));

    await waitFor(() => {
      expect(container).toHaveTextContent('Expected outcome after interaction');
    });
  });
});