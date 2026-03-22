// import type { ReactNode } from "react";
// import { HomeLayout } from "fumadocs-ui/layouts/home";
// import { baseOptions } from "@/app/layout.config";

// export default function Layout({ children }: { children: ReactNode }) {
//   return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
// }

import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { CrumbleNavbar } from "@/components/nav/CrumbleNavbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions} nav={{ component: <CrumbleNavbar /> }}>
      {children}
    </HomeLayout>
  );
}
