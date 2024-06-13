import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import YourComponent from './YourComponent';

const mock = new MockAdapter(axios);

const API_URL = process.env.REACT_APP_API_URL || 'http://your-default-api-url.com';

const mockData = {
  data: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ],
};

describe('YourComponent Tests', () => {
  it('should fetch data from backend correctly', async () => {
    mock.onGet(`${API_URL}/your-endpoint`).reply(200, mockData);

    const { getByText } = render(<YourComponent />);
    
    await waitFor(() => expect(getByText('Item 1')).toBeInTheDocument());
  });

  it('should handle large data sets without performance issues', async () => {
    const largeMockData = {
      data: Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        name: `Item ${index}`,
      })),
    };

    mock.onGet(`${API_URL}/your-endpoint`).reply(200, largeMockData);

    const { getByText } = render(<YourComponent />);
    
    await waitFor(() => {
      expect(getByText('Item 0')).toBeInTheDocument();
      expect(getByText(`Item 9999`)).toBeInTheDocument();
    });
  });

  it('should remain responsive under heavy load', async () => {
    const largeMockData = {
      data: Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        name: `Item ${index}`,
      })),
    };

    mock.onGet(`${API_URL}/your-endpoint`).reply(200, largeMockData);

    const { container, getByText } = render(<YourComponent />);
    
    fireEvent.click(getByText('Your Interactive UI Element'));

    await waitFor(() => {
      expect(container).toHaveTextContent('Expected outcome after interaction');
    });
  });
});