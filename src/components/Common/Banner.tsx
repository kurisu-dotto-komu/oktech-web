import { LuTriangleAlert } from "react-icons/lu";

import Container from "./Container";

export default function Banner() {
  return (
    <div className="bg-error text-error-content w-full" data-testid="banner">
      <Container>
        <div className="flex items-center py-3">
          <div className="mr-4 flex h-12 w-12 items-center justify-center">
            <LuTriangleAlert className="h-8 w-8" />
          </div>
          <div>
            <strong>Work in Progress!</strong> This site is under active development and the design
            is currently a work in progress.
          </div>
        </div>
      </Container>
    </div>
  );
}
