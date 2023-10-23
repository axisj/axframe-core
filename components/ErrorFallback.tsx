import { useErrorBoundary } from "react-error-boundary";
import { Alert, Button } from "antd";
import styled from "@emotion/styled";

export function ErrorFallback({ error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <Container>
      <h3>Something went wrong:</h3>
      <pre style={{ color: "red" }}>{error.stack ?? error.message}</pre>
      <Button onClick={resetBoundary}>Try again</Button>
    </Container>
  );
}

const Container = styled.div`
  padding: 1rem;
`;
