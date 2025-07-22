import Container from "./Container";
import { LuTriangleAlert } from "react-icons/lu";

export default function Banner() {
  return (
    <div className="alert alert-error rounded-none">
      <Container>
        <div className="flex items-center gap-4">
          <LuTriangleAlert className="w-10 h-10" />
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
