import { SITE } from "../../config";
import OGLayout from "./OGLayout";

interface PersonData {
  id: string;
  name: string;
  bio?: string;
  roles: string[];
  company?: string;
}

interface OGPersonProps {
  person: PersonData;
}

export default function OGPerson({ person }: OGPersonProps) {
  // Create description
  const roleDescriptions = person.roles
    .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
    .join(", ");
  const description = person.bio
    ? person.bio.slice(0, 160) + (person.bio.length > 160 ? "..." : "")
    : `${roleDescriptions} at ${person.company || "the tech community"}`;

  return (
    <OGLayout gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "430px",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "100px",
            background: "rgba(255, 255, 255, 0.3)",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "white",
            margin: 0,
          }}
        >
          {person.name}
        </h1>
        {description && (
          <p
            style={{
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.9)",
              marginTop: "16px",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </OGLayout>
  );
}
