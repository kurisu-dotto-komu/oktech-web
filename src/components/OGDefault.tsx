import React from "react";
import { SITE } from "../config";
import OGLayout from "./OGLayout";

export default function OGDefault() {
  return (
    <OGLayout gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
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
        <h1
          style={{
            fontSize: "96px",
            fontWeight: "bold",
            color: "white",
            margin: 0,
            lineHeight: 1,
            marginBottom: "24px",
          }}
        >
          {SITE.shortName}
        </h1>
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "normal",
            color: "rgba(255, 255, 255, 0.95)",
            margin: 0,
            marginBottom: "48px",
          }}
        >
          {SITE.longName}
        </h2>
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "600px",
          }}
        >
          Join our vibrant community of tech enthusiasts, developers, and designers in Osaka &
          Kansai
        </p>
      </div>
    </OGLayout>
  );
}