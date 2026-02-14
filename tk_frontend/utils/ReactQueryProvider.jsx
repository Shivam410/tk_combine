import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";  // Toast notifications
import PropTypes from "prop-types";

// ✅ Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,     // ✅ Auto refetch on tab focus
      refetchOnReconnect: true,       // ✅ Auto refetch on network restore
      staleTime: 1000 * 60 * 5,       // ✅ Cache data for 5 mins
      retry: 2,                        // ✅ Retry twice before failing
    },
  },
});

const ReactQueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster/>
      {children}
    </QueryClientProvider>
  );
};

ReactQueryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReactQueryProvider;
