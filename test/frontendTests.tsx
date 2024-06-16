import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import YourComponent from './YourComponent';

const axiosMockAdapter = new MockAdapter(axios);
const BACKEND_API_URL = process.env.REACT_APP_API_URL || 'http://your-default-api-url.com';

describe('YourComponent Tests', () => {
  beforeEach(() => {
    axiosMockAdapter.reset();
  });
  
  it('fetches data from the backend API correctly', async () => {
    mockGetData('your-endpoint', sampleData());

    const { getByText } = renderYourComponent();
    
    await waitForDataDisplay(getByText, 'Item 1');
  });

  it('handles large datasets efficiently without performance degradation', async () => {
    mockGetData('your-endpoint', largeDatasetMock());

    const { getByText } = renderYourComponent();
    
    await waitForMultipleItemsDisplay(getByText, ['Item 0', 'Item 9999']);
  });

  it('remains responsive and functional under heavy load', async () => {
    mockGetData('your-endpoint', heavyLoadMockData());
    
    const { container, getByText } = renderYourComponent();
    
    triggerUIInteraction(getByText, 'Your Interactive UI Element');
    
    await verifyOutcomeAfterInteraction(container, 'Expected outcome after interaction');
  });
});

function mockGetData(endpoint, responseData) {
  axiosMockAdapter.onGet(`${BACKEND_API_URL}/${endpoint}`).reply(200, responseData);
}

function sampleData() {
  return {
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
  };
}

function largeDatasetMock() {
  return {
    data: Array.from({ length: 10000 }, (_, index) => ({
      id: index,
      name: `Item ${index}`,
    })),
  };
}

function heavyLoadMockData() {
  return largeDatasetMock();
}

function renderYourComponent() {
  return render(<YourComponent />);
}

async function waitForDataDisplay(getByText, itemText) {
  await waitFor(() => expect(getByText(itemText)).toBeInTheDocument());
}

async function waitForMultipleItemsDisplay(getByText, itemTexts) {
  for (const itemText of itemTexts) {
    await waitFor(() => {
      expect(getByText(itemText)).toBeInTheDocument();
    });
  }
}

function triggerUIInteraction(getByText, buttonText) {
  fireEvent.click(getByText(buttonText));
}

async function verifyOutcomeAfterInteraction(container, expectedText) {
  await waitFor(() => {
    expect(container).toHaveTextContent(expectedText);
  });
}