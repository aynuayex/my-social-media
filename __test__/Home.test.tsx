// Home.test.tsx
import { render } from '@testing-library/react';
import Home from '../src/app/page';

jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => ({ userId: 'mockUserId' })),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Home page', () => {
  it('redirects to sign-in if userId is not present', async () => {
    jest.spyOn(require('next/navigation'), 'redirect');
    const { auth } = require('@clerk/nextjs');
    auth.mockReturnValueOnce({ userId: null });

    render(<Home />);

    expect(require('next/navigation').redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('redirects to posts if userId is present', async () => {
    jest.spyOn(require('next/navigation'), 'redirect');
    const { auth } = require('@clerk/nextjs');
    auth.mockReturnValueOnce({ userId: 'mockUserId' });

    render(<Home />);

    expect(require('next/navigation').redirect).toHaveBeenCalledWith('/posts');
  });
});
