import Container from "./Container";
import { LuTriangleAlert } from "react-icons/lu";

export default function Banner() {
  return (
    <div className="w-full bg-error text-error-content" data-testid="banner">
      <Container>
        <div className="flex items-center py-3">
          <div className="flex items-center justify-center w-12 h-12 mr-4">
            <LuTriangleAlert className="w-8 h-8" />
          </div>
          <div>
            <strong>Work in Progress!</strong> This site is under active development and the design
            is currently garbage slop. Do not fear, as the human hand will be applied to it soon.
            Please excuse the rough edges as we build something awesome together.
          </div>
        </div>
      </Container>
    </div>
  );
}
