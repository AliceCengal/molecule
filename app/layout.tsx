import { PropsWithChildren } from "react";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "../styles/globals.css";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
