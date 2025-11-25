module.exports = {
  Link: ({ children }) => children,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: "/" }),
};