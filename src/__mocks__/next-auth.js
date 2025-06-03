export const getServerSession = jest.fn();
export const NextAuth = jest.fn();

export default jest.fn(() => ({
    handlers: {
        GET: jest.fn(),
        POST: jest.fn(),
    },
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
}));
